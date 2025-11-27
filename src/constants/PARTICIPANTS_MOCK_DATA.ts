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
 * Defines the structure of participant data
 * 
 * @property id - Unique participant identifier
 * @property name - Participant's full name
 * @property status - Current enrollment status
 * @property pathway - Pathway type key (used for translation)
 * @property graduationProgress - Progress percentage (0-100) for in-progress status
 * @property graduationDate - Graduation date string for completed status
 * 
 * @remarks
 * In production, this interface should match the API response structure.
 * The `pathway` field uses translation keys ('employment' | 'entrepreneurship')
 * which are translated in the UI using the `t()` function.
 */
export interface ParticipantData {
  id: string;
  name: string;
  status: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
}

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

