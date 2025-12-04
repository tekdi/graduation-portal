import React from 'react';
import Project from '../../project-player/index';
import { ProjectPlayerData } from '../../project-player/types/components.types';
import {
  DUMMY_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '../../constants/PROJECTDATA';

const ProjectPlayer = () => {
  // Use the edit mode config from constants (EDIT mode works better for testing)
  // const config = PROJECT_PLAYER_CONFIGS.editMode;

  //  To test different modes, uncomment the desired config:
  // const config = PROJECT_PLAYER_CONFIGS.previewMode; // For preview mode
  const config = PROJECT_PLAYER_CONFIGS.readOnlyMode; // For read-only mode

  // Create data object with the dummy project data
  const data: ProjectPlayerData = {
    solutionId: config.solutionId,
    projectId: config.projectId,
    localData: DUMMY_PROJECT_DATA,
  };

  return <Project config={config} data={data} />;
};

export default ProjectPlayer;
