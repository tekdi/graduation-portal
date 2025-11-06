import React from 'react';
import { ScrollView, VStack, Text } from '@ui';

import { dashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const DashboardScreen = () => {
  const { t } = useLanguage();

  return (
    <ScrollView {...dashboardStyles.scrollView}>
      <VStack {...dashboardStyles.mainVStack}>
        <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
        <Text {...dashboardStyles.welcomeText}>
          {t('admin.dashboardDescription')}
        </Text>
      </VStack>
    </ScrollView>
  );
};

export default DashboardScreen;
