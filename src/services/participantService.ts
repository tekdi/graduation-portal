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
    ({ pathway: _pathway, graduationProgress: _graduationProgress, graduationDate: _graduationDate, ...participant }) =>
      participant,
  );
};

/**
 * Get participant detail data by ID
 * Returns detailed participant data including status, pathway, and progress
 */
export const getParticipantById = (id: string): ParticipantData | undefined => {
  const participant = PARTICIPANTS_DATA.find(p => p.id === id);
  if (!participant) return undefined;

  return {
    id: participant.id,
    name: participant.name,
    status: participant.status,
    pathway: participant.pathway,
    graduationProgress: participant.graduationProgress,
    graduationDate: participant.graduationDate,
  };
};

/**
 * Get participant profile data by ID
 * Returns full participant data including contact info and address
 * Currently uses mock data, will be replaced with API call later
 */
export const getParticipantProfile = (id: string): UnifiedParticipant | undefined => {
  return PARTICIPANTS_DATA.find(p => p.id === id);
};

