import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { VStack, HStack, Button, Text, Image, Box } from '@ui';
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
import { User } from '@app-types/user';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { usePlatform } from '@utils/platform';
import { styles } from './Styles';
import { getUsersList } from '../../services/userService';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const data = [SearchFilter, ...FilterOptions];
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const columns = useMemo(() => getUsersColumns(), []);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Build API parameters from filters
        const apiParams: any = {
          tenant_code: 'brac',
          type: 'user,session_manager,org_admin',
          page: currentPage,
          limit: pageSize,
        };

        // Add search parameter
        if (filters.search) {
          apiParams.search = filters.search;
        }

        // Add filter parameters (only if not "all" values)
        if (filters.role && filters.role !== 'all-roles') {
          apiParams.role = filters.role;
        }
        if (filters.status && filters.status !== 'all-status') {
          apiParams.status = filters.status;
        }
        if (filters.province && filters.province !== 'all-provinces') {
          const provinceFilter = FilterOptions.find((f) => f.attr === 'province');
          const option = provinceFilter?.data.find((opt: any) => 
            typeof opt === 'string' ? opt === filters.province : opt.value === filters.province
          );
          const provinceLabel = typeof option === 'object' && option?.label ? option.label : option;
          if (provinceLabel) apiParams.province = provinceLabel;
        }
        if (filters.district && filters.district !== 'all-districts') {
          const districtFilter = FilterOptions.find((f) => f.attr === 'district');
          const option = districtFilter?.data.find((opt: any) => 
            typeof opt === 'string' ? opt === filters.district : opt.value === filters.district
          );
          const districtLabel = typeof option === 'object' && option?.label ? option.label : option;
          if (districtLabel) apiParams.district = districtLabel;
        }

        const response = await getUsersList(apiParams);
        
        // Map API response to User[] format
        // Transform API response fields to match User interface
        const usersData = (response.result?.data || []).map((user: any) => {
          // Try to find role from various possible field names
          let role = user.role || user.user_role || user.role_name || user.role_label || 
                     user.user_type || user.type || user.roles?.[0]?.label || 
                     user.roles?.[0]?.title || '-';
          
          // Normalize role values to match User interface
          if (role && role !== '-') {
            // Map common role variations to expected values
            const roleMap: Record<string, string> = {
              'admin': 'Admin',
              'supervisor': 'Supervisor',
              'linkage_champion': 'Linkage Champion',
              'linkage champion': 'Linkage Champion',
              'participant': 'Participant',
              'session_manager': 'Supervisor', // or appropriate mapping
              'org_admin': 'Admin',
            };
            role = roleMap[role.toLowerCase()] || role;
          }
          
          // Map status
          let status = user.status || user.user_status || 'Active';
          if (typeof status === 'string') {
            status = status === 'ACTIVE' || status === 'Active' ? 'Active' : 
                     status === 'DEACTIVATED' || status === 'Deactivated' || status === 'INACTIVE' ? 'Deactivated' : 
                     status;
          }
          
          return {
            id: String(user.id || user.user_id || user._id || ''),
            name: user.name || user.full_name || user.username || user.display_name || '',
            email: user.email || user.email_address || '',
            role: role as User['role'],
            status: status as User['status'],
            province: user.province || user.province_name || user.address?.province || '-',
            district: user.district || user.district_name || user.address?.district || '-',
            lastLogin: user.lastLogin || user.last_login || user.lastLoginDate || user.last_login_date || '-',
            details: user.details || null,
          };
        }) as User[];
        
        setUsers(usersData);
        setTotalCount(response.result?.total || usersData.length);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [filters, currentPage, pageSize]);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setCurrentPage(1);
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
                  count: users.length,
                  total: totalCount,
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
          data={users}
          columns={columns}
          onRowClick={handleRowClick}
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          pagination={{
            enabled: false, // Disable client-side pagination since we're using server-side pagination
          }}
          emptyMessage="admin.users.noUsersFound"
          loadingMessage="admin.users.loadingUsers"
        />
      </Box>
    </VStack>
  );
};

export default UserManagementScreen;
