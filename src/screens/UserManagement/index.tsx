import React, { useState, useMemo, useCallback } from 'react';
import { VStack, HStack, Button, Text, Image, Box } from '@ui';
import { View } from 'react-native';
import { LucideIcon } from '@ui/index';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import { SearchFilter, FilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import DataTable from '@components/DataTable';
import { getUsersColumns } from './UsersTableConfig';
import { USER_MANAGEMENT_MOCK_DATA, User } from '@constants/USER_MANAGEMENT_MOCK_DATA';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { applyFilters } from '@utils/helper';
import { usePlatform } from '@utils/platform';
import { styles } from './Styles';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const data = [SearchFilter, ...FilterOptions];
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  const columns = useMemo(() => getUsersColumns(), []);

  // Filter users using applyFilters helper
  const filteredData = useMemo(() => {
    let result = [...USER_MANAGEMENT_MOCK_DATA];

    // Handle search filter separately (needs OR logic across name and email)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Build filters object for applyFilters
    const filtersForHelper: Record<string, any> = {};
    
    if (filters.role && filters.role !== 'all-roles') {
      filtersForHelper.role = filters.role;
    }
    if (filters.status && filters.status !== 'all-status') {
      filtersForHelper.status = filters.status;
    }
    if (filters.province && filters.province !== 'all-provinces') {
      const provinceFilter = FilterOptions.find((f) => f.attr === 'province');
      const option = provinceFilter?.data.find((opt: any) => 
        typeof opt === 'string' ? opt === filters.province : opt.value === filters.province
      );
      const provinceLabel = typeof option === 'object' && option?.label ? option.label : option;
      if (provinceLabel) filtersForHelper.province = provinceLabel;
    }
    if (filters.district && filters.district !== 'all-districts') {
      const districtFilter = FilterOptions.find((f) => f.attr === 'district');
      const option = districtFilter?.data.find((opt: any) => 
        typeof opt === 'string' ? opt === filters.district : opt.value === filters.district
      );
      const districtLabel = typeof option === 'object' && option?.label ? option.label : option;
      if (districtLabel) filtersForHelper.district = districtLabel;
    }
    
    return applyFilters(result, filtersForHelper);
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  const handleRowClick = useCallback((user: User) => {
    // Handle row click - navigate to user details
    console.log('User clicked:', user);
  }, []);

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title="admin.menu.userManagement"
        description="admin.userManagementDescription"
        right={
          isMobile ? (
            <VStack space="sm" width="$full">
              <Button
                {...titleHeaderStyles.outlineButton}
                onPress={() => {
                  // Handle bulk upload
                }}
                width="$full"
              >
                <HStack space="sm" alignItems="center">
                  <Image 
                    source={UploadIcon}
                    style={{ width: 16, height: 16 }}
                    alt="Upload icon"
                  />
                  <Text {...titleHeaderStyles.outlineButtonText}>
                    {t('admin.actions.bulkUploadCSV')}
                  </Text>
                </HStack>
              </Button>
              
              <Button
                {...titleHeaderStyles.solidButton}
                onPress={() => {
                  // Handle create user
                }}
                width="$full"
              >
                <HStack space="sm" alignItems="center">
                  <Image 
                    source={ExportIcon}
                    style={{ width: 16, height: 16 }}
                    alt="Export icon"
                  />
                  <Text {...titleHeaderStyles.solidButtonText}>
                    {t('admin.actions.createUser')}
                  </Text>
                </HStack>
              </Button>
            </VStack>
          ) : (
            <HStack space="md" alignItems="center">
              <Button
                {...titleHeaderStyles.outlineButton}
                onPress={() => {
                  // Handle bulk upload
                }}
              >
                <HStack space="sm" alignItems="center">
                  <Image 
                    source={UploadIcon}
                    style={{ width: 16, height: 16 }}
                    alt="Upload icon"
                  />
                  <Text {...titleHeaderStyles.outlineButtonText}>
                    {t('admin.actions.bulkUploadCSV')}
                  </Text>
                </HStack>
              </Button>
              
              <Button
                {...titleHeaderStyles.solidButton}
                onPress={() => {
                  // Handle create user
                }}
              >
                <HStack space="sm" alignItems="center">
                  <Image 
                    source={ExportIcon}
                    style={{ width: 16, height: 16 }}
                    alt="Export icon"
                  />
                  <Text {...titleHeaderStyles.solidButtonText}>
                    {t('admin.actions.createUser')}
                  </Text>
                </HStack>
              </Button>
            </HStack>
          )
        }
      />
      
      <FilterButton 
        data={data} 
        filteredCount={filteredData.length}
        totalCount={USER_MANAGEMENT_MOCK_DATA.length}
        userLabel="users"
        onFilterChange={handleFilterChange}
      />
      
      {/* Table Header with Title, Count, and Export Button */}
      <Box {...styles.tableContainer}>
        <HStack {...styles.tableHeader}>
          <Text {...TYPOGRAPHY.h4} color="$textForeground" fontWeight="$normal">
            {t('admin.users.allUsers')}
          </Text>
          <HStack {...styles.tableHeaderActions}>
            {!isMobile && (
              <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
                {t('admin.users.showing', {
                  count: filteredData.length,
                  total: USER_MANAGEMENT_MOCK_DATA.length,
                })}
              </Text>
            )}
            <Button
                {...titleHeaderStyles.outlineButton}
                onPress={() => {
                  // Handle Export CSV
                }}
              >
              <HStack space="xs" alignItems="center">
                <LucideIcon
                  name="Download"
                  size={16}
                />
                <Text {...TYPOGRAPHY.bodySmall} fontWeight="$medium">
                  {t('admin.actions.exportCSV')}
                </Text>
              </HStack>
            </Button>
          </HStack>
        </HStack>

        {/* DataTable */}
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          getRowKey={(user) => user.id}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],
            maxPageNumbers: 5,
          }}
          emptyMessage="admin.users.noUsersFound"
          loadingMessage="admin.users.loadingUsers"
        />
      </Box>
    </VStack>
  );
};

export default UserManagementScreen;
