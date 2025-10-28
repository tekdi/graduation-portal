import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  I18nManager,
  Platform,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import SelectLanguageScreen from '../screens/SelectLanguageScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

// Linking configuration for web URL routing
const linking = {
  prefixes: ['http://localhost:3000', 'https://yourapp.com'],
  config: {
    screens: {
      login: 'login',
    },
  },
};

const AppNavigator: React.FC = () => {
  const { t, isRTL } = useLanguage();

  // Update I18nManager when RTL changes (for React Native)
  useEffect(() => {
    // Note: On React Native (not web), changing RTL requires app restart
    // This ensures the correct direction is applied
    if (I18nManager.isRTL !== isRTL) {
      console.log(
        'RTL direction changed, app may need restart on native platforms',
      );
    }
  }, [isRTL]);

  // Log current URL on web for debugging
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('Current URL:', window.location.href);
      console.log('Pathname:', window.location.pathname);
    }
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      }
    >
      <Stack.Navigator
        initialRouteName="select-language"
        screenOptions={{
          headerShown: false,
          cardStyle: { width: '100%', height: '100vh' },
        }}
      >
        <Stack.Screen
          name="select-language"
          component={SelectLanguageScreen}
          options={{
            title: t('navigation.selectLanguage'),
          }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{
            title: t('navigation.login'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
