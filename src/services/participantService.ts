import type { ParticipantData, ParticipantSearchParams, ParticipantSearchResponse, Site } from '@app-types/participant';
import { PARTICIPANTS_DATA, PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { ROLE_NAMES } from '@constants/ROLES';
import { getUserProfile } from './authenticationService';
import { User } from '@contexts/AuthContext';

// Type declaration for process.env (injected by webpack DefinePlugin on web, available in React Native)
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
} | undefined;


/**
 * User Search Parameters
 * Parameters for searching/filtering users via API
 */
export interface UserSearchParams {
  user_ids?: string[] | null;
  tenant_code?: string;
  type?: string; // 'user,session_manager,org_admin'
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
  result: any;
}

/**
 * Role data from API
 */
export interface Role {
  id: number;
  title: string;
  user_type: number;
  visibility: string;
  label: string;
  status: string;
  organization_id: number;
  tenant_code: string;
}

/**
 * Get participants list for table view
 * Searches users by user IDs and returns the search response
 *
 * @param params - Search parameters including user_ids array and optional query params
 * @returns A promise resolving to the search response from the API
 */
export const getParticipantsList = async (params: ParticipantSearchParams): Promise<ParticipantSearchResponse> => {
  try {
    const {
      tenant_code = process?.env?.TENANT_CODE,
      type = ROLE_NAMES.USER,
      page = 1,
      limit = 20, 
      search,
      entity_id,
    } = params;


    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code: tenant_code || '',
      type,
      page: page.toString(),
      limit: limit.toString(),
      search: search || '',
    });

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;
    
    // Validate entity_id before constructing endpoint
    if (!entity_id?.trim()) {
      throw new Error('entity_id is required and cannot be empty');
    }
    
    const subEntityListEndpoint = `${API_ENDPOINTS.PARTICIPANTS_SUB_ENTITY_LIST}/${encodeURIComponent(entity_id)}?type=${ROLE_NAMES.PARTICIPANT.toLowerCase()}`;
    const subEntityListResponse = await api.get<any>(subEntityListEndpoint);
    const subEntityList = subEntityListResponse.data?.result?.data || [];

    const response = await api.post<ParticipantSearchResponse>(endpoint, {
      user_ids: subEntityList.map((subEntity: any) => subEntity.externalId),
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get participant profile data by ID
 * Returns full participant data including contact info and address
 * Currently uses mock data, will be replaced with API call later
 */
export const getParticipantProfile = async (id: string): Promise<User |undefined> => {
  try {
    const userProfile = await getUserProfile(id);

    return userProfile;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Update participant address
 * Currently uses mock data update, will be replaced with API call later
 * 
 * @param id - Participant ID
 * @param address - New address object with street, province, and site
 * @returns Updated participant or undefined if not found
 */
export const updateParticipantAddress = async (
  id: string,
  address: {
    street: string;
    province: string;
    site: string;
  }
): Promise<ParticipantData | undefined> => {
  // TODO: Replace with actual API call
  // Example: return await api.put(`/participants/${id}/address`, address);
  
  // Mock implementation - simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const participant = PARTICIPANTS_DATA.find(p => p.id === id);
      if (participant) {
        // Format address as string for now (can be changed to object later)
        const formattedAddress = `${address.street}, ${address.province}, ${address.site}`;
        participant.address = formattedAddress;
        resolve(participant);
      } else {
        resolve(undefined);
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Get province label by value
 * @param value - Province value
 * @returns Province label or the value if not found
 */
export const getProvinceLabel = (value: string): string => {
  const province = PROVINCES.find(p => p.value === value);
  return province?.label || value;
};

/**
 * Get site label by value
 * @param value - Site value
 * @returns Site label or the value if not found
 */
export const getSiteLabel = (value: string): string => {
  const site = SITES.find(s => s.value === value);
  return site?.label || value;
};

/**
 * Get sites by province (for future API integration)
 * For now, returns all sites. In future, this will filter by province
 * @param provinceValue - Province value to filter sites
 * @returns Array of sites for the given province
 */
export const getSitesByProvince = (provinceValue: string): Site[] => {
  // TODO: Replace with API call that filters sites by province
  // For now, return all sites
  return SITES;
};

/**
 * Get users list from API
 * Handles search, filtering, and pagination
 * Reuses same endpoint as participants, differentiated by type parameter
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to UserSearchResponse
 */
export const getUsersList = async (
  params: UserSearchParams
): Promise<UserSearchResponse> => {
  try {
    const {
      user_ids,
      tenant_code = 'brac',
      type = 'user,session_manager,org_admin',  // Different from participant
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
      type,  // 'user,session_manager,org_admin' instead of 'participant'
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

    // Reuse PARTICIPANTS_LIST endpoint (same URL, different type param)
    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;
    
    // Log the complete API URL with query parameters
    console.log('API URL:', endpoint);
    const paramsObj: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    console.log('Query Parameters:', paramsObj);

    // Make POST request
    const response = await api.post<UserSearchResponse>(endpoint, {
      user_ids: user_ids || null,  // Different from participant_ids
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get user roles list for filter dropdown - Dynamic role filter from API
 * Fetches available roles from the API with pagination support
 */
export interface RolesListParams {
  page?: number;
  limit?: number;
}

export const getRolesList = async (
  params?: RolesListParams
): Promise<{
  responseCode: string;
  message: string;
  result: {
    data: Role[];
    count: number;
  };
}> => {
  try {
    const { page = 1, limit = 100 } = params || {};
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.USER_ROLES_LIST}?${queryParams.toString()}`;
    
    // GET request to fetch roles
    const response = await api.get<{
      responseCode: string;
      message: string;
      result: {
        data: Role[];
        count: number;
      };
    }>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Entity Types List Response
 * Response structure from the entity types API
 */
export interface EntityTypesListResponse {
  message: string;
  status: number;
  result: Array<{
    _id: string;
    name: string;
  }>;
}

/**
 * Province data from API
 */
export interface ProvinceEntity {
  _id: string;
  externalId: string;
  name: string;
  locationId: string;
}

/**
 * Get entity types list and store in local storage - Cache entity types for province/district filters
 * Stores entity type name-id pairs for later use
 */
export const getEntityTypesList = async (): Promise<EntityTypesListResponse> => {
  try {
    const endpoint = API_ENDPOINTS.ENTITY_TYPES_LIST;
    
    // GET request - internal-access-token header is added automatically by interceptor for entity-management endpoints
    const response = await api.get<EntityTypesListResponse>(endpoint);

    // Store entity types in local storage (name -> _id mapping)
    if (response.data?.result && Array.isArray(response.data.result)) {
      const entityTypesMap: Record<string, string> = {};
      response.data.result.forEach((entityType) => {
        entityTypesMap[entityType.name] = entityType._id;
      });
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ENTITY_TYPES,
        JSON.stringify(entityTypesMap)
      );
    }

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * Get entity types from local storage
 * Returns cached entity types if available
 */
export const getEntityTypesFromStorage = async (): Promise<Record<string, string> | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.ENTITY_TYPES);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error reading entity types from storage:', error);
    return null;
  }
};

/**
 * Get provinces list by entity type ID - Dynamic province filter from API
 * Uses the province entity type ID to fetch all provinces
 */
export const getProvincesByEntityType = async (
  provinceEntityTypeId: string
): Promise<{
  message: string;
  status: number;
  result: ProvinceEntity[];
}> => {
  try {
    const endpoint = `${API_ENDPOINTS.ENTITIES_BY_TYPE}/${provinceEntityTypeId}`;
    
    // GET request - internal-access-token header is added automatically by interceptor for entity-management endpoints
    const response = await api.get<{
      message: string;
      status: number;
      result: ProvinceEntity[];
    }>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

/**
 * District data from API
 */
export interface DistrictEntity {
  _id: string;
  externalId: string;
  name: string;
  locationId: string;
}

/**
 * Get districts list by province entity ID - Dynamic district filter based on selected province
 * Uses the province entity ID to fetch all districts for that province
 */
export const getDistrictsByProvinceEntity = async (
  provinceEntityId: string,
  params?: { page?: number; limit?: number }
): Promise<{
  message: string;
  status: number;
  result: {
    count: number;
    data: DistrictEntity[];
  };
}> => {
  try {
    const { page = 1, limit = 100 } = params || {};
    
    const queryParams = new URLSearchParams({
      type: 'district',
      page: page.toString(),
      limit: limit.toString(),
    });

    const endpoint = `${API_ENDPOINTS.SUB_ENTITIES_BY_PARENT}/${provinceEntityId}?${queryParams.toString()}`;
    
    // GET request - internal-access-token header is added automatically by interceptor for entity-management endpoints
    const response = await api.get<{
      message: string;
      status: number;
      result: {
        count: number;
        data: DistrictEntity[];
      };
    }>(endpoint);

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
};

