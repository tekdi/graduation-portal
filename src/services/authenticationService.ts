import api, { saveToken } from './api';
import offlineStorage from './offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';

/**
 * Logs in the user with the specified credentials.
 *
 * @param identifier - The user's identifier (usually email or username)
 * @param password - The user's password
 * @returns A promise resolving to the login response from the API
 */
export const login = async (
  identifier: string,
  password: string
): Promise<any> => {
  try {
    const response = await api.post('/user/v1/account/login', {
      identifier,
      password,
    });

    // Extract token from response (adjust based on your API response structure)
    // Common patterns: response.data.token, response.data.accessToken, response.data.data.token
    const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
    
    // Save token if present
    if (token) {
      await saveToken(token);
    }

    // Save complete login response data to offline storage
    // This works for both web and Android
    if (response.data) {
      await offlineStorage.create(STORAGE_KEYS.AUTH_USER, response.data);
    }

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};
