/**
 * User Management Type Definitions
 * Type definitions for User Management table data
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Linkage Champion' | 'Participant';
  status: 'Active' | 'Deactivated';
  province: string;
  district: string;
  lastLogin: string;
  details: {
    type: 'assigned' | 'progress';
    value: number; // For assigned: count, for progress: percentage
  } | null;
}

