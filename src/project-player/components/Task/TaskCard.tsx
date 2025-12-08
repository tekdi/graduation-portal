import React, { useRef, useState, useMemo } from 'react';
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
  Toast,
  ToastTitle,
  useToast,
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
  const { mode, config } = useProjectContext();
  const { handleOpenForm, handleStatusChange, handleFileUpload } =
    useTaskActions();
  const { t } = useLanguage();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isReadOnly = mode === 'read-only';
  const isPreview = mode === 'preview';
  const isEdit = mode === 'edit';
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const maxFileSize = config.maxFileSize || 10;

  // Configuration for rendering different UI styles
  const uiConfig = useMemo(
    () => ({
      showAsCard: isChildOfProject && !isPreview,
      showAsInline: !isChildOfProject || isPreview,
      showCheckbox: isChildOfProject && !isPreview,
      showActionButton:
        !isPreview &&
        (task.type === 'file' ||
          task.type === 'observation' ||
          task.type === 'profile-update'),
      isInteractive: isEdit && !isUploading,
    }),
    [isChildOfProject, isPreview, isEdit, isUploading, task.type],
  );

  // Toast helper
  const showErrorToast = (message: string) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={id} action="error" variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  // File upload handler
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxSizeBytes = maxFileSize * 1024 * 1024;
    const invalidFiles = Array.from(files).filter(
      file => file.size > maxSizeBytes,
    );

    if (invalidFiles.length > 0) {
      showErrorToast(
        t('projectPlayer.fileSizeError', { maxSize: maxFileSize }),
      );
      return;
    }

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      await handleFileUpload(task._id, fileArray);
      handleStatusChange(task._id, TASK_STATUS.COMPLETED);

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="solid">
            <ToastTitle>{t('projectPlayer.uploadSuccess')}</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast(t('projectPlayer.uploadFailed'));
    } finally {
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Task click handler
  const handleTaskClick = () => {
    if (!isEdit) return;

    if (task.type === 'observation') {
      handleOpenForm(task._id);
    } else if (task.type === 'file') {
      fileInputRef.current?.click();
    } else if (task.type === 'profile-update') {
      const newStatus = isCompleted ? TASK_STATUS.TO_DO : TASK_STATUS.COMPLETED;
      handleStatusChange(task._id, newStatus);
    }
  };

  // Checkbox change handler
  const handleCheckboxChange = (checked: boolean) => {
    if (!isEdit) return;
    const newStatus = checked ? TASK_STATUS.COMPLETED : TASK_STATUS.TO_DO;
    handleStatusChange(task._id, newStatus);
  };

  // Button text helper
  const getButtonText = () => {
    if (task.type === 'file') {
      return isUploading
        ? t('projectPlayer.uploading')
        : t('projectPlayer.uploadFile');
    }
    if (task.type === 'observation') return t('projectPlayer.completeForm');
    if (task.type === 'profile-update') return t('projectPlayer.updateProfile');
    return t('projectPlayer.viewTask');
  };

  // Button icon helper
  const getButtonIcon = () => {
    const iconColor = theme.tokens.colors.textSecondary;
    const iconMap = {
      file: 'Upload',
      observation: 'FileText',
      'profile-update': 'User',
    } as const;

    const iconName = iconMap[task.type as keyof typeof iconMap];
    return iconName ? (
      <LucideIcon name={iconName} size={16} color={iconColor} />
    ) : null;
  };

  // Render file input (hidden)
  const renderFileInput = () => {
    if (task.type !== 'file') return null;

    const hiddenInputStyle = { display: 'none' as const };
    return (
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={hiddenInputStyle}
        accept="*/*"
        disabled={!isEdit || isUploading}
      />
    );
  };

  // Render task status indicator (circle or checkbox)
  const renderStatusIndicator = () => {
    if (uiConfig.showCheckbox) {
      return (
        <Checkbox
          value={task._id}
          isChecked={isCompleted}
          onChange={handleCheckboxChange}
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
            <CheckboxIcon color={theme.tokens.colors.backgroundPrimary.light}>
              <LucideIcon
                name="Check"
                size={12}
                color={theme.tokens.colors.backgroundPrimary.light}
                strokeWidth={3}
              />
            </CheckboxIcon>
          </CheckboxIndicator>
        </Checkbox>
      );
    }

    // Simple status circle
    const circleSize = isChildOfProject ? 24 : 24;
    const checkSize = isChildOfProject ? 14 : 14;
    const circleColor = isChildOfProject
      ? theme.tokens.colors.primary500
      : isCompleted
      ? theme.tokens.colors.accent200
      : theme.tokens.colors.textMuted;

    return (
      <Box
        width={circleSize}
        height={circleSize}
        borderRadius="$full"
        borderWidth={2}
        borderColor={circleColor}
        bg={
          isCompleted && !isChildOfProject
            ? theme.tokens.colors.accent200
            : theme.tokens.colors.backgroundPrimary.light
        }
        justifyContent="center"
        alignItems="center"
      >
        {(isCompleted || isChildOfProject) && (
          <LucideIcon
            name="Check"
            size={checkSize}
            color={
              isChildOfProject
                ? theme.tokens.colors.primary500
                : theme.tokens.colors.backgroundPrimary.light
            }
            strokeWidth={3}
          />
        )}
      </Box>
    );
  };

  // Render task information (name and description)
  const renderTaskInfo = () => {
    const textStyle = uiConfig.showCheckbox
      ? {
          textDecorationLine: (isCompleted ? 'line-through' : 'none') as
            | 'line-through'
            | 'none',
          opacity: isCompleted ? 0.6 : 1,
        }
      : {};

    const titleTypography = uiConfig.showAsCard ? TYPOGRAPHY.h4 : TYPOGRAPHY.h3;

    return (
      <VStack flex={1} space="xs">
        <Text
          {...titleTypography}
          color={theme.tokens.colors.textPrimary}
          {...textStyle}
        >
          {task.name}
        </Text>
        {task.description && (
          <Text
            {...(uiConfig.showAsCard
              ? TYPOGRAPHY.bodySmall
              : TYPOGRAPHY.paragraph)}
            color={theme.tokens.colors.textSecondary}
            lineHeight="$lg"
            {...textStyle}
          >
            {task.description}
          </Text>
        )}
      </VStack>
    );
  };

  // Render action button
  const renderActionButton = () => {
    if (!uiConfig.showActionButton) return null;

    const buttonStyles = uiConfig.showAsCard
      ? {
          borderColor: theme.tokens.colors.textSecondary,
          hoverBg: theme.tokens.colors.primary100,
        }
      : {
          borderColor: theme.tokens.colors.inputBorder,
          hoverBg: theme.tokens.colors.primary100,
        };

    return (
      <Button
        size="sm"
        variant="outline"
        onPress={handleTaskClick}
        isDisabled={isReadOnly || isUploading}
        borderRadius={uiConfig.showAsCard ? undefined : 10}
        borderColor={buttonStyles.borderColor}
        bg={theme.tokens.colors.backgroundPrimary.light}
        ml="$3"
        opacity={isReadOnly || isUploading ? 0.5 : 1}
        sx={{
          ':hover': {
            bg: isEdit ? buttonStyles.hoverBg : 'transparent',
            borderColor: theme.tokens.colors.primary500,
          },
        }}
      >
        <HStack space="xs" alignItems="center">
          {getButtonIcon()}
          <ButtonText
            {...TYPOGRAPHY.button}
            color={theme.tokens.colors.textSecondary}
            fontSize={uiConfig.showAsCard ? '$sm' : undefined}
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
    );
  };

  // Render divider
  const renderDivider = () => {
    if (isLastTask) return null;

    return (
      <Box
        height={1}
        bg={theme.tokens.colors.inputBorder}
        marginVertical={isChildOfProject && isPreview ? '$1' : undefined}
        marginHorizontal={!isChildOfProject ? '$5' : undefined}
      />
    );
  };

  // Main render logic
  // Card style for children of project tasks in EDIT and READ-ONLY modes
  if (uiConfig.showAsCard) {
    return (
      <>
        {renderFileInput()}
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
              <HStack flex={1} space="md" alignItems="center">
                {renderStatusIndicator()}
                {renderTaskInfo()}
              </HStack>
              {renderActionButton()}
            </HStack>
          </Box>
        </Card>
      </>
    );
  }

  // Inline style for preview mode with project children
  if (isChildOfProject && isPreview) {
    return (
      <>
        {renderFileInput()}
        <HStack
          alignItems="center"
          space="md"
          paddingVertical="$2"
          paddingHorizontal="$1"
        >
          {renderStatusIndicator()}
          {renderTaskInfo()}
        </HStack>
        {renderDivider()}
      </>
    );
  }

  // Default inline style for regular tasks (not children of project)
  return (
    <>
      {renderFileInput()}
      <Box
        bg={theme.tokens.colors.backgroundPrimary.light}
        padding="$5"
        marginLeft={level * 16}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <HStack flex={1} space="md" alignItems="center">
            <Box
              width={40}
              height={40}
              justifyContent="center"
              alignItems="center"
            >
              {renderStatusIndicator()}
            </Box>
            {renderTaskInfo()}
          </HStack>
          {renderActionButton()}
        </HStack>
      </Box>
      {renderDivider()}
    </>
  );
};

export default TaskCard;
