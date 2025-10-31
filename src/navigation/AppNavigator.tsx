import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager, Platform } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import SelectLanguageScreen from '../screens/Language/Index';
import { Spinner } from '@ui';
import logger from '../utils/logger';
import { usePlatform } from '../utils/usePlatform';

const Stack = createStackNavigator();

// Linking configuration for web URL routing
const linking = {
  prefixes: [],
  config: {
    screens: {
      'select-language': 'select-language',
    },
  },
};

const AppNavigator: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isWeb } = usePlatform();

  // Update I18nManager when RTL changes (for React Native)
  useEffect(() => {
    // Note: On React Native (not web), changing RTL requires app restart
    // This ensures the correct direction is applied
    if (I18nManager.isRTL !== isRTL) {
      logger.log(
        'RTL direction changed, app may need restart on native platforms',
      );
    }
  }, [isRTL]);

  // Sync document direction on web when RTL state changes
  useEffect(() => {
    if (isWeb && typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      logger.log('Document direction synced to:', isRTL ? 'rtl' : 'ltr');
    }
  }, [isRTL, isWeb]);

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Spinner size="large" color="primary" />}
    >
      <Stack.Navigator
        initialRouteName="select-language"
        screenOptions={{
          headerShown: false,
          cardStyle: isWeb
            ? ({ width: '100%', height: '100vh' } as any)
            : ({ width: '100%' } as any),
        }}
      >
        <Stack.Screen
          name="select-language"
          component={SelectLanguageScreen}
          options={{
            title: t('settings.selectLanguage'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
