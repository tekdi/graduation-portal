import React from 'react';
import { Box, VStack, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useLanguage } from '@contexts/LanguageContext';
import { TaskStatus as TaskStatusType } from '../../types/project.types';
import TaskStatus from './TaskStatus';
import UploadComponent from './UploadComponent';
import { TaskCardProps } from '../../types/components.types';

const TaskCard: React.FC<TaskCardProps> = ({ task, level = 0 }) => {
  const { mode } = useProjectContext();
  const { canEdit, handleStatusChange, handleOpenForm } = useTaskActions();
  const { t } = useLanguage();

  const isReadOnly = mode === 'preview' || mode === 'read-only';

  const handleTaskClick = () => {
    if (isReadOnly) return;

    if (task.type === 'observation') {
      handleOpenForm(task._id);
    }
  };

  return (
    <Box
      bg="$white"
      borderRadius="$md"
      padding="$4"
      borderWidth={1}
      borderColor="$borderLight300"
      marginLeft={level * 16}
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1} space="xs">
            <Text fontSize="$md" fontWeight="$semibold">
              {t(task.name)}
            </Text>
            {task.description && (
              <Text fontSize="$sm" color="$textLight600">
                {t(task.description)}
              </Text>
            )}
          </VStack>

          <TaskStatus
            status={task.status}
            isReadOnly={isReadOnly}
            onStatusChange={(newStatus: TaskStatusType) =>
              handleStatusChange(task._id, newStatus)
            }
          />
        </HStack>

        {/* File Upload Component for file type tasks */}
        {task.type === 'file' && canEdit && (
          <UploadComponent taskId={task._id} attachments={task.attachments} />
        )}

        {/* Observation Form Button */}
        {task.type === 'observation' && canEdit && (
          <Pressable onPress={handleTaskClick}>
            <Box
              bg="$primary500"
              padding="$2"
              borderRadius="$sm"
              alignItems="center"
            >
              <Text color="$white" fontSize="$sm">
                {t('projectPlayer.completeForm')}
              </Text>
            </Box>
          </Pressable>
        )}

        {/* Display attachments for read-only mode */}
        {isReadOnly && task.attachments && task.attachments.length > 0 && (
          <VStack space="xs">
            <Text fontSize="$sm" fontWeight="$medium">
              {t('projectPlayer.attachments')}:
            </Text>
            {task.attachments.map(attachment => (
              <Text key={attachment._id} fontSize="$sm" color="$textLight600">
                📎 {t(attachment.name)}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default TaskCard;
