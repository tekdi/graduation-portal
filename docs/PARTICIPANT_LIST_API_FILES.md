# Participant List API Integration - File-by-File Guide

This document explains exactly which files need to be changed and what changes are needed for the Participant List API integration.

---

## 📁 Files to Modify

### 1. `src/services/apiEndpoints.ts`
**Purpose:** Add the participant search API endpoint

**Current State:**
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    USERS_SEARCH: `${prefix}/user/v1/account/search`,
}
```

**Change Needed:**
Add the `PARTICIPANTS_SEARCH` endpoint:
```typescript
const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    USERS_SEARCH: `${prefix}/user/v1/account/search`,
    PARTICIPANTS_SEARCH: `${prefix}/participant/v1/search`,  // ← ADD THIS
}
```

---

### 2. `src/services/participantService.ts`
**Purpose:** Replace mock data function with real API call

**Current State:**
```typescript
// Currently returns mock data from constants
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

**Change Needed:**
Replace with API call function:

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
 * Handles search, filtering, and pagination
 * 
 * @param params - Query parameters for filtering and pagination
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
      tenant_code: 'brac',  // or get from config
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

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_SEARCH}?${queryParams.toString()}`;

    // Make POST request
    const response = await api.post<ParticipantsResponse>(endpoint, {
      participant_ids: null,  // or array if filtering by specific IDs
    });

    return response.data;
  } catch (error: any) {
    // Error is handled by axios interceptor
    throw error;
  }
};

/**
 * Transform API response data to Participant format
 * Maps API field names to UI expected format
 */
const transformParticipantData = (apiData: any): Participant => {
  return {
    id: apiData.id || apiData.participant_id || '',
    name: apiData.name || apiData.full_name || '',
    phone: apiData.contact || apiData.phone || apiData.phone_number || '',
    email: apiData.email || apiData.email_address || '',
    address: apiData.address || apiData.location || '-',
    progress: apiData.progress || apiData.completion_percentage || 0,
    status: normalizeStatus(apiData.status) as Participant['status'],
  };
};

/**
 * Normalize status values from API to match UI expectations
 */
const normalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'NOT_ONBOARDED': 'Not Onboarded',
    'ONBOARDED': 'Onboarded',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'DROPPED_OUT': 'Dropped out',
    'GRADUATED': 'Graduated',
  };
  
  return statusMap[status?.toUpperCase()] || status || 'Not Onboarded';
};
```

**Note:** Keep the other functions (`getParticipantById`, `getParticipantProfile`, etc.) as they are for now.

---

### 3. `src/screens/ParticipantsList/index.tsx`
**Purpose:** Integrate API calls, remove client-side filtering, add pagination

**Current State:**
- Uses `getParticipantsList()` which returns mock data
- Client-side filtering with `applyFilters`
- Client-side pagination in DataTable

**Changes Needed:**

#### 3.1 Update Imports
```typescript
// ADD these imports
import { getParticipantsList } from '../../services/participantService';
import type { ParticipantsQueryParams } from '@app-types/screens';

// REMOVE or keep (if used elsewhere)
// import { applyFilters } from '@utils/helper';  // ← Remove client-side filtering
```

#### 3.2 Update State Management
```typescript
// ADD new state variables
const [isLoading, setIsLoading] = useState(false);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [searchKey, setSearchKey] = useState('');

// UPDATE existing state
const [participants, setParticipants] = useState<Participant[]>([]);
const [activeStatus, setActiveStatus] = useState<StatusType | ''>(
  STATUS.NOT_ENROLLED,
);
const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');

// UPDATE statusCounts to use state (if API provides it)
const [statusCounts, setStatusCounts] = useState<StatusCount>({
  'Not Onboarded': 0,
  'Onboarded': 0,
  'In Progress': 0,
  'Completed': 0,
  'Dropped out': 0,
  'Graduated': 0,
});
```

#### 3.3 Replace Mock Data useEffect with API Call
**REMOVE this:**
```typescript
useEffect(() => {
  // Set mock participants data
  const participants = getParticipantsList();
  setParticipants(participants);
}, []);
```

**REPLACE with:**
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
      } else {
        // Calculate from current page data (fallback)
        const calculatedCounts = calculateStatusCounts(participantsData);
        setStatusCounts(calculatedCounts);
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

// Helper function to normalize status
const normalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'NOT_ONBOARDED': 'Not Onboarded',
    'ONBOARDED': 'Onboarded',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'DROPPED_OUT': 'Dropped out',
    'GRADUATED': 'Graduated',
  };
  return statusMap[status?.toUpperCase()] || status || 'Not Onboarded';
};

// Helper function to calculate status counts (fallback)
const calculateStatusCounts = (data: Participant[]): StatusCount => {
  const counts: StatusCount = {
    'Not Onboarded': 0,
    'Onboarded': 0,
    'In Progress': 0,
    'Completed': 0,
    'Dropped out': 0,
    'Graduated': 0,
  };

  data.forEach(participant => {
    if (participant.status && participant.status in counts) {
      counts[participant.status as StatusType]++;
    }
  });

  return counts;
};
```

#### 3.4 Remove Client-Side Filtering
**REMOVE this:**
```typescript
const filteredParticipants = useMemo(() => {
  // Build filters object for applyFilters
  const filters: Record<string, any> = {};
  
  // Apply status filter if active
  if (activeStatus) {
    filters.status = activeStatus;
  }
  
  // Apply filters using helper function
  return applyFilters(participants, filters);
}, [participants, activeStatus]);
```

**REPLACE with:**
```typescript
// No client-side filtering needed - API handles it
// Use participants directly from API
```

#### 3.5 Update Status Counts Calculation
**REMOVE or UPDATE this:**
```typescript
// OLD: Calculate from all participants
const statusCounts = useMemo<StatusCount>(() => {
  const counts: StatusCount = { /* ... */ };
  participants.forEach(participant => { /* ... */ });
  return counts;
}, [participants]);
```

**REPLACE with:**
```typescript
// Use statusCounts from state (set by API response)
// statusCounts is now managed in state, updated from API
```

#### 3.6 Update Search Handler
**CHANGE this:**
```typescript
const handleSearch = useCallback((text: string) => {
  // Search functionality can be implemented here when needed
}, []);
```

**TO:**
```typescript
const handleSearch = useCallback((text: string) => {
  setSearchKey(text);
  setCurrentPage(1); // Reset to first page on new search
}, []);
```

#### 3.7 Update Status Change Handler
**CHANGE this:**
```typescript
const handleStatusChange = useCallback((status: StatusType | '') => {
  setActiveStatus(status);
}, []);
```

**TO:**
```typescript
const handleStatusChange = useCallback((status: StatusType | '') => {
  setActiveStatus(status);
  setCurrentPage(1); // Reset to first page on status change
}, []);
```

#### 3.8 Add Pagination Handlers
**ADD these new handlers:**
```typescript
const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page);
}, []);

const handlePageSizeChange = useCallback((size: number) => {
  setPageSize(size);
  setCurrentPage(1); // Reset to first page when page size changes
}, []);
```

#### 3.9 Update DataTable Component
**CHANGE this:**
```typescript
<DataTable
  data={filteredParticipants}  // ← Change this
  columns={getParticipantsColumns(activeStatus)}
  getRowKey={participant => participant.id}
  onRowClick={handleRowClick}
  isLoading={isLoading}
  emptyMessage={t('participants.noParticipantsFound')}
  loadingMessage={t('participants.loadingParticipants')}
  pagination={{
    enabled: true,
    pageSize: 6,  // ← Change this
    maxPageNumbers: 5,
  }}
/>
```

**TO:**
```typescript
<DataTable
  data={participants}  // ← Use direct API data, no filtering
  columns={getParticipantsColumns(activeStatus)}
  getRowKey={participant => participant.id}
  onRowClick={handleRowClick}
  isLoading={isLoading}
  emptyMessage={t('participants.noParticipantsFound')}
  loadingMessage={t('participants.loadingParticipants')}
  pagination={{
    enabled: true,
    pageSize: pageSize,  // ← Use state variable
    pageSizeOptions: [10, 20, 50, 100],  // ← Add page size options
    showPageSizeSelector: true,  // ← Enable page size selector
    maxPageNumbers: 5,
  }}
  totalItems={totalCount}  // ← Add total from API
  onPageChange={handlePageChange}  // ← Add page change handler
  onPageSizeChange={handlePageSizeChange}  // ← Add page size handler
/>
```

#### 3.10 Update Active/Inactive Filter Handler
**CHANGE this:**
```typescript
onChange={(value) => setActiveFilter(value as 'active' | 'inactive')}
```

**TO:**
```typescript
onChange={(value) => {
  setActiveFilter(value as 'active' | 'inactive');
  setCurrentPage(1); // Reset pagination
  // Status will be updated by existing useEffect
}}
```

---

### 4. `src/types/screens.ts`
**Purpose:** Type definitions (already exists, verify it's correct)

**Current State:**
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

**Status:** ✅ Already correct, no changes needed

---

## 📋 Summary of Changes

### Files Modified:
1. ✅ `src/services/apiEndpoints.ts` - Add `PARTICIPANTS_SEARCH` endpoint
2. ✅ `src/services/participantService.ts` - Replace mock function with API call
3. ✅ `src/screens/ParticipantsList/index.tsx` - Integrate API, remove client-side filtering, add pagination
4. ✅ `src/types/screens.ts` - Already has correct types (no changes)

### Key Changes:
- **Service Layer:** Mock data → API call
- **Filtering:** Client-side → Server-side (via API parameters)
- **Pagination:** Client-side → Server-side (via API parameters)
- **Search:** Client-side → Server-side (via API parameter)
- **Status Counts:** Calculated from all data → From API response (or current page)

---

## 🔄 Data Flow

```
User Action (Search/Filter/Pagination)
    ↓
ParticipantsList Component (State Update)
    ↓
useEffect Triggered (State Change Detected)
    ↓
participantService.getParticipantsList() (API Call)
    ↓
api.post() (Axios with Auth Token)
    ↓
Backend API (/api/participant/v1/search)
    ↓
API Response (ParticipantsResponse)
    ↓
Data Transformation (normalizeStatus, map fields)
    ↓
State Update (setParticipants, setTotalCount, setStatusCounts)
    ↓
UI Re-render (DataTable shows new data)
```

---

## 🧪 Testing Checklist

After implementing changes, test:

- [ ] Initial page load shows participants
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Active/Inactive filter works
- [ ] Pagination (next/previous) works
- [ ] Page size change works
- [ ] Loading state shows during API calls
- [ ] Error handling works (network error, 401, 500)
- [ ] Empty state shows when no results
- [ ] Status counts update correctly

---

## 📝 Notes

1. **API Endpoint:** Confirm the exact endpoint path with backend team
2. **Field Mapping:** Adjust `transformParticipantData` based on actual API response structure
3. **Status Normalization:** Adjust `normalizeStatus` based on actual API status values
4. **Status Counts:** If API doesn't provide `statusCount`, use fallback calculation
5. **Error Handling:** Consider showing user-friendly error messages/toasts
6. **Loading States:** Ensure loading indicators are visible during API calls

---

## 🚀 Implementation Order

1. Add endpoint to `apiEndpoints.ts`
2. Update `participantService.ts` with API function
3. Update `ParticipantsList/index.tsx` step by step:
   - Add state variables
   - Replace useEffect
   - Update handlers
   - Update DataTable props
4. Test each feature incrementally
5. Handle edge cases and errors

