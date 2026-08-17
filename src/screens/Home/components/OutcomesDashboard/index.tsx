import React from 'react';
import { Box, VStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { outcomesStyles } from './styles';
import { getParticipantOutcomes } from '@constants/DASHBOARD_LC';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

// Import Custom ParticipantSelector
import ParticipantSelector from './ParticipantSelector';

// Import Cards
import ParticipantStatusMetricCard from './Cards/ParticipantStatusMetricCard';
import IncomeSavingsTrendCard from './Cards/IncomeSavingsTrendCard';
import IncomeSelfEfficacyCard from './Cards/IncomeSelfEfficacyCard';
import ProfitabilityAgencyCard from './Cards/ProfitabilityAgencyCard';

interface OutcomesDashboardProps {
  selectedParticipant: string;
  onParticipantChange: (id: string) => void;
}

const OutcomesDashboard: React.FC<OutcomesDashboardProps> = ({
  selectedParticipant,
  onParticipantChange,
}) => {
  const { t } = useLanguage();

  // Get dynamic outcomes data if a participant is selected
  const outcomesData = selectedParticipant ? getParticipantOutcomes(selectedParticipant) : null;

  return (
    <VStack {...outcomesStyles.cardsContainer}>
      {/* Participant Selector */}
      <ParticipantSelector
        selectedParticipant={selectedParticipant}
        onParticipantChange={onParticipantChange}
      />

      {/* Conditionally render stacked cards or empty state */}
      {!outcomesData ? (
        <Box {...outcomesStyles.emptyStateContainer}>
          {/* <LucideIcon name="UserCheck" size={24} color="$textMutedForeground" /> */}
          <Text {...outcomesStyles.emptyStateText} textAlign="center" >
            {t('requestorDashboard.outcomes.selectParticipantMessage')}
          </Text>
        </Box>
      ) : (
        <>
          {/* 1. Participant Status Card */}
          <ParticipantStatusMetricCard outcomesData={outcomesData} />

          {/* 2. Income & Savings Trend Card */}
          <IncomeSavingsTrendCard outcomesData={outcomesData} />

          {/* 3. Income & Self-Efficacy Card */}
          <IncomeSelfEfficacyCard outcomesData={outcomesData} />

          {/* 4. Profitability & Agency Card */}
          <ProfitabilityAgencyCard outcomesData={outcomesData} />
        </>
      )}
    </VStack>
  );
};

export default OutcomesDashboard;
