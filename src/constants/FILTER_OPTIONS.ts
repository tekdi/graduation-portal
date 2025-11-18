/**
 * Filter Options API
 * This simulates fetching filter options from an API
 * In real implementation, replace with actual API calls
 */

export interface FilterOptionsResponse {
  roles: string[];
  statuses: string[];
}

// Mock API function to fetch filter options
export const fetchFilterOptions = async (): Promise<FilterOptionsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Example: API might return values like "Linkage-champion" or "linkage_champion"
  // We'll map them to display-friendly values
  return {
    roles: ['admin', 'supervisor', 'linkage-champion', 'participant'], // API format
    statuses: ['active', 'deactivated'], // API format
  };
};

/**
 * Map API values to display values
 * This handles cases where API returns different formats
 */
export const mapRoleToDisplay = (apiRole: string): string => {
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'supervisor': 'Supervisor',
    'linkage-champion': 'Linkage Champion',
    'linkage_champion': 'Linkage Champion',
    'linkagechampion': 'Linkage Champion',
    'participant': 'Participant',
  };
  
  return roleMap[apiRole.toLowerCase()] || apiRole;
};

/**
 * Map display values back to API values for filtering
 * This ensures filtering works with actual API values
 */
export const mapDisplayToApiRole = (displayRole: string): string => {
  const reverseMap: Record<string, string> = {
    'Admin': 'admin',
    'Supervisor': 'supervisor',
    'Linkage Champion': 'linkage-champion',
    'Participant': 'participant',
  };
  
  return reverseMap[displayRole] || displayRole.toLowerCase();
};

export const mapStatusToDisplay = (apiStatus: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Active',
    'deactivated': 'Deactivated',
    'inactive': 'Deactivated',
  };
  
  return statusMap[apiStatus.toLowerCase()] || apiStatus;
};

export const mapDisplayToApiStatus = (displayStatus: string): string => {
  const reverseMap: Record<string, string> = {
    'Active': 'active',
    'Deactivated': 'deactivated',
  };
  
  return reverseMap[displayStatus] || displayStatus.toLowerCase();
};

