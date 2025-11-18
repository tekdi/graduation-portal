/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

export interface FilterConfig {
  name: string; // Display label
  attr: string; // Attribute key for filtering
  data: string[]; // Options/values for the filter
  type?: 'select' | 'search'; // Filter type (default: 'select')
  placeholder?: string; // Placeholder text for search inputs
}

export const USER_MANAGEMENT_FILTERS: FilterConfig[] = [
  {
    name: 'Search',
    attr: 'search',
    type: 'search',
    data: [],
    placeholder: 'Search by name or email...',
  },
  {
    name: 'Role',
    attr: 'role',
    type: 'select',
    data: ['All Roles', 'Admin', 'Supervisor', 'Linkage-Champion', 'Participant'],
  },
  {
    name: 'Status',
    attr: 'status',
    type: 'select',
    data: ['All Status', 'Active', 'Deactivated'],
  },
] as const;

