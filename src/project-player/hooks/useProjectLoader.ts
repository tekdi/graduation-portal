import { useState, useEffect } from 'react';
import { ProjectData } from '../types/project.types';
import {
  ProjectPlayerConfig,
  ProjectPlayerData,
} from '../types/components.types';

export const useProjectLoader = (
  config: ProjectPlayerConfig,
  data: ProjectPlayerData,
) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('📦 useProjectLoader - Config:', config);
        console.log('📦 useProjectLoader - Data:', data);
        console.log(
          '📦 useProjectLoader - Local data available:',
          !!data.localData,
        );

        // If local data is provided, use it (for testing/offline mode)
        if (data.localData) {
          console.log(
            '✅ Using provided local data with',
            data.localData.tasks?.length,
            'tasks',
          );
          setProjectData(data.localData);
          setIsLoading(false);
          return;
        }

        // Determine which API to call based on mode and available IDs
        if (config.mode === 'edit' && data.projectId) {
          // Load project instance
          // TODO: Implement API call
          // const response = await fetch(`/api/project/details/${data.projectId}`);
          console.log('🔄 Loading project instance:', data.projectId);
          // For now, set to null until API is implemented
          setProjectData(null);
        } else if (data.solutionId) {
          // Load template
          // TODO: Implement API call
          // const response = await fetch(`/api/template/details/${data.solutionId}`);
          console.log('🔄 Loading template:', data.solutionId);
          // For now, set to null until API is implemented
          setProjectData(null);
        }
      } catch (err) {
        console.error('❌ useProjectLoader error:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [config.mode, data.projectId, data.solutionId, data.localData]);

  return { projectData, isLoading, error };
};
