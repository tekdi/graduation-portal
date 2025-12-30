import axios from 'axios';
import { PROJECT_PLAYER_CONFIGS } from '../../constants/PROJECTDATA';
import { ApiResponse } from '../types/components.types';
import { API_ENDPOINTS } from './apiEndpoints';

export const apiClient = axios.create({
  baseURL: PROJECT_PLAYER_CONFIGS.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') ||
        PROJECT_PLAYER_CONFIGS.accessToken
      : null;

  if (token) {
    config.headers['X-auth-token'] = token;
  }

  return config;
});

apiClient.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      window.location.href =
        PROJECT_PLAYER_CONFIGS.redirectionLinks.unauthorizedRedirectUrl;
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
