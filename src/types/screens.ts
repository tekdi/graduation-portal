import { STATUS } from '../constants/app.constant';
export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export interface Participant {
  id: string;
  name: string;
  progress: number;
  email: string;
  phone: string;
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
  status?: StatusType | '';
  page?: number;
  limit?: number;
}
