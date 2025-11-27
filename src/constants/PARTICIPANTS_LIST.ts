import { Participant } from '@app-types/screens';
import type { ParticipantData, UnifiedParticipant } from '@app-types/participant';

/**
 * Mock Participants Data
 * Single source of truth for all participant data
 * Used for demo purposes until API is integrated
 */
const PARTICIPANTS_DATA: UnifiedParticipant[] = [
  {
    id: 'P-006',
    name: 'Aisha Patel',
    progress: 0,
    email: 'aisha@example.com',
    phone: '(555) 678-9012',
    status: 'not_enrolled',
    pathway: undefined,
    graduationProgress: undefined,
    graduationDate: undefined,
  },
  {
    id: 'P-009',
    name: 'David Freeman',
    progress: 0,
    email: 'david@example.com',
    phone: '(555) 901-2345',
    status: 'enrolled',
    pathway: 'employment',
    graduationProgress: undefined,
    graduationDate: undefined,
  },
  {
    id: 'P-014',
    name: 'Natasha Ivanova',
    progress: 57,
    email: 'natasha@example.com',
    phone: '(555) 456-7890',
    status: 'in_progress',
    pathway: 'employment',
    graduationProgress: 57,
    graduationDate: undefined,
  },
  {
    id: 'P-019',
    name: 'Tyler Mitchell',
    progress: 100,
    email: 'tyler@example.com',
    phone: '(555) 901-2345',
    status: 'completed',
    pathway: 'entrepreneurship',
    graduationProgress: 100,
    graduationDate: '2025-09-20',
  },
];

/**
 * Participants list for table view
 * Exports Participant[] format for list component
 */
export const PARTICIPANTS_LIST: Participant[] = PARTICIPANTS_DATA.map(
  ({ pathway, graduationProgress, graduationDate, ...participant }) =>
    participant,
);

/**
 * Get participant detail data by ID
 * Returns detailed participant data including status, pathway, and progress
 * Converts status format from underscore to hyphen for ParticipantData type
 */
export const getParticipantById = (id: string): ParticipantData | undefined => {
  const participant = PARTICIPANTS_DATA.find(p => p.id === id);
  if (!participant) return undefined;

  // Convert status from underscore format to hyphen format
  const statusMap: Record<string, ParticipantData['status']> = {
    not_enrolled: 'not-enrolled',
    enrolled: 'enrolled',
    in_progress: 'in-progress',
    completed: 'completed',
    dropout: 'dropout',
  };

  return {
    id: participant.id,
    name: participant.name,
    status: statusMap[participant.status] || 'not-enrolled',
    pathway: participant.pathway,
    graduationProgress: participant.graduationProgress,
    graduationDate: participant.graduationDate,
  };
};
