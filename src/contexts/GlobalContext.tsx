import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GlobalContextType {
  // Add global state here as needed
  // Example: user preferences, app settings, etc.
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load color mode preference
    const loadColorMode = async () => {
      try {
        if (Platform.OS === 'web') {
          // For web, use localStorage
          if (typeof localStorage !== 'undefined') {
            const savedMode = localStorage.getItem('colorMode');
            if (savedMode === 'light' || savedMode === 'dark') {
              setColorMode(savedMode);
            }
          }
        } else {
          // For React Native, use AsyncStorage
          const savedMode = await AsyncStorage.getItem('colorMode');
          if (savedMode === 'light' || savedMode === 'dark') {
            setColorMode(savedMode);
          }
        }
      } catch (error) {
        console.error('Error loading color mode:', error);
      }
    };

    loadColorMode();
  }, []);

  // Wrapper function to persist color mode changes
  const handleSetColorMode = async (mode: 'light' | 'dark') => {
    try {
      setColorMode(mode);
      // Persist to storage
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('colorMode', mode);
        }
      } else {
        await AsyncStorage.setItem('colorMode', mode);
      }
    } catch (error) {
      console.error('Error saving color mode:', error);
    }
  };

  const value: GlobalContextType = {
    isLoading,
    setIsLoading,
    colorMode,
    setColorMode: handleSetColorMode,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

export default GlobalContext;
