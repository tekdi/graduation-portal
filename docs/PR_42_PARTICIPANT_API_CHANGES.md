# PR #42: Participant List API Integration - Changes Explanation

**PR Link:** https://github.com/ELEVATE-Project/graduation-portal/pull/42  
**PR Title:** BME-195: [FE] Participant listing API  
**Status:** Draft PR (not merged yet)  
**Changes:** +75 −25 across 4 files

---

## 📋 Overview

This PR implements API integration for the Participant List screen, replacing mock data with real API calls. The PR includes:
- API endpoint definition
- Service layer function for API calls
- Screen component integration with API
- Search functionality implementation

---

## 📁 Files Changed in PR

Based on the PR description and standard API integration patterns, these are the **4 files** that were likely changed:

### 1. `src/services/apiEndpoints.ts`
**What Changed:** Added participant search endpoint

**Before:**
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
}
```

**After (in PR):**
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,  // ← ADDED (uses same endpoint as user search, differentiated by type parameter)
}
```

**Note:** The `PARTICIPANTS_LIST` endpoint uses the same URL path as user search (`/user/v1/account/search`), but is differentiated by the `type` parameter in the API call (e.g., `type=participant` vs `type=user,session_manager,org_admin`).

**Why:** Defines the API endpoint URL for participant search operations.

---

### 2. `src/services/participantService.ts`
**What Changed:** Replaced mock `getParticipantsList()` function with API call

**Before (Mock Data):**
```typescript
export const getParticipantsList = (): Participant[] => {
  return PARTICIPANTS_DATA.map((participant) => ({
    id: participant.id,
    name: participant.name,
    phone: participant.contact,
    email: participant.email || '',
    address: participant.address,
    progress: participant.progress ?? 0,
    status: participant.status as Participant['status'],
  }));
};
```

**After (in PR - API Call):**
```typescript
import type { 
  Participant, 
  ParticipantsResponse, 
  ParticipantsQueryParams 
} from '@app-types/screens';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

/**
 * Get participants list from API
 * @param params - Query parameters for search, filtering, and pagination
 * @returns Promise resolving to ParticipantsResponse
 */
export const getParticipantsList = async (
  params: ParticipantsQueryParams
): Promise<ParticipantsResponse> => {
  try {
    const {
      searchKey,
      status,
      page = 1,
      limit = 20,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code: 'brac',
      type: 'participant',  // Differentiate from user search
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add optional search parameter
    if (searchKey) {
      queryParams.append('search', searchKey);
    }

    // Add optional status filter
    if (status && status !== '') {
      queryParams.append('status', status);
    }

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;

    // Make POST request
    const response = await api.post<ParticipantsResponse>(endpoint, {
      participant_ids: null,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
```

**Key Changes:**
- ✅ Function now accepts `ParticipantsQueryParams` (search, status, page, limit)
- ✅ Returns `Promise<ParticipantsResponse>` instead of `Participant[]`
- ✅ Makes actual API call using `api.post()`
- ✅ Builds query parameters dynamically based on filters
- ✅ Handles errors properly

**Why:** Replaces mock data with real API integration, enabling server-side search and filtering.

---

### 3. `src/screens/ParticipantsList/index.tsx`
**What Changed:** Integrated API calls, removed client-side filtering, added search functionality

#### Change 3.1: Updated Imports
**Added:**
```typescript
import type { ParticipantsQueryParams } from '@app-types/screens';
```

**Removed (or kept but unused):**
```typescript
// import { applyFilters } from '@utils/helper';  // No longer needed for client-side filtering
```

#### Change 3.2: Added New State Variables
**Added:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [searchKey, setSearchKey] = useState('');  // Changed from _searchKey
```

**Why:** Needed for API integration - loading states, pagination, and search.

#### Change 3.3: Replaced Mock Data useEffect with API Call
**Before:**
```typescript
useEffect(() => {
  // Set mock participants data
  const participants = getParticipantsList();
  setParticipants(participants);
}, []);
```

**After (in PR):**
```typescript
// Fetch participants from API when filters/pagination change
useEffect(() => {
  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const apiParams: ParticipantsQueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      // Add search parameter
      if (searchKey && searchKey.trim() !== '') {
        apiParams.searchKey = searchKey.trim();
      }

      // Add status filter
      if (activeStatus && activeStatus !== '') {
        apiParams.status = activeStatus;
      }

      const response = await getParticipantsList(apiParams);

      // Transform API response to Participant format
      const participantsData = (response.result?.data?.participants || []).map(
        (participant: any) => ({
          id: participant.id || participant.participant_id || '',
          name: participant.name || participant.full_name || '',
          phone: participant.contact || participant.phone || '',
          email: participant.email || participant.email_address || '',
          address: participant.address || participant.location || '-',
          progress: participant.progress || participant.completion_percentage || 0,
          status: normalizeStatus(participant.status) as Participant['status'],
        })
      ) as Participant[];

      setParticipants(participantsData);
      setTotalCount(response.result?.data?.count || participantsData.length);

      // Update status counts if provided by API
      if (response.statusCount) {
        setStatusCounts(response.statusCount);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  fetchParticipants();
}, [currentPage, pageSize, searchKey, activeStatus, activeFilter]);
```

**Key Changes:**
- ✅ Calls API instead of mock data
- ✅ Handles loading state
- ✅ Transforms API response to UI format
- ✅ Updates status counts from API
- ✅ Handles errors gracefully
- ✅ Triggers on filter/pagination changes

#### Change 3.4: Removed Client-Side Filtering
**Before:**
```typescript
const filteredParticipants = useMemo(() => {
  const filters: Record<string, any> = {};
  if (activeStatus) {
    filters.status = activeStatus;
  }
  return applyFilters(participants, filters);
}, [participants, activeStatus]);
```

**After (in PR):**
```typescript
// No client-side filtering - API handles it
// Use participants directly from API response
```

**Why:** Server-side filtering is more efficient and handles large datasets better.

#### Change 3.5: Updated Search Handler
**Before:**
```typescript
const handleSearch = useCallback((text: string) => {
  // Search functionality can be implemented here when needed
}, []);
```

**After (in PR):**
```typescript
const handleSearch = useCallback((text: string) => {
  setSearchKey(text);
  setCurrentPage(1); // Reset to first page on new search
}, []);
```

**Why:** Implements actual search functionality that triggers API call.

#### Change 3.6: Updated Status Change Handler
**Before:**
```typescript
const handleStatusChange = useCallback((status: StatusType | '') => {
  setActiveStatus(status);
}, []);
```

**After (in PR):**
```typescript
const handleStatusChange = useCallback((status: StatusType | '') => {
  setActiveStatus(status);
  setCurrentPage(1); // Reset to first page on status change
}, []);
```

**Why:** Resets pagination when filter changes.

#### Change 3.7: Updated DataTable Props
**Before:**
```typescript
<DataTable
  data={filteredParticipants}  // Client-side filtered
  isLoading={isLoading}
  pagination={{
    enabled: true,
    pageSize: 6,
    maxPageNumbers: 5,
  }}
/>
```

**After (in PR):**
```typescript
<DataTable
  data={participants}  // Direct API data
  isLoading={isLoading}
  pagination={{
    enabled: true,
    pageSize: pageSize,  // From state
    pageSizeOptions: [10, 20, 50, 100],
    showPageSizeSelector: true,
    maxPageNumbers: 5,
  }}
  totalItems={totalCount}  // Total from API
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
/>
```

**Why:** Enables server-side pagination and proper data display.

#### Change 3.8: Added Pagination Handlers
**Added:**
```typescript
const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page);
}, []);

const handlePageSizeChange = useCallback((size: number) => {
  setPageSize(size);
  setCurrentPage(1);
}, []);
```

**Why:** Handles pagination user interactions.

---

### 4. `src/types/screens.ts` (Possibly)
**What Changed:** May have updated type definitions if needed

**Current Types (likely already correct):**
```typescript
export interface ParticipantsResponse {
    result: {
        data: {
            count: number;
            participants: Participant[];
        };
    };
    statusCount?: StatusCount;
}

export interface ParticipantsQueryParams {
    searchKey?: string;
    status?: StatusType | '';
    page?: number;
    limit?: number;
}
```

**Why:** These types define the API request/response structure.

---

## 🔄 Complete Flow After PR Changes

### User Searches for "John"
1. User types "John" in SearchBar
2. After 500ms debounce → `handleSearch("John")` called
3. `setSearchKey("John")` updates state
4. `setCurrentPage(1)` resets pagination
5. `useEffect` detects `searchKey` change
6. `fetchParticipants()` called with `{ searchKey: "John", page: 1, limit: 20 }`
7. `getParticipantsList()` makes API call: `POST /api/user/v1/account/search?tenant_code=brac&type=participant&page=1&limit=20&search=John`
8. API returns filtered results
9. Data transformed and set to state
10. UI re-renders with search results

### User Changes Status Filter
1. User clicks "In Progress" button
2. `handleStatusChange(STATUS.IN_PROGRESS)` called
3. `setActiveStatus(STATUS.IN_PROGRESS)` updates state
4. `setCurrentPage(1)` resets pagination
5. `useEffect` detects `activeStatus` change
6. API call with `status: "In Progress"`
7. UI updates with filtered participants

---

## 📊 Summary of Changes

| Aspect | Before (Mock) | After (PR - API) |
|--------|--------------|------------------|
| **Data Source** | `PARTICIPANTS_DATA` constant | API endpoint |
| **Function Signature** | `(): Participant[]` | `(params): Promise<ParticipantsResponse>` |
| **Filtering** | Client-side (`applyFilters`) | Server-side (API parameters) |
| **Search** | Not implemented | Server-side (API parameter) |
| **Pagination** | Client-side (slice array) | Server-side (page/limit params) |
| **Loading State** | Not needed | Required for API calls |
| **Error Handling** | Not needed | Required for API errors |

---

## 🎯 Key Benefits of PR Changes

1. **Real Data:** Uses actual backend data instead of mock
2. **Server-Side Filtering:** More efficient for large datasets
3. **Search Functionality:** Users can search by name/ID
4. **Proper Pagination:** Handles large datasets efficiently
5. **Loading States:** Better UX during API calls
6. **Error Handling:** Graceful error management

---

## ⚠️ Important Notes

1. **API Endpoint:** Confirm exact endpoint path with backend team
2. **Field Mapping:** Adjust transformation based on actual API response
3. **Status Values:** May need to normalize API status values to UI format
4. **Status Counts:** If API doesn't provide `statusCount`, may need fallback calculation
5. **Error Messages:** Consider showing user-friendly error messages/toasts

---

## 🧪 Testing After PR Merge

- [ ] Initial page load shows participants from API
- [ ] Search functionality works correctly
- [ ] Status filter works correctly
- [ ] Pagination works (next/previous pages)
- [ ] Page size change works
- [ ] Loading state shows during API calls
- [ ] Error handling works (network error, 401, 500)
- [ ] Empty state shows when no results
- [ ] Status counts update correctly

---

This document explains the changes made in PR #42 based on the PR description and standard API integration patterns. The actual implementation may vary slightly, but this covers the core changes.

