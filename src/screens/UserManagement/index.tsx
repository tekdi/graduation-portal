import React, { useState, useMemo } from 'react';
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

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const data = [SearchFilter, ...FilterOptions];
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredData, setFilteredData] = useState<User[]>(USER_MANAGEMENT_MOCK_DATA);
  
  const columns = useMemo(() => getUsersColumns(), []);

  // Filter users based on filter values
  useMemo(() => {
    let result = [...USER_MANAGEMENT_MOCK_DATA];

    // Search filter (name or email)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Role filter
    if (filters.role && filters.role !== 'all-roles') {
      result = result.filter((user) => user.role === filters.role);
    }

    // Status filter
    if (filters.status && filters.status !== 'all-status') {
      result = result.filter((user) => user.status === filters.status);
    }

    // Province filter - match by province name
    if (filters.province && filters.province !== 'all-provinces') {
      // Find the province label from the filter value
      const provinceFilter = FilterOptions.find((f) => f.attr === 'province');
      const selectedProvince = provinceFilter?.data.find(
        (opt: any) => {
          if (typeof opt === 'string') return opt === filters.province;
          return opt.value === filters.province;
        }
      );
      const provinceName = typeof selectedProvince === 'object' && selectedProvince !== null
        ? selectedProvince.label
        : selectedProvince;
      
      if (provinceName) {
        result = result.filter((user) => user.province === provinceName);
      }
    }

    // District filter - match by district name
    if (filters.district && filters.district !== 'all-districts') {
      // Find the district label from the filter value
      const districtFilter = FilterOptions.find((f) => f.attr === 'district');
      const selectedDistrict = districtFilter?.data.find(
        (opt: any) => {
          if (typeof opt === 'string') return opt === filters.district;
          return opt.value === filters.district;
        }
      );
      const districtName = typeof selectedDistrict === 'object' && selectedDistrict !== null
        ? selectedDistrict.label
        : selectedDistrict;
      
      if (districtName) {
        result = result.filter((user) => user.district === districtName);
      }
    }

    setFilteredData(result);
  }, [filters]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleRowClick = (user: User) => {
    // Handle row click - navigate to user details
    console.log('User clicked:', user);
  };

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title="admin.menu.userManagement"
        description="admin.userManagementDescription"
        right={
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
      <Box
        bg="$white"
        padding="$4"
        borderRadius="$lg"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <HStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <Text {...TYPOGRAPHY.h4} color="$textForeground" fontWeight="$semibold">
            All Users
          </Text>
          <HStack space="md" alignItems="center">
            <Text {...TYPOGRAPHY.bodySmall} color="$textMutedForeground">
              Showing {filteredData.length} of {USER_MANAGEMENT_MOCK_DATA.length} users
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                // Handle export CSV
              }}
            >
              <HStack space="xs" alignItems="center">
                <LucideIcon
                  name="Download"
                  size={16}
                />
                <Text {...TYPOGRAPHY.bodySmall} fontWeight="$medium">
                  Export CSV
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
