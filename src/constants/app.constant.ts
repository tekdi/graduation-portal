export const STATUS = {
  NOT_ENROLLED: 'not_enrolled',
  ENROLLED: 'enrolled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DROPOUT: 'dropout',
};

// Task Status Constants
export const TASK_STATUS = {
  TO_DO: 'to-do',
  COMPLETED: 'completed',
} as const;

// Project Status Constants
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
} as const;

// Upload Status Constants
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
} as const;

/**
 * Card Status Types
 * Defines the possible status types for assessment survey cards
 */
export const CARD_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  GRADUATED: 'graduated',
} as const;
