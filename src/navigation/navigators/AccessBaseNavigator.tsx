import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useLanguage } from '@contexts/LanguageContext';
const Stack = createStackNavigator();

const AccessBaseNavigator: React.FC<{
  accessPages: { name: string; component: React.ComponentType<any> }[];
}> = ({ accessPages }) => {
  const { t } = useLanguage();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {accessPages.map(page => (
        <Stack.Screen
          key={page.name}
          name={page.name}
          component={page.component}
          options={{
            title: t(`admin.${page.name}`),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AccessBaseNavigator;
