/**
 * User Management Filter Configurations
 * Data-driven filter definitions for the User Management screen
 * All filter logic integrated with API
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getRolesList,
  Role,
  getEntityTypesList,
  getEntityTypesFromStorage,
  getProvincesByEntityType,
  ProvinceEntity,
  getDistrictsByProvinceEntity,
  DistrictEntity,
} from '../services/participantService';

// Type definition for filter configuration
export type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<string | { label?: string; labelKey?: string; value: string | null }>;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
  disabled?: boolean; // Disable the filter (e.g., district when no province selected)
};

// Search filter configuration - Static filter
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Status filter configuration - Static filter
export const StatusFilter: FilterConfig = {
  nameKey: 'admin.filters.status',
  attr: 'status',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allStatus', value: 'all-status' },
    { labelKey: 'admin.filters.active', value: 'Active' },
    { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
  ],
};

/**
 * Map filter status labels to API status format
 * Maps display labels to API format (e.g., "Active" → "ACTIVE")
 */
export const mapStatusLabelToAPI = (statusLabel: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'ACTIVE',
    'Deactivated': 'DEACTIVATED',
  };
  return statusMap[statusLabel] || statusLabel;
};

/**
 * Custom hook to manage user management filters with API integration
 * Fetches roles, provinces, and districts from API and builds filter options dynamically
 */
export const useUserManagementFilters = (filters: Record<string, any>) => {
  // State for API data
  const [roles, setRoles] = useState<Role[]>([]);
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [districts, setDistricts] = useState<DistrictEntity[]>([]);

  // Fetch roles and provinces from API on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch roles
      try {
        const rolesResponse = await getRolesList({ page: 1, limit: 100 });
        const allRoles = rolesResponse.result?.data || [];
        // Filter only ACTIVE roles for the dropdown
        const activeRoles = allRoles.filter((role: Role) => role.status === 'ACTIVE');
        setRoles(activeRoles);
      } catch (error) {
        setRoles([]);
      }

      // Fetch provinces
      try {
        // First, check if entity types are in storage
        let entityTypes = await getEntityTypesFromStorage();
        
        // If not in storage, fetch entity types from API
        if (!entityTypes || !entityTypes['province']) {
          await getEntityTypesList();
          entityTypes = await getEntityTypesFromStorage();
        }

        // Get province entity type ID
        const provinceEntityTypeId = entityTypes?.['province'];
        
        if (!provinceEntityTypeId) {
          setProvinces([]);
          return;
        }

        // Fetch provinces using the entity type ID
        const provincesResponse = await getProvincesByEntityType(provinceEntityTypeId);
        const provincesData = provincesResponse.result || [];
        setProvinces(provincesData);
      } catch (error) {
        setProvinces([]);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch districts when province filter changes
  useEffect(() => {
    const fetchDistricts = async () => {
      // If no province selected or "All Provinces" is selected, clear districts
      if (!filters.province || filters.province === 'all-provinces') {
        setDistricts([]);
        return;
      }

      // Only fetch if provinces are loaded
      if (provinces.length === 0) {
        return;
      }

      try {
        // Find the selected province from provinces array to get its _id
        const selectedProvince = provinces.find(
          (province: ProvinceEntity) => province.name === filters.province
        );

        if (!selectedProvince || !selectedProvince._id) {
          setDistricts([]);
          return;
        }

        // Fetch districts using the province's entity ID (_id)
        const response = await getDistrictsByProvinceEntity(selectedProvince._id, {
          page: 1,
          limit: 100,
        });
        
        // Access districts from response.result.data
        const districtsData = Array.isArray(response.result?.data) ? response.result.data : [];
        setDistricts(districtsData);
      } catch (error) {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [filters.province, provinces]);

  // Build dynamic filter options with API data
  const filterOptions = useMemo(() => {
    // Build role filter from API roles
    const roleFilterOptions = [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      ...roles.map((role: Role) => ({
        label: role.label, // Display label in dropdown
        value: role.title, // Use title as value for filtering (unique identifier)
      })),
    ];

    // Build province filter from API provinces
    const provinceFilterOptions = [
      { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
      ...provinces.map((province: ProvinceEntity) => ({
        label: province.name,
        value: province.name, // Use name as value (e.g., "Eastern Cape")
      })),
    ];

    // Build district filter from API districts
    // District filter is disabled if no province is selected or "All Provinces" is selected
    const isProvinceSelected = filters.province && filters.province !== 'all-provinces' && filters.province !== '';
    const districtFilterOptions = [
      { labelKey: 'admin.filters.allDistricts', value: 'all-districts' },
      ...districts.map((district: DistrictEntity) => ({
        label: district.name,
        value: district.name, // Use name as value
      })),
    ];

    return [
      {
        nameKey: 'common.search',
        attr: 'search',
        type: 'search' as const,
        data: [],
        placeholderKey: 'admin.filters.searchPlaceholder',
      },
      {
        nameKey: 'admin.filters.role',
        attr: 'role',
        type: 'select' as const,
        data: roleFilterOptions,
      },
      {
        nameKey: 'admin.filters.status',
        attr: 'status',
        type: 'select' as const,
        data: [
          { labelKey: 'admin.filters.allStatus', value: 'all-status' },
          { labelKey: 'admin.filters.active', value: 'Active' },
          { labelKey: 'admin.filters.deactivated', value: 'Deactivated' },
        ],
      },
      {
        nameKey: 'admin.filters.province',
        attr: 'province',
        type: 'select' as const,
        data: provinceFilterOptions,
      },
      {
        nameKey: 'admin.filters.district',
        attr: 'district',
        type: 'select' as const,
        data: districtFilterOptions,
        disabled: !isProvinceSelected, // Disable when no province is selected
      },
    ];
  }, [roles, provinces, districts, filters.province]);

  return {
    filters: filterOptions,
    roles,
    provinces,
    districts,
  };
};

