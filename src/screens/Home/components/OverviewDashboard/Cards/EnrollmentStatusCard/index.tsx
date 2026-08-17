import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack } from '@ui';
import { LucideIcon } from '@ui';
import { enrollmentStatusStyles } from './styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

interface EnrollmentStatus {
  label: string;
  count: number;
  percentage: number;
}

interface EnrollmentStatusCardProps {
  statuses?: EnrollmentStatus[];
}

const EnrollmentStatusCard: React.FC<EnrollmentStatusCardProps> = ({
  statuses = [
    { label: 'Not Enrolled', count: 4, percentage: 14 },
    { label: 'Onboarded', count: 2, percentage: 7 },
    { label: 'In Progress', count: 15, percentage: 54 },
    { label: 'Completed', count: 7, percentage: 25 },
  ],
}) => {
  return (
    <Box {...enrollmentStatusStyles.card}>
      <HStack {...enrollmentStatusStyles.header}>
        <Box {...enrollmentStatusStyles.iconContainer}>
          <LucideIcon name="User" size={20} color="$primary500" />
        </Box>
        <Text {...enrollmentStatusStyles.cardtitle} color="$textPrimary">
          Enrollment Status
        </Text>
      </HStack>

      <VStack {...enrollmentStatusStyles.content}>
        {statuses.map((status, index) => (
          <VStack key={index} {...enrollmentStatusStyles.statusItem}>
            <HStack {...enrollmentStatusStyles.statusRow}>
              <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
                {status.label}
              </Text>
              <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                {status.count}
              </Text>
            </HStack>
            <Progress
              value={status.percentage}
              w="$full"
              h="$1.5"
              bg="$progressBarBackground"
              {...enrollmentStatusStyles.progressBar}
            >
              <ProgressFilledTrack bg="$blue500" />
            </Progress>
          </VStack>
        ))}
      </VStack>
    </Box>
  );
};

export default EnrollmentStatusCard;
