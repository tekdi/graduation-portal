import React from 'react';
import { ScrollView, VStack, Text } from '@ui';

import { dashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import AdminLayout from '@layout/admin/Layout';
const DashboardScreen = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <ScrollView {...dashboardStyles.scrollView}>
        <VStack {...dashboardStyles.mainVStack}>
          <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
          <Text {...dashboardStyles.welcomeText}>
            {t('admin.dashboardDescription')}
          </Text>
        </VStack>
      </ScrollView>
    </AdminLayout>
  );
};

export default DashboardScreen;
