import React, { useEffect, useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager } from 'react-native';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth } from '@contexts/AuthContext';
import { Spinner } from '@ui';
import logger from '@utils/logger';
import { usePlatform } from '@utils/platform';
import AccessBaseNavigator from './navigators/AccessBaseNavigator';
import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Auth/LoginScreen';
import SelectLanguageScreen from '../screens/Language/Index';
import WelcomePage from '../screens/Welcome/index';
import ParticipantsList from '../screens/ParticipantsList/index';

const Stack = createStackNavigator();

// Shared function to generate accessPages based on user role
const getAccessPages = (
  userRole?: string,
): { name: string; path?: string; component: React.ComponentType<any> }[] => {
  const role = userRole?.toLowerCase();

  switch (role) {
    case 'admin':
      return [
        { name: 'home', path: '/', component: HomeScreen },
        {
          name: 'select-language',
          path: '/select-language',
          component: SelectLanguageScreen,
        },
      ];
    case 'supervisor':
      return [{ name: 'home', path: '/home', component: HomeScreen }];
    case 'lc':
      return [
        { name: 'welcome', component: WelcomePage },
        { name: 'select-language', component: SelectLanguageScreen },
        { name: 'dashboard', component: HomeScreen },
        { name: 'participants', component: ParticipantsList },
      ];
    default:
      return [];
  }
};

// Function to generate linking configuration based on accessPages
const getLinkingConfig = (
  accessPages: {
    name: string;
    path?: string;
    component: React.ComponentType<any>;
  }[],
) => {
  // Define the base screens that are always available in linking
  const screens: Record<string, any> = {
    login: 'login',
    main: {
      path: '/',
      screens: {},
    },
  };

  // Dynamically generate nested routes from accessPages array
  if (accessPages.length > 0) {
    const mainScreens: Record<string, string> = {};
    accessPages.forEach(page => {
      // Prefer explicit 'path' property for each page, else fallback to name
      const screenPath = page.path
        ? // Remove leading slash for react-navigation config consistency
          page.path.startsWith('/')
          ? page.path.substr(1)
          : page.path
        : page.name;

      // Special handling for LC role:
      // If there are multiple pages (e.g., 'home' and 'home1') and this is 'home', map it to select-language
      if (
        page.name === 'home' &&
        accessPages.length > 1 &&
        accessPages.some(p => p.name === 'home1')
      ) {
        mainScreens[page.name] = 'select-language';
      } else {
        mainScreens[page.name] = screenPath;
      }
    });
    screens.main.screens = mainScreens;
  }

  return {
    prefixes: [],
    config: {
      screens,
    },
  };
};

// Component to render role-based navigator
const RoleBasedNavigator: React.FC = () => {
  const { user } = useAuth();
  const [accessPages, setAccessPages] = useState<
    { name: string; path?: string; component: React.ComponentType<any> }[]
  >([]);

  useEffect(() => {
    // Use shared function to get accessPages based on user role
    setAccessPages(getAccessPages(user?.role));
  }, [user]);

  if (accessPages.length === 0) {
    return <LoginScreen />;
  }

  return <AccessBaseNavigator accessPages={accessPages} />;
};

const AppNavigator: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isLoggedIn, loading, user } = useAuth();
  const { isWeb } = usePlatform();

  // Generate accessPages based on user role
  const accessPages = useMemo(() => getAccessPages(user?.role), [user?.role]);

  // Generate dynamic linking configuration based on accessPages
  // Memoize to prevent unnecessary recalculations
  const linking = useMemo(() => getLinkingConfig(accessPages), [accessPages]);

  // Update I18nManager when RTL changes (for React Native)
  useEffect(() => {
    // Note: On React Native (not web), changing RTL requires app restart
    // This ensures the correct direction is applied
    if (I18nManager.isRTL !== isRTL && !isWeb) {
      logger.log(
        'RTL direction changed, app may need restart on native platforms',
      );
    }
  }, [isRTL, isWeb]);

  // Log current URL on web for debugging
  useEffect(() => {
    if (isWeb) {
      logger.log('Current URL:', window.location.href);
      logger.log('Pathname:', window.location.pathname);
    }
  }, [isWeb]);

  if (loading) {
    return <Spinner size="large" color="$primary500" />;
  }

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Spinner size="large" color="$primary500" />}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: isWeb
            ? ({ width: '100%', height: '100vh' } as any)
            : ({ width: '100%' } as any),
        }}
      >
        {!isLoggedIn ? (
          // Show login screen when not logged in
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{
              title: t('login.logIn'),
            }}
          />
        ) : (
          // Show role-based navigator when logged in
          <Stack.Screen
            name="main"
            component={RoleBasedNavigator}
            options={{
              title: t('navigation.menu'),
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
