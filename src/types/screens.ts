export type ParticipantStatus =
  | 'not_enrolled'
  | 'enrolled'
  | 'in_progress'
  | 'completed'
  | 'dropped_out';

export interface Participant {
  id: string;
  name: string;
  progress: number;
  email: string;
  phone: string | number;
  status?: ParticipantStatus;
}

export interface StatusCount {
  not_enrolled: number;
  enrolled: number;
  in_progress: number;
  completed: number;
  dropped_out: number;
}

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
  status?: ParticipantStatus | '';
  page?: number;
  limit?: number;
}
