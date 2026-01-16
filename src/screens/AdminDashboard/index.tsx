import React from 'react';
import { VStack, Card, Heading, Text } from '@ui';
import { theme } from '@config/theme';

import { adminDashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import TitleHeader from '@components/TitleHeader';
import FilterButton from '@components/Filter';
import DashboardCards from '@components/DashboardCards';
import { AdminDashboardFilterOptions } from '@constants/ADMIN_DASHBOARD_FILTERS';
import { AssessmentSurveyCardData } from '@app-types/participant';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Dashboard filters changed:', filters);
    // Add your filter logic here
  };

  // Indicator cards data
  const indicatorCards: AssessmentSurveyCardData[] = [
    {
      id: 'output-indicators',
      icon: 'TrendingUp',
      iconColor: theme.tokens.colors.error100,
      title: 'admin.outputIndicators.title',
      description: 'admin.outputIndicators.description',
      navigationUrl: '/output-indicators',
      status: {
        type: 'not-started',
        label: 'admin.outputIndicators.topics',
      },
    },
    {
      id: 'outcome-indicators',
      icon: 'Target',
      iconColor: theme.tokens.colors.error100,
      title: 'admin.outcomeIndicators.title',
      description: 'admin.outcomeIndicators.description',
      navigationUrl: '/outcome-indicators',
      status: {
        type: 'not-started',
        label: 'admin.outcomeIndicators.topics',
      },
    },
  ];

  return (
    <VStack space="md" width="100%">
      <TitleHeader title="admin.dashboard" description="admin.dashboardDescription" />
      <FilterButton 
        data={AdminDashboardFilterOptions as any[]} 
        onFilterChange={handleFilterChange}
      />
      <Card size="md" variant="ghost" mt="$4">
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