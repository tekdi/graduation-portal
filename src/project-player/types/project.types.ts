export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'submitted';

export interface ProjectData {
  _id: string;
  solutionId: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'submitted';
  progress: number;
  tasks: Task[];
  metaData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  name: string;
  description?: string;
  type: 'simple' | 'file' | 'observation' | 'project' | 'profile-update';
  status: TaskStatus;
  isRequired: boolean;
  children?: Task[]; // For nested project tasks
  attachments?: Attachment[];
  observationFormId?: string;
  metadata?: Record<string, any>;
}

export interface Attachment {
  _id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  localPath?: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  createdAt: string;
}
