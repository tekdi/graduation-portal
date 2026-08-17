import React, { useState } from 'react';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { TabButton } from '@components/Tabs';
import { PERFORMANCE_REPORT_METRICS } from '@constants/DASHBOARD_LC';
import { performanceActivityStyles } from './styles';

const PerformanceActivityReportCard: React.FC = () => {
  const { t } = useLanguage();
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const tabs = [
    { key: 'weekly', label: 'requestorDashboard.overview.performanceActivityReport.tabs.weekly' },
    { key: 'monthly', label: 'requestorDashboard.overview.performanceActivityReport.tabs.monthly' },
  ];

  return (
    <Pressable {...performanceActivityStyles.card}>
      <VStack>
        {/* Header Row */}
        <HStack {...performanceActivityStyles.header}>
          <VStack space="xs">
            <Text {...performanceActivityStyles.cardTitle}>
              {t('requestorDashboard.overview.performanceActivityReport.title')}
            </Text>
            <Text {...performanceActivityStyles.cardDescription}>
              {t('requestorDashboard.overview.performanceActivityReport.description')}
            </Text>
          </VStack>
          <HStack {...performanceActivityStyles.periodTabs}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={reportPeriod === tab.key}
                onPress={(key) => setReportPeriod(key as any)}
                variant="ButtonTab"
                _container={performanceActivityStyles.tabButton(reportPeriod === tab.key)}
                _text={performanceActivityStyles.tabText(reportPeriod === tab.key)}
              />
            ))}
          </HStack>
        </HStack>

        {/* 4x3 Grid of Metrics */}
        <HStack {...performanceActivityStyles.metricGrid}>
          {PERFORMANCE_REPORT_METRICS.map((metric) => {
            const value = reportPeriod === 'weekly' ? metric.weeklyValue : metric.monthlyValue;
            const label = t(metric.labelKey);
            const subLabel =
              metric.subLabelWeeklyKey && reportPeriod === 'weekly'
                ? t(metric.subLabelWeeklyKey)
                : t(metric.subLabelKey);

            return (
              <Box key={metric.key} {...performanceActivityStyles.metricCardWrapper}>
                <Box {...performanceActivityStyles.metricCard(metric.borderToken)}>
                  <VStack space="md">
                    {/* Icon + Title */}
                    <HStack space="sm" alignItems="center">
                      <Box {...performanceActivityStyles.metricIcon(metric.bgToken)}>
                        <LucideIcon name={metric.icon} size={16} color={metric.colorToken} />
                      </Box>
                      <Text {...performanceActivityStyles.metricLabel}>
                        {label}
                      </Text>
                    </HStack>

                    {/* Value + Sub-label */}
                    <VStack space="xs">
                      <Text {...performanceActivityStyles.metricValue(metric.colorToken)}>
                        {value}
                      </Text>
                      <Text {...performanceActivityStyles.metricDescription}>
                        {subLabel}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </Box>
            );
          })}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default PerformanceActivityReportCard;
