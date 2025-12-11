import React from 'react';
import { Box, VStack } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';
import AddCustomTask from '../Task/AddCustomTask';
import { projectComponentStyles } from './Styles';

const ProjectComponent: React.FC = () => {
  const { projectData, mode } = useProjectContext();

  if (!projectData) {
    console.log('⚠️ ProjectComponent - No project data, returning null');
    return null;
  }

  const isEditMode = mode === 'edit';

  return (
    <Box flex={1} bg="$backgroundLight0">
      <VStack space="md" padding="$4">
        <ProjectInfoCard project={projectData} />

        {projectData.tasks?.map(task => (
          <TaskComponent key={task._id} task={task} />
        ))}
      </VStack>
      {isEditMode && (
        <Box {...projectComponentStyles.addTaskButtonContainer}>
          <AddCustomTask />
        </Box>
      )}
    </Box>
  );
};

export default ProjectComponent;
