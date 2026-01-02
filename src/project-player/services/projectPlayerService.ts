import axios from 'axios';
import { PROJECT_PLAYER_CONFIGS } from '../../constants/PROJECTDATA';
import { ApiResponse } from '../types/components.types';
import { API_ENDPOINTS } from './apiEndpoints';
import { isWeb } from '@utils/platform';
import { navigate } from '../../navigation/navigationRef';

// Ensure baseURL is always valid (not empty string)
const getBaseURL = (): string => {
  const url = PROJECT_PLAYER_CONFIGS.baseUrl;
  // If baseUrl is empty or invalid, use a default fallback
  if (!url || url.trim() === '') {
    console.warn(
      'API_BASE_URL is not set in environment, using default fallback',
    );
    return 'https://brac-dev.tekdinext.com/api/project/v1';
  }
  return url;
};

export const apiClient = axios.create({
  // Use baseUrl from PROJECT_PLAYER_CONFIGS (which gets from env, with fallback)
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  // Get token from PROJECT_PLAYER_CONFIGS.accessToken (which fetches from AsyncStorage)
  try {
    const token = await PROJECT_PLAYER_CONFIGS.accessToken();
    console.log('token', token);
    if (token) {
      config.headers['X-auth-token'] = token;
    }
  } catch (error) {
    console.error(
      'Error getting token from AsyncStorage in interceptor:',
      error,
    );
    // No token will be added if AsyncStorage fails
  }

  return config;
});

apiClient.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      const redirectUrl =
        PROJECT_PLAYER_CONFIGS.redirectionLinks.unauthorizedRedirectUrl;

      if (isWeb) {
        window.location.href = redirectUrl;
      } else {
        const routeName = redirectUrl.startsWith('/')
          ? redirectUrl.slice(1)
          : redirectUrl;
        navigate(routeName);
      }
    }
    return Promise.reject(error);
  },
);

export const handleApiError = (error: unknown): ApiResponse<null> => {
  if (axios.isAxiosError(error)) {
    return {
      data: null,
      error: error.response
        ? `HTTP ${error.response.status}: ${error.response.statusText}`
        : error.message,
    };
  }

  return {
    data: null,
    error: error instanceof Error ? error.message : 'Unknown error occurred',
  };
};

export const getProjectTemplatesList = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_TEMPLATES_LIST);

    return { data: response.data.result };
  } catch (error) {
    return handleApiError(error);
  }
};
