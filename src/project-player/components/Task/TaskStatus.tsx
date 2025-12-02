import React from 'react';
import { Box, Text, Pressable } from '@gluestack-ui/themed';
import { TaskStatus as TaskStatusType } from '../../types/project.types';
import { getStatusColor } from '../ProjectComponent/helpers';
import { TaskStatusProps } from '../../types/components.types';

const TaskStatus: React.FC<TaskStatusProps> = ({
  status,
  isReadOnly,
  onStatusChange,
}) => {
  const statusColor = getStatusColor(status);

  const toggleStatus = () => {
    if (isReadOnly || !onStatusChange) return;

    // Cycle through statuses: pending -> in-progress -> completed
    const nextStatus: Record<TaskStatusType, TaskStatusType> = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
      submitted: 'submitted', // Don't change submitted status
    };

    onStatusChange(nextStatus[status]);
  };

  return (
    <Pressable onPress={toggleStatus} disabled={isReadOnly}>
      <Box
        bg={statusColor}
        paddingHorizontal="$3"
        paddingVertical="$1"
        borderRadius="$full"
      >
        <Text color="$white" fontSize="$xs" fontWeight="$medium">
          {status.toUpperCase()}
        </Text>
      </Box>
    </Pressable>
  );
};

export default TaskStatus;
