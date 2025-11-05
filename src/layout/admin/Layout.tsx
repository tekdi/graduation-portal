import React, { useEffect, useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  MenuIcon,
  SafeAreaView,
  useColorMode,
  Pressable,
} from '@ui';
import AdminHeader from '@components/Header';
import AdminSidebar from '@components/Sidebar/Sidebar';
import { layoutStyles } from './styles';
import { usePlatform } from '@utils/platform';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const mode = useColorMode();
  const isDark = mode === 'dark';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Determine if we're on mobile/tablet (< 768px)
  const { isMobile } = usePlatform();

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const rightSideContent = (
    <Pressable onPress={() => setIsDrawerOpen(!isDrawerOpen)}>
      <Icon as={MenuIcon} />
    </Pressable>
  );

  useEffect(() => {
    setIsDrawerOpen(!isMobile);
  }, [isMobile]);

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
          <AdminHeader
            {...{ search, setSearch, showNotification: true }}
            rightSideContent={rightSideContent}
          />
        </Box>
        {/* Main Content */}
        <Box {...layoutStyles.mainContent}>{children}</Box>
      </HStack>
    </SafeAreaView>
  );
};

export default AdminLayout;
