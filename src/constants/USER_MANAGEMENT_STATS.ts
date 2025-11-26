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
    title: 'admin.stats.totalUsers',
    count: 10,
    subLabel: 'admin.stats.allRoles',
  },
  {
    title: 'admin.stats.participants',
    count: 4,
    subLabel: 'admin.stats.activeLearners',
    color: '#3b82f6',
  },
  {
    title: 'admin.stats.linkageChampions',
    count: 2,
    subLabel: 'admin.stats.activeCoaches',
    color: '#f59e0b',
  },
  {
    title: 'admin.stats.supervisors',
    count: 2,
    subLabel: 'admin.stats.activeSupervisors',
    color: '#10b981',
  },
];

