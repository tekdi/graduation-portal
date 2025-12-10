import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { Box, SafeAreaView, useColorMode, Pressable, Icon, MenuIcon } from '@gluestack-ui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@components/Header';
import { stylesLayout } from './Styles';
import { LC_MENU_OPTIONS } from '@constants/PROFILE_MENU_OPTIONS';
import { useAuth } from '@contexts/AuthContext';
import logger from '@utils/logger';

/**
 * LC Layout Component - Enhanced Header Integration
 * 
 * [PR #19 Changes]
 * - Integrates Header component with LC-specific configuration (left-aligned profile menu, hamburger menu)
 * - Conditional menu filtering: Hides "Home" menu item when on welcome screen to prevent redundant navigation
 * - Menu selection handler: Navigates to welcome screen for 'home', handles logout for 'logout'
 * - Uses useMemo to optimize menu filtering based on current route
 */
interface LayoutProps {
  title: string;
  children: React.ReactNode;
  navigation?: any;
  pendingSyncCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const mode = useColorMode();
  const isDark = mode === 'dark';
  const { logout } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  // [PR #19] Filter menu items based on current screen - hides Home menu on welcome screen
  const filteredMenuItems = useMemo(() => {
    const isWelcomeScreen = route.name === 'welcome';
    if (isWelcomeScreen) {
      // Hide Home menu when on welcome screen (prevents showing "Home" when already on home)
      return LC_MENU_OPTIONS.filter(item => item.key !== 'home');
    }
    // Show all menu items including Home when on other screens
    return LC_MENU_OPTIONS;
  }, [route.name]);

  // [PR #19] Handle menu item selection - navigates to welcome for 'home', handles logout
  const handleMenuSelect = (key: string | undefined) => {
    logger.log('Menu selected:', key);
    if (key === 'home') {
      navigation.navigate('welcome' as never);
    } else if (key === 'logout') {
      logout();
    }
    // Note: dashboard, myProfile, serviceProviders handlers can be added here as needed
  };

  const rightSideContent = (
    <Pressable>
      <Icon as={MenuIcon} />
    </Pressable>
  );

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

      {/* 
        [PR #19] Header with LC-specific configuration
        - userMenuPosition="left": Places profile menu on left side (LC layout)
        - hamburgerMenuItems: Passes filtered menu items (conditionally hides Home)
        - onHamburgerMenuSelect: Handles menu item selection (navigation/logout)
        - showLanguage/showTheme: Disabled for LC layout
      */}
      <Header 
        title={title} 
        showLanguage={false} 
        showTheme={false} 
        userMenuPosition="left"
        rightSideContent={rightSideContent}
        hamburgerMenuItems={filteredMenuItems}
        onHamburgerMenuSelect={handleMenuSelect}
      />

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
