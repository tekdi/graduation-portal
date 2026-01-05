import type { User, UserSearchParams, UserSearchResponse } from '../types/user';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

/**
 * User Service
 * Handles user data operations and API calls
 */

/**
 * Get users list for table view
 * Searches users by parameters and returns the search response
 * 
 * @param params - Search parameters including user_ids, tenant_code, type, page, limit, search, etc.
 * @returns A promise resolving to the search response from the API
 */
export const getUsersList = async (params: UserSearchParams): Promise<UserSearchResponse> => {
  try {
    const {
      user_ids,
      tenant_code = 'brac',
      type = 'user,session_manager,org_admin',
      page = 1,
      limit = 20,
      search,
      role,
      status,
      province,
      district,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code,
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add optional search parameter
    if (search) {
      queryParams.append('search', search);
    }

    // Add optional filter parameters
    if (role) {
      queryParams.append('role', role);
    }
    if (status) {
      queryParams.append('status', status);
    }
    if (province) {
      queryParams.append('province', province);
    }
    if (district) {
      queryParams.append('district', district);
    }

    const endpoint = `${API_ENDPOINTS.USERS_SEARCH}?${queryParams.toString()}`;

    const response = await api.post<UserSearchResponse>(endpoint, {
      user_ids: user_ids || null,
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

