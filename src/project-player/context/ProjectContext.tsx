import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { ProjectData, Task } from '../types/project.types';
import {
  ProjectContextValue,
  ProjectProviderProps,
} from '../types/components.types';
import { setApiConfig } from '../utils/api';

const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  config,
  initialData,
}) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize API configuration
  useEffect(() => {
    if (config.baseUrl || config.accessToken) {
      setApiConfig({
        baseUrl: config.baseUrl,
        accessToken: config.accessToken,
      });
    }
  }, [config.baseUrl, config.accessToken]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to update task in nested structure
      const updateTaskRecursive = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task._id === taskId) {
            console.log(
              'Found task to update:',
              task.name,
              'new status:',
              updates.status,
            );
            return { ...task, ...updates };
          }
          if (task.children) {
            return {
              ...task,
              children: updateTaskRecursive(task.children),
            };
          }
          return task;
        });
      };

      const updatedData = {
        ...prev,
        tasks: updateTaskRecursive(prev.tasks),
      };
      return updatedData;
    });
  }, []);

  const updateProjectInfo = useCallback((updates: Partial<ProjectData>) => {
    setProjectData(prev => (prev ? { ...prev, ...updates } : null));
  }, []);

  const addTask = useCallback((pillarId: string, task: Task) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to find pillar and add task to its children
      const addTaskToPillar = (tasks: Task[]): Task[] => {
        return tasks.map(t => {
          if (t._id === pillarId && t.type === 'project') {
            // Found the pillar, add task to its children
            return {
              ...t,
              children: [...(t.children || []), task],
            };
          }
          if (t.children) {
            // Keep searching in children
            return {
              ...t,
              children: addTaskToPillar(t.children),
            };
          }
          return t;
        });
      };

      return {
        ...prev,
        tasks: addTaskToPillar(prev.tasks),
      };
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setProjectData(prev => {
      if (!prev) return null;

      // Recursive function to remove task from anywhere in the tree
      const deleteTaskRecursive = (tasks: Task[]): Task[] => {
        return tasks
          .filter(task => task._id !== taskId) // Remove if matches
          .map(task => {
            if (task.children) {
              // Recursively delete from children
              return {
                ...task,
                children: deleteTaskRecursive(task.children),
              };
            }
            return task;
          });
      };

      return {
        ...prev,
        tasks: deleteTaskRecursive(prev.tasks),
      };
    });
  }, []);

  const saveLocal = useCallback(() => {
    // TODO: Implement local save logic
    console.log('saveLocal');
  }, []);

  const syncToServer = useCallback(async () => {
    // TODO: Implement sync logic
    console.log('syncToServer');
  }, []);

  const value: ProjectContextValue = {
    projectData,
    isLoading,
    error,
    mode: config.mode,
    config, // Provide full config to child components
    updateTask,
    updateProjectInfo,
    addTask,
    deleteTask,
    saveLocal,
    syncToServer,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
