# User Management API Integration Plan

**Based on:** PR #42 (Participant List API Integration)  
**API Endpoint:** `/api/user/v1/account/search`  
**Key Difference:** Only the `type` parameter differs (`type=user,session_manager,org_admin` vs `type=participant`)

---

## 📋 Overview

This plan outlines the integration of User Management API, following the exact pattern from PR #42 (Participant List API). The main difference is the `type` parameter in the API call.

### 🔄 Code Reuse Strategy

**Key Principle:** Reuse code from PR #42 instead of duplicating

1. **Endpoint:** Reuse `PARTICIPANTS_LIST` from PR #42 (same URL, different `type` param)
2. **Interfaces:** Add `UserSearchParams` and `UserSearchResponse` interfaces to `src/services/participantService.ts` (following PR #42 pattern where interfaces are in the service file)
3. **Service:** Add `getUsersList()` function to existing `src/services/participantService.ts` (reuse PR #42 code, modify for users)

**Benefits:**
- Less code duplication
- Easier maintenance (single endpoint constant)
- Consistent pattern across participants and users
- When PR #42 merges, User Management will automatically work

---

## 🔍 API Analysis

### Curl Command Analysis:
```bash
POST /api/user/v1/account/search?tenant_code=brac&type=user,session_manager,org_admin&page=1&limit=20
```

**Key Parameters:**
- `tenant_code`: `brac` (required)
- `type`: `user,session_manager,org_admin` (required - differentiates from participants)
- `page`: `1` (pagination)
- `limit`: `20` (page size)
- Optional: `search`, `role`, `status`, `province`, `district` (filters)

**Request Body:**
- `user_ids`: `null` or array of user IDs (optional)

**Response Structure:** (Expected, similar to Participant API)
```typescript
{
  responseCode: string;
  message: string;
  result: {
    data: User[];
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

---

## 📁 Files to Create/Modify

### 1. **`src/services/apiEndpoints.ts`** ✅ MODIFY
**Action:** Use `PARTICIPANTS_LIST` endpoint from PR #42 (same endpoint, different type parameter)

**Current State:**
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
}
```

**After (from PR #42):**
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,  // ← From PR #42 (reused for both participants and users)
}
```

**Note:** 
- Reuse `PARTICIPANTS_LIST` endpoint from PR #42
- Same URL for both participants and users
- Differentiated by `type` parameter:
  - Participants: `type=participant`
  - Users: `type=user,session_manager,org_admin`

---

### 2. **`src/services/participantService.ts`** ✅ MODIFY
**Action:** Add User interfaces and `getUsersList()` function (following PR #42 pattern where interfaces are in the service file)

**From PR #42 Pattern:**
In PR #42, `ParticipantSearchParams` and `ParticipantSearchResponse` are defined in `participantService.ts` itself, not in a separate types file.

**Step 2.1: Add Imports (at the top of file)**
```typescript
// Add to existing imports
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import { User } from '@constants/USER_MANAGEMENT_MOCK_DATA';  // Or from @app-types/screens if available
```

**Step 2.2: Add Interfaces (after imports, before functions)**
```typescript
/**
 * User Search Parameters
 * Parameters for searching/filtering users via API
 * Following PR #42 pattern (interfaces in service file)
 */
export interface UserSearchParams {
  user_ids?: string[] | null;
  tenant_code?: string;
  type?: string; // 'user,session_manager,org_admin'
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  province?: string;
  district?: string;
}

/**
 * User Search Response
 * Response structure from the user search API
 * Following PR #42 pattern (interfaces in service file)
 */
export interface UserSearchResponse {
  responseCode: string;
  message: string;
  result: any;  // Following PR #42 pattern (result: any)
}
```

**Step 2.3: Add Function (after existing participant functions)**
```typescript
/**
 * Get users list from API
 * Handles search, filtering, and pagination
 * Reuses same endpoint as participants, differentiated by type parameter
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to UserSearchResponse
 */
export const getUsersList = async (
  params: UserSearchParams
): Promise<UserSearchResponse> => {
  try {
    const {
      user_ids,
      tenant_code = 'brac',
      type = 'user,session_manager,org_admin',  // Different from participant
      page = 1,
      limit = 20,
      search,
      role,
      status,
      province,
      district,
    } = params;

    // Build query string (same pattern as getParticipantsList from PR #42)
    const queryParams = new URLSearchParams({
      tenant_code,
      type,  // 'user,session_manager,org_admin' instead of 'participant'
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add optional search parameter
    if (search) {
      queryParams.append('search', search);
    }

    // Add optional filter parameters
    if (role) {
      queryParams.append('role', role);
    }
    if (status) {
      queryParams.append('status', status);
    }
    if (province) {
      queryParams.append('province', province);
    }
    if (district) {
      queryParams.append('district', district);
    }

    // Reuse PARTICIPANTS_LIST endpoint (same URL, different type param)
    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;

    // Make POST request (same pattern as PR #42)
    const response = await api.post<UserSearchResponse>(endpoint, {
      user_ids: user_ids || null,  // Different from participant_ids
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};
```

**Key Modifications from PR #42 `getParticipantsList()`:**
- Function name: `getUsersList` (vs `getParticipantsList`)
- `type` default: `'user,session_manager,org_admin'` (vs `'participant'`)
- Request body: `user_ids` (vs `participant_ids`)
- Additional filters: `role`, `province`, `district` (same logic)
- Uses same `PARTICIPANTS_LIST` endpoint
- Return type: `UserSearchResponse` (vs `ParticipantsResponse`)

**Note:** Reuse the exact code structure from PR #42's `getParticipantsList()`, just modify the parameters.

---

### 3. **`src/screens/UserManagement/index.tsx`** ✅ MODIFY
**Action:** Replace mock data with API calls (following PR #42 pattern)

#### 3.1 Update Imports
**Remove:**
```typescript
import { USER_MANAGEMENT_MOCK_DATA, User } from '@constants/USER_MANAGEMENT_MOCK_DATA';
import { applyFilters } from '@utils/helper';
```

**Add:**
```typescript
import { User } from '@constants/USER_MANAGEMENT_MOCK_DATA';  // Or from @app-types/screens if available
import { getUsersList, UserSearchParams } from '../../services/participantService';  // Interfaces and function from participantService.ts (PR #42 pattern)
```

#### 3.2 Update State Management
**Add:**
```typescript
const [users, setUsers] = useState<User[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
```

**Remove:**
- Client-side filtering logic (`filteredData` useMemo)

#### 3.3 Replace Mock Data with API Call
**Remove:**
```typescript
const filteredData = useMemo(() => {
  // ... client-side filtering logic
}, [filters]);
```

**Add:**
```typescript
// Fetch users from API when filters/pagination change
useEffect(() => {
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const apiParams: UserSearchParams = {
        tenant_code: 'brac',
        type: 'user,session_manager,org_admin',
        page: currentPage,
        limit: pageSize,
      };

      // Add search parameter
      if (filters.search) {
        apiParams.search = filters.search;
      }

      // Add filter parameters (only if not "all" values)
      if (filters.role && filters.role !== 'all-roles') {
        apiParams.role = filters.role;
      }
      if (filters.status && filters.status !== 'all-status') {
        apiParams.status = filters.status;
      }
      if (filters.province && filters.province !== 'all-provinces') {
        const provinceFilter = FilterOptions.find((f) => f.attr === 'province');
        const option = provinceFilter?.data.find((opt: any) => 
          typeof opt === 'string' ? opt === filters.province : opt.value === filters.province
        );
        const provinceLabel = typeof option === 'object' && option?.label ? option.label : option;
        if (provinceLabel) apiParams.province = provinceLabel;
      }
      if (filters.district && filters.district !== 'all-districts') {
        const districtFilter = FilterOptions.find((f) => f.attr === 'district');
        const option = districtFilter?.data.find((opt: any) => 
          typeof opt === 'string' ? opt === filters.district : opt.value === filters.district
        );
        const districtLabel = typeof option === 'object' && option?.label ? option.label : option;
        if (districtLabel) apiParams.district = districtLabel;
      }

      const response = await getUsersList(apiParams);
      
      // Transform API response to User[] format
      const usersData = (response.result?.data || []).map((user: any) => {
        // Normalize role values
        let role = user.role || user.user_role || user.role_name || user.role_label || 
                   user.user_type || user.type || user.roles?.[0]?.label || 
                   user.roles?.[0]?.title || '-';
        
        if (role && role !== '-') {
          const roleMap: Record<string, string> = {
            'admin': 'Admin',
            'supervisor': 'Supervisor',
            'linkage_champion': 'Linkage Champion',
            'linkage champion': 'Linkage Champion',
            'participant': 'Participant',
            'session_manager': 'Supervisor',
            'org_admin': 'Admin',
          };
          role = roleMap[role.toLowerCase()] || role;
        }
        
        // Normalize status
        let status = user.status || user.user_status || 'Active';
        if (typeof status === 'string') {
          status = status === 'ACTIVE' || status === 'Active' ? 'Active' : 
                   status === 'DEACTIVATED' || status === 'Deactivated' || status === 'INACTIVE' ? 'Deactivated' : 
                   status;
        }
        
        return {
          id: String(user.id || user.user_id || user._id || ''),
          name: user.name || user.full_name || user.username || user.display_name || '',
          email: user.email || user.email_address || '',
          role: role as User['role'],
          status: status as User['status'],
          province: user.province || user.province_name || user.address?.province || '-',
          district: user.district || user.district_name || user.address?.district || '-',
          lastLogin: user.lastLogin || user.last_login || user.lastLoginDate || user.last_login_date || '-',
          details: user.details || null,
        };
      }) as User[];

      setUsers(usersData);
      setTotalCount(response.result?.total || usersData.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUsers();
}, [filters, currentPage, pageSize]);
```

#### 3.4 Update Filter Handler
**Change:**
```typescript
const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
  setFilters(newFilters);
  setCurrentPage(1); // Reset to page 1 when filters change
}, []);
```

#### 3.5 Update DataTable Props
**Change:**
```typescript
<DataTable
  data={filteredData}  // ← Remove
  // ...
/>
```

**To:**
```typescript
<DataTable
  data={users}  // ← Use API data directly
  isLoading={isLoading}
  pagination={{
    enabled: false, // Server-side pagination (if needed, can enable client-side)
  }}
  // ...
/>
```

#### 3.6 Update Count Display
**Change:**
```typescript
{t('admin.users.showing', {
  count: filteredData.length,
  total: USER_MANAGEMENT_MOCK_DATA.length,
})}
```

**To:**
```typescript
{t('admin.users.showing', {
  count: users.length,
  total: totalCount,
})}
```

---

### 4. **`src/screens/UserManagement/UsersTableConfig.tsx`** ✅ MODIFY
**Action:** No change needed (already using correct import)

**Current State:**
```typescript
import { User } from '@constants/USER_MANAGEMENT_MOCK_DATA';  // Already correct
```

**Note:** Keep using `User` from mock data file. The `UserSearchParams` and `UserSearchResponse` interfaces are in `participantService.ts` (following PR #42 pattern), not in a separate types file.

---

## 🔄 Comparison: Participant vs User API

| Aspect | Participant API (PR #42) | User API (This Plan) |
|--------|-------------------------|----------------------|
| **Endpoint** | `/api/user/v1/account/search` | `/api/user/v1/account/search` (same) |
| **Type Parameter** | `type=participant` | `type=user,session_manager,org_admin` |
| **Request Body** | `participant_ids: null` | `user_ids: null` |
| **Service File** | `participantService.ts` | `participantService.ts` (same file, add function) |
| **Interfaces Location** | `participantService.ts` (ParticipantSearchParams, ParticipantSearchResponse) | `participantService.ts` (add UserSearchParams, UserSearchResponse) |
| **Endpoint Constant** | `PARTICIPANTS_LIST` | `PARTICIPANTS_LIST` (reuse same) |

**Key Insight:** Same endpoint, different `type` parameter!

---

## 📝 Implementation Steps

### Phase 1: Setup (Service Layer)
1. ✅ Use `PARTICIPANTS_LIST` from PR #42 in `apiEndpoints.ts` (already added in PR #42)
2. ✅ Add `UserSearchParams` and `UserSearchResponse` interfaces to `src/services/participantService.ts` (following PR #42 pattern - interfaces in service file)
3. ✅ Add `getUsersList()` function to `src/services/participantService.ts` (reuse PR #42 code, modify for users)
4. ✅ Test API call with sample parameters

### Phase 2: Component Integration
5. ✅ Update `UserManagement/index.tsx` imports
6. ✅ Add state variables (users, isLoading, totalCount, pagination)
7. ✅ Replace mock data useEffect with API call useEffect
8. ✅ Remove client-side filtering (`applyFilters`)
9. ✅ Update filter handlers to reset pagination
10. ✅ Update DataTable props
11. ✅ Update count display

### Phase 3: Data Transformation
12. ✅ Implement API response to User[] transformation
13. ✅ Handle role normalization (admin, supervisor, etc.)
14. ✅ Handle status normalization (ACTIVE → Active, etc.)
15. ✅ Map API field names to User interface

### Phase 4: Testing & Refinement
16. ✅ Test initial page load
17. ✅ Test search functionality
18. ✅ Test filter combinations (role, status, province, district)
19. ✅ Test pagination (if implemented)
20. ✅ Test error handling
21. ✅ Verify data transformation accuracy

---

## ⚠️ Important Considerations

### 1. **Data Transformation**
- API may return different field names (e.g., `user_role` vs `role`)
- Need to normalize role values (e.g., `'admin'` → `'Admin'`)
- Need to normalize status values (e.g., `'ACTIVE'` → `'Active'`)
- Handle missing/null fields gracefully

### 2. **Filter Handling**
- "All" options (e.g., "All Roles") should not be sent to API
- Province/District filters need label-to-value mapping
- Filter changes should reset pagination to page 1

### 3. **Pagination**
- Currently using client-side pagination in DataTable
- Can keep client-side or switch to server-side (based on requirements)
- If server-side: Add `onPageChange` and `onPageSizeChange` handlers

### 4. **Error Handling**
- Handle network errors
- Handle 401 unauthorized
- Handle empty responses
- Show user-friendly error messages

### 5. **Loading States**
- Show loading indicator during API calls
- Prevent multiple simultaneous requests

---

## 🎯 Expected Outcome

After implementation:
- ✅ User Management screen fetches data from API
- ✅ Search functionality works (server-side)
- ✅ Filters work (server-side: role, status, province, district)
- ✅ Data is transformed correctly to match UI expectations
- ✅ Loading states are handled
- ✅ Error handling is in place
- ✅ No client-side filtering needed (all handled by API)

---

## 📊 Files Summary

| File | Action | Lines Changed (Est.) |
|------|--------|---------------------|
| `src/services/apiEndpoints.ts` | No change (use `PARTICIPANTS_LIST` from PR #42) | 0 lines |
| `src/services/participantService.ts` | Modify (add interfaces + `getUsersList()` function) | ~80 lines added |
| `src/screens/UserManagement/index.tsx` | Modify | ~100 lines changed |
| `src/screens/UserManagement/UsersTableConfig.tsx` | Modify | ~1 line (import path) |

**Total:** ~181 lines of changes (reusing PR #42 code reduces duplication)

**Note:** All User-related interfaces and service function will be in `participantService.ts` (following PR #42 pattern).

---

## ✅ Approval Checklist

Before implementation, please confirm:
- [ ] API endpoint URL is correct: `/api/user/v1/account/search`
- [ ] Type parameter is correct: `type=user,session_manager,org_admin`
- [ ] Request body structure is correct: `{ user_ids: null }`
- [ ] Response structure matches expected format
- [ ] Data transformation logic is acceptable
- [ ] Filter parameter names match API expectations
- [ ] Pagination approach (client-side vs server-side) is decided

---

## 🚀 Ready for Implementation?

Once approved, I will:

### Phase 1: Service Layer
1. ✅ Modify `src/services/participantService.ts`:
   - Add `UserSearchParams` and `UserSearchResponse` interfaces (following PR #42 pattern)
   - Add `getUsersList()` function (reusing PR #42 code, modified for users)
   - Add necessary imports (`api`, `API_ENDPOINTS`, `User` type)

### Phase 2: Component Integration
2. ✅ Modify `src/screens/UserManagement/index.tsx`:
   - Update imports (remove mock data imports, add `getUsersList` and `UserSearchParams`)
   - Add API state management (`users`, `isLoading`, `totalCount`, `currentPage`, `pageSize`)
   - Replace client-side filtering with API calls (`useEffect` with API integration)
   - Update filter handlers to reset pagination
   - Update DataTable props for server-side pagination
   - Update count display to use API data

### Phase 3: Testing & Refinement
3. ✅ Test the integration:
   - Verify API calls with different filter combinations
   - Test pagination (page changes, page size changes)
   - Test search functionality
   - Test role, status, province, district filters
   - Verify data transformation (role/status normalization)
   - Handle edge cases (empty responses, errors, loading states)

4. ✅ Handle any edge cases or adjustments needed:
   - Data field mapping (if API returns different field names)
   - Error handling improvements
   - Loading state optimizations
   - Filter label-to-value mappings

**Note:** No new files will be created. All changes will be made to existing files (`participantService.ts` and `UserManagement/index.tsx`), following the PR #42 pattern.

**Please review and approve this plan before I proceed with implementation.**

