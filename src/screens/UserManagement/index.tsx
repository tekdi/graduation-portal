import React from 'react';
import { VStack, Text } from '@ui';
import { View } from 'react-native';

import { userManagementStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import Filters from '../../components/ui/Filter';
import BulkOperationsCard from '../../components/ui/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/ui/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
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
