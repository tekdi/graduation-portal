import React, { useEffect, useState } from 'react';
import { Box, HStack, SafeAreaView, useColorMode } from '@ui';
import AdminHeader from '@components/Header';
import AdminSidebar from '../../components/Sidebar/Sidebar';
import { layoutStyles } from './styles';
import { Platform } from 'react-native';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const mode = useColorMode();
  const isDark = mode === 'dark';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Determine if we're on mobile/tablet (< 768px)
  const [isMobile, setIsMobile] = useState(false);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkWidth = () => {
        const width = window.innerWidth;
        const mobile = width < 768;
        setIsMobile(mobile);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    } else {
      // For native, default to closed
      setIsMobile(true);
    }
  }, []);

  return (
    <SafeAreaView
      {...layoutStyles.container}
      bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
      />

      {/* Content with Sidebar */}
      <HStack {...layoutStyles.contentContainer}>
        {/* Header */}
        <Box {...layoutStyles.headerContent}>
          <AdminHeader {...{ search, setSearch, showNotification: true }} />
        </Box>
        {/* Main Content */}
        <Box {...layoutStyles.mainContent}>{children}</Box>
      </HStack>
    </SafeAreaView>
  );
};

export default AdminLayout;
