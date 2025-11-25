import React, { useState, useEffect } from 'react';
import { VStack, Spinner } from '@ui';
import { View } from 'react-native';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import BulkOperationsCard from '../../components/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import { SearchFilter, FilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import AdminActionButtons from '@components/AdminActionButtons';
import TitleHeader from '@components/TitleHeader';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const data = [SearchFilter, ...FilterOptions];

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title={t('admin.menu.userManagement')}
        description={t('admin.userManagementDescription')}
        right={
          <AdminActionButtons
            buttons={[
              {
                label: 'Bulk Upload (CSV)',
                icon: UploadIcon,
                variant: 'outline',
                onPress: () => {
                  // Handle bulk upload
                },
              },
              {
                label: 'Create User',
                icon: ExportIcon,
                variant: 'solid',
                onPress: () => {
                  // Handle create user
                },
              },
            ]}
          />
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
      
      
    </VStack>
  );
};

export default UserManagementScreen;
