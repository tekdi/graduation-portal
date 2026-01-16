# Assign Users Feature - Development Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components Used](#components-used)
4. [Development Approach](#development-approach)
5. [Feature Workflow](#feature-workflow)
6. [State Management](#state-management)
7. [Data Flow](#data-flow)
8. [File Structure](#file-structure)
9. [Key Features](#key-features)
10. [API Integration Points](#api-integration-points)
11. [Future Enhancements](#future-enhancements)

---

## Overview

The **Assign Users** feature allows administrators to assign Linkage Champions (LCs) to Supervisors and Participants to Linkage Champions. This feature is implemented as a multi-step wizard interface with two main workflows:

1. **LC to Supervisor Tab**: Assign Linkage Champions to Supervisors
2. **Participant to LC Tab**: Assign Participants to Linkage Champions

### Key Capabilities
- Multi-step assignment process with clear visual feedback
- Dynamic filtering based on geography, site, bio, and productivity
- Real-time list updates (assigned items removed from unassigned list)
- Hardcoded data tables showing assigned relationships
- Responsive design using Gluestack UI components

---

## Architecture

### High-Level Architecture

```
AssignUsersScreen (Main Container)
├── TitleHeader (Tab Navigation)
├── SelectionCard Components (Reusable Step Cards)
│   ├── FilterButton (Filter Controls)
│   ├── Checkbox Lists (Selection Interface)
│   └── Assignment Buttons
└── Data Tables (Assigned Items Display)
```

### Component Hierarchy

```
AssignUsersScreen
│
├── TitleHeader
│   └── Tab Buttons (LC_TO_SUPERVISOR | PARTICIPANT_TO_LC)
│
├── SelectionCard (Step 1: Select Supervisor)
│   └── FilterButton
│       └── Select Components (Province, Supervisor)
│
├── SelectionCard (Step 2: Assign LCs / Select LC)
│   └── FilterButton
│       └── Select Components (Site / Geography)
│   └── Checkbox List (LCs / Participants)
│   └── Assign Button
│
├── SelectionCard (Step 3: Assign Participants) [Participant Tab Only]
│   └── FilterButton
│       └── Select Components (Bio, Productivity)
│   └── Checkbox List (Participants)
│   └── Assign Button
│
└── Data Tables
    ├── List of LCs Mapped to Supervisor
    └── List of Participants Mapped to LC
```

---

## Components Used

### Core Components

#### 1. **AssignUsersScreen** (`src/screens/AssignUsers/index.tsx`)
- **Purpose**: Main container component managing the entire assignment workflow
- **Responsibilities**:
  - Tab state management (LC_TO_SUPERVISOR | PARTICIPANT_TO_LC)
  - Filter state management for all steps
  - Assigned items state tracking
  - Handler functions for assignments
  - Data table rendering

#### 2. **SelectionCard** (`src/components/SelectionCard/index.tsx`)
- **Purpose**: Reusable card component for each step in the assignment process
- **Props**:
  - `title`: Step title (translation key)
  - `description`: Step description (translation key with interpolation)
  - `filterOptions`: Array of filter configurations
  - `onChange`: Callback for filter changes
  - `selectedValues`: Current filter values
  - `showSelectedCard`: Display selected supervisor/LC card
  - `showLcList`: Show checkbox list for selection
  - `showLcListforSupervisorTeam`: Show selectable LC cards
  - `onLcSelect`: Callback when LC is selected
  - `onAssign`: Callback when assignment button is clicked
  - `lcList`: Optional filtered list (for removing assigned items)
  - `isParticipantList`: Flag for participant-specific UI

#### 3. **FilterButton** (`src/components/Filter/index.tsx`)
- **Purpose**: Generic filter component supporting search and select filters
- **Features**:
  - Search input field
  - Select dropdowns with translation support
  - Placeholder support
  - Auto-selection of "all" options
  - Clear filters functionality

#### 4. **TitleHeader** (`src/components/TitleHeader/index.tsx`)
- **Purpose**: Page header with title, description, and action buttons
- **Usage**: Displays tab navigation buttons

### UI Components (Gluestack UI)

- **VStack**: Vertical layout container
- **HStack**: Horizontal layout container
- **Card**: Container with outline variant
- **Button**: Action buttons with solid/outline variants
- **Text**: Typography component
- **Avatar**: User avatar with fallback initials
- **Checkbox**: Selection checkbox with indicator
- **Box**: Layout container with flex properties
- **Divider**: Visual separator

---

## Development Approach

### 1. **Data-Driven Filter Configuration**

Filters are defined as configuration objects in `USER_MANAGEMENT_FILTERS.ts`:

```typescript
type FilterConfig = {
  nameKey?: string;        // Translation key
  attr: string;            // Filter attribute name
  type: 'search' | 'select';
  data: Array<...>;        // Filter options
  placeholderKey?: string; // Placeholder translation key
};
```

**Benefits**:
- Centralized filter definitions
- Easy to modify without component changes
- Supports translation keys
- Reusable across different screens

### 2. **State Management Strategy**

#### Local Component State
- Each SelectionCard manages its own checkbox selection state
- Filter values are managed at the parent level (AssignUsersScreen)
- Assigned items are tracked in parent state

#### State Flow
```
User Interaction
  ↓
SelectionCard (Local State)
  ↓
onChange/onAssign Callbacks
  ↓
AssignUsersScreen (Parent State)
  ↓
State Updates
  ↓
Re-render with Updated Data
```

### 3. **Reusable Component Pattern**

**SelectionCard** is designed as a highly reusable component:
- Accepts configuration via props
- Handles multiple use cases (LCs, Participants, Supervisor selection)
- Supports different display modes (checkboxes, selectable cards)
- Flexible filter integration

### 4. **Separation of Concerns**

- **Constants**: Filter configurations and mock data
- **Components**: UI rendering and interaction
- **Screen**: Business logic and state management
- **Locales**: Translation strings

---

## Feature Workflow

### Tab 1: LC to Supervisor

#### Step 1: Select Supervisor
1. **User Action**: Select province from dropdown
2. **System**: Filters available supervisors by province
3. **User Action**: Select supervisor from dropdown
4. **System**: 
   - Displays selected supervisor card
   - Shows Step 2 card
   - Resets assigned LCs if supervisor changes

#### Step 2: Assign Linkage Champions
1. **User Action**: Optionally filter by Site
2. **System**: Shows available (unassigned) LCs
3. **User Action**: Select LCs using checkboxes
4. **User Action**: Click "Assign LCs to Supervisor" button
5. **System**:
   - Generates LC data (email, LC ID, site)
   - Adds to assigned LCs state
   - Removes from unassigned list
   - Displays in table below
   - Clears checkbox selection

#### Data Table Display
- Shows hardcoded row (Nomsa Dlamini - LC-002)
- Dynamically displays all assigned LCs
- Updates in real-time as assignments are made

### Tab 2: Participant to LC

#### Step 1: Select Supervisor
1. **User Action**: Select supervisor from dropdown
2. **System**: 
   - Displays selected supervisor card
   - Shows Step 2 card
   - Resets assigned participants and selected LC

#### Step 2: Select Linkage Champion
1. **User Action**: Click on an LC card from supervisor's team
2. **System**:
   - Highlights selected LC
   - Shows Step 3 card
   - Resets assigned participants if LC changes

#### Step 3: Assign Participants
1. **User Action**: Optionally filter by Bio and Productivity
2. **System**: Shows available (unassigned) participants
3. **User Action**: Select participants using checkboxes
4. **User Action**: Click "Assign X Participants to LC" button
5. **System**:
   - Generates participant data (email, participant ID, bio, productivity)
   - Adds to assigned participants state
   - Removes from unassigned list
   - Displays in table below
   - Clears checkbox selection

#### Data Table Display
- Shows hardcoded row (Mandla Zwane - PAR-001)
- Dynamically displays all assigned participants
- Shows productivity badges (High=Red, Medium=Yellow, Low=Green)
- Updates in real-time as assignments are made

---

## State Management

### State Variables in AssignUsersScreen

```typescript
// Tab Management
const [activeTab, setActiveTab] = useState<AssignTab>('LC_TO_SUPERVISOR');

// LC Selection (Participant Tab)
const [selectedLc, setSelectedLc] = useState<any>(null);

// Filter States
const [supervisorFilterValues, setSupervisorFilterValues] = useState<Record<string, any>>({});
const [lcFilterValues, setLcFilterValues] = useState<Record<string, any>>({});
const [participantFilterValues, setParticipantFilterValues] = useState<Record<string, any>>({});

// Assigned Items Tracking
const [assignedLCs, setAssignedLCs] = useState<any[]>([]);
const [assignedParticipants, setAssignedParticipants] = useState<any[]>([]);
```

### State Reset Logic

1. **Supervisor Change**: Resets assigned LCs/participants and selected LC
2. **LC Change**: Resets assigned participants
3. **Tab Switch**: State persists (no reset on tab switch)

### State Flow Diagram

```
User Selects Supervisor
  ↓
handleSupervisorFilterChange()
  ↓
Check if supervisor changed
  ↓
Reset assigned items
  ↓
Update supervisorFilterValues
  ↓
Re-render with new supervisor
```

---

## Data Flow

### Filter Data Flow

```
USER_MANAGEMENT_FILTERS.ts (Configuration)
  ↓
AssignUsersScreen (Filter Options Array)
  ↓
SelectionCard (filterOptions prop)
  ↓
FilterButton (data prop)
  ↓
Select/Input Components
  ↓
User Selection
  ↓
onChange Callback
  ↓
AssignUsersScreen State Update
```

### Assignment Data Flow

```
User Selects Items (Checkboxes)
  ↓
SelectionCard Local State (selectedLCs Set)
  ↓
User Clicks Assign Button
  ↓
onAssign Callback
  ↓
handleAssignLCs/handleAssignParticipants
  ↓
Generate Additional Data (email, ID, etc.)
  ↓
Update assignedLCs/assignedParticipants State
  ↓
getAvailableLCs/getAvailableParticipants Filter
  ↓
Update SelectionCard lcList Prop
  ↓
Remove Assigned Items from List
  ↓
Display in Data Table
```

### Data Generation Logic

#### For LCs:
- **Email**: Generated from name (e.g., "Busisiwe Ngcobo" → "busisiwe.ngcobo@gbl.co.za")
- **LC ID**: Incremental (LC-003, LC-004, etc.)
- **Site**: Determined from location (eThekwini → Site B, Johannesburg → Site A)

#### For Participants:
- **Email**: Generated from name (e.g., "Thandeka Zungu" → "thandeka.zungu@example.com")
- **Participant ID**: Incremental (PAR-001, PAR-002, etc.)
- **Bio & Productivity**: Extracted from location string ("Bio • Productivity")

---

## File Structure

```
src/
├── screens/
│   └── AssignUsers/
│       ├── index.tsx          # Main screen component
│       └── Styles.ts          # Component-specific styles
│
├── components/
│   ├── SelectionCard/
│   │   ├── index.tsx          # Reusable step card component
│   │   └── Styles.ts          # SelectionCard styles
│   │
│   └── Filter/
│       ├── index.tsx          # Generic filter component
│       └── Styles.ts          # Filter styles
│
├── constants/
│   └── USER_MANAGEMENT_FILTERS.ts  # Filter configurations & mock data
│
└── locales/
    └── en.json                # Translation strings
```

### Key Files

1. **`src/screens/AssignUsers/index.tsx`** (601 lines)
   - Main screen component
   - State management
   - Handler functions
   - Data table rendering

2. **`src/components/SelectionCard/index.tsx`** (258 lines)
   - Reusable step card
   - Checkbox list rendering
   - Filter integration
   - Assignment button

3. **`src/components/Filter/index.tsx`** (189 lines)
   - Generic filter component
   - Search and select support
   - Translation integration

4. **`src/constants/USER_MANAGEMENT_FILTERS.ts`** (212 lines)
   - Filter configurations
   - Mock data (LCs, Participants)
   - Type definitions

---

## Key Features

### 1. **Multi-Step Wizard Interface**

Each tab follows a step-by-step process:
- **LC to Supervisor**: 2 steps
- **Participant to LC**: 3 steps

Steps are conditionally rendered based on previous selections.

### 2. **Dynamic Filtering**

- **Province-based filtering**: Filter supervisors by province
- **Site filtering**: Filter LCs by site location
- **Bio filtering**: Filter participants by bio category
- **Productivity filtering**: Filter participants by productivity level
- **Search**: Text search across all lists

### 3. **Real-Time List Updates**

- When items are assigned, they are immediately removed from the unassigned list
- Uses `getAvailableLCs()` and `getAvailableParticipants()` functions
- Maintains data consistency across the UI

### 4. **Data Tables**

Two hardcoded tables display assigned relationships:
- **LCs Mapped to Supervisor**: Shows Linkage Champions assigned to selected supervisor
- **Participants Mapped to LC**: Shows Participants assigned to selected LC

Tables include:
- Hardcoded sample row
- Dynamically added rows from assignments
- Proper formatting with avatars, IDs, and metadata

### 5. **Translation Support**

All text is internationalized using translation keys:
- Filter labels
- Step titles and descriptions
- Button text
- Table headers
- Status labels

### 6. **Placeholder Support**

- Select filters can have placeholders (e.g., "Choose Supervisor")
- Prevents auto-selection when placeholder is set
- Only "all" options auto-select by default

### 7. **State Persistence**

- Filter selections persist when switching tabs
- Assigned items persist across tab switches
- State resets only when supervisor/LC changes

---

## API Integration Points

### Current Implementation
All data is **hardcoded** and marked with TODO comments for API integration.

### Future API Integration

#### 1. **Supervisor Data**
```typescript
// TODO: Replace supervisorFilterOptions with API call
// Endpoint: GET /api/supervisors?province={province}
// Response: { supervisors: [{ id, name, province, ... }] }
```

#### 2. **LC Data**
```typescript
// TODO: Replace selectedLCList with API call
// Endpoint: GET /api/linkage-champions?site={site}&status=unassigned
// Response: { lcs: [{ id, name, location, site, status, ... }] }
```

#### 3. **Participant Data**
```typescript
// TODO: Replace participantList with API call
// Endpoint: GET /api/participants?bio={bio}&productivity={productivity}&status=unassigned
// Response: { participants: [{ id, name, bio, productivity, status, ... }] }
```

#### 4. **Assignment Operations**

**Assign LCs to Supervisor:**
```typescript
// TODO: Implement API call
// Endpoint: POST /api/assignments/lc-to-supervisor
// Body: { supervisorId, lcIds: [lcId1, lcId2, ...] }
// Response: { success: boolean, assigned: [...] }
```

**Assign Participants to LC:**
```typescript
// TODO: Implement API call
// Endpoint: POST /api/assignments/participant-to-lc
// Body: { lcId, participantIds: [participantId1, participantId2, ...] }
// Response: { success: boolean, assigned: [...] }
```

#### 5. **Assigned Items Tables**

**LCs Mapped to Supervisor:**
```typescript
// TODO: Replace hardcoded table with API call
// Endpoint: GET /api/supervisors/{supervisorId}/assigned-lcs
// Response: { lcs: [{ id, name, email, location, site, ... }] }
```

**Participants Mapped to LC:**
```typescript
// TODO: Replace hardcoded table with API call
// Endpoint: GET /api/linkage-champions/{lcId}/assigned-participants
// Response: { participants: [{ id, name, email, bio, productivity, ... }] }
```

### Integration Strategy

1. **Replace Mock Data**: Update filter options and lists to use API responses
2. **Add Loading States**: Show loading indicators during API calls
3. **Error Handling**: Display error messages for failed API calls
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **Pagination**: Add pagination for large lists
6. **Real-time Updates**: Consider WebSocket for real-time assignment updates

---

## Component Interactions

### SelectionCard → FilterButton

```
SelectionCard
  ↓ (passes filterOptions)
FilterButton
  ↓ (renders filters)
Select/Input Components
  ↓ (user interaction)
FilterButton State Update
  ↓ (calls onFilterChange)
SelectionCard handleFilterChange
  ↓ (calls onChange prop)
AssignUsersScreen State Update
```

### SelectionCard → AssignUsersScreen

```
User Selects Items (Checkboxes)
  ↓
SelectionCard Local State
  ↓
User Clicks Assign Button
  ↓
SelectionCard onAssign Callback
  ↓
AssignUsersScreen Handler
  ↓
Generate Data & Update State
  ↓
Pass Filtered List Back to SelectionCard
  ↓
SelectionCard Re-renders with Updated List
```

---

## Data Structures

### Filter Configuration

```typescript
type FilterConfig = {
  nameKey?: string;        // Translation key for filter name
  attr: string;            // Filter attribute (e.g., 'province', 'site')
  type: 'search' | 'select';
  data: Array<
    string | 
    { 
      label?: string; 
      labelKey?: string; 
      value: string | null 
    }
  >;
  placeholderKey?: string;  // Translation key for placeholder
};
```

### LC Data Structure

```typescript
{
  labelKey: string;        // Display name (translation key or direct)
  value: string;           // Unique identifier
  location: string;        // Location string (e.g., "eThekwini, KwaZulu-Natal")
  status: 'assigned' | 'unassigned';
  // Generated on assignment:
  email?: string;          // Generated email
  lcId?: string;          // Generated LC ID (LC-003, etc.)
  site?: string;          // Determined site
}
```

### Participant Data Structure

```typescript
{
  labelKey: string;        // Display name
  value: string;           // Unique identifier
  bio: string;            // Bio category (Youth Development, etc.)
  productivity: 'High' | 'Medium' | 'Low';
  status: 'assigned' | 'unassigned';
  // Generated on assignment:
  email?: string;          // Generated email
  participantId?: string; // Generated ID (PAR-001, etc.)
}
```

---

## Styling Approach

### Gluestack UI Priority

Following project rules, all styling uses **Gluestack UI** components and props:
- No StyleSheet.create() unless explicitly needed
- Uses Gluestack's spacing tokens (`$3`, `$md`, etc.)
- Uses Gluestack's color tokens (`$textLight900`, `$error500`, etc.)
- Responsive props (`$md-width`, etc.)

### Custom Styles

Minimal custom styles in:
- `src/screens/AssignUsers/Styles.ts`
- `src/components/SelectionCard/Styles.ts`

Used only for component-specific styling not available in Gluestack UI.

---

## Translation Keys

### Filter Translations
- `admin.filters.filterByProvince`: "Filter by Province"
- `admin.filters.allProvinces`: "All Provinces"
- `admin.filters.selectSupervisor`: "Select Supervisor"
- `admin.filters.chooseSupervisor`: "Choose Supervisor"
- `admin.filters.site`: "Site"
- `admin.filters.allSites`: "All Sites"
- `admin.filters.bio`: "Bio"
- `admin.filters.productivity`: "Productivity"
- `admin.filters.high/medium/low`: Productivity levels

### Step Translations
- `admin.assignUsers.step1SelectSupervisor`: "Step 1: Select Supervisor"
- `admin.assignUsers.step2SelectLC`: "Step 2: Select Linkage Champion"
- `admin.assignUsers.step2AssignLinkageChampions`: "Step 2: Assign Linkage Champions"
- `admin.assignUsers.step3AssignParticipants`: "Step 3: Assign Participants"

### Action Translations
- `admin.actions.assignLCsToSupervisor`: "Assign LCs to Supervisor"
- `admin.assignUsers.assignParticipantsToLc`: "Assign {{count}} Participants to LC"

---

## Error Handling & Edge Cases

### Current Implementation
- Basic console logging for debugging
- No error boundaries (to be added)
- No loading states (to be added for API integration)

### Edge Cases Handled
1. **Empty Selections**: Assign button is disabled when no items selected
2. **State Reset**: Properly resets when supervisor/LC changes
3. **List Filtering**: Handles missing assigned items gracefully
4. **Initialization**: Defaults to empty state

---

## Testing Considerations

### Manual Testing Scenarios

1. **Tab Switching**
   - Verify state persists across tabs
   - Verify filters maintain selections

2. **Assignment Flow**
   - Select items and assign
   - Verify removal from unassigned list
   - Verify addition to table
   - Verify state updates correctly

3. **Filter Functionality**
   - Test all filter dropdowns
   - Verify placeholder behavior
   - Verify "all" option auto-selection

4. **State Reset**
   - Change supervisor → verify LC/participant reset
   - Change LC → verify participant reset

### Future Test Cases
- Unit tests for handler functions
- Integration tests for assignment flow
- E2E tests for complete workflows

---

## Performance Considerations

### Current Optimizations
- Conditional rendering (steps only show when needed)
- Efficient state updates (only update changed items)
- Memoized filter lists (computed once per render)

### Future Optimizations
- Memoize expensive computations (getAvailableLCs, etc.)
- Virtualize long lists
- Debounce search inputs
- Lazy load data tables

---

## Future Enhancements

### Planned Features
1. **API Integration**: Replace all hardcoded data with API calls
2. **Bulk Operations**: Select all, deselect all functionality
3. **Search Enhancement**: Real-time search with debouncing
4. **Pagination**: For large lists of LCs/participants
5. **Confirmation Dialogs**: Before assignment operations
6. **Success Notifications**: Toast messages on successful assignment
7. **Undo Functionality**: Ability to unassign items
8. **Export Functionality**: Export assignment reports
9. **Filter Persistence**: Save filter preferences
10. **Advanced Filters**: Date ranges, multiple selections, etc.

### Technical Debt
- Remove hardcoded data
- Add proper TypeScript types (replace `any`)
- Add error boundaries
- Add loading states
- Add unit tests
- Optimize re-renders

---

## Conclusion

The Assign Users feature provides a comprehensive, user-friendly interface for managing assignments between Supervisors, Linkage Champions, and Participants. The implementation follows React best practices, uses a component-based architecture, and is designed for easy API integration.

The feature is currently functional with hardcoded data and ready for API integration when backend endpoints are available.

---

## Appendix

### Key Functions Reference

#### `handleAssignLCs(selectedLCs: any[])`
- Generates email, LC ID, and site for selected LCs
- Adds to assignedLCs state
- Triggers re-render with updated lists

#### `handleAssignParticipants(selectedParticipants: any[])`
- Generates email, participant ID, bio, and productivity
- Adds to assignedParticipants state
- Triggers re-render with updated lists

#### `getAvailableLCs()`
- Filters out assigned LCs from selectedLCList
- Returns unassigned LCs for display

#### `getAvailableParticipants()`
- Filters out assigned participants from participantList
- Returns unassigned participants for display

### Constants Reference

- `supervisorFilterOptions`: Province and Supervisor filters
- `lcFilterOptions`: Site filter for LC assignment
- `participantFilterOptions`: Bio and Productivity filters
- `selectedLCList`: Mock LC data
- `participantList`: Mock participant data

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Author**: Development Team
