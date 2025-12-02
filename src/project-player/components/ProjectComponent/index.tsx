import React from 'react';
import { Box, VStack } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';

const ProjectComponent: React.FC = () => {
  const { projectData } = useProjectContext();

  // console.log('🏗️ ProjectComponent - projectData:', projectData);
  // console.log('🏗️ ProjectComponent - tasks:', projectData?.tasks?.length);

  if (!projectData) {
    console.log('⚠️ ProjectComponent - No project data, returning null');
    return null;
  }

  return (
    <Box flex={1} bg="$backgroundLight0">
      <VStack space="md" padding="$4">
        <ProjectInfoCard project={projectData} />

        {projectData.tasks?.map(task => (
          <TaskComponent key={task._id} task={task} />
        ))}
      </VStack>
    </Box>
  );
};

export default ProjectComponent;
