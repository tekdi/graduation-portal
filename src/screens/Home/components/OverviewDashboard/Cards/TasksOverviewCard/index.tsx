import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack } from '@ui';
import { LucideIcon } from '@ui';
import { tasksOverviewStyles } from './styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

interface TasksOverviewCardProps {
  totalTasks?: number;
  completedTasks?: number;
  recentActivity?: number;
}

const TasksOverviewCard: React.FC<TasksOverviewCardProps> = ({
  totalTasks = 1392,
  completedTasks = 806,
  recentActivity = 0,
}) => {
  const completionPercentage = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <Box {...tasksOverviewStyles.card}>
      <HStack {...tasksOverviewStyles.header}>
        <Box {...tasksOverviewStyles.iconContainer}>
          <LucideIcon name="Target" size={20} color="$primary500" />
        </Box>
        <Text {...tasksOverviewStyles.cardtitle} color="$textPrimary">
          Tasks Overview
        </Text>
      </HStack>

      <VStack {...tasksOverviewStyles.content}>
        <HStack {...tasksOverviewStyles.metricRow}>
          <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
            Total Tasks
          </Text>
          <Text {...TYPOGRAPHY.h4} color="$textPrimary">
            {totalTasks.toLocaleString()}
          </Text>
        </HStack>

        <VStack {...tasksOverviewStyles.progressSection}>
          <HStack {...tasksOverviewStyles.metricRow}>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
              Completed Tasks
            </Text>
            <Text {...TYPOGRAPHY.h4} color="$textPrimary">
              {completedTasks.toLocaleString()} / {totalTasks.toLocaleString()}
            </Text>
          </HStack>
          <Progress
            value={completionPercentage}
            w="$full"
            h="$1.5"
            bg="$progressBarBackground"
            {...tasksOverviewStyles.progressBar}
          >
            <ProgressFilledTrack bg="$blue500" />
          </Progress>
        </VStack>

        <HStack {...tasksOverviewStyles.metricRow}>
          <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
            Recent Activity (30 days)
          </Text>
          <Text {...TYPOGRAPHY.h4} color="$textPrimary">
            {recentActivity.toLocaleString()}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default TasksOverviewCard;
