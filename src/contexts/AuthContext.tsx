import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import logger from '@utils/logger';
import { login as loginService, adminLogin as adminLoginService } from '../services/authenticationService';
import offlineStorage from '../services/offlineStorage';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { getToken, removeToken } from '../services/api';
import { ADMIN_ROLES, LC_ROLES } from '@constants/ROLES';

export type UserRole = 'Admin' | 'Supervisor' | 'LC';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  languages?: string[] | null;
  [key: string]: any; // Allow additional user properties from API
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Determines user role based on organizations and roles.
 * Checks admin roles first (priority), then LC roles.
 * Throws error if user doesn't have any authorized role.
 * @param userData - User data from API response
 * @returns UserRole based on role priority (Admin > LC)
 * @throws Error if user doesn't have any authorized role
 */
const determineUserRole = (userData: any): UserRole => {
  // Check if user has organizations array
  if (!userData?.organizations || !Array.isArray(userData.organizations)) {
    // If no organizations, check if user has a direct role property
    const directRole = userData?.role || userData?.userRole;
    if (directRole) {
      const roleLower = String(directRole).toLowerCase();
      const roleString = String(directRole);
      if (roleLower === 'admin' || ADMIN_ROLES.includes(roleString)) {
        return 'Admin';
      }
      if (roleLower === 'lc' || LC_ROLES.includes(roleString)) {
        return 'LC';
      }
    }
    // If no organizations and no valid direct role, throw error
    throw new Error('Unauthorized: This role is not authorized to access the system');
  }

  // Check for admin roles first (priority)
  const adminOrganizations = userData.organizations.filter((org: any) => {
    if (!org?.roles || !Array.isArray(org.roles)) {
      return false;
    }
    return org.roles.some((role: any) => 
      ADMIN_ROLES.includes(role?.title)
    );
  });

  if (adminOrganizations.length > 0) {
    logger.info('User has admin role based on organizations');
    return 'Admin';
  }

  // Check for LC roles
  const lcOrganizations = userData.organizations.filter((org: any) => {
    if (!org?.roles || !Array.isArray(org.roles)) {
      return false;
    }
    return org.roles.some((role: any) => 
      LC_ROLES.includes(role?.title)
    );
  });

  if (lcOrganizations.length > 0) {
    logger.info('User has LC role based on organizations');
    return 'LC';
  }

  // If no matching roles found in organizations, throw unauthorized error
  throw new Error('Unauthorized: This role is not authorized to access the system');
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for both user data and token
        // Both must exist for user to be considered logged in
        const [storedUser, token] = await Promise.all([
          offlineStorage.read<User>(STORAGE_KEYS.AUTH_USER),
          getToken(),
        ]);

        // Validate that user object has required fields and token exists
        const isValidUser = storedUser && 
          typeof storedUser === 'object' && 
          Object.keys(storedUser).length > 0 &&
          (storedUser.id || storedUser.email); // At least one identifier should exist

        // Only set logged in if both user and token exist and user is valid
        if (isValidUser && token) {
          setUser(storedUser);
          setIsLoggedIn(true);
          logger.info('User session restored from storage:', storedUser.email || storedUser.id);
        } else {
          // If either is missing or invalid, clear everything to ensure clean state
          if (storedUser && !token) {
            logger.warn('User data found but no token - clearing user data');
          } else if (token && !isValidUser) {
            logger.warn('Token found but invalid user data - clearing auth data');
          }
          
          // Clear all auth data
          await offlineStorage.remove(STORAGE_KEYS.AUTH_USER);
          await offlineStorage.remove('@auth_refresh_token');
          await offlineStorage.remove('@auth_response');
          if (token) {
            await removeToken();
          }
          
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        logger.error('Error loading user from storage:', error);
        // On error, ensure clean state
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        logger.warn('Login attempted with empty credentials');
        return false;
      }

      // Call the authentication service
      const loginResponse = await loginService(email, password);

      // Check if login was successful
      if (loginResponse.responseCode === 'OK' && loginResponse.result?.user) {
        const userData = loginResponse.result.user;
        
        // Validate that user data is not empty
        if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
          logger.warn('Login response contains empty user object');
          // Do NOT create a fallback user; treat this as a failed login requiring valid user and role check
          logger.error('Login failed: No user data returned from authentication service');
          return false;
        }
        
        // Determine role based on organizations and roles (admin priority first)
        // This will throw an error if user doesn't have authorized role
        let determinedRole: UserRole;
        try {
          determinedRole = determineUserRole(userData);
        } catch (roleError: any) {
          logger.warn('User role not authorized:', roleError.message);
          throw new Error(roleError.message || 'Unauthorized: This role is not authorized to access the system');
        }
        
        // Map API user data to User interface
        // Adjust these mappings based on your actual API user structure
        const mappedUser: User = {
          role: determinedRole,
          ...userData, // Include any additional properties from API
        };

        // Validate mapped user has at least email or id
        if (!mappedUser.id && !mappedUser.email) {
          logger.error('Mapped user object is invalid - missing id and email');
          return false;
        }

        // Save the mapped user data to storage (overwrite the raw user data saved by authenticationService)
        // This ensures the correct structure is always persisted
        await offlineStorage.create(STORAGE_KEYS.AUTH_USER, mappedUser);
        
        // Update the context state
        setUser(mappedUser);
        setIsLoggedIn(true);
        
        logger.info('User logged in successfully:', mappedUser.email || mappedUser.id);
        return true;
      } else {
        logger.warn('Login failed:', loginResponse.message);
        return false;
      }
    } catch (error: any) {
       // @ts-ignore - Allow throwing error (so UI can show the error message)
      logger.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        logger.warn('Admin login attempted with empty credentials');
        return false;
      }

      // Call the admin authentication service
      const loginResponse = await adminLoginService(email, password);

      // Check if login was successful
      if (loginResponse.responseCode === 'OK' && loginResponse.result?.user) {
        const userData = loginResponse.result.user;
        
        // Validate that user data is not empty
        if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
          logger.warn('Admin login response contains empty user object');
          // Use admin email as fallback to create a minimal user object
          const fallbackUser: User = {
            id: email,
            email: email,
            name: email.split('@')[0],
            role: 'Admin' as UserRole,
          };
          await offlineStorage.create(STORAGE_KEYS.AUTH_USER, fallbackUser);
          setUser(fallbackUser);
          setIsLoggedIn(true);
          logger.info('Admin logged in successfully with fallback user:', email);
          return true;
        }
        
        // Determine role based on organizations and roles (admin priority first)
        // This will throw an error if user doesn't have authorized role
        let determinedRole: UserRole;
        try {
          determinedRole = determineUserRole(userData);
        } catch (roleError: any) {
          logger.warn('Admin user role not authorized:', roleError.message);
          throw new Error(roleError.message || 'Unauthorized: This role is not authorized to access the system');
        }
        
        // Map API user data to User interface
        const mappedUser: User = {
          id: userData.id || userData._id || email,
          email: userData.email || email,
          name: userData.name || userData.fullName || userData.username || email.split('@')[0],
          role: determinedRole,
          ...userData, // Include any additional properties from API
        };

        // Validate mapped user has at least email or id
        if (!mappedUser.id && !mappedUser.email) {
          logger.error('Mapped admin user object is invalid - missing id and email');
          return false;
        }

        // Save the mapped user data to storage
        await offlineStorage.create(STORAGE_KEYS.AUTH_USER, mappedUser);
        
        // Update the context state
        setUser(mappedUser);
        setIsLoggedIn(true);
        
        logger.info('Admin logged in successfully:', mappedUser.email || mappedUser.id);
        return true;
      } else {
        logger.warn('Admin login failed:', loginResponse.message);
        return false;
      }
    } catch (error: any) {
      logger.error('Admin login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Remove tokens
      await removeToken();
      
      // Remove user data from storage
      await offlineStorage.remove(STORAGE_KEYS.AUTH_USER);
      await offlineStorage.remove('@auth_refresh_token');
      await offlineStorage.remove('@auth_response');
      
      // Clear context state
      setUser(null);
      setIsLoggedIn(false);
      
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, adminLogin, logout, setIsLoggedIn, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
