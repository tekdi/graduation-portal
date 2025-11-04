import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useLanguage } from '../../contexts/LanguageContext';
import SelectLanguageScreen from '../../screens/Language/Index';

const Stack = createStackNavigator();

const LCNavigator: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Stack.Navigator
      initialRouteName="SelectLanguage"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name="SelectLanguage"
        component={SelectLanguageScreen}
        options={{
          title: t('admin.home'),
        }}
      />
    </Stack.Navigator>
  );
};

export default LCNavigator;
