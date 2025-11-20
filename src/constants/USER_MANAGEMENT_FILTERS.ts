/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

// Type definition for filter configuration
type FilterConfig = {
  name: string;
  attr: string;
  type: 'search' | 'select';
  data: Array<string | { label: string; value: string | null }>;
  placeholder?: string;
};

// Search filter configuration
export const SearchFilter: FilterConfig = {
  name: 'Search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholder: 'Search by name or email...',
};

// Select filters (Role, Status, etc.)
export const FilterOptions: ReadonlyArray<FilterConfig> = [
  {
    name: 'Role',
    attr: 'role',
    type: 'select',
    data: ['Admin', 'Supervisor', 
    'Linkage Champion', 'Participant',],
  },
  {
    name: 'Status',
    attr: 'status',
    type: 'select',
    data: ['All Status', 'Active', 'Deactivated'],
  },
];

