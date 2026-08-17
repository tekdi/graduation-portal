import React from 'react';
import { Box, HStack, VStack, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { GRADUATION_METRICS } from '@constants/DASHBOARD_LC';
import { graduationCriteriaStyles } from '../../styles';

const OverallProgramGraduationRateMetricCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.metricCard}>
      <HStack {...graduationCriteriaStyles.metricRow}>
        {GRADUATION_METRICS.map((metric, index) => {
          const isLast = index === GRADUATION_METRICS.length - 1;
          const label = t(metric.labelKey);
          const value = t(metric.valueKey);
          const description = t(metric.subLabelKey);
          const isCoachWorkload = metric.key === 'coachWorkload';

          return (
            <VStack
              key={metric.key}
              {...graduationCriteriaStyles.metricItem(isLast)}
              {...(!isCoachWorkload ? {
                borderLeftWidth: 4,
                borderLeftColor: metric.colorToken,
              } : {})}
            >
              {/* Text Content */}
              <VStack {...graduationCriteriaStyles.metricTextContainer}>
                <Text
                  {...graduationCriteriaStyles.metricLabel}
                  color={metric.colorToken}
                >
                  {label}
                </Text>
                <Text
                  {...graduationCriteriaStyles.metricValue}
                  color={metric.colorToken}
                >
                  {value}
                </Text>
                <Text {...graduationCriteriaStyles.metricDescription}>
                  {description}
                </Text>
              </VStack>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default OverallProgramGraduationRateMetricCard;
