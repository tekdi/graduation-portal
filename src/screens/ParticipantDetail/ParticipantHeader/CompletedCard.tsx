import React from 'react';
import { VStack, HStack, Text, Box } from '@ui';
import { participantHeaderStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

interface CompletedCardProps {
  graduationDate?: string;
}

/**
 * CompletedCard Component
 * Shows graduation completion status with date and checkmark icon.
 */
const CompletedCard: React.FC<CompletedCardProps> = ({ graduationDate }) => {
  const { t } = useLanguage();
  const date = graduationDate ?? '2025-09-20';

  return (
    <Box
      {...participantHeaderStyles.completedCard}
      // @ts-ignore - Web-specific props not in Gluestack UI types
      $web-boxShadow={participantHeaderStyles.completedCardBoxShadow}
      $web-backgroundImage={participantHeaderStyles.completedCardBackgroundImage}
    >
      <VStack space="sm">
        <Text {...participantHeaderStyles.completedCardTitle}>
          {t('participantDetail.header.programStatus')}
        </Text>
        <HStack {...participantHeaderStyles.completedCardContent}>
          <VStack flex={1} space="xs">
            <Text {...participantHeaderStyles.completedStatus}>
              {t('participantDetail.header.graduatedComplete')}
            </Text>
            <Text {...participantHeaderStyles.completedDate}>
              {t('participantDetail.header.graduatedOn', { date })}
            </Text>
          </VStack>
          <Box {...participantHeaderStyles.completedCheckmark}>
            <Text {...participantHeaderStyles.completedCheckmarkText}>✓</Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CompletedCard;

