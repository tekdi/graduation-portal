import React from 'react';
import { VStack, HStack, Box } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';

import { overviewStyles } from './styles';
import MetricCard from './Cards/MetricCard';
import TasksOverviewCard from './Cards/TasksOverviewCard';
import EnrollmentStatusCard from './Cards/EnrollmentStatusCard';
import PerformanceActivityReportCard from './Cards/PerformanceActivityReportCard';

const OverviewDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <VStack {...overviewStyles.contentContainer}>
      {/* Metric Cards Row */}
      <HStack {...overviewStyles.metricsRow}>
        <MetricCard
          title={t('requestorDashboard.overview.metrics.totalCaseload')}
          value={36}
          icon="Users"
          iconColor="$primary500"
        />
        <MetricCard
          title={t('requestorDashboard.overview.metrics.activeParticipants')}
          value={17}
          icon="Activity"
          iconColor="$info100"
        />
        <MetricCard
          title={t('requestorDashboard.overview.metrics.completed')}
          value={7}
          icon="CircleCheck"
          iconColor="$success600"
        />
        <MetricCard
          title={t('requestorDashboard.overview.metrics.averageProgress')}
          value="65%"
          icon="Clock"
          iconColor="$blue500"
        />
      </HStack>

      {/* Cards Grid */}
      <HStack {...overviewStyles.cardsRow}>
        <Box {...overviewStyles.cardColumn}>
          <TasksOverviewCard />
        </Box>
        <Box {...overviewStyles.cardColumn}>
          <EnrollmentStatusCard />
        </Box>
      </HStack>

      <PerformanceActivityReportCard />
    </VStack>
  );
};

export default OverviewDashboard;
