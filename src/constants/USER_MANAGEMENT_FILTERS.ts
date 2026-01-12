/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

import { PROVINCES } from './PARTICIPANTS_LIST';

// Type definition for filter configuration
type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<string | { label?: string; labelKey?: string; value: string | null }>;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
  disabled?: boolean; // Disable the filter (e.g., district when no province selected)
};

/**
 * South African Districts
 * Mock data for district selection dropdown
 * TODO: Replace with API call in future (may depend on selected province)
 */
const DISTRICTS = [
  { label: 'Alfred Nzo', value: 'alfred-nzo' },
  { label: 'Amathole', value: 'amathole' },
  { label: 'Chris Hani', value: 'chris-hani' },
  { label: 'Joe Gqabi', value: 'joe-gqabi' },
  { label: 'OR Tambo', value: 'or-tambo' },
  { label: 'Sarah Baartman', value: 'sarah-baartman' },
  { label: 'Buffalo City', value: 'buffalo-city' },
  { label: 'Nelson Mandela Bay', value: 'nelson-mandela-bay' },
];

// Search filter configuration
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Select filters (Role, Status, Province, District, etc.)
// Note: Role, Province, and District filters are now dynamically populated from API in UserManagement screen
export const FilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.role',
    attr: 'role',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      { labelKey: 'admin.filters.admin', value: 'Admin' },
      { labelKey: 'admin.filters.supervisor', value: 'Supervisor' },
      { labelKey: 'admin.filters.linkageChampion', value: 'Linkage Champion' },
      { labelKey: 'admin.filters.participant', value: 'Participant' },
    ],
  },
  {
    nameKey: 'admin.filters.status',
    attr: 'status',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allStatus', value: 'all-status' },
      { labelKey: 'admin.filters.active', value: 'Active' },
      { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
    ],
  },
  {
    nameKey: 'admin.filters.province',
    attr: 'province',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
      ...PROVINCES.map(province => ({
        label: province.label,
        value: province.value,
      })),
    ],
  },
  {
    nameKey: 'admin.filters.district',
    attr: 'district',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allDistricts', value: 'all-districts' },
      ...DISTRICTS.map(district => ({
        label: district.label,
        value: district.value,
      })),
    ],
  },
];

