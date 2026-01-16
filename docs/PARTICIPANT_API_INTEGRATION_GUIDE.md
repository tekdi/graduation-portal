# Participant List API Integration - Complete Guide

## Overview
This document explains the complete API integration process for the Participant List view, following the pattern established in the User Management screen. The integration replaces mock data with real API calls, implements server-side filtering, pagination, and search functionality.

---

## 1. Architecture Overview

### 1.1 Component Structure
```
src/
├── services/
│   ├── participantService.ts    # API service layer
│   ├── api.ts                   # Axios instance with interceptors
│   └── apiEndpoints.ts          # API endpoint constants
├── screens/
│   └── ParticipantsList/
│       ├── index.tsx            # Main screen component
│       ├── Styles.ts            # Component styles
│       └── ParticipantsTableConfig.tsx  # Table column definitions
├── types/
│   ├── screens.ts               # Participant types & API response types
│   └── participant.ts           # Participant data interfaces
└── components/
    ├── DataTable/               # Reusable table component
    └── SearchBar/               # Search input component
```

### 1.2 Data Flow
```
User Interaction (Filter/Search/Pagination)
    ↓
ParticipantsList Component (State Management)
    ↓
participantService.ts (API Service Layer)
    ↓
api.ts (Axios Instance with Auth)
    ↓
Backend API
    ↓
Response Transformation
    ↓
State Update
    ↓
UI Re-render
```

---

## 2. API Endpoint Structure

### 2.1 Endpoint Definition
Based on the pattern from User Management, the participant search endpoint should be:

```typescript
// src/services/apiEndpoints.ts
export const API_ENDPOINTS = {
    // ... existing endpoints
    PARTICIPANTS_SEARCH: `${prefix}/participant/v1/search`,  // or similar
}
```

### 2.2 Request Structure
The API likely accepts a POST request with query parameters and optional body:

**Query Parameters:**
- `tenant_code`: string (e.g., "brac")
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional - for name/ID search)
- `status`: string (optional - filter by status)

**Request Body (POST):**
```json
{
  "participant_ids": null  // or array of IDs if filtering by specific participants
}
```

### 2.3 Response Structure
Based on `ParticipantsResponse` type:

```typescript
interface ParticipantsResponse {
    result: {
        data: {
            count: number;              // Total count of participants
            participants: Participant[]; // Array of participant objects
        };
    };
    statusCount?: StatusCount;          // Optional: counts per status
}
```

**Example API Response:**
```json
{
  "responseCode": "200",
  "message": "Success",
  "result": {
    "data": {
      "count": 150,
      "participants": [
        {
          "id": "P-001",
          "name": "John Doe",
          "contact": "+1234567890",
          "email": "john@example.com",
          "status": "In Progress",
          "progress": 65,
          "address": "123 Main St, Province, Site"
        }
      ]
    }
  },
  "statusCount": {
    "Not Onboarded": 20,
    "Onboarded": 30,
    "In Progress": 50,
    "Completed": 25,
    "Dropped out": 15,
    "Graduated": 10
  }
}
```

---

## 3. Service Layer Implementation

### 3.1 participantService.ts Structure

```typescript
// src/services/participantService.ts
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

    // Make POST request with optional participant_ids in body
    const response = await api.post<ParticipantsResponse>(endpoint, {
      participant_ids: null,  // or array if filtering by specific IDs
    });

    return response.data;
  } catch (error: any) {
    // Error is handled by axios interceptor
    throw error;
  }
};
```

### 3.2 Data Transformation
The API response may need transformation to match the `Participant` interface:

```typescript
/**
 * Transform API response to Participant format
 * Handles field name mapping and data normalization
 */
const transformParticipantData = (apiData: any): Participant => {
  return {
    id: apiData.id || apiData.participant_id || '',
    name: apiData.name || apiData.full_name || '',
    phone: apiData.contact || apiData.phone || apiData.phone_number || '',
    email: apiData.email || apiData.email_address || '',
    address: apiData.address || apiData.location || '-',
    progress: apiData.progress || apiData.completion_percentage || 0,
    status: normalizeStatus(apiData.status) as StatusType,
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

---

## 4. Screen Component Integration

### 4.1 State Management

The `ParticipantsList` component needs to manage:

```typescript
// State variables
const [participants, setParticipants] = useState<Participant[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [searchKey, setSearchKey] = useState('');
const [activeStatus, setActiveStatus] = useState<StatusType | ''>(STATUS.NOT_ENROLLED);
const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');

// Status counts from API (if provided) or calculated from data
const [statusCounts, setStatusCounts] = useState<StatusCount>({
  'Not Onboarded': 0,
  'Onboarded': 0,
  'In Progress': 0,
  'Completed': 0,
  'Dropped out': 0,
  'Graduated': 0,
});
```

### 4.2 API Call Implementation

```typescript
// useEffect to fetch participants when filters/pagination change
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
        (participant: any) => transformParticipantData(participant)
      ) as Participant[];

      setParticipants(participantsData);
      setTotalCount(response.result?.data?.count || participantsData.length);

      // Update status counts if provided by API
      if (response.statusCount) {
        setStatusCounts(response.statusCount);
      } else {
        // Calculate from current data if not provided
        const calculatedCounts = calculateStatusCounts(participantsData);
        setStatusCounts(calculatedCounts);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]);
      setTotalCount(0);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  fetchParticipants();
}, [currentPage, pageSize, searchKey, activeStatus, activeFilter]);
```

### 4.3 Filter Handling

**Search Handler:**
```typescript
const handleSearch = useCallback((text: string) => {
  setSearchKey(text);
  setCurrentPage(1); // Reset to first page on new search
}, []);
```

**Status Change Handler:**
```typescript
const handleStatusChange = useCallback((status: StatusType | '') => {
  setActiveStatus(status);
  setCurrentPage(1); // Reset to first page on status change
}, []);
```

**Active/Inactive Filter:**
```typescript
const handleActiveFilterChange = useCallback((filter: 'active' | 'inactive') => {
  setActiveFilter(filter);
  setCurrentPage(1);
  
  // Set default status based on filter
  if (filter === 'inactive') {
    setActiveStatus(STATUS.GRADUATED);
  } else {
    setActiveStatus(STATUS.NOT_ENROLLED);
  }
}, []);
```

### 4.4 Pagination Handlers

```typescript
const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page);
}, []);

const handlePageSizeChange = useCallback((size: number) => {
  setPageSize(size);
  setCurrentPage(1); // Reset to first page when page size changes
}, []);
```

### 4.5 Remove Client-Side Filtering

**Before (Mock Data):**
```typescript
const filteredParticipants = useMemo(() => {
  const filters: Record<string, any> = {};
  if (activeStatus) {
    filters.status = activeStatus;
  }
  return applyFilters(participants, filters);
}, [participants, activeStatus]);
```

**After (API Integration):**
```typescript
// Remove client-side filtering - API handles it
// Use participants directly from API
// No need for filteredParticipants
```

---

## 5. DataTable Integration

### 5.1 Update DataTable Props

```typescript
<DataTable
  data={participants}  // Direct API data, no client-side filtering
  columns={getParticipantsColumns(activeStatus)}
  getRowKey={participant => participant.id}
  onRowClick={handleRowClick}
  isLoading={isLoading}
  emptyMessage={t('participants.noParticipantsFound')}
  loadingMessage={t('participants.loadingParticipants')}
  pagination={{
    enabled: true,
    pageSize: pageSize,
    pageSizeOptions: [10, 20, 50, 100],
    showPageSizeSelector: true,
    maxPageNumbers: 5,
  }}
  totalItems={totalCount}  // Total from API
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
/>
```

---

## 6. Authentication & API Configuration

### 6.1 API Instance Setup
The `api.ts` file already handles:
- Base URL configuration
- Authentication token injection
- Request/response interceptors
- Error handling
- Token refresh logic

### 6.2 Token Management
Tokens are automatically added via interceptors:
```typescript
// Automatically added by api.ts interceptor
headers: {
  'Authorization': `Bearer ${token}`,
  'x-auth-token': token,
}
```

---

## 7. Error Handling

### 7.1 API Error Handling
Errors are handled at multiple levels:

1. **Axios Interceptor** (`api.ts`):
   - 401 Unauthorized → Clear token, redirect to login
   - Network errors → User-friendly messages
   - Other errors → Log and return error message

2. **Service Layer** (`participantService.ts`):
   - Re-throw errors for component handling

3. **Component Level** (`ParticipantsList/index.tsx`):
   ```typescript
   catch (error) {
     console.error('Error fetching participants:', error);
     setParticipants([]);
     setTotalCount(0);
     // Optionally show toast/notification to user
   }
   ```

### 7.2 Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

// Show loading indicator in DataTable
<DataTable
  isLoading={isLoading}
  loadingMessage={t('participants.loadingParticipants')}
  // ...
/>
```

---

## 8. Status Counts Management

### 8.1 API-Provided Counts (Preferred)
If API returns `statusCount` in response:
```typescript
if (response.statusCount) {
  setStatusCounts(response.statusCount);
}
```

### 8.2 Client-Side Calculation (Fallback)
If API doesn't provide counts, calculate from current page:
```typescript
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

**Note:** Client-side counts only reflect current page. For accurate counts, API should provide them.

---

## 9. Search Implementation

### 9.1 Debounced Search
The `SearchBar` component already implements debouncing:

```typescript
<SearchBar
  placeholder={t('participants.searchByNameOrId')}
  onSearch={handleSearch}  // Called after debounce delay
  debounceMs={500}  // Wait 500ms after user stops typing
/>
```

### 9.2 Search Handler
```typescript
const handleSearch = useCallback((text: string) => {
  setSearchKey(text);
  setCurrentPage(1); // Reset pagination
}, []);
```

---

## 10. Complete Implementation Checklist

### Phase 1: Service Layer
- [ ] Add `PARTICIPANTS_SEARCH` endpoint to `apiEndpoints.ts`
- [ ] Implement `getParticipantsList` function in `participantService.ts`
- [ ] Add data transformation logic
- [ ] Add status normalization function
- [ ] Test API call with sample parameters

### Phase 2: Component Integration
- [ ] Update state management (add loading, pagination states)
- [ ] Implement `useEffect` for API calls
- [ ] Update filter handlers to trigger API calls
- [ ] Remove client-side filtering (`applyFilters`)
- [ ] Update search handler
- [ ] Add pagination handlers

### Phase 3: DataTable Integration
- [ ] Update DataTable props (remove client-side filtering)
- [ ] Add `totalItems` prop
- [ ] Add `onPageChange` and `onPageSizeChange` handlers
- [ ] Update `isLoading` prop

### Phase 4: Status Counts
- [ ] Handle API-provided status counts
- [ ] Implement fallback calculation if needed
- [ ] Update status filter UI with counts

### Phase 5: Error Handling & Testing
- [ ] Test error scenarios (network, 401, 500)
- [ ] Test loading states
- [ ] Test pagination
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Test active/inactive filter
- [ ] Verify data transformation

---

## 11. Key Differences from Mock Implementation

| Aspect | Mock Implementation | API Implementation |
|--------|-------------------|-------------------|
| **Data Source** | `getParticipantsList()` from constants | API call via `participantService.ts` |
| **Filtering** | Client-side (`applyFilters`) | Server-side (API parameters) |
| **Pagination** | Client-side (slice array) | Server-side (page/limit params) |
| **Status Counts** | Calculated from all data | From API or current page |
| **Search** | Client-side filtering | Server-side search parameter |
| **Loading State** | Not needed | Required for API calls |
| **Error Handling** | Not needed | Required for API errors |

---

## 12. Example: Complete Flow

### User Action: Search for "John"
1. User types "John" in SearchBar
2. After 500ms debounce, `handleSearch("John")` is called
3. `setSearchKey("John")` updates state
4. `setCurrentPage(1)` resets pagination
5. `useEffect` detects `searchKey` change
6. `fetchParticipants()` is called with `searchKey: "John"`
7. `getParticipantsList({ searchKey: "John", page: 1, limit: 20 })` is called
8. API request: `POST /api/participant/v1/search?tenant_code=brac&page=1&limit=20&search=John`
9. API returns filtered results
10. Data is transformed and set to state
11. UI re-renders with filtered participants

### User Action: Change Status Filter
1. User clicks "In Progress" status button
2. `handleStatusChange(STATUS.IN_PROGRESS)` is called
3. `setActiveStatus(STATUS.IN_PROGRESS)` updates state
4. `setCurrentPage(1)` resets pagination
5. `useEffect` detects `activeStatus` change
6. API call with `status: "In Progress"`
7. UI updates with filtered results

---

## 13. Testing Checklist

### Manual Testing
- [ ] Load participants list (initial load)
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Test active/inactive filter
- [ ] Test pagination (next/previous)
- [ ] Test page size change
- [ ] Test loading states
- [ ] Test error scenarios
- [ ] Test empty state
- [ ] Test on mobile and desktop

### Edge Cases
- [ ] Empty search results
- [ ] Very long search query
- [ ] Rapid filter changes
- [ ] Network timeout
- [ ] 401 unauthorized
- [ ] 500 server error
- [ ] Large dataset pagination

---

## 14. Performance Considerations

1. **Debouncing**: Search is debounced to avoid excessive API calls
2. **Memoization**: Use `useCallback` for handlers, `useMemo` for computed values
3. **Pagination**: Server-side pagination reduces data transfer
4. **Loading States**: Show loading indicators to improve UX
5. **Error Recovery**: Graceful error handling prevents app crashes

---

## 15. Future Enhancements

1. **Caching**: Cache API responses for better performance
2. **Optimistic Updates**: Update UI before API confirmation
3. **Infinite Scroll**: Alternative to pagination
4. **Advanced Filters**: Province, district, date range filters
5. **Export Functionality**: Export filtered results to CSV
6. **Real-time Updates**: WebSocket for live status updates

---

## Conclusion

This guide provides a complete overview of the Participant List API integration. Follow the implementation checklist step by step, and refer to the User Management implementation as a reference pattern. The key is to replace client-side operations (filtering, pagination) with server-side API calls while maintaining a smooth user experience.

