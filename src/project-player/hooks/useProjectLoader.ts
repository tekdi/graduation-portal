import { useState, useEffect } from 'react';
import { ProjectData } from '../types/project.types';
import {
  ProjectPlayerConfig,
  ProjectPlayerData,
} from '../types/components.types';
import { getProjectTemplatesList } from '../services/projectPlayerService';

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

        // If local data is provided, use it (for testing/offline mode)
        if (data.data) {
          setProjectData(data.data);
          setIsLoading(false);
          return;
        }

        // config.mode = "edit" and data contains both solutionId and projectId.
        if (config.mode === 'edit' && data.projectId) {
          const { data: templates, error } = await getProjectTemplatesList();

          if (error) {
            console.error('Failed to load project templates:', error);
            setProjectData(null);
            return;
          }

          const selectTemplate = (templates: any[]) =>
            templates.find(t => t.externalId === data.projectId);

          const template = selectTemplate(templates);

          setProjectData({
            ...template,
            tasks: template.tasks.map((id: any) => ({
              _id: id,
            })),
          });
        } else if (data.solutionId) {
          // Load template
          // TODO: Implement API call
          // const response = await fetch(`/api/template/details/${data.solutionId}`);
          // For now, set to null until API is implemented
          setProjectData(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [config.mode, data.projectId, data.solutionId, data.data]);

  return { projectData, isLoading, error };
};
