import { Participant } from '@app-types/screens';
import type { ParticipantData, Province, Site } from '@app-types/participant';
import { PARTICIPANTS_DATA, PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';

/**
 * Participant Service
 * Handles participant data operations and transformations
 */

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
 * Maps ParticipantData[] to Participant[] format by converting contact to phone
 */
export const getParticipantsList = (): Participant[] => {
  return PARTICIPANTS_DATA.map((participant) => ({
    id: participant.id,
    name: participant.name,
    phone: participant.contact, // Map contact to phone
    email: participant.email || '',
    address: participant.address,
    progress: participant.progress ?? 0,
    status: participant.status as Participant['status'], // Use display status directly
  }));
};

/**
 * Get participant detail data by ID
 * Returns detailed participant data including status, pathway, and progress
 */
export const getParticipantById = (id: string): ParticipantData | undefined => {
  const participant = PARTICIPANTS_DATA.find(p => p.id === id);
  if (!participant) return undefined;

  return {
    id: participant.id,
    name: participant.name,
    contact: participant.contact,
    status: participant.status,
    progress: participant.progress,
    pathway: participant.pathway || undefined,
    graduationProgress: participant.graduationProgress != null && !isNaN(Number(participant.graduationProgress)) ? participant.graduationProgress : undefined,
    graduationDate: participant.graduationDate && participant.graduationDate !== '' ? participant.graduationDate : undefined,
    email: participant.email,
    address: participant.address,
  };
};

/**
 * Get participant profile data by ID
 * Returns full participant data including contact info and address
 * Currently uses mock data, will be replaced with API call later
 */
export const getParticipantProfile = (id: string): ParticipantData | undefined => {
  return PARTICIPANTS_DATA.find(p => p.id === id);
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
 * Get user roles list for filter dropdown
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
 * Get entity types list and store in local storage
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
 * Get provinces list by entity type ID
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
 * Get districts list by province entity ID
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

