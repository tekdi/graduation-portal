import { StatusCount, StatusType } from '@app-types/screens';
import { STATUS } from './app.constant';

export interface StatusFilterItem {
  key: StatusType;
  label: string;
  count: number;
}

export const getStatusItems = (
  statusCounts: StatusCount,
): StatusFilterItem[] => [
  {
    key: STATUS.NOT_ENROLLED,
    label: 'participants.notEnrolled',
    count: statusCounts.not_enrolled,
  },
  {
    key: STATUS.ENROLLED,
    label: 'participants.enrolled',
    count: statusCounts.enrolled,
  },
  {
    key: STATUS.IN_PROGRESS,
    label: 'participants.inProgress',
    count: statusCounts.in_progress,
  },
  {
    key: STATUS.COMPLETED,
    label: 'participants.completed',
    count: statusCounts.completed,
  },
  {
    key: STATUS.GRADUATED,
    label: 'participants.graduatedStatus',
    count: statusCounts.graduated,
  },
  {
    key: STATUS.DROPOUT,
    label: 'participants.droppedOut',
    count: statusCounts.dropout,
  },
];
