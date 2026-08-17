import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';
import { GRADUATION_CRITERIA_CATEGORIES, getParticipantGraduationCriteria } from '@constants/DASHBOARD_LC';
import CategoryCard from './CategoryCard';

interface GraduationCriteriaProps {
  selectedParticipant: string;
}

const GraduationCriteria: React.FC<GraduationCriteriaProps> = ({ selectedParticipant }) => {
  const { t } = useLanguage();

  if (!selectedParticipant) return null;

  const statuses = getParticipantGraduationCriteria(selectedParticipant);

  // Calculate overall totals
  const achievedTotal = Object.values(statuses).filter((s) => s === 'Achieved').length;
  const onTrackTotal = Object.values(statuses).filter((s) => s === 'On Track').length;
  const atRiskTotal = Object.values(statuses).filter((s) => s === 'At Risk').length;

  return (
    <VStack space="md" width="$full">
      {/* 1. Main Graduation Criteria summary card */}
      <Box {...graduationCriteriaStyles.checklistCard}>
        <VStack>
          {/* Header */}
          <VStack {...graduationCriteriaStyles.checklistHeader}>
            <Text {...graduationCriteriaStyles.checklistTitle}>
              {t('requestorDashboard.graduationCriteria.checklist.title')}
            </Text>
            <Text {...graduationCriteriaStyles.checklistSubtitle}>
              {t('requestorDashboard.graduationCriteria.checklist.subtitle')}
            </Text>
          </VStack>

          {/* Summary counts grid */}
          <HStack {...graduationCriteriaStyles.summaryGrid}>
            <Box {...graduationCriteriaStyles.summaryBox('Achieved')}>
              <Text {...graduationCriteriaStyles.summaryValue('Achieved')}>{achievedTotal}</Text>
              <Text {...graduationCriteriaStyles.summaryLabel('Achieved')}>
                {t('requestorDashboard.graduationCriteria.indicators.achieved')}
              </Text>
            </Box>
            <Box {...graduationCriteriaStyles.summaryBox('On Track')}>
              <Text {...graduationCriteriaStyles.summaryValue('On Track')}>{onTrackTotal}</Text>
              <Text {...graduationCriteriaStyles.summaryLabel('On Track')}>
                {t('requestorDashboard.graduationCriteria.indicators.onTrack')}
              </Text>
            </Box>
            <Box {...graduationCriteriaStyles.summaryBox('At Risk')}>
              <Text {...graduationCriteriaStyles.summaryValue('At Risk')}>{atRiskTotal}</Text>
              <Text {...graduationCriteriaStyles.summaryLabel('At Risk')}>
                {t('requestorDashboard.graduationCriteria.indicators.atRisk')}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>

      {/* 2. Category Cards listed one below another */}
      <VStack space="md" width="$full">
        {GRADUATION_CRITERIA_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            category={category}
            statuses={statuses}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default GraduationCriteria;
