import React from 'react';
import { VStack, HStack, Text, Box, Progress, ProgressFilledTrack } from '@ui';
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

  // Return null if status is invalid or not provided
  if (!status || !['in_progress', 'completed', 'dropout'].includes(status)) {
    return null;
  }

  const progress = graduationProgress ?? 0;
  const date = graduationDate;
  // Dropout: Return warning content directly
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

  // In-progress or Completed: Return main card with title and content
  // Note: Since dropout is handled above with early return, status here is always 'in_progress' or 'completed'
  return (
    <Box
      {...getStatusCard(status as 'in_progress' | 'completed')}
      // @ts-ignore - Web-specific props not in Gluestack UI types
      $web-boxShadow={participantHeaderStyles.statusCardBoxShadow}
      $web-backgroundImage={participantHeaderStyles.statusCardBackgroundImage}
    >
      {/* Title: Conditionally render based on status */}
      <Text
        {...(status === 'in_progress'
          ? participantHeaderStyles.progressCardTitle
          : participantHeaderStyles.completedCardTitle)}
      >
        {t(
          status === 'in_progress'
            ? 'participantDetail.header.graduationReadiness'
            : 'participantDetail.header.programStatus'
        )}
      </Text>
      
      {/* Content: Conditionally render based on status */}
      {status === 'in_progress' ? (
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
            <Progress
              value={progress}
              {...participantHeaderStyles.progressBarBackground}
            >
              <ProgressFilledTrack {...participantHeaderStyles.progressBarFill} />
            </Progress>
          </Box>
        </VStack>
      ) : (
        <HStack {...participantHeaderStyles.completedCardContent}>
          <VStack flex={1} space="xs">
            <Text {...participantHeaderStyles.completedStatus}>
              {t('participantDetail.header.graduatedComplete')}
            </Text>
            <Text {...participantHeaderStyles.completedDate}>
            {date 
              ? t('participantDetail.header.graduatedOn', { date })
              : t('participantDetail.header.graduationDateNotAvailable')}
            </Text>
          </VStack>
          <LucideIcon name="CircleCheck" size={50} color={theme.tokens.colors.accent300} />
        </HStack>
      )}
    </Box>
  );
};

export default ParticipantProgressCard;

