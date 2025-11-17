import React, { useState, useEffect, Suspense, useMemo } from 'react';
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

const Stack = createStackNavigator();

const getAccessPages = (
  userRole?: string,
): { name: string; path?: string; component: React.ComponentType<any> }[] => {
  const role = userRole?.toLowerCase();
  const TemplateManagement = React.lazy(() => import('../screens/TemplateManagement'));

  switch (role) {
    case 'admin':
      return [
        { 
          name: 'home', 
          path: '/', 
          component: HomeScreen 
        },
        { 
          name: 'UserManagement', 
          path: '/user-management', 
          component: HomeScreen
        },
        { 
          name: 'TemplateManagement', 
          path: '/template-management', 
          component: TemplateManagement 
        },
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
      ];
    default:
      return []; // Always return an array, even if empty
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
  const screens: Record<string, any> = {
    login: 'login',
    main: {
      path: '/',
      screens: {},
    },
  };

  if (accessPages.length > 0) {
    const mainScreens: Record<string, string> = {};
    accessPages.forEach(page => {
      const screenPath = page.path
        ? page.path.startsWith('/')
          ? page.path.substr(1)
          : page.path
        : page.name;

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
    setAccessPages(getAccessPages(user?.role));
  }, [user]);

  if (accessPages.length === 0) {
    return <LoginScreen />;
  }

  return (
    <Suspense fallback={<Spinner size="large" color="$primary500" />}>
      <AccessBaseNavigator accessPages={accessPages} />
    </Suspense>
  );
};

const AppNavigator: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isLoggedIn, loading, user } = useAuth();
  const { isWeb } = usePlatform();

  const accessPages = useMemo(() => getAccessPages(user?.role), [user?.role]);
  const linking = useMemo(() => getLinkingConfig(accessPages), [accessPages]);

  useEffect(() => {
    if (I18nManager.isRTL !== isRTL && !isWeb) {
      logger.log(
        'RTL direction changed, app may need restart on native platforms',
      );
    }
  }, [isRTL, isWeb]);

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
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{
              title: t('login.logIn'),
            }}
          />
        ) : (
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