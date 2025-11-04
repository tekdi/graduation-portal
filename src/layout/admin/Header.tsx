import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Input,
  InputField,
  Icon,
  Pressable,
  Badge,
  Avatar,
  AvatarFallbackText,
  Menu,
  InputSlot,
  MenuIcon,
  InputIcon,
} from '@ui';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@ui';
import { useAuth } from '../../contexts/AuthContext';
import { headerStyles } from './styles';

const AdminHeader: React.FC<{
  onMenuPress?: () => void;
  isMobile?: boolean;
}> = ({ onMenuPress, isMobile }) => {
  const { user, logout } = useAuth();

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      textValue: 'profile',
    },
    {
      key: 'settings',
      label: 'Settings',
      textValue: 'settings',
    },
    {
      key: 'logout',
      label: 'Logout',
      textValue: 'logout',
    },
  ];

  const handleMenuSelect = (key: string | undefined) => {
    // Handle menu item selection
    console.log('Menu selected:', key);
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <Box {...headerStyles.container}>
      <HStack {...headerStyles.hStack}>
        {isMobile && (
          <Pressable onPress={() => onMenuPress?.()}>
            <Icon as={MenuIcon} size="lg" />
          </Pressable>
        )}
        {/* Center: Search Bar */}
        <Box {...headerStyles.searchContainer}>
          <Input {...headerStyles.searchInput}>
            <InputSlot pl="$3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              placeholder="Search users, templates, logs..."
              {...headerStyles.searchInputField}
            />
          </Input>
        </Box>

        {/* Right: Notifications & User */}
        <HStack {...headerStyles.rightActionsContainer}>
          {/* Notifications */}
          <Pressable position="relative">
            <Icon as={BellIcon} {...headerStyles.notificationIcon} />
            <Badge {...headerStyles.notificationBadge}>
              <Text {...headerStyles.notificationBadgeText}>3</Text>
            </Badge>
          </Pressable>

          {/* User Menu */}
          <Menu
            items={userMenuItems}
            placement="bottom right"
            offset={5}
            trigger={triggerProps => (
              <Pressable {...triggerProps} {...headerStyles.userMenuTrigger}>
                <Avatar {...headerStyles.userAvatar}>
                  <AvatarFallbackText>
                    {user?.name
                      ?.split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase() || 'AD'}
                  </AvatarFallbackText>
                </Avatar>
                {!isMobile && (
                  <>
                    <VStack {...headerStyles.userInfoContainer}>
                      <Text {...headerStyles.userNameText}>
                        {user?.name || 'Admin User'}
                      </Text>
                      <HStack {...headerStyles.userRoleContainer}>
                        <Text {...headerStyles.userRoleText}>
                          System Administrator
                        </Text>
                      </HStack>
                    </VStack>
                    <Icon as={ChevronDownIcon} {...headerStyles.chevronIcon} />
                  </>
                )}
              </Pressable>
            )}
            onSelect={handleMenuSelect}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default AdminHeader;
