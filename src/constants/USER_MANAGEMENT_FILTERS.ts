/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 */

// Search filter configuration
export const SearchFilter = {
  name: 'Search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholder: 'Search by name or email...',
};

// Select filters (Role, Status, etc.)
export const FilterOptions = [
  {
    name: 'Role',
    attr: 'role',
    type: 'select',
    data: [{label:"All role", value:"All"}, 'Admin', 'Supervisor', 
    'Linkage-Champion', 'Participant',
    {label:"String Null", value:""},{label:"Null", value:null}],
  },
  {
    name: 'Status',
    attr: 'status',
    type: 'select',
    data: ['All Status', 'Active', 'Deactivated'],
  },
];

