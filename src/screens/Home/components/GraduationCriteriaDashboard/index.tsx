import React, { useState, useCallback } from 'react';
import { Box, HStack, VStack, Text, Pressable, LucideIcon } from '@ui';
import { graduationCriteriaStyles } from './styles';
import OverallProgramGraduationRate from './Cards/OverallProgramGraduationRate';
import OverallProgramGraduationRateMetricCard from './Cards/OverallProgramGraduationRateMetricCard';
import ReadinessStatusDistribution from './Cards/ReadinessStatusDistribution';
import ProgramExitDistribution from './Cards/ProgramExitDistribution';
import GraduationRateTimeline from './Cards/GraduationRateTimeline';
import GraduationRateCard from './Cards/GraduationRateCard';
import GraduationRateItems from './Cards/GraduationRateItems';
import GraduationIndicatorsCard from './Cards/GraduationIndicatorsCard';
import FilterButton from '@components/Filter';
import { GRADUATION_FILTERS } from '@constants/DASHBOARD_LC';
import { useLanguage } from '@contexts/LanguageContext';
import IndividualGraduationReadiness from './Cards/IndividualGraduationReadiness';
import GraduationCriteria from './Cards/GraduationCriteria';

const DEFAULT_FILTERS: Record<string, string> = {
  gender: 'all-genders',
  pathway: 'all-pathways',
  pillar: 'all-pillars',
};

interface GraduationCriteriaDashboardProps {
  selectedParticipant: string;
  onParticipantChange: (id: string) => void;
}

const GraduationCriteriaDashboard: React.FC<GraduationCriteriaDashboardProps> = ({
  selectedParticipant,
  onParticipantChange,
}) => {
  const { t } = useLanguage();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(DEFAULT_FILTERS);

  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    setActiveFilters(filters);
  }, []);

  const handleReset = useCallback(() => {
    setActiveFilters(DEFAULT_FILTERS);
  }, []);

  const resetButton = (
    <Pressable onPress={handleReset}>
      <HStack
        alignItems="center"
        space="xs"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$md"
        px="$3"
        py="$1.5"
        bg="$white"
      >
        <LucideIcon name="Filter" size={14} color="$textMutedForeground" />
        <Text fontSize={14} color="$textMutedForeground" fontWeight="$medium">
          {t('requestorDashboard.graduationCriteria.filters.reset')}
        </Text>
      </HStack>
    </Pressable>
  );

  return (
    <VStack {...graduationCriteriaStyles.container}>
      {/* Row 1: Overall Program Graduation Rate header card */}
      <OverallProgramGraduationRate />

      {/* Row 2: Graduation Metrics (4 metric boxes) */}
      <OverallProgramGraduationRateMetricCard />

      {/* Row 3: Readiness Status Distribution + Program Exit Distribution (side-by-side) */}
      <HStack {...graduationCriteriaStyles.distributionCardsRow}>
        <ReadinessStatusDistribution />
        <ProgramExitDistribution />
      </HStack>

      {/* Row 4: Graduation Rate Timeline (full-width) */}
      <GraduationRateTimeline />

      {/* Row 5: Transparent filter bar — All Genders / All Pathways / All Pillars + Reset */}
      <Box {...graduationCriteriaStyles.graduationFilters}>
        <HStack alignItems="center" width="$full" space="sm">
          <Box flex={1}>
            <FilterButton
              data={GRADUATION_FILTERS}
              hideTitleHeader={true}
              showClearButton={false}
              onFilterChange={handleFilterChange}
              _container={{
                mt: 0,
                p: 0,
                borderWidth: 0,
                bg: 'transparent',
                shadowOpacity: 0,
                elevation: 0,
                borderRadius: 0,
              }}
              _input={{
                bg: '$white',
              }}
            />
          </Box>
          {resetButton}
        </HStack>
      </Box>

      {/* Row 6a: Graduation Rate Items (7 metrics cards in a row) */}
      <GraduationRateItems />

      {/* Row 6b: Graduation Rate card */}
      <GraduationRateCard filters={activeFilters} />

      {/* Row 7: Graduation Indicators (12 indicators, 2-column grid) */}
      <GraduationIndicatorsCard filters={activeFilters} />

      {/* Row 8: Individual Graduation Readiness Section (Header + Participant Selector + Selected Card) */}
      <IndividualGraduationReadiness
        selectedParticipant={selectedParticipant}
        onParticipantChange={onParticipantChange}
      />

      {/* Row 9: Graduation Criteria Checklist Grid (Summary counts card + 4 categories checklist cards) */}
      <GraduationCriteria selectedParticipant={selectedParticipant} />
    </VStack>
  );
};

export default GraduationCriteriaDashboard;
