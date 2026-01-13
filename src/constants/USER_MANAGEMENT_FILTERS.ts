/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

// Type definition for filter configuration
type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<string | { label?: string; labelKey?: string; value: string | null }>;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
};

// Search filter configuration
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Select filters (Role, Status, etc.)
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
];

export const supervisorFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.filterByProvince',
    attr: 'filterByProvince',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },
      { labelKey: 'Gauteng', value: 'Gauteng' },
      { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },
      { labelKey: 'Western Cape', value: 'Western Cape' },
    ],
  },
  {
    nameKey: 'admin.filters.selectSupervisor',
    attr: 'selectSupervisor',
    type: 'select',
    placeholderKey: 'admin.filters.chooseSupervisor',
    data: [
      {
        labelKey: 'Dr. Lerato Mokoena',
        value: 'Dr. Lerato Mokoena',
      },
      {
        labelKey: 'Zanele Ndabae',
        value: 'Zanele Ndabae',
      },
      {
        labelKey: 'Mpho Sithole',
        value: 'Mpho Sithole',
      }
    ],
  },
 ];
 
 
 export const lcFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.filterByProvince',
    attr: 'filterByProvince',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },
      { labelKey: 'Gauteng', value: 'Gauteng' },
      { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },
    ],
  },
  {
    nameKey: 'admin.filters.allDistrict',
    attr: 'allDistrict',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allDistrict', value: 'all-District' },
      {
        labelKey: 'Jonnesburg',
        value: 'Jonnesburg',
      },
      {
        labelKey: 'Tshwane',
        value: 'Tshwane',
      },
      {
        labelKey: 'Cape town',
        value: 'Cape town',
      },
    ],
  },
 ];
 
 
 export const selectedLCList = [
  {
    labelKey: 'Busisiwe Ngcobo',
    value: 'Busisiwe-Ngcobo',
    location: 'eThekwini, KwaZulu-Natal',
    status: 'unassigned',
  },
  {
    labelKey: 'Andile Mkhize',
    value: 'Andile-Mkhize',
    location: 'Johannesburg, Gauteng',
    status: 'unassigned',
  },
 ];
 
 
 export const participantLCFilterOptions = [
  {
    nameKey: 'admin.filters.selectSupervisor',
    attr: 'selectSupervisor',
    type: 'select',
    placeholderKey: 'admin.filters.chooseSupervisor',
    data: [
      {
        labelKey: 'Dr. Lerato Mokoena Johannesburg',
        value: 'Dr. Lerato Mokoena Johannesburg ',
      },
      {
        labelKey: 'Zanele Ndabae Thekwini',
        value: 'Zanele Ndabae Thekwini',
      },
    ],
  },
 ];
 
