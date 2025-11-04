import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useLanguage } from '../../contexts/LanguageContext';
import HomeScreen from '../../admin_screens/Home';
const Stack = createStackNavigator();

const AdminNavigator: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('admin.home'),
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
