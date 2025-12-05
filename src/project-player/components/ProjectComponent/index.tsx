import React from 'react';
import { Box, VStack, Card, ScrollView } from '@gluestack-ui/themed';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInfoCard from './ProjectInfoCard';
import TaskComponent from './TaskComponent';

const ProjectComponent: React.FC = () => {
  const { projectData } = useProjectContext();

  if (!projectData) {
    return null;
  }

  return (
    <Box flex={1} bg="$backgroundLight0">
      {/* ScrollView for overflow handling */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Single Card Container - Using Gluestack Card for cross-platform compatibility */}
        <Card size="lg" variant="elevated" bg="$white" borderRadius="$lg">
          <VStack>
            {/* Project Info Header */}
            <ProjectInfoCard project={projectData} />

            {/* Task List */}
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
    </Box>
  );
};

export default ProjectComponent;
