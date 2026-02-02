/**
 * Assign Users Filter Configurations
 * Filter definitions for the Assign Users screen
 * All filter logic will be integrated with API
 */

import { useState, useEffect, useMemo } from 'react';
import {
  getEntityTypesList,
  getEntityTypesFromStorage,
  getProvincesByEntityType,
  getUsersList,
} from '../services/usersService';
import type { ProvinceEntity, AdminUserManagementData } from '@app-types/Users';
import type { FilterConfig } from '@app-types/filters';


// Search filter for LC assignment
export const SearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

// Search filter for participant assignment
export const ParticipantSearchFilter: FilterConfig = {
  nameKey: 'common.search',
  attr: 'search',
  type: 'search',
  data: [],
  placeholderKey: 'admin.filters.searchPlaceholder',
};

/**
 * Custom hook to manage assign users filters with API integration
 * Fetches provinces from API and builds filter options dynamically
 * Filters supervisors based on selected province
 */
export const useAssignUsersFilters = (filters: Record<string, any> = {}) => {
  // State for API data
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [allSupervisors, setAllSupervisors] = useState<AdminUserManagementData[]>([]);
  
  console.log('useAssignUsersFilters hook called with filters:', filters);

  // Fetch provinces from API on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
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

    fetchProvinces();
  }, []);

  // Fetch supervisors from API when province filter changes (server-side filtering)
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        // Build API params similar to UserManagement screen
        const apiParams: any = {
          tenant_code: 'brac',
          type: 'tenant_admin',
          page: 1,
          limit: 100, // Fetch all supervisors
        };

        // Add province filter if a specific province is selected
        const selectedProvince = filters.filterByProvince;
        if (selectedProvince && selectedProvince !== 'all-Provinces' && selectedProvince !== 'all-provinces') {
          apiParams.province = selectedProvince;
        }

        console.log('Fetching supervisors with params:', apiParams);
        const supervisorsResponse = await getUsersList(apiParams);
        console.log('Supervisors API Response:', supervisorsResponse);
        console.log('Supervisors Response Result:', supervisorsResponse.result);
        const supervisorsData = supervisorsResponse.result?.data || [];
        console.log('All Supervisors Data:', supervisorsData);
        console.log('All Supervisors Data Length:', supervisorsData.length);
        
        // Print each supervisor with their province name
        console.log('=== Supervisors and their Provinces ===');
        supervisorsData.forEach((supervisor: any) => {
          const supervisorName = supervisor.name || supervisor.full_name || supervisor.email || 'Unknown';
          const supervisorProvince = supervisor.province || 
                                      supervisor.province_name || 
                                      supervisor.location?.province ||
                                      supervisor.meta?.province ||
                                      'No Province';
          console.log(`Supervisor: ${supervisorName} | Province: ${supervisorProvince}`);
        });
        console.log('=======================================');
        
        setAllSupervisors(supervisorsData);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        setAllSupervisors([]);
      }
    };

    fetchSupervisors();
  }, [filters.filterByProvince]);

  // No need for client-side filtering - API handles province filtering
  // Use allSupervisors directly as they're already filtered by the API
  const filteredSupervisors = allSupervisors;

  // Build dynamic filter options with API data
  const supervisorFilterOptions = useMemo(() => {
    // Build province filter from API provinces
    const provinceFilterOptions = [
      { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },
      ...provinces.map((province: ProvinceEntity) => ({
        label: province.name,
        value: province.name, // Use name as value (e.g., "Eastern Cape")
      })),
    ];

    // Build supervisor filter from filtered supervisors
    const supervisorFilterOptionsData = filteredSupervisors.map((supervisor: any) => {
      // Handle different possible data structures from API
      const name = supervisor.name || supervisor.full_name || supervisor.email || 'Unknown';
      const value = supervisor.id || supervisor._id || supervisor.email || name;
      return {
        label: name,
        value: value,
      };
    });
    
    // Determine if supervisor filter should be disabled
    // Disable when a specific province is selected but no supervisors are available for that province
    const selectedProvince = filters.filterByProvince;
    const isProvinceSelected = selectedProvince && 
                                selectedProvince !== 'all-Provinces' && 
                                selectedProvince !== 'all-provinces';
    const shouldDisableSupervisorFilter = isProvinceSelected && filteredSupervisors.length === 0;
    
    console.log('Selected Province:', filters.filterByProvince);
    console.log('Filtered Supervisors count:', filteredSupervisors.length);
    console.log('Supervisor Filter Options Data:', supervisorFilterOptionsData);
    console.log('Should disable supervisor filter:', shouldDisableSupervisorFilter);

    return [
      {
        nameKey: 'admin.filters.filterByProvince',
        attr: 'filterByProvince',
        type: 'select' as const,
        data: provinceFilterOptions,
      },
      {
        nameKey: 'admin.filters.selectSupervisor',
        attr: 'selectSupervisor',
        type: 'select' as const,
        placeholderKey: 'admin.filters.chooseSupervisor',
        data: supervisorFilterOptionsData,
        disabled: shouldDisableSupervisorFilter, // Disable when no supervisors available for selected province
      },
    ];
  }, [provinces, filteredSupervisors]);

  return {
    supervisorFilterOptions,
    provinces,
    supervisors: filteredSupervisors,
  };
};


export const lcFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.site',
    attr: 'site',
    type: 'select',
    data: [], // TODO: Populate from API
  },
];


export const selectedLCList: any[] = []; // TODO: Populate from API


export const participantLCFilterOptions = [
  {
    nameKey: 'admin.filters.selectSupervisor',
    attr: 'selectSupervisor',
    type: 'select',
    placeholderKey: 'admin.filters.chooseSupervisor',
    data: [], // TODO: Populate from API
  },
  {
    nameKey: 'admin.filters.selectLC',
    attr: 'selectLC',
    type: 'select',
    placeholderKey: 'admin.filters.chooseLC',
    data: [], // TODO: Populate dynamically based on selected supervisor from API
  },
];

// Participant filter options for Step 3
export const participantFilterOptions: ReadonlyArray<FilterConfig> = [
  {
    nameKey: 'admin.filters.bio',
    attr: 'bio',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allBio', value: 'all' },
      { labelKey: 'admin.filters.youthDevelopment', value: 'youth-development' },
      { labelKey: 'admin.filters.skillsTraining', value: 'skills-training' },
      { labelKey: 'admin.filters.entrepreneurship', value: 'entrepreneurship' },
    ],
  },
  {
    nameKey: 'admin.filters.productivity',
    attr: 'productivity',
    type: 'select',
    data: [
      { labelKey: 'admin.filters.allProductivity', value: 'all' },
      { labelKey: 'admin.filters.high', value: 'high' },
      { labelKey: 'admin.filters.medium', value: 'medium' },
      { labelKey: 'admin.filters.low', value: 'low' },
    ],
  },
];

// Participant list - TODO: Populate from API
export const participantList: any[] = [];
