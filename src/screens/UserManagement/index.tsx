import React, { useState, useEffect } from 'react';
import { VStack, HStack, Text, Spinner, Button, Image } from '@ui';
import { View } from 'react-native';

import { userManagementStyles } from './Styles';
import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import Filters from '../../components/ui/Filter';
import BulkOperationsCard from '../../components/ui/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/ui/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import { SearchFilter, FilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/ui/Filter';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const data = [SearchFilter, ...FilterOptions];

  return (
    <VStack space="md" width="100%">
      <HStack 
        justifyContent="space-between" 
        alignItems="flex-start" 
        width="100%"
        flexWrap="wrap"
      >
        <VStack {...userManagementStyles.mainVStack} flex={1}>
          <Text {...userManagementStyles.titleText}>{t('admin.menu.userManagement')}</Text>
          <Text {...userManagementStyles.welcomeText}>
            {t('admin.userManagementDescription')}
          </Text>
        </VStack>
        
        <HStack space="md" alignItems="center" mt="$2">
          <Button
            {...userManagementStyles.bulkUploadButton}
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
              <Text {...userManagementStyles.bulkUploadButtonText}>
                Bulk Upload (CSV)
              </Text>
            </HStack>
          </Button>
          
          <Button
            {...userManagementStyles.createUserButton}
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
              <Text {...userManagementStyles.createUserButtonText}>
                Create User
              </Text>
            </HStack>
          </Button>
        </HStack>
      </HStack>
      
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
      
      
    </VStack>
  );
};

export default UserManagementScreen;
