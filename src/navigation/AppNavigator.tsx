import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager } from 'react-native';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth } from '@contexts/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import AdminNavigator from './navigators/AdminNavigator';
import SupervisorNavigator from './navigators/SupervisorNavigator';
import LCNavigator from './navigators/LCNavigator';
import { Spinner } from '@ui';
import logger from '@utils/logger';
import { usePlatform } from '@utils/platform';

const Stack = createStackNavigator();

// Linking configuration for web URL routing
const linking = {
  prefixes: [],
  config: {
    screens: {
      login: 'login',
      main: '/',
      selectLanguage: 'select-language',
    },
  },
};

// Component to render role-based navigator
const RoleBasedNavigator: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Return appropriate navigator based on user role
  switch (user.role) {
    case 'Admin':
      return <AdminNavigator />;
    case 'Supervisor':
      return <SupervisorNavigator />;
    case 'LC':
      return <LCNavigator />;
    default:
      return <LCNavigator />;
  }
};

const AppNavigator: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isLoggedIn, loading } = useAuth();
  const { isWeb } = usePlatform();

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
        initialRouteName="login"
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
