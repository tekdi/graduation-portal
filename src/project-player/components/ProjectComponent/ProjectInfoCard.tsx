import React from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Progress,
  ProgressFilledTrack,
} from '@gluestack-ui/themed';
import { ProjectInfoCardProps } from '../../types/components.types';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useProjectContext } from '../../context/ProjectContext';
import { useLanguage } from '@contexts/LanguageContext';

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  const { mode } = useProjectContext();
  const { t } = useLanguage();

  const completedTasks =
    project.tasks?.filter(task => task.status === 'completed').length || 0;
  const totalTasks = project.tasks?.length || 0;

  // Check if any task is a project type (has children)
  const hasChildren =
    project.tasks?.some(
      task =>
        task.type === 'project' && task.children && task.children.length > 0,
    ) || false;

  // Count total pillars (project type tasks)
  const totalPillars =
    project.tasks?.filter(task => task.type === 'project').length || 0;

  // Count total child tasks across all pillars
  const totalChildTasks =
    project.tasks?.reduce((acc, task) => {
      if (task.type === 'project' && task.children) {
        return acc + task.children.length;
      }
      return acc;
    }, 0) || 0;

  const isPreview = mode === 'preview';
  const isEditOrReadOnly = mode === 'edit' || mode === 'read-only';

  // Calculate progress percentage
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box bg={theme.tokens.colors.backgroundPrimary.light} padding="$6">
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
      >
        {/* LEFT SIDE — Project Title + Description */}
        <VStack space="md" flex={1}>
          {/* Project Title */}
          <Text {...TYPOGRAPHY.h3} color={theme.tokens.colors.textPrimary}>
            {project.name}
          </Text>

          {/* Project Description */}
          {project.description && (
            <Text
              {...TYPOGRAPHY.paragraph}
              color={theme.tokens.colors.textSecondary}
              lineHeight="$lg"
            >
              {project.description}
            </Text>
          )}
        </VStack>

        {/* RIGHT SIDE — Conditional rendering based on mode and hasChildren */}
        {!hasChildren && isEditOrReadOnly && (
          // No children + Edit/Read-only: Show steps complete badge
          <Box
            bg={theme.tokens.colors.mutedForeground}
            borderRadius="$full"
            paddingHorizontal="$4"
            paddingVertical="$2"
            shadowColor="$backgroundLight900"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.1}
            shadowRadius={2}
            elevation={2}
            marginLeft="$4"
          >
            <HStack space="xs" alignItems="center">
              <Text
                {...TYPOGRAPHY.caption}
                color={theme.tokens.colors.backgroundPrimary.light}
                fontWeight="$semibold"
              >
                {completedTasks} of {totalTasks} Steps Complete
              </Text>
            </HStack>
          </Box>
        )}

        {!hasChildren && isPreview && (
          // No children + Preview: Show task count
          <Box>
            <Text
              {...TYPOGRAPHY.caption}
              color={theme.tokens.colors.primary500}
            >
              {totalTasks} {t('projectPlayer.tasks')}
            </Text>
          </Box>
        )}

        {hasChildren && isEditOrReadOnly && (
          // Has children + Edit/Read-only: Show progress bar
          <VStack space="xs" marginLeft="$4" width={120}>
            <Text
              {...TYPOGRAPHY.caption}
              color={theme.tokens.colors.primary500}
              fontWeight="$bold"
              textAlign="right"
            >
              {progressPercentage}%
            </Text>
            <Progress
              value={progressPercentage}
              size="sm"
              bg={theme.tokens.colors.inputBorder}
            >
              <ProgressFilledTrack bg={theme.tokens.colors.primary500} />
            </Progress>
          </VStack>
        )}

        {hasChildren && isPreview && (
          // Has children + Preview: Show pillars and tasks count
          <VStack space="xs" marginLeft="$4" alignItems="flex-end">
            <Text
              {...TYPOGRAPHY.caption}
              color={theme.tokens.colors.primary500}
            >
              {totalPillars} {t('projectPlayer.pillars')}
            </Text>
            <Text
              {...TYPOGRAPHY.caption}
              color={theme.tokens.colors.primary500}
            >
              {totalChildTasks} {t('projectPlayer.tasks')}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
};

export default ProjectInfoCard;
