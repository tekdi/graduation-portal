import React from 'react';
import { Box, HStack, VStack, Text, Progress, ProgressFilledTrack } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';
import { GRADUATION_INDICATORS, GraduationIndicator } from '@constants/DASHBOARD_LC';

interface Props {
  filters?: Record<string, string>;
}

const STATUS_ROWS = [
  { key: 'achieved' as const, labelKey: 'requestorDashboard.graduationCriteria.indicators.achieved', color: '#22C55E', icon: 'CheckCircle' },
  { key: 'onTrack' as const,  labelKey: 'requestorDashboard.graduationCriteria.indicators.onTrack',  color: '#F59E0B', icon: 'CheckCircle' },
  { key: 'atRisk' as const,   labelKey: 'requestorDashboard.graduationCriteria.indicators.atRisk',   color: '#EF4444', icon: 'AlertCircle' },
];

const IndicatorCard: React.FC<{ indicator: GraduationIndicator }> = ({ indicator }) => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.indicatorCard}>
      {/* Header */}
      <HStack alignItems="flex-start">
        <Box {...graduationCriteriaStyles.indicatorIconBox}>
          <LucideIcon name={indicator.icon as any} size={18} color="$primary500" />
        </Box>
        <VStack space="none" flex={1}>
          <Text fontSize={14} fontWeight="$semibold" color="$textForeground" flexWrap="wrap">
            {t(indicator.titleKey)}
          </Text>
          <Text fontSize={12} color="$textMutedForeground">
            {t(indicator.categoryKey)}
          </Text>
          {indicator.note ? (
            <Text fontSize={11} color="$textMutedForeground" fontStyle="italic">
              {indicator.note}
            </Text>
          ) : null}
        </VStack>
      </HStack>

      {/* Progress rows */}
      {STATUS_ROWS.map((status) => {
        const stat = indicator[status.key];
        return (
          <Box key={status.key}>
            <HStack {...graduationCriteriaStyles.indicatorProgressRow}>
              <HStack {...graduationCriteriaStyles.indicatorProgressLabel} alignItems="center" space="xs">
                <LucideIcon name={status.icon} size={14} color={status.color as any} />
                <Text fontSize={13} color={status.color as any} fontWeight="$medium">
                  {t(status.labelKey)}
                </Text>
              </HStack>
              <Text fontSize={13} fontWeight="$semibold" color={status.color as any}>
                {stat.value} ({stat.percent}%)
              </Text>
            </HStack>
            <Progress
              value={stat.percent}
              w="$full"
              h="$1.5"
              bg="$backgroundLight100"
              borderRadius="$full"
              mt="$0.5"
            >
              <ProgressFilledTrack bg={status.color as any} borderRadius="$full" />
            </Progress>
          </Box>
        );
      })}
    </Box>
  );
};

const GraduationIndicatorsCard: React.FC<Props> = ({ filters }) => {
  const { t } = useLanguage();
  const indicators = GRADUATION_INDICATORS;

  return (
    <VStack space="sm" width="$full">
      <Text {...graduationCriteriaStyles.indicatorsSectionTitle}>
        {t('requestorDashboard.graduationCriteria.indicatorsTitle')}
      </Text>
      <HStack {...graduationCriteriaStyles.indicatorsGrid}>
        {indicators.map((ind) => (
          <IndicatorCard key={ind.key} indicator={ind} />
        ))}
      </HStack>
    </VStack>
  );
};

export default GraduationIndicatorsCard;
