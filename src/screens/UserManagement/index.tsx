import React, { useState, useEffect } from 'react';
import { VStack, Text, Spinner } from '@ui';
import { View } from 'react-native';

import { userManagementStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import Filters from '../../components/ui/Filter';
import BulkOperationsCard from '../../components/ui/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/ui/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import { FilterConfig } from '@constants/USER_MANAGEMENT_FILTERS';
import { 
  fetchFilterOptions, 
  mapRoleToDisplay, 
  mapStatusToDisplay
} from '@constants/FILTER_OPTIONS';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  
  // State for filter configurations (will be populated from API)
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  
  // Pre-filled filter values
  const preFilledFilters: Record<string, string> = {
    search: '',
    role: 'All Roles',
    status: 'All Status',
  };

  // Fetch filter options from API on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoadingFilters(true);
        const filterOptions = await fetchFilterOptions();
        
        // Map API values to display values
        const displayRoles = ['All Roles', ...filterOptions.roles.map(mapRoleToDisplay)];
        const displayStatuses = ['All Status', ...filterOptions.statuses.map(mapStatusToDisplay)];
        
        // Create filter configurations dynamically
        const configs: FilterConfig[] = [
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
            data: displayRoles, // Use API values mapped to display format
          },
          {
            name: 'Status',
            attr: 'status',
            type: 'select',
            data: displayStatuses, // Use API values mapped to display format
          },
        ];
        
        setFilterConfigs(configs);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        // Fallback to default filters if API fails
        setFilterConfigs([
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
            data: ['All Roles', 'Admin', 'Supervisor', 'Linkage Champion', 'Participant'],
          },
          {
            name: 'Status',
            attr: 'status',
            type: 'select',
            data: ['All Status', 'Active', 'Deactivated'],
          },
        ]);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (filters: Record<string, string>) => {
    // Filter values are received as JSON object
    // You can use these filters to filter your data, send to API, etc.
  };

  return (
    <VStack space="md" width="100%">
      <VStack {...userManagementStyles.mainVStack}>
        <Text {...userManagementStyles.titleText}>{t('admin.menu.userManagement')}</Text>
        <Text {...userManagementStyles.welcomeText}>
          {t('admin.userManagementDescription')}
        </Text>
      </VStack>
      
      {loadingFilters ? (
        <VStack alignItems="center" justifyContent="center" p="$4">
          <Spinner size="small" color="$primary500" />
          <Text mt="$2" fontSize="$sm" color="$textLight500">
            Loading filters...
          </Text>
        </VStack>
      ) : (
        <Filters 
          data={filterConfigs} // Use dynamically loaded filter configs
          initialValues={preFilledFilters} // Pre-fill filters with JSON values
          onFilterChange={handleFilterChange} // Receives all filters as JSON
        />
      )}
      
      <BulkOperationsCard/>
      {/* Stats and Bulk Operations - Display after table */}
      <View style={{ marginTop: 24, width: '100%' }}>
        <StatsRow>
          {USER_MANAGEMENT_STATS.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              count={stat.count}
              subLabel={stat.subLabel}
              color={stat.color}
            />
          ))}
        </StatsRow>
      </View>
      
      
    </VStack>
  );
};

export default UserManagementScreen;
