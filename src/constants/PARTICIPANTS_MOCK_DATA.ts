import type { ParticipantData } from '@app-types/participant';

/**
 * Re-export types for backward compatibility
 * @deprecated Import from '@app-types/participant' instead
 */
export type { ParticipantStatus, PathwayType, ParticipantData } from '@app-types/participant';

/**
 * Mock Participants Data
 * Contains 5 sample participants, one for each status type.
 * Used for development and testing purposes.
 * 
 * @remarks
 * In production, replace this with an API call to fetch participant data.
 * The pathway field uses translation keys that correspond to keys in locale files:
 * - 'employment' → 'participantDetail.pathways.employment'
 * - 'entrepreneurship' → 'participantDetail.pathways.entrepreneurship'
 * 
 * @example
 * ```typescript
 * // Fetch participant by ID
 * const participant = getParticipantById('1001');
 * // Returns: { id: '1001', name: 'Noma Sithole', status: 'not-enrolled', ... }
 * ```
 */
export const PARTICIPANTS_MOCK_DATA: ParticipantData[] = [
  {
    id: '1001',
    name: 'Noma Sithole',
    status: 'not-enrolled',
    pathway: undefined,
    graduationProgress: undefined,
    graduationDate: undefined,
  },
  {
    id: '1002',
    name: 'Nosipho Khumalo',
    status: 'enrolled',
    pathway: 'employment',
    graduationProgress: undefined,
    graduationDate: undefined,
  },
  {
    id: '1003',
    name: 'Thabo Mthembu',
    status: 'in-progress',
    pathway: 'employment',
    graduationProgress: 57,
    graduationDate: undefined,
  },
  {
    id: '1004',
    name: 'Zanele Dlamini',
    status: 'completed',
    pathway: 'entrepreneurship',
    graduationProgress: 100,
    graduationDate: '2025-09-20',
  },
  {
    id: '1005',
    name: 'Sipho Nkosi',
    status: 'dropout',
    pathway: 'employment',
    graduationProgress: undefined,
    graduationDate: undefined,
  },
];

/**
 * Get participant data by ID
 * 
 * Searches the mock data array for a participant with the matching ID.
 * 
 * @param id - Participant ID to search for
 * @returns Participant data if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const participant = getParticipantById('1001');
 * if (participant) {
 *   console.log(participant.name); // 'Noma Sithole'
 * }
 * ```
 * 
 * @remarks
 * In production, replace this with an API call:
 * ```typescript
 * const participant = await api.getParticipant(id);
 * ```
 */
export const getParticipantById = (id: string): ParticipantData | undefined => {
  return PARTICIPANTS_MOCK_DATA.find(participant => participant.id === id);
};

