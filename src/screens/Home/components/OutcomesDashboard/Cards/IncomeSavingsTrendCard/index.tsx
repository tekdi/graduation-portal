import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { outcomesStyles } from '../../styles';
import { ParticipantOutcomes } from '@constants/DASHBOARD_LC';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import SimpleLineChart from '@components/charts/SimpleLineChart';

interface IncomeSavingsTrendCardProps {
  outcomesData: ParticipantOutcomes;
}

const IncomeSavingsTrendCard: React.FC<IncomeSavingsTrendCardProps> = ({
  outcomesData,
}) => {
  const { t } = useLanguage();

  return (
    <Box {...outcomesStyles.incomeSavingsCard}>
      <HStack {...outcomesStyles.cardRow}>
        {/* Income Trend Box */}
        <Box {...outcomesStyles.incomeTrendBox}>
          <VStack space="xs">
            <Text {...outcomesStyles.metricTitle}>
              {t('requestorDashboard.outcomes.incomeSavings.incomeTrend.title')}
            </Text>
            <Text {...outcomesStyles.metricsubtitle1}>
              {t('requestorDashboard.outcomes.incomeSavings.incomeTrend.description')}
            </Text>
            <Box {...outcomesStyles.chartContainer}>
              <SimpleLineChart
                data={outcomesData.incomeTrend}
                title=""
                height={280}
                color="#3B82F6"
                showGrid={true}
                showLegend={false}
                yAxisLabel="ZAR"
              />
            </Box>
          </VStack>
        </Box>

        {/* Savings Trend Box */}
        <Box {...outcomesStyles.savingsTrendBox}>
          <VStack space="xs">
            <Text {...outcomesStyles.metricTitle}>
              {t('requestorDashboard.outcomes.incomeSavings.savingsTrend.title')}
            </Text>
            <Text {...outcomesStyles.metricsubtitle1}>
              {t('requestorDashboard.outcomes.incomeSavings.savingsTrend.description')}
            </Text>
            <Box {...outcomesStyles.chartContainer}>
              <SimpleLineChart
                data={outcomesData.savingsTrend}
                title=""
                height={280}
                color="#10B981"
                showGrid={true}
                showLegend={false}
                yAxisLabel="ZAR"
              />
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default IncomeSavingsTrendCard;
