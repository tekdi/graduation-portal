import { Task, TaskStatus } from '../../types/project.types';

export const getTaskProgress = (task: Task): number => {
  if (!task.children || task.children.length === 0) {
    return task.status === 'completed' || task.status === 'submitted' ? 100 : 0;
  }

  const completedChildren = task.children.filter(
    child => child.status === 'completed' || child.status === 'submitted',
  ).length;
  return Math.round((completedChildren / task.children.length) * 100);
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'completed':
      return '$success500';
    case 'in-progress':
      return '$info500';
    case 'submitted':
      return '$primary500';
    case 'pending':
    default:
      return '$secondary500';
  }
};

export const canEditTask = (
  _task: Task,
  mode: 'preview' | 'edit' | 'read-only',
): boolean => mode === 'edit';
