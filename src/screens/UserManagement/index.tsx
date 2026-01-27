import React, { useState, useRef, useEffect } from 'react';
import { VStack, HStack, Button, Text, Image, Box, Pressable, Card, useAlert, Modal } from '@ui';
import { View, Platform } from 'react-native';
import { LucideIcon } from '@ui/index';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import BulkOperationsCard from '../../components/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import { SearchFilter, FilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { usePlatform } from '@utils/platform';
import { userManagementStyles as styles } from './Styles';
import { theme } from '@config/theme';
import { getSignedUrl, uploadFileToSignedUrl, bulkUserCreate } from '../../services/bulkUploadService';
import offlineStorage from '../../services/offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { API_ENDPOINTS } from '../../services/apiEndpoints';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const { showAlert } = useAlert();
  const data = [SearchFilter, ...FilterOptions];
  
  // File upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Log orgId and tenant_code from login API response
  useEffect(() => {
    const logUserData = async () => {
      try {
        const userData = await offlineStorage.read<any>(STORAGE_KEYS.AUTH_USER);
        if (userData) {
          const orgId = userData?.organizations?.[0]?.code;
          const tenantCode = userData?.tenant_code;
          
          console.log('=== USER MANAGEMENT SCREEN ===');
          console.log('OrgId from login response:', orgId);
          console.log('Tenant Code from login response:', tenantCode);
          console.log('Full user data:', userData);
        } else {
          console.log('No user data found in storage');
        }
      } catch (error) {
        console.error('Error reading user data:', error);
      }
    };
    
    logUserData();
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
      showAlert('error', t('admin.actions.csvValidationError'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
          return;
        }

    setIsUploading(true);
    let currentStep: 'getSignedUrl' | 'uploadFile' | 'bulkCreate' | null = null;
    
    try {
      // Step 1: Get signed URL
      currentStep = 'getSignedUrl';
      const signedUrlResponse = await getSignedUrl(file.name);
      if (!signedUrlResponse.result?.signedUrl) {
          throw new Error(t('admin.actions.uploadErrorSignedUrl'));
        }

      // Step 2: Upload file to signed URL
      currentStep = 'uploadFile';
      await uploadFileToSignedUrl(signedUrlResponse.result.signedUrl, file);

      // Step 3: Trigger bulk user creation
      currentStep = 'bulkCreate';
      const filePath = signedUrlResponse.result.filePath || signedUrlResponse.result.destFilePath;
      if (!filePath) {
        throw new Error(t('admin.actions.uploadErrorFilePathNotFound'));
      }
      
      const bulkCreateResponse = await bulkUserCreate(filePath, ['name', 'email'], 'UPLOAD');
      
      // Show success toast
      showAlert('success', t('admin.actions.uploadSuccess'));
      
    } catch (error: any) {
      // Determine which step failed based on currentStep or error response structure
      let errorMessage = t('admin.actions.uploadError');

      // Check which step failed using currentStep variable
      if (currentStep === 'getSignedUrl') {
        // Step 1 failed: Get signed URL
        errorMessage = t('admin.actions.uploadErrorSignedUrl');
      } else if (currentStep === 'uploadFile') {
        // Step 2 failed: File upload to S3
        errorMessage = t('admin.actions.uploadErrorFileUpload');
      } else if (currentStep === 'bulkCreate') {
        // Step 3 failed: Bulk user creation
        errorMessage = t('admin.actions.uploadErrorBulkCreate');
      } else {
        // Fallback: Check error response structure
        const errorUrl = error?.config?.url || error?.response?.config?.url || '';
        
        if (errorUrl.includes(API_ENDPOINTS.GET_SIGNED_URL)) {
          errorMessage = t('admin.actions.uploadErrorSignedUrl');
        } else if (errorUrl.includes(API_ENDPOINTS.BULK_USER_CREATE)) {
          errorMessage = t('admin.actions.uploadErrorBulkCreate');
        } else if (error?.response?.data?.message) {
          // Use API error message if available
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.responseCode) {
          // Use responseCode from API response if available
          const responseCode = error.response.data.responseCode;
          if (responseCode === 'CLIENT_ERROR' || responseCode === 'SERVER_ERROR') {
            errorMessage = error.response.data.message || t('admin.actions.uploadError');
          }
        }
      }
        
      showAlert('error', errorMessage);
      } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        }
      />
      
      <FilterButton data={data} />
      
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
