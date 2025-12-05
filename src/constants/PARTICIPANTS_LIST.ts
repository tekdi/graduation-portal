import type { UnifiedParticipant, Province, Site } from '@app-types/participant';

/**
 * South African Provinces
 * Mock data for province selection dropdown
 * TODO: Replace with API call in future
 */

export const PROVINCES: Province[] = [
  { value: 'eastern-cape', label: 'Eastern Cape' },
  { value: 'free-state', label: 'Free State' },
  { value: 'gauteng', label: 'Gauteng' },
  { value: 'kwazulu-natal', label: 'KwaZulu-Natal' },
  { value: 'limpopo', label: 'Limpopo' },
  { value: 'mpumalanga', label: 'Mpumalanga' },
  { value: 'northern-cape', label: 'Northern Cape' },
  { value: 'north-west', label: 'North West' },
  { value: 'western-cape', label: 'Western Cape' },
] as const;

/**
 * Site Options
 * Mock data for site selection dropdown
 * TODO: Replace with API call in future (may depend on selected province)
 */
export const SITES: Site[] = [
  { value: 'site-a', label: 'Site A - Urban', type: 'Urban' },
  { value: 'site-b', label: 'Site B - Urban', type: 'Urban' },
  { value: 'site-c', label: 'Site C - Rural', type: 'Rural' },
  { value: 'site-d', label: 'Site D - Rural', type: 'Rural' },
  { value: 'site-e', label: 'Site E - Peri-urban', type: 'Peri-urban' },
  { value: 'site-f', label: 'Site F - Peri-urban', type: 'Peri-urban' },
] as const;

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
    address: '123 Main Street, City, State',
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
    address: '456 Oak Avenue, City, State',
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
    address: '789 Pine Road, City, State',
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
    address: '321 Elm Street, City, State',
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
    address: '654 Maple Drive, City, State',
    status: 'dropout',
    pathway: 'entrepreneurship',
    graduationProgress: 50,
    graduationDate: 'undefined',
  },
];
