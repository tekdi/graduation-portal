import React from 'react';
import { VStack, Card, Heading, Text } from '@ui';
import { theme } from '@config/theme';

import { adminDashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import TitleHeader from '@components/TitleHeader';
import FilterButton from '@components/Filter';
import DashboardCards from './DashboardCards';
import { AdminDashboardFilterOptions } from '@constants/ADMIN_DASHBOARD_FILTERS';
import { indicatorCards } from '@constants/ADMIN_DASHBOARD_CARDS';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Dashboard filters changed:', filters);
    // Add your filter logic here
  };

  return (
    <VStack space="md" width="100%">
      <TitleHeader title="admin.dashboard" description="admin.dashboardDescription" />
      <FilterButton 
        data={AdminDashboardFilterOptions as any[]} 
        onFilterChange={handleFilterChange}
      />
      <Card size="md" variant="ghost" px="$0">
        <Heading size="md" fontSize="$md" fontWeight="$normal" color="$textForeground">
          {t('admin.selectIndicatorType')}
        </Heading>
        <Text size="sm" color="$textMutedForeground">{t('admin.indicatorTypeDescription')}</Text>
      </Card>

      {/* Indicator Cards */}
      <DashboardCards cards={indicatorCards} />
    </VStack>
  );
};

export default AdminDashboard;