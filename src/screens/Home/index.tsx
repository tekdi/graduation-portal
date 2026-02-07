import React from 'react';
import { VStack, Text, Container } from '@ui';

import { dashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const DashboardScreen = () => {
  const { t } = useLanguage();

  return (
    <Container>
      <VStack {...dashboardStyles.mainVStack}>
        <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
        <Text {...dashboardStyles.welcomeText}>
          {t('admin.dashboardDescription')}
        </Text>
      </VStack>
    </Container>
  );
};

export default DashboardScreen;
