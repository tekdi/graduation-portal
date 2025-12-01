import React from 'react';
import { VStack, HStack, Text, Box } from '@ui';
import { participantHeaderStyles, getStatusCard } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import type { ParticipantStatus } from '@app-types/participant';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';

interface ParticipantProgressCardProps {
  status?: ParticipantStatus;
  graduationProgress?: number;
  graduationDate?: string;
}

/**
 * ParticipantProgressCard Component
 * Unified component that displays status-specific content based on participant status:
 * - In Progress: Shows graduation readiness progress
 * - Completed: Shows graduation completion status with date
 * - Dropout: Shows dropout warning message
 */
const ParticipantProgressCard: React.FC<ParticipantProgressCardProps> = ({
  status,
  graduationProgress,
  graduationDate,
}) => {
  const { t } = useLanguage();

  // In Progress: Graduation Readiness Card
  if (status === 'in-progress') {
    const progress = graduationProgress ?? 57;
    return (
      <Box
        {...getStatusCard('in-progress')}
        // @ts-ignore - Web-specific props not in Gluestack UI types
        $web-boxShadow={participantHeaderStyles.statusCardBoxShadow}
        $web-backgroundImage={participantHeaderStyles.statusCardBackgroundImage}
      >
        <Text {...participantHeaderStyles.progressCardTitle}>
          {t('participantDetail.header.graduationReadiness')}
        </Text>
        <VStack
          {...participantHeaderStyles.progressCardContent}
          $md-flexDirection="row"
          $md-justifyContent="space-between"
          $md-alignItems="center"
          space="sm"
        >
          <Text {...participantHeaderStyles.progressPercentage}>
            {progress}%
          </Text>
          <Box
            {...participantHeaderStyles.progressBarContainer}
            $md-width="auto"
          >
            <Box {...participantHeaderStyles.progressBarBackground}>
              <Box
                {...participantHeaderStyles.progressBarFill}
                width={`${progress}%`}
              />
            </Box>
          </Box>
        </VStack>
      </Box>
    );
  }

  // Completed: Graduation Status Card
  if (status === 'completed') {
    const date = graduationDate ?? '2025-09-20';
    return (
      <Box
        {...getStatusCard('completed')}
        // @ts-ignore - Web-specific props not in Gluestack UI types
        $web-boxShadow={participantHeaderStyles.statusCardBoxShadow}
        $web-backgroundImage={participantHeaderStyles.statusCardBackgroundImage}
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
            <LucideIcon name="CircleCheck" size={50} color={theme.tokens.colors.accent300} />
          </HStack>
        </VStack>
      </Box>
    );
  }

  // Dropout: Warning Box
  if (status === 'dropout') {
    return (
      <Box {...getStatusCard('dropout')}>
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
  }

  // No status-specific content to display
  return null;
};

export default ParticipantProgressCard;

