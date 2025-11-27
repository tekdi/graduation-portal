/**
 * Participant Status Types
 * Defines the possible enrollment statuses for a participant
 */
export type ParticipantStatus =
  | 'not-enrolled'
  | 'enrolled'
  | 'in-progress'
  | 'completed'
  | 'dropout';

/**
 * Pathway Type
 * Defines the possible pathway types for participants
 * These keys correspond to translation keys in locale files
 */
export type PathwayType = 'employment' | 'entrepreneurship';

/**
 * Participant Data Interface
 * Defines the structure of participant data with status and progress tracking.
 */
export interface ParticipantData {
  id: string;
  name: string;
  status: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
}

