import React from 'react';

import {
  Box,
  HStack,
  Text,
  Icon,
  MoonIcon,
  SunIcon,
  Menu,
  Pressable,
  Avatar,
  AvatarFallbackText,
  Input,
  InputSlot,
  InputIcon,
  InputField,
  Badge,
  VStack,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { useGlobal } from '@contexts/GlobalContext';
import { stylesHeader } from './Styles';
import LanguageSelector from '@components/LanguageSelector/LanguageSelector';
import { useAuth } from '@contexts/AuthContext';
import { usePlatform } from '@utils/usePlatform';

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
const Header: React.FC<{
  title?: string;
  rightSideContent?: React.ReactNode;
  leftSideContent?: React.ReactNode;
  search?: string;
  setSearch?: (search: string) => void;
  // Props for controlling the visibility of language and theme sections
  showLang?: boolean;
  showTheme?: boolean;
  showNotification?: boolean;
}> = ({
  title,
  rightSideContent,
  leftSideContent,
  search,
  setSearch,
  showLang,
  showTheme,
  showNotification,
}) => {
  const { colorMode, setColorMode } = useGlobal();
  const isDark = colorMode === 'dark';
  const { user, logout, isLoggedIn } = useAuth();
  const { isMobile } = usePlatform();

  const handleMenuSelect = (key: string | undefined) => {
    // Handle menu item selection
    console.log('Menu selected:', key);
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <Box
      {...stylesHeader.container}
      borderBottomColor={isDark ? '$borderDark200' : '$borderLight200'}
      bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
      shadowColor={isDark ? '$backgroundDark950' : '$black'}
    >
      <HStack {...stylesHeader.hStack}>
        {rightSideContent && rightSideContent}
        {/* Title */}
        {title && (
          <Text
            {...stylesHeader.titleText}
            color={isDark ? '$textLight100' : '$textDark900'}
          >
            {title}
          </Text>
        )}
        {/* Center: Search Bar */}
        {setSearch && (
          <>
            <Box {...stylesHeader.searchContainer}>
              <Input {...stylesHeader.searchInput}>
                <InputSlot pl="$3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                  placeholder="Search users, templates, logs..."
                  {...stylesHeader.searchInputField}
                  value={search || ''}
                  onChangeText={text => setSearch(text)}
                />
              </Input>
            </Box>
          </>
        )}
        {/* Right: Notifications & User */}
        <HStack {...stylesHeader.rightActionsContainer}>
          {/* Notifications */}
          {showNotification && (
            <Pressable position="relative">
              <Icon as={BellIcon} {...stylesHeader.notificationIcon} />
              <Badge {...stylesHeader.notificationBadge}>
                <Text {...stylesHeader.notificationBadgeText}>3</Text>
              </Badge>
            </Pressable>
          )}
          {showLang && <LanguageSelector />}
          {showTheme && (
            <Icon
              {...stylesHeader.rightColorModeIcon}
              as={colorMode === 'dark' ? MoonIcon : SunIcon}
              onPress={() => {
                const newMode = colorMode === 'dark' ? 'light' : 'dark';
                setColorMode(newMode);
              }}
            />
          )}
          {/* User Menu */}
          {isLoggedIn && (
            <Menu
              items={userMenuItems}
              placement="bottom right"
              offset={5}
              trigger={triggerProps => (
                <Pressable {...triggerProps} {...stylesHeader.userMenuTrigger}>
                  <Avatar {...stylesHeader.userAvatar}>
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
                      <VStack {...stylesHeader.userInfoContainer}>
                        <Text {...stylesHeader.userNameText}>
                          {user?.name || 'Admin User'}
                        </Text>
                        <HStack {...stylesHeader.userRoleContainer}>
                          <Text {...stylesHeader.userRoleText}>
                            {user?.role || 'Admin'}
                          </Text>
                        </HStack>
                      </VStack>
                      <Icon
                        as={ChevronDownIcon}
                        {...stylesHeader.chevronIcon}
                      />
                    </>
                  )}
                </Pressable>
              )}
              onSelect={handleMenuSelect}
            />
          )}
        </HStack>
        {leftSideContent && leftSideContent}
      </HStack>
    </Box>
  );
};

export default Header;
