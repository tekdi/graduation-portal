import api, { saveToken } from './api';
import offlineStorage from './offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import logger from '@utils/logger';

export interface LoginResponse {
  responseCode: string;
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    user: any;
  };
}

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
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/user/v1/account/login', {
      identifier,
      password,
    });

    const responseData = response.data;

    // Check if response is successful
    if (responseData.responseCode !== 'OK' || !responseData.result) {
      throw new Error(responseData.message || 'Login failed');
    }

    // Extract tokens and user from result
    const { access_token, refresh_token, user } = responseData.result;
    
    // Validate and save access token (must be non-empty string)
    if (access_token && typeof access_token === 'string' && access_token.trim().length > 0) {
      await saveToken(access_token);
      logger.info('Access token saved successfully');
    } else {
      logger.warn('Access token is missing or empty in login response');
      throw new Error('Access token is required but was not provided');
    }

    // Save refresh token separately if present and non-empty
    if (refresh_token && typeof refresh_token === 'string' && refresh_token.trim().length > 0) {
      await offlineStorage.create('@auth_refresh_token', refresh_token);
      logger.info('Refresh token saved successfully');
    }

    // Save user data to offline storage (will be overwritten by AuthContext with mapped user)
    if (user) {
      await offlineStorage.create(STORAGE_KEYS.AUTH_USER, user);
      logger.info('User data saved to storage');
    }

    // Save complete response for reference
    await offlineStorage.create('@auth_response', responseData);

    return responseData;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Logs in as admin with provided credentials using admin-specific endpoint.
 *
 * @param identifier - The admin's identifier (usually email or username)
 * @param password - The admin's password
 * @returns A promise resolving to the login response from the API
 */
export const adminLogin = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // Admin login uses the same endpoint but is a separate function to distinguish admin login flow
    const response = await api.post<LoginResponse>('/user/v1/admin/login', {
      identifier,
      password,
    });

    const responseData = response.data;

    // Check if response is successful
    if (responseData.responseCode !== 'OK' || !responseData.result) {
      throw new Error(responseData.message || 'Admin login failed');
    }

    // Extract tokens and user from result
    const { access_token, refresh_token, user } = responseData.result;
    
    // Validate and save access token (must be non-empty string)
    if (access_token && typeof access_token === 'string' && access_token.trim().length > 0) {
      await saveToken(access_token);
      logger.info('Access token saved successfully');
    } else {
      logger.warn('Access token is missing or empty in admin login response');
      throw new Error('Access token is required but was not provided');
    }

    // Save refresh token separately if present and non-empty
    if (refresh_token && typeof refresh_token === 'string' && refresh_token.trim().length > 0) {
      await offlineStorage.create('@auth_refresh_token', refresh_token);
      logger.info('Refresh token saved successfully');
    }

    // Save user data to offline storage (will be overwritten by AuthContext with mapped user)
    if (user) {
      await offlineStorage.create(STORAGE_KEYS.AUTH_USER, user);
      logger.info('User data saved to storage');
    }

    // Save complete response for reference
    await offlineStorage.create('@auth_response', responseData);

    return responseData;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};
