import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import logger from '@utils/logger';
import { AssessmentSurveyCardData } from '@app-types/participant';

/**
 * Solution Service
 * Handles API calls for targeted solutions
 */

/**
 * Interface for targeted solutions API request parameters
 */
export interface TargetedSolutionsParams {
  type: string;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Interface for targeted solutions API response
 */
export interface TargetedSolutionsResponse {
  result?: {
    data?: AssessmentSurveyCardData[];
    [key: string]: any;
  };
  data?: AssessmentSurveyCardData[];
  [key: string]: any;
}

/**
 * Get targeted solutions from API
 * 
 * @param params - Query parameters for the API call
 * @returns Promise resolving to array of AssessmentSurveyCardData
 */
export const getTargetedSolutions = async (
  params: TargetedSolutionsParams
): Promise<AssessmentSurveyCardData[]> => {
  try {
    const { type, page = 1, limit = 10, search = '' } = params;
    
    // Build query string
    const queryParams = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
      search: search || '',
    });

    // Make API call with internal-access-token header
    const response = await api.post<TargetedSolutionsResponse>(
      `${API_ENDPOINTS.TARGETED_SOLUTIONS}?${queryParams.toString()}`,
      {},
      {
        headers: {
          'internal-access-token': '9yG*tM*y(7)',
        },
      }
    );

    // Extract data from response (handle different response structures)
    const responseData = response.data;
    const solutions = responseData?.result?.data || responseData?.data || [];

    // Map API response to AssessmentSurveyCardData format
    const mappedSolutions: AssessmentSurveyCardData[] = solutions.map((item) => ({
      ...item,
      icon: item.icon || 'FileText',
      iconColor: item.iconColor || '$primary500',
      navigationUrl: item.navigationUrl || 'observation',
      status: item.status,
    }));

    logger.info('Targeted solutions fetched successfully', {
      count: mappedSolutions.length,
    });

    return mappedSolutions;
  } catch (error: any) {
    logger.error('Error fetching targeted solutions:', error);
    throw error;
  }
};

