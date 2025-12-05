import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui/index';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TASK_STATUS } from '../../../constants/app.constant';
import { TaskCardProps } from '../../types/components.types';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  level = 0,
  isLastTask = false,
  isChildOfProject = false,
}) => {
  const { mode } = useProjectContext();
  const { handleOpenForm, handleStatusChange } = useTaskActions();
  const { t } = useLanguage();

  const isReadOnly = mode === 'read-only';
  const isPreview = mode === 'preview';
  const isEdit = mode === 'edit';
  const isCompleted = task.status === TASK_STATUS.COMPLETED;

  const handleTaskClick = () => {
    if (!isEdit) {
      return;
    }

    if (task.type === 'observation') {
      handleOpenForm(task._id);
    } else if (task.type === 'file' || task.type === 'profile-update') {
      // Toggle status on button click for simple tasks
      const newStatus = isCompleted ? TASK_STATUS.TO_DO : TASK_STATUS.COMPLETED;
      handleStatusChange(task._id, newStatus);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (!isEdit) {
      return;
    }
    // Toggle status for project children based on new checkbox state
    const newStatus = checked ? TASK_STATUS.COMPLETED : TASK_STATUS.TO_DO;
    handleStatusChange(task._id, newStatus);
  };

  const getButtonText = () => {
    if (task.type === 'file') return t('projectPlayer.uploadFile');
    if (task.type === 'observation') return t('projectPlayer.completeForm');
    if (task.type === 'profile-update') return t('projectPlayer.updateProfile');
    return t('projectPlayer.viewTask');
  };

  const getButtonIcon = () => {
    const iconColor = theme.tokens.colors.textSecondary;
    if (task.type === 'file')
      return <LucideIcon name="Upload" size={16} color={iconColor} />;
    if (task.type === 'observation')
      return <LucideIcon name="FileText" size={16} color={iconColor} />;
    if (task.type === 'profile-update')
      return <LucideIcon name="User" size={16} color={iconColor} />;
    return null;
  };

  // For preview mode with project children - show simple inline style
  if (isChildOfProject && isPreview) {
    return (
      <>
        <HStack
          alignItems="center"
          space="md"
          paddingVertical="$2"
          paddingHorizontal="$1"
        >
          {/* Circle Icon */}
          <Box
            width={24}
            height={24}
            borderRadius="$full"
            borderWidth={2}
            borderColor={theme.tokens.colors.primary500}
            bg={theme.tokens.colors.backgroundPrimary.light}
            justifyContent="center"
            alignItems="center"
          >
            <LucideIcon
              name="Check"
              size={14}
              color={theme.tokens.colors.primary500}
              strokeWidth={3}
            />
          </Box>

          {/* Task Info */}
          <VStack flex={1}>
            <Text
              {...TYPOGRAPHY.paragraph}
              color={theme.tokens.colors.textPrimary}
            >
              {task.name}
            </Text>
            {task.description && (
              <Text
                {...TYPOGRAPHY.bodySmall}
                color={theme.tokens.colors.textSecondary}
              >
                {task.description}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Divider - only if not last task */}
        {!isLastTask && (
          <Box
            height={1}
            bg={theme.tokens.colors.inputBorder}
            marginVertical="$1"
          />
        )}
      </>
    );
  }

  // Render card style for children of project tasks in EDIT and READ-ONLY modes
  if (isChildOfProject && !isPreview) {
    return (
      <Card
        size="md"
        variant="elevated"
        bg={theme.tokens.colors.taskCardBg}
        borderRadius="$lg"
        marginBottom="$3"
        borderWidth={1}
        borderColor={theme.tokens.colors.taskCardBorder}
      >
        <Box padding="$4">
          <HStack alignItems="center" justifyContent="space-between">
            {/* Checkbox for project children - visible in edit and read-only, hidden in preview */}
            <HStack flex={1} space="md" alignItems="center">
              {!isPreview && (
                <Checkbox
                  value={task._id}
                  isChecked={isCompleted}
                  onChange={handleCheckboxChange}
                  // Disable checkbox in read-only mode
                  isDisabled={isReadOnly}
                  size="md"
                  aria-label={`Mark ${task.name} as ${
                    isCompleted ? 'incomplete' : 'complete'
                  }`}
                  opacity={isReadOnly ? 0.6 : 1}
                >
                  <CheckboxIndicator
                    borderColor={
                      isCompleted
                        ? theme.tokens.colors.primary500
                        : theme.tokens.colors.textMuted
                    }
                    bg={
                      isCompleted
                        ? theme.tokens.colors.primary500
                        : theme.tokens.colors.backgroundPrimary.light
                    }
                  >
                    <CheckboxIcon
                      color={theme.tokens.colors.backgroundPrimary.light}
                    >
                      <LucideIcon
                        name="Check"
                        size={12}
                        color={theme.tokens.colors.backgroundPrimary.light}
                        strokeWidth={3}
                      />
                    </CheckboxIcon>
                  </CheckboxIndicator>
                </Checkbox>
              )}

              {/* Task Info */}
              <VStack flex={1} space="xs">
                <Text
                  {...TYPOGRAPHY.h4}
                  color={theme.tokens.colors.textPrimary}
                  textDecorationLine={isCompleted ? 'line-through' : 'none'}
                  opacity={isCompleted ? 0.6 : 1}
                >
                  {task.name}
                </Text>

                {task.description && (
                  <Text
                    {...TYPOGRAPHY.bodySmall}
                    color={theme.tokens.colors.textSecondary}
                    lineHeight="$lg"
                    opacity={isCompleted ? 0.6 : 1}
                  >
                    {task.description}
                  </Text>
                )}
              </VStack>
            </HStack>

            {/* Action Button - visible in edit and read-only, hidden in preview */}
            {!isPreview &&
              (task.type === 'file' ||
                task.type === 'observation' ||
                task.type === 'profile-update') && (
                <Button
                  size="sm"
                  variant="outline"
                  onPress={handleTaskClick}
                  // Disable for read-only mode
                  isDisabled={isReadOnly}
                  borderColor={theme.tokens.colors.textSecondary}
                  bg={theme.tokens.colors.backgroundPrimary.light}
                  ml="$3"
                  opacity={isReadOnly ? 0.5 : 1}
                  sx={{
                    ':hover': {
                      bg: isEdit
                        ? theme.tokens.colors.primary100
                        : 'transparent', // no hover effect in read-only
                      borderColor: theme.tokens.colors.primary500,
                    },
                  }}
                >
                  <HStack space="xs" alignItems="center">
                    {getButtonIcon()}
                    <ButtonText
                      {...TYPOGRAPHY.button}
                      color={theme.tokens.colors.textSecondary}
                      sx={{
                        ':hover': {
                          color: theme.tokens.colors.primary500,
                        },
                      }}
                      fontSize="$sm"
                    >
                      {getButtonText()}
                    </ButtonText>
                  </HStack>
                </Button>
              )}
          </HStack>
        </Box>
      </Card>
    );
  }

  // Default inline style for regular tasks (not children of project)
  return (
    <>
      <Box
        bg={theme.tokens.colors.backgroundPrimary.light}
        padding="$5"
        marginLeft={level * 16}
      >
        <HStack alignItems="center" justifyContent="space-between">
          {/* Icon Circle for regular tasks */}
          <HStack flex={1} space="md" alignItems="center">
            <Box
              width={40}
              height={40}
              justifyContent="center"
              alignItems="center"
            >
              <Box
                width={24}
                height={24}
                borderRadius="$full"
                borderWidth={2}
                borderColor={
                  isCompleted
                    ? theme.tokens.colors.accent200
                    : theme.tokens.colors.textMuted
                }
                bg={
                  isCompleted
                    ? theme.tokens.colors.accent200
                    : theme.tokens.colors.backgroundPrimary.light
                }
                justifyContent="center"
                alignItems="center"
              >
                {isCompleted && (
                  <LucideIcon
                    name="Check"
                    size={14}
                    color={theme.tokens.colors.backgroundPrimary.light}
                    strokeWidth={3}
                  />
                )}
              </Box>
            </Box>

            {/* Task Info */}
            <VStack flex={1} space="xs">
              <Text {...TYPOGRAPHY.h3} color={theme.tokens.colors.textPrimary}>
                {task.name}
              </Text>
              {task.description && (
                <Text
                  {...TYPOGRAPHY.paragraph}
                  color={theme.tokens.colors.textSecondary}
                  lineHeight="$lg"
                >
                  {task.description}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Action Button for regular tasks - visible in edit and read-only, hidden in preview */}
          {!isPreview && (
            <Button
              size="sm"
              variant="outline"
              onPress={handleTaskClick}
              // Disable in read-only mode
              isDisabled={isReadOnly}
              borderRadius={10}
              borderColor={theme.tokens.colors.inputBorder}
              bg={theme.tokens.colors.backgroundPrimary.light}
              ml="$3"
              opacity={isReadOnly ? 0.5 : 1}
              sx={{
                ':hover': {
                  bg: isEdit ? theme.tokens.colors.primary100 : 'transparent',
                },
              }}
            >
              <HStack space="xs" alignItems="center">
                {getButtonIcon()}
                <ButtonText
                  {...TYPOGRAPHY.button}
                  color={theme.tokens.colors.textSecondary}
                  sx={{
                    ':hover': {
                      color: theme.tokens.colors.primary500,
                    },
                  }}
                >
                  {getButtonText()}
                </ButtonText>
              </HStack>
            </Button>
          )}
        </HStack>
      </Box>

      {/* Divider - only if not last task */}
      {!isLastTask && (
        <Box
          height={1}
          bg={theme.tokens.colors.inputBorder}
          marginHorizontal="$5"
        />
      )}
    </>
  );
};

export default TaskCard;
