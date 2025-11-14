import React from 'react';
import { Box, HStack, Text } from '@gluestack-ui/themed';
import { Participant, ParticipantStatus } from '@app-types/screens';
import { ColumnDef } from '@app-types/components';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

/**
 * Progress Bar Component for Participants Table
 */
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <HStack space="sm" alignItems="center" width="$full" maxWidth={200}>
    <Box
      flex={1}
      height={8}
      bg="$backgroundLight200"
      borderRadius="$full"
      overflow="hidden"
    >
      <Box
        width={`${progress}%`}
        height="$full"
        bg={theme.tokens.colors.info100}
        borderRadius="$full"
      />
    </Box>
    <Text
      {...TYPOGRAPHY.bodySmall}
      color={theme.tokens.colors.mutedForeground}
      minWidth={40}
    >
      {progress}%
    </Text>
  </HStack>
);

/**
 * All possible columns for Participants Table
 */
const allParticipantsColumns: ColumnDef<Participant>[] = [
  {
    key: 'name',
    label: 'participants.name',
    flex: 2,
    render: participant => (
      <Text {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground}>
        {participant.name}
      </Text>
    ),
  },
  {
    key: 'id',
    label: 'participants.participantID',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {participant.id}
      </Text>
    ),
  },
  {
    key: 'progress',
    label: 'participants.overallProgress',
    flex: 2,
    render: participant => <ProgressBar progress={participant.progress} />,
  },
  {
    key: 'phone',
    label: 'participants.contact',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.bodySmall}
        color={theme.tokens.colors.mutedForeground}
      >
        {participant.phone}
      </Text>
    ),
  },
];

/**
 * Get filtered columns based on participant status
 * Progress column is only shown when status is 'in_progress'
 */
export const getParticipantsColumns = (
  status?: ParticipantStatus | '',
): ColumnDef<Participant>[] => {
  // Show progress column only when status is 'in_progress'
  if (status === 'in_progress') {
    return allParticipantsColumns;
  }

  // Filter out the progress column for other statuses
  return allParticipantsColumns.filter(col => col.key !== 'progress');
};

/**
 * Default column configuration (for backward compatibility)
 * Shows all columns including progress
 */
export const participantsColumns = allParticipantsColumns;
