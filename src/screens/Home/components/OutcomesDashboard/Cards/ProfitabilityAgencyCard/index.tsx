import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { outcomesStyles } from '../../styles';
import { ParticipantOutcomes } from '@constants/DASHBOARD_LC';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import SimpleLineChart from '@components/charts/SimpleLineChart';

interface ProfitabilityAgencyCardProps {
  outcomesData: ParticipantOutcomes;
}

const ProfitabilityAgencyCard: React.FC<ProfitabilityAgencyCardProps> = ({
  outcomesData,
}) => {
  const { t } = useLanguage();

  return (
    <Box {...outcomesStyles.profitabilityAgencyCard}>
      <HStack {...outcomesStyles.cardRow}>
        {/* Business Profitability Box */}
        <Box {...outcomesStyles.profitabilityBox}>
          <VStack space="xs">
            <Text {...outcomesStyles.metricTitle}>
              {t('requestorDashboard.outcomes.profitabilityAgency.profitability.title')}
            </Text>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
              {t('requestorDashboard.outcomes.profitabilityAgency.profitability.description')}
            </Text>
             <Box {...outcomesStyles.chartContainer}>
              <SimpleLineChart
                data={outcomesData.profitabilityTrend}
                title=""
                height={280}
                color="#F59E0B"
                showGrid={true}
                showLegend={false}
                yAxisLabel="ZAR"
              />
            </Box>
          </VStack>
        </Box>

        {/* Sense of Agency Box */}
        <Box {...outcomesStyles.agencyBox}>
          <VStack space="xs" flex={1}>
            <HStack alignItems="center" space="xs">
              <LucideIcon name="Heart" size={20} color="$primary500" />
              <Text {...outcomesStyles.metricTitle}>
                {t('requestorDashboard.outcomes.senseOfAgency.title')}
              </Text>
            </HStack>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
              {t('requestorDashboard.outcomes.senseOfAgency.description')}
            </Text>
            
            <Box {...outcomesStyles.agencyContentCard}>
              <Box {...outcomesStyles.agencyIconContainer}>
                <LucideIcon name="CheckCircle2" size={32} color="$success600" />
              </Box>
              <Text {...TYPOGRAPHY.h3} color="$success800" fontWeight="$bold" textAlign="center">
                {outcomesData.agency.title}
              </Text>
              <Text {...TYPOGRAPHY.bodySmall} color="$success600" fontWeight="$medium" textAlign="center">
                {outcomesData.agency.subTitle}
              </Text>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default ProfitabilityAgencyCard;
