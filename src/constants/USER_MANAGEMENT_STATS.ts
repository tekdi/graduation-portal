/**
 * User Management Statistics Data
 * Centralized stats configuration for the User Management screen
 */

export interface UserStatData {
  title: string;
  count: number;
  subLabel: string;
  color?: string;
}

export const USER_MANAGEMENT_STATS: UserStatData[] = [
  {
    title: 'Total Users',
    count: 10,
    subLabel: 'All roles',
  },
  {
    title: 'Participants',
    count: 4,
    subLabel: 'Active learners',
    color: '#3b82f6',
  },
  {
    title: 'Linkage Champions',
    count: 2,
    subLabel: 'Active coaches',
    color: '#f59e0b',
  },
  {
    title: 'Supervisors',
    count: 2,
    subLabel: 'Active supervisors',
    color: '#10b981',
  },
] as const;

