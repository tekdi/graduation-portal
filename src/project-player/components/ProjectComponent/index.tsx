import React from 'react';
import {
  Box,
  VStack,
  Card,
  ScrollView,
  Button,
  ButtonText,
  HStack,
} from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
import AddCustomTask from '../Task/AddCustomTask';
import { projectComponentStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

const ProjectComponent: React.FC = () => {
  const { projectData, mode, config } = useProjectContext();
  const { t } = useLanguage();

  if (!projectData) {
    return null;
  }

  const isEditMode =
    mode === 'edit' && config.showAddCustomTaskButton !== false;

  const shouldShowSubmitButton =
    config.showSubmitButton &&
    mode === 'preview' &&
    config.onSubmitInterventionPlan;

  return (
    <Box {...projectComponentStyles.container}>
      <VStack flex={1}>
        <ScrollView {...projectComponentStyles.scrollView}>
          <Card {...projectComponentStyles.card}>
            <VStack>
              <ProjectInfoCard project={projectData} />

              {projectData.tasks?.map((task, index) => (
                <TaskComponent
                  key={task._id}
                  task={task}
                  isLastTask={index === projectData.tasks.length - 1}
                />
              ))}
            </VStack>
          </Card>
        </ScrollView>
        {isEditMode && (
          <Box {...projectComponentStyles.addTaskButtonContainer}>
            <AddCustomTask />
          </Box>
        )}

        {/* Submit Intervention Plan Button */}
        {shouldShowSubmitButton && (
          <Box
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderLight300"
            bg="$backgroundPrimary.light"
          >
            <HStack justifyContent="flex-end" width="$full">
              <Button
                bg="$primary500"
                borderRadius="$md"
                paddingHorizontal="$6"
                paddingVertical="$3"
                onPress={config.onSubmitInterventionPlan}
                $hover-bg="$primary600"
                $web-cursor="pointer"
              >
                <ButtonText
                  color="$backgroundPrimary.light"
                  {...TYPOGRAPHY.button}
                  fontWeight="$semibold"
                >
                  {t(
                    'participantDetail.interventionPlan.submitInterventionPlan',
                  )}
                </ButtonText>
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
export default ProjectComponent;
