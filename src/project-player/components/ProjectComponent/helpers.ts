import { Task, TaskStatus } from '../../types/project.types';
import { TASK_STATUS } from '../../../constants/app.constant';

export const getTaskProgress = (task: Task): number => {
  if (!task.children || task.children.length === 0) {
    return task.status === TASK_STATUS.COMPLETED ? 100 : 0;
  }

  const completedChildren = task.children.filter(
    child => child.status === TASK_STATUS.COMPLETED,
  ).length;
  return Math.round((completedChildren / task.children.length) * 100);
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TASK_STATUS.TO_DO:
      return '$amber500'; // Orange/Amber for pending work
    case TASK_STATUS.COMPLETED:
      return '$green500'; // Green for completed
    default:
      return '$gray500';
  }
};

export const canEditTask = (
  _task: Task,
  mode: 'preview' | 'edit' | 'read-only',
): boolean => mode === 'edit';
