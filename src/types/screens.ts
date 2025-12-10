import { STATUS } from '../constants/app.constant';
export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export interface Participant {
  id: string;
  name: string;
  progress: number;
  email: string;
  phone: string;
  address?: string; // Optional address field
  status?: StatusType;
}

export type StatusCount = {
  [K in StatusType]: number;
};

export interface ParticipantsResponse {
  result: {
    data: {
      count: number;
      participants: Participant[];
    };
  };
  statusCount?: StatusCount;
}

export interface ParticipantsQueryParams {
  searchKey?: string;
  status?: StatusType | '' | StatusType[]; // Single status or array of statuses
  id?: string | string[]; // Single ID or array of IDs
  page?: number;
  limit?: number;
}
