import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { outcomesStyles } from '../../styles';
import { ParticipantOutcomes } from '@constants/DASHBOARD_LC';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import SimpleLineChart from '@components/charts/SimpleLineChart';

interface IncomeSelfEfficacyCardProps {
  outcomesData: ParticipantOutcomes;
}

const sourceColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

const IncomeSelfEfficacyCard: React.FC<IncomeSelfEfficacyCardProps> = ({
  outcomesData,
}) => {
  const { t } = useLanguage();

  return (
    <Box {...outcomesStyles.incomeSelfEfficacyCard}>
      <HStack {...outcomesStyles.cardRow}>
        {/* Income Sources Box */}
        <Box {...outcomesStyles.incomeSourcesBox}>
          <VStack space="xs" flex={1}>
            <Text {...outcomesStyles.metricTitle}>
              {t('requestorDashboard.outcomes.incomeSelfEfficacy.incomeSources.title')}
            </Text>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary" mb="$4">
              {t('requestorDashboard.outcomes.incomeSelfEfficacy.incomeSources.description')}
            </Text>
            
            <VStack space="sm" flex={1} justifyContent="center">
              {outcomesData.incomeSources.map((src, index) => (
                <VStack key={src.source} {...outcomesStyles.sourceProgressBarContainer}>
                  <HStack {...outcomesStyles.sourceRow}>
                    <Text {...TYPOGRAPHY.bodySmall} color="$textPrimary" fontWeight="$medium">
                      {src.source}
                    </Text>
                    <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary" fontWeight="$semibold">
                      {src.amount} ({src.percent}%)
                    </Text>
                  </HStack>
                  <Progress
                    value={src.percent}
                    w="$full"
                    h="$2"
                    bg="$progressBarBackground"
                    borderRadius="$full"
                    mt="$1"
                  >
                    <ProgressFilledTrack style={{ backgroundColor: sourceColors[index % sourceColors.length] }} />
                  </Progress>
                </VStack>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* Self-Efficacy Box */}
        <Box {...outcomesStyles.selfEfficacyBox}>
          <VStack space="xs">
            <Text {...outcomesStyles.metricTitle}>
              {t('requestorDashboard.outcomes.incomeSelfEfficacy.selfEfficacy.title')}
            </Text>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
              {t('requestorDashboard.outcomes.incomeSelfEfficacy.selfEfficacy.description')}
            </Text>
            <Box {...outcomesStyles.chartContainer}>
              <SimpleLineChart
                data={outcomesData.selfEfficacyTrend}
                title=""
                height={280}
                color="#8B5CF6"
                showGrid={true}
                showLegend={false}
                yAxisLabel="Score"
                yMin={0}
                yMax={100}
              />
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default IncomeSelfEfficacyCard;
