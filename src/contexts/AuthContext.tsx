import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';

export type UserRole = 'Admin' | 'Supervisor' | 'LC';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (user) {
        setUser(JSON.parse(user));
      }
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    loadUser();
  }, []);

  // Mock login function - replace with real API call
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock validation
      if (!email || !password) {
        return false;
      }

      // Mock user data based on email
      let role: UserRole = 'LC';
      let name: string = email.split('@')[0];
      
      if (email.toLowerCase().includes('admin')) {
        role = 'Admin';
      } else if (email.toLowerCase().includes('supervisor')) {
        role = 'Supervisor';
      } else if (role === 'LC') {
        // Set default name for LC users
        name = 'Lerato Mokoena';
      }

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        role: role,
      };

      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));

      setUser(mockUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      logger.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, setIsLoggedIn, loading }}
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
