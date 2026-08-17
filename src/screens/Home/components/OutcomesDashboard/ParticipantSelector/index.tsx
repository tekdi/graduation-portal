import React from 'react';
import { Box, HStack, Text, Select } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { outcomesStyles } from '../styles';
import { PARTICIPANTS_DATA } from '@constants/PARTICIPANTS_LIST';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

interface ParticipantSelectorProps {
  selectedParticipant: string;
  onParticipantChange: (id: string) => void;
  label?: string;
}

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  selectedParticipant,
  onParticipantChange,
  label,
}) => {
  const { t } = useLanguage();

  // Create option list containing only Name and Status next to each other
  const options = PARTICIPANTS_DATA.map((p) => ({
    value: p.id,
    name: p.name,
    status: p.status,
  }));

  return (
    <Box {...outcomesStyles.participantSelector}>
      <HStack {...outcomesStyles.selectorRow}>
        <Text {...outcomesStyles.titletextselector}>
          {label ?? t('requestorDashboard.outcomes.title')}
        </Text>
        <Box style={{ width: 280 } as any}>
          <Select
            options={options}
            value={selectedParticipant}
            onChange={(val: string) => onParticipantChange(val)}
            placeholder={t('requestorDashboard.outcomes.participantPlaceholder')}
            showSearch={true}
            searchPlaceholder={t('requestorDashboard.outcomes.searchPlaceholder')}
          />
        </Box>
      </HStack>
    </Box>
  );
};

export default ParticipantSelector;
