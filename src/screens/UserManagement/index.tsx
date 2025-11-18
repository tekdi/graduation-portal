import React from 'react';
import { VStack, Text } from '@ui';
import { View } from 'react-native';

import { userManagementStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import Filters from '../../components/ui/Filter';
import BulkOperationsCard from '../../components/ui/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/ui/StatCard';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
const statsData = [
  { 
    title: "Total Users", 
    count: "10", 
    subLabel: "All roles" 
  },
  { 
    title: "Participants", 
    count: "4", 
    subLabel: "Active learners", 
    color: "#3b82f6" 
  },
  { 
    title: "Linkage Champions", 
    count: "2", 
    subLabel: "Active coaches", 
    color: "#f59e0b" 
  },
  { 
    title: "Supervisors", 
    count: "2", 
    subLabel: "Active supervisors", 
    color: "#10b981" 
  }
];
  return (
    <VStack space="md" width="100%">
      <VStack {...userManagementStyles.mainVStack}>
        <Text {...userManagementStyles.titleText}>{t('admin.menu.userManagement')}</Text>
        <Text {...userManagementStyles.welcomeText}>
          {t('admin.userManagementDescription')}
        </Text>
      </VStack>
      
      <Filters/>
      <BulkOperationsCard/>
      
      <View style={{ marginTop: 24, width: '100%' }}>
        <StatsRow>
          {statsData.map((stat, index) => (
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
