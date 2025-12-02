export type TaskType =
  | 'simple'
  | 'file'
  | 'observation'
  | 'project'
  | 'profile-update';

export interface TaskActionHandlers {
  onStatusChange?: (taskId: string, status: string) => void;
  onUpload?: (taskId: string, files: File[]) => void;
  onOpenForm?: (taskId: string) => void;
  onAddSubTask?: (parentTaskId: string) => void;
}
