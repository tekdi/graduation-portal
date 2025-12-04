import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { useLanguage } from '@contexts/LanguageContext';
import TaskComponent from '../ProjectComponent/TaskComponent';
import { getTaskProgress } from '../ProjectComponent/helpers';
import { TaskAccordionProps } from '../../types/components.types';

const TaskAccordion: React.FC<TaskAccordionProps> = ({ task, level = 0 }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = getTaskProgress(task);

  return (
    <Box marginLeft={level * 16}>
      <VStack space="sm">
        {/* Accordion Header */}
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <Box
            bg="$primary50"
            borderRadius="$md"
            padding="$4"
            borderWidth={1}
            borderColor="$primary200"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack flex={1} space="xs">
                <Text fontSize="$md" fontWeight="$bold" color="$primary700">
                  {task.name}
                </Text>
                {task.description && (
                  <Text fontSize="$sm" color="$textLight600">
                    {task.description}
                  </Text>
                )}
                <Text fontSize="$xs" color="$textLight500">
                  {task.children?.length || 0} {t('projectPlayer.tasks')} •{' '}
                  {progress}% {t('projectPlayer.complete')}
                </Text>
              </VStack>

              <Text fontSize="$xl" color="$primary500">
                {isExpanded ? '▼' : '▶'}
              </Text>
            </HStack>
          </Box>
        </Pressable>

        {/* Accordion Content */}
        {isExpanded && task.children && (
          <VStack space="sm" paddingLeft="$4">
            {task.children.map(childTask => (
              <TaskComponent
                key={childTask._id}
                task={childTask}
                level={level + 1}
              />
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default TaskAccordion;
