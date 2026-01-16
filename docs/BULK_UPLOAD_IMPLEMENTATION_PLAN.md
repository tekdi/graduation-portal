# Bulk CSV Upload Implementation Plan

## Overview
This document outlines the implementation plan for bulk user creation via CSV upload, following the API documentation in `bulkUser.md`.

## API Flow Summary

The bulk upload process consists of **3 sequential steps**:

1. **Get Signed URL** - Request a signed URL for file upload
2. **Upload CSV File** - Upload the CSV file to the signed URL (direct PUT request)
3. **Trigger Bulk Creation** - Call the bulk user creation endpoint with file path

## Implementation Plan

### Phase 1: API Service Layer

#### 1.1 Add API Endpoints (`src/services/apiEndpoints.ts`)
```typescript
GET_SIGNED_URL: `${prefix}/user/v1/cloud-services/file/getSignedUrl`
BULK_USER_CREATE: `${prefix}/user/v1/tenant/bulkUserCreate`
```

#### 1.2 Create Bulk Upload Service (`src/services/bulkUploadService.ts`)

**Functions to implement:**

1. **`getSignedUrl(fileName: string)`**
   - Endpoint: `GET /v1/cloud-services/file/getSignedUrl?fileName={fileName}`
   - Headers: `X-auth-token` (already handled by interceptor)
   - Returns: `{ signedUrl, filePath, destFilePath }`
   - Console Log: `console.log('Step 1 - Signed URL Response:', response.data)`

2. **`uploadFileToSignedUrl(signedUrl: string, file: File)`**
   - Method: `PUT` (direct to signed URL, NOT through axios)
   - Headers: None (signed URL handles auth)
   - Body: Raw file content
   - Note: This is a direct fetch/XMLHttpRequest call, not through our axios instance
   - Console Log: `console.log('Step 2 - File Upload Response:', { status, statusText, ok })`

3. **`bulkUserCreate(filePath: string, editableFields: string[], uploadType: 'CREATE' | 'UPLOAD' | 'INVITE')`**
   - Endpoint: `POST /v1/tenant/bulkUserCreate`
   - Headers: 
     - `X-auth-token` (already handled by interceptor)
     - `organization: {orgCode}` (automatically added by API interceptor)
     - `tenant: {tenantCode}` (automatically added by API interceptor)
     - `Content-Type: application/json`
   - Body: `{ file_path, editable_fields, upload_type }`
   - Returns: Upload job details with status "PENDING"
   - Console Log: `console.log('Step 3 - Bulk User Create Response:', response.data)`

**Key Considerations:**
- Organization and tenant codes will be automatically added to ALL API requests via the request interceptor (same as X-auth-token and internal-access-token)
- Codes will be stored in AsyncStorage during login and retrieved in the interceptor
- Default header names are `organization` and `tenant` (per docs), but configurable via env vars
- Default values: `organization: 'brac_gbl'`, `tenant: 'brac'` (can be extracted from user.organizations or use defaults)

### Phase 2: UI/UX Enhancements

#### 2.1 Upload Type Selection (Optional Enhancement)
Add a dropdown/radio group in the modal to select upload type:
- **CREATE**: Directly creates user accounts with provided passwords
- **UPLOAD**: Creates users and sends invitation emails (default)
- **INVITE**: Sends invitation emails without creating accounts

**Current State:** Modal only has "Upload CSV" option
**Enhancement:** Add upload type selector before file selection

#### 2.2 Progress Tracking
- Show upload progress for Step 2 (file upload to signed URL)
- Show loading state during all 3 steps
- Display success/error messages for each step

#### 2.3 CSV Validation (Client-Side)
Before uploading, validate CSV structure:
- Check required columns: `name, email, phone_code, phone, username, password, roles, province, district, local_municipality, linkageChampion, supervisor`
- Validate file size (max 10MB - already implemented)
- Validate row count (max 1000 users per file)
- Show validation errors before proceeding

#### 2.4 Success/Error Handling
- **Success:** Show success toast with message about email notification
- **Error:** Show specific error messages:
  - File validation errors
  - Signed URL expiration (15 minutes)
  - API errors with user-friendly messages
  - Network errors

### Phase 3: State Management

#### 3.1 Upload State
```typescript
interface UploadState {
  step: 1 | 2 | 3 | 'complete';
  isUploading: boolean;
  progress: number; // 0-100 for file upload
  signedUrl: string | null;
  filePath: string | null;
  uploadJobId: number | null;
  error: string | null;
}
```

#### 3.2 Loading States
- Step 1: "Getting upload URL..."
- Step 2: "Uploading file... {progress}%"
- Step 3: "Processing bulk upload..."
- Complete: "Upload successful! You will receive an email with results."

### Phase 4: Implementation Details

#### 4.1 File Upload to Signed URL
**Challenge:** Signed URLs require direct PUT request, not through axios

**Solution Options:**
1. Use native `fetch` API with PUT method
2. Use XMLHttpRequest for progress tracking
3. Use FormData if required (but docs show direct file PUT)

**Recommended:** Use `fetch` with progress tracking via `ReadableStream` (if supported) or XMLHttpRequest

#### 4.2 Organization and Tenant Codes
**Implementation Approach:**
- Store organization and tenant codes in AsyncStorage (similar to tokens)
- Add storage keys: `STORAGE_KEYS.ORGANIZATION_CODE` and `STORAGE_KEYS.TENANT_CODE`
- Extract codes during login from `userData.organizations` or use defaults
- Add codes to API request interceptor (same pattern as X-auth-token and internal-access-token)
- Default values: `organization: 'brac_gbl'`, `tenant: 'brac'` (from env or hardcoded)

**Implementation Steps:**
1. Add storage keys to `STORAGE_KEYS.ts`
2. Extract and store codes in `AuthContext.tsx` during login
3. Add code retrieval and header injection in `api.ts` request interceptor
4. Codes will be automatically added to ALL API requests (including bulk upload)

#### 4.3 Editable Fields
**Current requirement:** `["name", "email"]` per docs example
**Options:**
- Hardcode for now
- Make configurable later
- Get from user selection (future enhancement)

#### 4.4 Error Recovery
- If Step 1 fails: Retry allowed
- If Step 2 fails: Retry with new signed URL (old one expires)
- If Step 3 fails: File already uploaded, can retry Step 3 only

#### 4.5 Console Logging for Each Step
**Implementation:** Add comprehensive console logging for debugging and monitoring:

**Step 1 - Get Signed URL:**
```typescript
console.log('Step 1 - Requesting signed URL:', { fileName });
const response = await api.get(API_ENDPOINTS.GET_SIGNED_URL, { params: { fileName } });
console.log('Step 1 - Signed URL Response:', response.data);
```

**Step 2 - Upload File:**
```typescript
console.log('Step 2 - Uploading file:', { fileName, fileSize, signedUrl });
const uploadResponse = await fetch(signedUrl, { method: 'PUT', body: file });
console.log('Step 2 - File Upload Response:', { 
  status: uploadResponse.status, 
  statusText: uploadResponse.statusText, 
  ok: uploadResponse.ok 
});
```

**Step 3 - Bulk User Create:**
```typescript
console.log('Step 3 - Triggering bulk user create:', { filePath, editableFields, uploadType });
const response = await api.post(API_ENDPOINTS.BULK_USER_CREATE, { file_path, editable_fields, upload_type });
console.log('Step 3 - Bulk User Create Response:', response.data);
```

**Error Logging:**
```typescript
catch (error) {
  console.error(`Step ${stepNumber} - Error:`, error);
  console.error(`Step ${stepNumber} - Error Details:`, { 
    message: error.message, 
    response: error.response?.data 
  });
}
```

### Phase 5: File Structure

```
src/services/
  ├── bulkUploadService.ts (NEW)
    - getSignedUrl() // Logs Step 1 response
    - uploadFileToSignedUrl() // Logs Step 2 response
    - bulkUserCreate() // Logs Step 3 response

src/screens/UserManagement/
  ├── index.tsx (UPDATE)
    - Replace TODO with actual API calls
    - Add upload type selection
    - Add progress tracking
    - Add CSV validation

src/constants/
  ├── BULK_UPLOAD.ts (NEW - optional)
    - Upload types
    - Max file size
    - Max rows
    - Required CSV columns
```

### Phase 6: Testing Checklist

- [ ] File validation (CSV extension, size, structure)
- [ ] Step 1: Get signed URL successfully (check console for response)
- [ ] Step 2: Upload file to signed URL with progress (check console for response)
- [ ] Step 3: Trigger bulk creation successfully (check console for response)
- [ ] Console logging for each step response
- [ ] Error handling for each step (check console for error logs)
- [ ] Signed URL expiration handling
- [ ] Network error handling
- [ ] Success message display
- [ ] Modal closes after successful upload
- [ ] File input resets after upload

### Phase 7: Translation Keys Needed

Add to `src/locales/en.json`:
```json
{
  "admin": {
    "actions": {
      "uploadUsers": "Upload Users",
      "uploadUsersDescription": "Choose how you want to add users",
      "uploadCSV": "Upload CSV",
      "uploadCSVDescription": "Upload a CSV file to create multiple users at once",
      "uploadType": "Upload Type",
      "uploadTypeCreate": "Create Users (with passwords)",
      "uploadTypeUpload": "Create & Invite Users",
      "uploadTypeInvite": "Send Invitations Only",
      "uploading": "Uploading...",
      "uploadProgress": "Uploading file... {progress}%",
      "uploadSuccess": "CSV uploaded successfully! You will receive an email with results once processing is complete.",
      "uploadError": "Failed to upload CSV file",
      "uploadErrorSignedUrl": "Failed to get upload URL. Please try again.",
      "uploadErrorFileUpload": "Failed to upload file. Please try again.",
      "uploadErrorBulkCreate": "File uploaded but failed to process. Please contact support.",
      "csvValidationError": "CSV file validation failed",
      "csvMaxRowsExceeded": "CSV file exceeds maximum of 1000 rows",
      "csvInvalidFormat": "CSV file does not match required format"
    }
  }
}
```

## Implementation Order

1. **Phase 4.2** - Add organization/tenant code handling in API interceptor (PREREQUISITE)
   - Add storage keys
   - Store codes during login
   - Add to request interceptor
2. **Phase 1** - API Service Layer (Foundation)
3. **Phase 4.1** - Implement file upload to signed URL
4. **Phase 3** - Add state management
5. **Phase 2** - Update UI with progress and error handling
6. **Phase 2.3** - Add CSV validation
7. **Phase 7** - Add translations
8. **Phase 6** - Testing

## Open Questions

1. **Organization and Tenant Codes:** ✅ RESOLVED
   - Will be stored in AsyncStorage and automatically added via API interceptor
   - Extracted from user.organizations during login or use defaults

2. **Editable Fields:**
   - Should this be configurable or hardcoded to `["name", "email"]`?

3. **Upload Type:**
   - Should we add UI for selecting upload type, or default to "UPLOAD"?

4. **CSV Validation:**
   - Should we parse and validate CSV structure before upload, or let API handle it?

5. **Progress Tracking:**
   - Is progress tracking for file upload essential, or is loading spinner sufficient?

## Implementation Details: Organization & Tenant Code Handling

### Step-by-Step Implementation

#### 1. Add Storage Keys (`src/constants/STORAGE_KEYS.ts`)
```typescript
export const STORAGE_KEYS = {
  // ... existing keys
  ORGANIZATION_CODE: '@organization_code',
  TENANT_CODE: '@tenant_code',
} as const;
```

#### 2. Update API Interceptor (`src/services/api.ts`)
Add organization and tenant code retrieval and header injection in the request interceptor:

```typescript
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // ... existing token handling ...
      
      // Add organization code header if available
      const orgCode = await AsyncStorage.getItem(STORAGE_KEYS.ORGANIZATION_CODE);
      if (orgCode && config.headers) {
        config.headers['organization'] = orgCode;
      }
      
      // Add tenant code header if available
      const tenantCode = await AsyncStorage.getItem(STORAGE_KEYS.TENANT_CODE);
      if (tenantCode && config.headers) {
        config.headers['tenant'] = tenantCode;
      }
      
      return config;
    } catch (error) {
      // ... error handling ...
    }
  }
);
```

#### 3. Store Codes During Login (`src/contexts/AuthContext.tsx`)
Extract and store organization and tenant codes during login:

```typescript
// In login function, after successful authentication
const orgCode = userData.organizations?.[0]?.code || process?.env?.ORG_CODE || 'brac_gbl';
const tenantCode = userData.tenant_code || process?.env?.TENANT_CODE || 'brac';

await AsyncStorage.setItem(STORAGE_KEYS.ORGANIZATION_CODE, orgCode);
await AsyncStorage.setItem(STORAGE_KEYS.TENANT_CODE, tenantCode);
```

#### 4. Clear Codes on Logout (`src/contexts/AuthContext.tsx`)
```typescript
// In logout function
await AsyncStorage.removeItem(STORAGE_KEYS.ORGANIZATION_CODE);
await AsyncStorage.removeItem(STORAGE_KEYS.TENANT_CODE);
```

**Note:** After this implementation, organization and tenant headers will be automatically added to ALL API requests, including the bulk upload endpoint. No manual header passing needed in service functions.

## Notes

- Signed URLs expire after 15 minutes - handle expiration gracefully
- Process is asynchronous - users receive email notification when complete
- Maximum 1000 users per CSV file
- All operations are logged and auditable
- Duplicate emails/phones handled by API based on existing records
- Organization and tenant codes are automatically added to all API requests via interceptor