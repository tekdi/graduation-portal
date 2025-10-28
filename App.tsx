/**
 * IDP / Project / Bundle Task Management App
 * Features offline support with sync capabilities
 */

import React from 'react';
import './src/config/i18n'; // Initialize i18n
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { theme } from './src/config/theme';

function App() {
  const mode = localStorage.getItem('colorMode') || 'light';
  return (
    <GluestackUIProvider config={theme} colorMode={mode as any}>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </GluestackUIProvider>
  );
}

export default App;
