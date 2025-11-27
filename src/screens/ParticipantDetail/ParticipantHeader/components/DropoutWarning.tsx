import React from 'react';
import { VStack, HStack, Text, Box } from '@ui';
import { participantHeaderStyles } from '../Styles';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * DropoutWarning Component
 * Shows warning message box for dropout participants.
 */
const DropoutWarning: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...participantHeaderStyles.dropoutWarningBox}>
      <HStack {...participantHeaderStyles.dropoutWarningContent}>
        <Box {...participantHeaderStyles.dropoutWarningIcon}>
          <Text {...participantHeaderStyles.dropoutWarningIconText}>×</Text>
        </Box>
        <VStack {...participantHeaderStyles.dropoutWarningTextContainer}>
          <Text {...participantHeaderStyles.dropoutWarningTitle}>
            {t('participantDetail.header.participantDroppedOut')}
          </Text>
          <Text {...participantHeaderStyles.dropoutWarningMessage}>
            {t('participantDetail.header.dropoutWarning')}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default DropoutWarning;

