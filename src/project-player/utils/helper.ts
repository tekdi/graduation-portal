import { ProjectData } from '../types';

export const normalizeTaskResponse = (
  taskResult: Record<string, any[]>,
): ProjectData[] => {
  const projectMap = new Map<string, ProjectData>();

  Object.entries(taskResult).forEach(([categoryId, projects]) => {
    projects.forEach(project => {
      const existingProject = projectMap.get(project._id);

      if (!existingProject) {
        projectMap.set(project._id, {
          _id: project._id,
          solutionId: project._id,
          title: project.title,
          name: project.title,
          description: project.description,
          status: project.status,
          progress: 0,
          tasks: project.tasks || [],
          metaInformation: {
            categoryIds: [categoryId], // ✅ guaranteed
            externalId: project.externalId,
            programId: project.programId,
          },
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        });
      } else {
        existingProject?.metaInformation.categoryIds.push(categoryId);
      }
    });
  });

  return Array.from(projectMap.values());
};

export const enrichChildrenWithProjects = (
  children: any[],
  projects: ProjectData[],
) => {
  return children.map(child => {
    const matchedProjects = projects.filter(project =>
      project?.metaInformation.categoryIds.includes(child._id),
    );

    return {
      ...child,
      projects: [
        ...(child.projects || []),
        ...matchedProjects.filter(
          p =>
            !(child.projects || []).some(
              (existing: any) => existing.solutionId === p.solutionId,
            ),
        ),
      ],
    };
  });
};
