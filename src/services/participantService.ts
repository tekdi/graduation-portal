import { Participant } from '@app-types/screens';
import type { ParticipantData, UnifiedParticipant } from '@app-types/participant';
import { PARTICIPANTS_DATA } from '@constants/PARTICIPANTS_LIST';

/**
 * Participant Service
 * Handles participant data operations and transformations
 */

/**
 * Get participants list for table view
 * Maps UnifiedParticipant[] to Participant[] format by removing detail fields
 */
export const getParticipantsList = (): Participant[] => {
  return PARTICIPANTS_DATA.map(
    ({ pathway, graduationProgress, graduationDate, ...participant }) =>
      participant,
  );
};

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

