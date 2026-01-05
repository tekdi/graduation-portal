/**
 * User Interface
 * Represents a user in the User Management system
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

/**
 * User Search Parameters
 * Parameters for searching/filtering users via API
 */
export interface UserSearchParams {
  user_ids?: string[] | null;
  tenant_code?: string;
  type?: string; // Comma-separated string: 'user,session_manager,org_admin'
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  province?: string;
  district?: string;
}

/**
 * User Search Response
 * Response structure from the user search API
 */
export interface UserSearchResponse {
  responseCode: string;
  message: string;
  result: {
    data: User[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

