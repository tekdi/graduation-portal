import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { Box, SafeAreaView, useColorMode, Pressable, Icon, MenuIcon } from '@gluestack-ui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@components/Header';
import { stylesLayout } from './Styles';
import { LC_MENU_OPTIONS } from '@constants/PROFILE_MENU_OPTIONS';
import { useAuth } from '@contexts/AuthContext';
import logger from '@utils/logger';

// LC Layout: Configures Header with left-aligned profile menu, hamburger menu, and conditional Home menu visibility
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

  // Filter menu items based on current screen
  const filteredMenuItems = useMemo(() => {
    const isWelcomeScreen = route.name === 'welcome';
    if (isWelcomeScreen) {
      // Hide Home menu when on welcome screen
      return LC_MENU_OPTIONS.filter(item => item.key !== 'home');
    }
    // Show all menu items including Home when on other screens
    return LC_MENU_OPTIONS;
  }, [route.name]);

  const handleMenuSelect = (key: string | undefined) => {
    logger.log('Menu selected:', key);
    if (key === 'home') {
      navigation.navigate('welcome' as never);
    } else if (key === 'logout') {
      logout();
    }
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

      {/* Header */}
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
