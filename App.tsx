/**
 * IDP / Project / Bundle Task Management App
 * Features offline support with sync capabilities
 */

import React from 'react';
import './src/config/i18n'; // Initialize i18n
import { GlobalProvider, useGlobal } from './src/contexts/GlobalContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { theme } from './src/config/theme';

function App() {
  const { colorMode } = useGlobal();

  return (
    <GluestackUIProvider config={theme} colorMode={colorMode}>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </GluestackUIProvider>
  );
}

const RootApp = () => {
  return (
    <GlobalProvider>
      <App />
    </GlobalProvider>
  );
};

export default RootApp;
