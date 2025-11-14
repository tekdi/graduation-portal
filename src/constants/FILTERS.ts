import { ParticipantStatus, StatusCount } from '@app-types/screens';

export interface StatusFilterItem {
  key: ParticipantStatus;
  label: string;
  count: number;
}

export const getStatusItems = (
  statusCounts: StatusCount,
): StatusFilterItem[] => [
  {
    key: 'not_enrolled' as ParticipantStatus,
    label: 'participants.notEnrolled',
    count: statusCounts.not_enrolled,
  },
  {
    key: 'enrolled' as ParticipantStatus,
    label: 'participants.enrolled',
    count: statusCounts.enrolled,
  },
  {
    key: 'in_progress' as ParticipantStatus,
    label: 'participants.inProgress',
    count: statusCounts.in_progress,
  },
  {
    key: 'completed' as ParticipantStatus,
    label: 'participants.completed',
    count: statusCounts.completed,
  },
  {
    key: 'dropped_out' as ParticipantStatus,
    label: 'participants.droppedOut',
    count: statusCounts.dropped_out,
  },
];
