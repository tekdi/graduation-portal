import React from 'react';
import { Box, HStack, Text, VStack, Progress, ProgressFilledTrack } from '@ui';
import { Participant, StatusType } from '@app-types/screens';
import { ColumnDef } from '@app-types/components';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { STATUS, PARTICIPANT_COLUMN_KEYS } from '@constants/app.constant';
import { LucideIcon } from '@ui/index';
import { useLanguage } from '@contexts/LanguageContext';
import { usePlatform } from '@utils/platform';
import { StatusBadge } from './StatusBadge';

/**
 * Progress Bar Component for Participants Table
 * Desktop: Horizontal layout with bar and percentage side by side
 * Mobile: Label and percentage on top row, progress bar below
 */
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const { isMobile } = usePlatform();
  const { t } = useLanguage();

  if (isMobile) {
    // Mobile layout: Label left, percentage right, bar below
    return (
      <VStack space="xs" width="$full" marginTop="$3">
        <HStack justifyContent="space-between" alignItems="center" width="$full">
          <Text
            {...TYPOGRAPHY.label}
            color={theme.tokens.colors.mutedForeground}
            fontSize="$xs"
          >
            {t('participants.overallProgress')}
          </Text>
          <Text
            {...TYPOGRAPHY.bodySmall}
            color={theme.tokens.colors.mutedForeground}
          >
            {progress}%
          </Text>
        </HStack>
        <Progress value={progress} width="$full" size="sm" bg="$progressBarBackground">
          <ProgressFilledTrack bg="$progressBarFillColor" />
        </Progress>
      </VStack>
    );
  }

  // Desktop layout: Bar and percentage side by side
  return (
    <HStack space="sm" alignItems="center" width="$full" maxWidth={200}>
      <Progress value={progress} flex={1} size="sm" bg="$progressBarBackground">
        <ProgressFilledTrack bg="$progressBarFillColor" />
      </Progress>
      <Text
        {...TYPOGRAPHY.bodySmall}
        color={theme.tokens.colors.mutedForeground}
        minWidth={40}
      >
        {progress}%
      </Text>
    </HStack>
  );
};


/**
 * Ready to Graduate Component
 * Shows "Ready to Graduate" text with warning icon
 */
const ReadyToGraduate: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <HStack space="sm" alignItems="center" justifyContent="space-between" marginTop="$3" $md-marginTop="$0">
      <Text
        {...TYPOGRAPHY.bodySmall}
        color={theme.tokens.colors.mutedForeground}
      >
        {t('participants.graduated')}
      </Text>
      <LucideIcon
        name="AlertCircle"
        size={20}
        color={theme.tokens.colors.warning500}
      />
    </HStack>
  );
};

/**
 * All possible columns for Participants Table
 */
const allParticipantsColumns: ColumnDef<Participant>[] = [
  {
    key: 'name',
    label: 'participants.name',
    flex: 2,
    render: participant => (
      <Text {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground} lineHeight="$sm">
        {participant.name} 
      </Text>
    ),
    mobileConfig: {
      leftRank: 1, // Top left position
      showLabel: false, // Hide label on mobile
    },
  },
  {
    key: 'status',
    label: 'participants.status',
    flex: 1.5,
    render: participant => <StatusBadge status={participant.status} />,
    desktopConfig: {
      showColumn: false, // Hide status column on desktop
    },
    mobileConfig: {
      rightRank: 1, // Top right position (paired with name)
      showColumn: true, // Show on mobile
      showLabel: false, // Hide label on mobile
    },
  },
  {
    key: 'id',
    label: 'participants.participantID',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
        fontSize="$sm"
      >
        {participant.id}
      </Text>
    ),
    mobileConfig: {
      leftRank: 2, // Below name
      showLabel: false, // Hide label on mobile
    },
  },
  {
    key: 'phone',
    label: 'participants.contact',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.bodySmall}
        color={theme.tokens.colors.mutedForeground}
        fontSize="$sm" 
        marginTop="$3" $md-marginTop="$0"
      >
        {participant.phone}
      </Text>
    ),
    mobileConfig: {
      leftRank: 3, // Below ID
      showLabel: false, // Hide label on mobile
    },
  },
  {
    key: 'progress',
    label: 'participants.overallProgress',
    flex: 2,
    render: participant => <ProgressBar progress={participant.progress} />,
    mobileConfig: {
      fullWidthRank: 1, // Full width progress bar
      showLabel: false, // Label is rendered inside ProgressBar component
    },
  },
  {
    key: 'graduated',
    label: 'participants.graduated',
    flex: 2,
    render: participant =>
      participant.progress === 100 ? (
        <ReadyToGraduate />
      ) : (
        '-'
      ),
    mobileConfig: {
      fullWidthRank: 2, // Full width, appears after progress
      showLabel: false, // Text is rendered inside the component
    },
  },
];

export const getParticipantsColumns = (
  status?: StatusType,
): ColumnDef<Participant>[] => {
  return allParticipantsColumns.filter(col => {
    if(([PARTICIPANT_COLUMN_KEYS.PROGRESS] as string[]).includes(col.key)) {
      if(status === STATUS.IN_PROGRESS) {return true} else {return false}
    }
    if(([PARTICIPANT_COLUMN_KEYS.GRADUATED] as string[]).includes(col.key)) {
      if(status === STATUS.COMPLETED) {return true} else {return false}
    }
    return true; // keep all other columns for any status
  });
};

/**
 * Default column configuration (for backward compatibility)
 * Shows all columns including progress
 */
export const participantsColumns = allParticipantsColumns;

