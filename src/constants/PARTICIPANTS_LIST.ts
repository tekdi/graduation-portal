import type { UnifiedParticipant } from '@app-types/participant';

/**
 * Mock Participants Data
 * Single source of truth for all participant data
 * Used for demo purposes until API is integrated
 */
export const PARTICIPANTS_DATA: UnifiedParticipant[] = [
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
  {
    id: 'P-020',
    name: 'John Doe',
    progress: 10,
    email: 'john@example.com',
    phone: '(555) 901-2345',
    status: 'dropout',
    pathway: 'entrepreneurship',
    graduationProgress: 50,
    graduationDate: 'undefined',
  },
];
