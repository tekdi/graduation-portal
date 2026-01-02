import type { ParticipantData, ParticipantSearchParams, ParticipantSearchResponse, Site } from '@app-types/participant';
import { PARTICIPANTS_DATA, PROVINCES, SITES } from '@constants/PARTICIPANTS_LIST';
import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';


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
      user_ids,
      tenant_code = 'brac',
      type = 'user',
      page = 1,
      limit = 20, 
      search,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      tenant_code,
      type,
      page: page.toString(),
      limit: limit.toString(),
      search: search || '',
    });

    const endpoint = `${API_ENDPOINTS.PARTICIPANTS_LIST}?${queryParams.toString()}`;

    const response = await api.post<ParticipantSearchResponse>(endpoint, {
      user_ids,
    });

    return response.data;
  } catch (error: any) {
    // Error is already handled by axios interceptor
    throw error;
  }
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

