import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { VStack, HStack, Button, Text, Image, Box, Pressable, Card, useToast, Toast, ToastTitle } from '@ui';
import { View, Platform } from 'react-native';
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
import { User } from '@constants/USER_MANAGEMENT_MOCK_DATA';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { usePlatform } from '@utils/platform';
import { styles } from './Styles';
// API service for fetching users, roles, provinces, and districts
import { 
  getUsersList, 
  UserSearchParams, 
  getRolesList, 
  Role,
  getEntityTypesList,
  getEntityTypesFromStorage,
  getProvincesByEntityType,
  ProvinceEntity,
  getDistrictsByProvinceEntity,
  DistrictEntity
} from '../../services/participantService';
import { Modal } from '@ui';
import { theme } from '@config/theme';
//import BulkOperationsCard from '../../components/BulkOperationsCard';
// TODO: Add USER_MANAGEMENT_STATS constant
// import StatCard, { StatsRow } from '@components/StatCard';
// import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const toast = useToast();
  
  // API state management
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Roles state for dynamic filter
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({}); // Maps label → title
  
  // Provinces state for dynamic filter
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  
  // Districts state for dynamic filter
  const [districts, setDistricts] = useState<DistrictEntity[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  
  // File upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10; // 10MB max file size
  
  const columns = useMemo(() => getUsersColumns(), []);

  // Toast helpers
  const showErrorToast = (message: string) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="error" variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  const showSuccessToast = (message: string) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  // Validate file size
  const validateFileSize = (file: File): boolean => {
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  // Fetch roles from API on component mount - Dynamic role filter from API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const response = await getRolesList({ page: 1, limit: 100 });
        const allRoles = response.result?.data || [];
        
        // Filter only ACTIVE roles for the dropdown
        const activeRoles = allRoles.filter((role: Role) => role.status === 'ACTIVE');
        setRoles(activeRoles);

        // Build roleMap: label → title (e.g., "Supervisor" → "org_admin")
        const newRoleMap: Record<string, string> = {};
        activeRoles.forEach((role: Role) => {
          if (role.label && role.title) {
            newRoleMap[role.label] = role.title;
          }
        });
        setRoleMap(newRoleMap);
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Set empty array - filter will show only "All Roles" option
        setRoles([]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch provinces from API on component mount - Dynamic province filter from API
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
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
          console.error('Province entity type ID not found');
          setProvinces([]);
          return;
        }

        // Fetch provinces using the entity type ID
        const response = await getProvincesByEntityType(provinceEntityTypeId);
        const provincesData = response.result || [];
        setProvinces(provincesData);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        // Set empty array - filter will show only "All Provinces" option
        setProvinces([]);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province filter changes - Dynamic district filter based on selected province
  useEffect(() => {
    const fetchDistricts = async () => {
      // If no province selected or "All Provinces" is selected, clear districts
      if (!filters.province || filters.province === 'all-provinces') {
        setDistricts([]);
        // Clear district filter if province is cleared
        setFilters((prev) => {
          if (prev.district) {
            const updated = { ...prev };
            delete updated.district;
            return updated;
          }
          return prev;
        });
        return;
      }

      // Only fetch if provinces are loaded
      if (provinces.length === 0) {
        return;
      }

      setIsLoadingDistricts(true);
      try {
        // Find the selected province from provinces array to get its _id
        const selectedProvince = provinces.find(
          (province: ProvinceEntity) => province.name === filters.province
        );

        if (!selectedProvince || !selectedProvince._id) {
          console.error('Selected province not found or missing _id:', filters.province);
          setDistricts([]);
          return;
        }

        // Console log: Province selected
        console.log('Province selected:', selectedProvince.name);

        // Build API endpoint URL for districts (base URL is configured in axios instance)
        const queryParams = new URLSearchParams({
          type: 'district',
          page: '1',
          limit: '100',
        });
        const endpoint = `/api/entity-management/v1/entities/subEntityList/${selectedProvince._id}?${queryParams.toString()}`;

        // Fetch districts using the province's entity ID (_id)
        const response = await getDistrictsByProvinceEntity(selectedProvince._id, {
          page: 1,
          limit: 100,
        });
        
        // Access districts from response.result.data (API returns { result: { count, data } })
        const districtsData = Array.isArray(response.result?.data) ? response.result.data : [];
        setDistricts(districtsData);

        // Console log: List of districts (below province selection)
        const districtNames = districtsData.length > 0 
          ? districtsData.map((d: DistrictEntity) => d.name).join(', ')
          : 'No districts found';
        console.log('list of district of province:', districtNames);
        
        // Console log: API URL (endpoint path - base URL is configured in axios)
        console.log('API url link getting send to District filter to fetch districts:', endpoint);

        // Clear district filter when new districts are loaded (to avoid invalid selections)
        setFilters((prev) => {
          if (prev.district) {
            const updated = { ...prev };
            delete updated.district;
            return updated;
          }
          return prev;
        });
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [filters.province, provinces]);

  // Map filter role labels to API role titles (using dynamic roleMap from API) - Maps display labels to API titles (e.g., "Supervisor" → "org_admin")
  const mapRoleLabelToTitle = useCallback((roleLabel: string): string => {
    const mappedRole = roleMap[roleLabel] || roleLabel;
    console.log('Role mapping:', { roleLabel, mappedRole });
    return mappedRole;
  }, [roleMap]);

  // Map filter status labels to API status format - Maps display labels to API format (e.g., "Active" → "ACTIVE")
  const mapStatusLabelToAPI = useCallback((statusLabel: string): string => {
    const statusMap: Record<string, string> = {
      'Active': 'ACTIVE',
      'Deactivated': 'DEACTIVATED',
    };
    return statusMap[statusLabel] || statusLabel;
  }, []);

  // Build dynamic filter options with API roles, provinces, and districts - Replace hardcoded filters with API data
  const filterOptionsWithRoles = useMemo(() => {
    // Get status filter from FilterOptions
    const statusFilter = FilterOptions.find(f => f.attr === 'status');
    
    // Always build role filter from API roles (even if empty during loading)
    // Use title as value to ensure unique identification (even if labels are duplicate)
    const roleFilterOptions = [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      ...roles.map((role: Role) => ({
        label: role.label, // Display label in dropdown
        value: role.title, // Use title as value for filtering (unique identifier)
      })),
    ];

    // Always build province filter from API provinces (even if empty during loading)
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
        nameKey: 'admin.filters.role',
        attr: 'role',
        type: 'select' as const,
        data: roleFilterOptions,
      },
      ...(statusFilter ? [statusFilter] : []),
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

  // Combine search filter with dynamic filter options
  const data = useMemo(() => [SearchFilter, ...filterOptionsWithRoles], [filterOptionsWithRoles]);

  // Fetch users from API when filters/pagination change
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Determine type parameter based on role filter
        // When "All Roles" is selected, use all role titles from API
        let apiType: string;
        if (filters.role && filters.role !== 'all-roles') {
          // Filter value is already the role title (not label), so use it directly
          apiType = filters.role;
          console.log('Role filter applied - using type:', apiType);
        } else {
          // Build type parameter from all active roles fetched from API
          // Extract unique role titles from roles array
          const allRoleTitles = roles
            .map((role: Role) => role.title)
            .filter((title: string | undefined): title is string => !!title)
            .filter((title: string, index: number, self: string[]) => self.indexOf(title) === index); // Remove duplicates
          
          // Use all role titles from API (no fallback)
          apiType = allRoleTitles.join(',');
          console.log('All Roles selected - using type:', apiType);
        }

        const apiParams: UserSearchParams = {
          tenant_code: 'brac',
          type: apiType,
          page: currentPage,
          limit: pageSize,
        };

        if (filters.search) {
          apiParams.search = filters.search;
        }

        console.log('Filters object:', filters);
        console.log('Role filter value:', filters.role);
        console.log('Status filter value:', filters.status);
        // Note: Role filter is handled via 'type' parameter above, not 'role' parameter
        // We don't send 'role' parameter to avoid duplication
        if (filters.status && filters.status !== 'all-status') {
          // Map status filter value to API format (e.g., "Active" → "ACTIVE")
          const mappedStatus = mapStatusLabelToAPI(filters.status);
          apiParams.status = mappedStatus;
          console.log('Status filter applied - mapped value:', mappedStatus);
        } else {
          console.log('Status filter not applied - value is:', filters.status);
        }
        if (filters.province && filters.province !== 'all-provinces') {
          // Since we're using province.name as both label and value, use it directly
          // The API expects the province name (e.g., "Eastern Cape")
          apiParams.province = filters.province;
        }
        if (filters.district && filters.district !== 'all-districts') {
          // Since we're using district.name as both label and value, use it directly
          // The API expects the district name (e.g., "Alfred Nzo")
          apiParams.district = filters.district;
        }

        const response = await getUsersList(apiParams);
        console.log('API response:', response);
        console.log('Users data:', response.result?.data);
        
        // Get raw API data
        let usersData = response.result?.data || [];
        
        // Apply client-side status filtering if status filter is set (fallback if API doesn't filter)
        // This ensures status filter works even if API doesn't support status parameter
        if (filters.status && filters.status !== 'all-status') {
          const mappedStatus = mapStatusLabelToAPI(filters.status);
          usersData = usersData.filter((user: any) => {
            const userStatus = user.status?.toUpperCase();
            return userStatus === mappedStatus;
          });
          console.log('Client-side status filter applied:', { 
            filterStatus: mappedStatus, 
            filteredCount: usersData.length 
          });
        }

        // Apply client-side province filtering if province filter is set
        // Filter out users that don't have province data matching the filter
        if (filters.province && filters.province !== 'all-provinces') {
          usersData = usersData.filter((user: any) => {
            const userProvince = user.province || user.province_name || user.location?.province;
            // If user has no province data, exclude them when province filter is applied
            if (!userProvince) return false;
            // Match province name (case-insensitive)
            return userProvince.toLowerCase() === filters.province.toLowerCase();
          });
          console.log('Client-side province filter applied:', { 
            filterProvince: filters.province, 
            filteredCount: usersData.length 
          });
        }

        // Apply client-side district filtering if district filter is set
        // Filter out users that don't have district data matching the filter
        if (filters.district && filters.district !== 'all-districts') {
          usersData = usersData.filter((user: any) => {
            const userDistrict = user.district || user.district_name || user.location?.district;
            // If user has no district data, exclude them when district filter is applied
            if (!userDistrict) return false;
            // Match district name (case-insensitive)
            return userDistrict.toLowerCase() === filters.district.toLowerCase();
          });
          console.log('Client-side district filter applied:', { 
            filterDistrict: filters.district, 
            filteredCount: usersData.length 
          });
        }
        
        setUsers(usersData);
        setTotalCount(usersData.length);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [filters, currentPage, pageSize, mapRoleLabelToTitle, mapStatusLabelToAPI]);

  // Handle filter changes and reset pagination
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleRowClick = useCallback((user: User) => {
    // Handle row click - navigate to user details
    console.log('User clicked:', user);
  }, []);

  // Handle CSV upload: closes options modal and triggers native file picker
  const handleUploadCSV = () => {
    setIsUploadModalOpen(false);
    // Trigger file input click
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process selected CSV file: validates file type and handles upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate CSV file extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
      showErrorToast('Please select a CSV file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (!validateFileSize(file)) {
      showErrorToast(`File size exceeds maximum limit of ${maxFileSize}MB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Implement actual CSV upload API call
      console.log('Uploading CSV file:', file.name);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('CSV file uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast('Failed to upload CSV file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUser = () => {
    setIsUploadModalOpen(false);
    // TODO: Handle add user
    console.log('Add User clicked');
  };

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
                onPress={() => setIsUploadModalOpen(true)}
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
                onPress={() => setIsUploadModalOpen(true)}
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

        {/* DataTable with raw API data */}
        <DataTable
          data={users}
          columns={columns}
          onRowClick={handleRowClick}
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          pagination={{
            enabled: false,  // Disable client-side pagination since API handles it
          }}
          emptyMessage="admin.users.noUsersFound"
          loadingMessage="admin.users.loadingUsers"
        />
      </Box>

      {/* <BulkOperationsCard/> */}

      {/* Stats and Bulk Operations - Display after table */}
      {/* TODO: Uncomment when USER_MANAGEMENT_STATS constant is available
      <View style={{ marginTop: 24, width: '100%' }}>
        <StatsRow>
          {USER_MANAGEMENT_STATS.map((stat: any, index: number) => (
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
      */}
      
      {/* Upload Users Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        headerTitle={t('admin.actions.uploadUsers')}
        headerDescription={t('admin.actions.uploadUsersDescription')}
        size="md"
        borderRadius="$lg"
      >
        <VStack space="md" width="100%">
          {/* Upload CSV Option */}
          <Pressable 
            onPress={handleUploadCSV}
            // @ts-ignore - Web-specific event handlers
            onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
            onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            <Card
              {...(styles.uploadOptionCard as any)}
              bg={isHovered ? "$accent200" : "$white"}
            >
              <HStack space="md" alignItems="center">
                {/* Icon Container */}
                <Box
                  {...(styles.uploadCSVIconContainer as any)}
                >
                  <LucideIcon 
                    name="FileUp" 
                    size={16} 
                    color={theme.tokens.colors.primary500} 
                  />
                </Box>
                
                {/* Text Content */}
                <VStack flex={1} space="xs">
                  <Text 
                    {...TYPOGRAPHY.bodySmall} 
                    color={theme.tokens.colors.textPrimary}
                    fontWeight="$medium"
                  >
                    {t('admin.actions.uploadCSV')}
                  </Text>
                  <Text 
                    {...TYPOGRAPHY.caption} 
                    color={theme.tokens.colors.textMutedForeground}
                  >
                    {t('admin.actions.uploadCSVDescription')}
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </Pressable>

          {/* Add User Option - Disabled */}
          <Pressable disabled>
            <Card
              {...(styles.uploadOptionCardDisabled as any)}
              bg="$white"
            >
              <HStack space="md" alignItems="center">
                {/* Icon Container */}
                <Box
                  {...(styles.addUserIconContainer as any)}
                >
                  <LucideIcon 
                    name="UserPlus" 
                    size={16} 
                    color="#6B7280" 
                  />
                </Box>
                
                {/* Text Content */}
                <VStack flex={1} space="xs">
                  <Text 
                    {...TYPOGRAPHY.bodySmall} 
                    color={theme.tokens.colors.textPrimary}
                    fontWeight="$medium"
                  >
                    {t('admin.actions.addUser')}
                  </Text>
                  <Text 
                    {...TYPOGRAPHY.caption} 
                    color={theme.tokens.colors.textMutedForeground}
                  >
                    {t('admin.actions.addUserDescription')}
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </Pressable>
        </VStack>
      </Modal>

      {/* Hidden File Input for CSV Upload - triggers native file picker on "Upload CSV" click */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </VStack>
  );
};

export default UserManagementScreen;
