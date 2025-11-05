import React from 'react';
import { StatusBar } from 'react-native';
import { Box, SafeAreaView, useColorMode } from '@gluestack-ui/themed';
import Header from '@components/Header';
import { stylesLayout } from './Styles';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  navigation?: any;
  pendingSyncCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const mode = useColorMode();
  const isDark = mode === 'dark';

  return (
    <SafeAreaView
      style={stylesLayout.safeAreaView}
      bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
    >
      {/* Status Bar */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '$backgroundDark950' : '$backgroundLight0'}
      />

      {/* Header */}
      <Header title={title} showLanguage={true} showTheme={true} />

      {/* Main Content */}
      <Box
        {...stylesLayout.mainContent}
        bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
      >
        {children}
      </Box>
    </SafeAreaView>
  );
};

export default Layout;
