import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  Card,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui/index';
import { useLanguage } from '@contexts/LanguageContext';
import { useProjectContext } from '../../context/ProjectContext';
import TaskComponent from '../ProjectComponent/TaskComponent';
import AddCustomTask from './AddCustomTask';
import { TaskAccordionProps } from '../../types/components.types';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

const TaskAccordion: React.FC<TaskAccordionProps> = ({ task, level = 0 }) => {
  const { t } = useLanguage();
  const { mode } = useProjectContext();

  const isPreview = mode === 'preview';

  // For Edit/Read-Only modes: Show as Card (always expanded)
  if (!isPreview) {
    return (
      <Box marginBottom="$3">
        <Card
          size="md"
          variant="elevated"
          bg="$backgroundPrimary.light"
          borderRadius="$lg"
        >
          {/* Card Header */}
          <Box
            padding="$5"
            borderBottomWidth={1}
            borderBottomColor="$mutedBorder"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <VStack flex={1} space="xs">
                <HStack alignItems="center" space="sm" flexWrap="wrap">
                  <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                    {task.name}
                  </Text>
                  <Box
                    bg="$primary100"
                    paddingHorizontal="$3"
                    paddingVertical="$1"
                    borderRadius="$full"
                    borderColor="$primary500"
                  >
                    <Text
                      fontSize="$xs"
                      fontWeight="$medium"
                      color="$primary500"
                    >
                      {task.children?.length || 0} {t('projectPlayer.tasks')}
                    </Text>
                  </Box>
                </HStack>
                {task.description && (
                  <Text
                    {...TYPOGRAPHY.paragraph}
                    color="$textSecondary"
                    lineHeight="$lg"
                  >
                    {task.description}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>

          {/* Card Content - Always visible (no accordion) */}
          <Box paddingHorizontal="$5" paddingBottom="$5">
            <VStack space="md" paddingTop="$3">
              {task.children?.map((childTask, index) => (
                <TaskComponent
                  key={childTask._id}
                  task={childTask}
                  level={level + 1}
                  isLastTask={index === task.children!.length - 1}
                  isChildOfProject={true}
                />
              ))}

              {/* Add Custom Task Button */}
              <AddCustomTask pillarId={task._id} _pillarName={task.name} />
            </VStack>
          </Box>
        </Card>
      </Box>
    );
  }

  // For Preview mode: Show as Accordion
  return (
    <Box marginBottom="$3">
      <Accordion
        type="single"
        variant="unfilled"
        shadowColor="$backgroundLight900"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.05}
        shadowRadius={4}
        elevation={2}
      >
        <AccordionItem
          value={task._id}
          bg="$backgroundPrimary.light"
          borderRadius="$lg"
          borderWidth={1}
          borderColor="$mutedBorder"
        >
          {/* Accordion Header */}
          <AccordionHeader>
            <AccordionTrigger padding="$5">
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <HStack
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <VStack flex={1} space="xs">
                      <HStack alignItems="center" space="sm" flexWrap="wrap">
                        <Text {...TYPOGRAPHY.h4} color="$textPrimary">
                          {task.name}
                        </Text>
                        <Box
                          bg="$primary100"
                          paddingHorizontal="$3"
                          paddingVertical="$1"
                          borderRadius="$full"
                          borderColor="$primary500"
                        >
                          <Text
                            fontSize="$xs"
                            fontWeight="$medium"
                            color="$primary500"
                          >
                            {task.children?.length || 0}{' '}
                            {t('projectPlayer.tasks')}
                          </Text>
                        </Box>
                      </HStack>
                      {task.description && (
                        <Text
                          {...TYPOGRAPHY.paragraph}
                          color="$textSecondary"
                          lineHeight="$lg"
                        >
                          {task.description}
                        </Text>
                      )}
                    </VStack>

                    {/* Custom Lucide Icon */}
                    <Box ml="$4">
                      <LucideIcon
                        name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                        size={20}
                        color="$textSecondary"
                      />
                    </Box>
                  </HStack>
                </>
              )}
            </AccordionTrigger>
          </AccordionHeader>

          {/* Accordion Content - Collapsible in preview mode */}
          <AccordionContent paddingHorizontal="$5" paddingBottom="$5">
            <VStack space="md" paddingTop="$3">
              {task.children?.map((childTask, index) => (
                <TaskComponent
                  key={childTask._id}
                  task={childTask}
                  level={level + 1}
                  isLastTask={index === task.children!.length - 1}
                  isChildOfProject={true}
                />
              ))}

              {/* Add Custom Task Button */}
              <AddCustomTask pillarId={task._id} _pillarName={task.name} />
            </VStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TaskAccordion;
