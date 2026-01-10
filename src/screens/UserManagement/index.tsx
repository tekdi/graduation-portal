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
// API service for fetching users, roles, and provinces
import { 
  getUsersList, 
  UserSearchParams, 
  getRolesList, 
  Role,
  getEntityTypesList,
  getEntityTypesFromStorage,
  getProvincesByEntityType,
  ProvinceEntity
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

  // Fetch roles from API on component mount
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

  // Fetch provinces from API on component mount
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

  // Map filter role labels to API role titles (using dynamic roleMap from API)
  const mapRoleLabelToTitle = useCallback((roleLabel: string): string => {
    const mappedRole = roleMap[roleLabel] || roleLabel;
    console.log('Role mapping:', { roleLabel, mappedRole });
    return mappedRole;
  }, [roleMap]);

  // Build dynamic filter options with API roles and provinces
  const filterOptionsWithRoles = useMemo(() => {
    // Get status and district filters from FilterOptions
    const statusFilter = FilterOptions.find(f => f.attr === 'status');
    const districtFilter = FilterOptions.find(f => f.attr === 'district');
    
    // Always build role filter from API roles (even if empty during loading)
    const roleFilterOptions = [
      { labelKey: 'admin.filters.allRoles', value: 'all-roles' },
      ...roles.map((role: Role) => ({
        label: role.label,
        value: role.label, // Use label as value (e.g., "Supervisor")
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
      ...(districtFilter ? [districtFilter] : []),
    ];
  }, [roles, provinces]);

  // Combine search filter with dynamic filter options
  const data = useMemo(() => [SearchFilter, ...filterOptionsWithRoles], [filterOptionsWithRoles]);

  // Fetch users from API when filters/pagination change
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Determine type parameter based on role filter
        let apiType = 'user,session_manager,org_admin'; // Default: all types
        if (filters.role && filters.role !== 'all-roles') {
          // Map filter role label to API role title and use it as type
          const mappedRole = mapRoleLabelToTitle(filters.role);
          apiType = mappedRole;
          console.log('Role filter applied - using type:', apiType);
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
        // Note: Role filter is handled via 'type' parameter above, not 'role' parameter
        // We don't send 'role' parameter to avoid duplication
        if (filters.status && filters.status !== 'all-status') {
          apiParams.status = filters.status;
        }
        if (filters.province && filters.province !== 'all-provinces') {
          // Since we're using province.name as both label and value, use it directly
          // The API expects the province name (e.g., "Eastern Cape")
          apiParams.province = filters.province;
        }
        if (filters.district && filters.district !== 'all-districts') {
          const districtFilter = FilterOptions.find((f) => f.attr === 'district');
          const option = districtFilter?.data.find((opt: any) => 
            typeof opt === 'string' ? opt === filters.district : opt.value === filters.district
          );
          let districtLabel: string | undefined;
          if (typeof option === 'string') {
            districtLabel = option;
          } else if (typeof option === 'object' && option) {
            districtLabel = option.label || (option.value ? String(option.value) : undefined);
          }
          if (districtLabel) apiParams.district = districtLabel;
        }

        const response = await getUsersList(apiParams);
        console.log('API response:', response);
        console.log('Users data:', response.result?.data);
        
        // Use raw API data directly
        setUsers(response.result?.data || []);
        setTotalCount(response.result?.total || (response.result?.data || []).length);
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

  // Handle filter changes and reset pagination
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
