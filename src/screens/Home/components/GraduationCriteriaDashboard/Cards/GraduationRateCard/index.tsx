import React from 'react';
import { Box, HStack, VStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';
import { GRADUATION_RATE_DATA, GraduationRateData } from '@constants/DASHBOARD_LC';

interface Props {
  filters?: Record<string, string>;
}

const GraduationRateCard: React.FC<Props> = ({ filters }) => {
  const { t } = useLanguage();

  // In a real implementation, filters would select a different dataset.
  // Using static data that represents the default (all filters) view.
  const data: GraduationRateData = GRADUATION_RATE_DATA;

  return (
    <Box {...graduationCriteriaStyles.graduationRateCard}>
      {/* Header row: title + percentage */}
      <HStack {...graduationCriteriaStyles.rateCardHeader}>
        <Text {...graduationCriteriaStyles.rateCardTitle}>
          {t('requestorDashboard.graduationCriteria.rate.title')}
        </Text>
        <Text {...graduationCriteriaStyles.rateCardPercent}>
          {data.rate}%
        </Text>
      </HStack>

      {/* Subtitle */}
      <Text {...graduationCriteriaStyles.rateCardSubtitle}>
        {t('requestorDashboard.graduationCriteria.rate.subtitle', {
          graduated: data.graduated,
          total: data.totalActive,
        })}
      </Text>

      {/* Stacked segment bar */}
      <HStack {...graduationCriteriaStyles.segmentBar}>
        {data.segments.map((seg) => (
          <Box
            key={seg.labelKey}
            bg={seg.color as any}
            style={{ flex: seg.percent }}
            alignItems="center"
            justifyContent="center"
          >
            {seg.value > 0 && (
              <Text
                fontSize={12}
                fontWeight="$semibold"
                color="$white"
                selectable={false}
              >
                {seg.value}
              </Text>
            )}
          </Box>
        ))}
      </HStack>

      {/* Legend */}
      <HStack {...graduationCriteriaStyles.segmentLegendGrid}>
        {data.segments.map((seg) => (
          <HStack key={seg.labelKey} {...graduationCriteriaStyles.segmentLegendItem}>
            <Box
              width={8}
              height={8}
              borderRadius={999}
              bg={seg.color as any}
              mr="$1.5"
            />
            <VStack space="none">
              <Text fontSize={13} fontWeight="$semibold" color="$textForeground">
                {seg.value} ({seg.percent}%)
              </Text>
              <Text fontSize={11} color="$textMutedForeground">
                {t(seg.labelKey)}
              </Text>
            </VStack>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
};

export default GraduationRateCard;
