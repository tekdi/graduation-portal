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
  LucideIcon,
  MenuIcon,
} from '@ui';
import { useGlobal } from '@contexts/GlobalContext';
import { stylesHeader } from './Styles';
import LanguageSelector from '@components/LanguageSelector/LanguageSelector';
import { useAuth } from '@contexts/AuthContext';
import { usePlatform } from '@utils/platform';
import PROFILE_MENU_OPTIONS from '@constants/PROFILE_MENU_OPTIONS';
import logger from '@utils/logger';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { MenuItemData } from '@components/ui/Menu';

// Header component with LC-specific layout: profile menu on left, hamburger menu with dropdown, avatar with user icon
const Header: React.FC<{
  title?: string;
  rightSideContent?: React.ReactNode;
  leftSideContent?: React.ReactNode;
  search?: string;
  setSearch?: (search: string) => void;
  // Props for controlling the visibility of language and theme sections
  showLanguage?: boolean;
  showTheme?: boolean;
  showNotification?: boolean;
  // Control user menu position (left or right) - for LC layout
  userMenuPosition?: 'left' | 'right';
  // For LC: menu items and handler for hamburger menu
  hamburgerMenuItems?: MenuItemData[];
  onHamburgerMenuSelect?: (key: string | undefined) => void;
}> = ({
  title,
  rightSideContent,
  leftSideContent,
  search,
  setSearch,
  showLanguage,
  showTheme,
  showNotification,
  userMenuPosition = 'right',
  hamburgerMenuItems,
  onHamburgerMenuSelect,
}) => {
  const { colorMode, setColorMode } = useGlobal();
  const isDark = colorMode === 'dark';
  const { user, logout, isLoggedIn } = useAuth();
  const { isMobile } = usePlatform();
  const { t } = useLanguage();

  const handleMenuSelect = (key: string | undefined) => {
    // Handle menu item selection
    logger.log('Menu selected:', key);
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
        {/* Hamburger Menu with Dropdown (for LC) */}
        {rightSideContent && hamburgerMenuItems && onHamburgerMenuSelect ? (
          <Menu
            items={hamburgerMenuItems}
            placement="bottom left"
            offset={15}
            trigger={triggerProps => (
              <Pressable {...triggerProps}>
                <Icon as={MenuIcon} />
              </Pressable>
            )}
            onSelect={onHamburgerMenuSelect}
          />
        ) : (
          rightSideContent && rightSideContent
        )}
        
        {/* Left: Avatar Only (only if userMenuPosition is 'left') */}
        {isLoggedIn && userMenuPosition === 'left' && (
          <HStack {...stylesHeader.userMenuTrigger} alignItems="center" space="sm">
            <Avatar {...stylesHeader.userAvatar} $web-style={{
              backgroundImage: 'linear-gradient(to right bottom, rgb(139, 40, 66) 0%, oklab(0.999994 0.0000455678 0.0000200868 / 0.9) 100%)',
            }}>
              <AvatarFallbackText>
                {' '}
              </AvatarFallbackText>
              <Box position="absolute" justifyContent="center" alignItems="center" width="100%" height="100%">
                <LucideIcon name="User" size={20} color="#fff" />
              </Box>
            </Avatar>
            <VStack {...stylesHeader.userInfoContainer}>
              <Text {...stylesHeader.userNameText}>
                {user?.name || ''}
              </Text>
              {/* <HStack {...stylesHeader.userRoleContainer}>
                <Text {...stylesHeader.userRoleText}>
                  {user?.role || ''}
                </Text>
              </HStack> */}
            </VStack>
          </HStack>
        )}
        
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
                  placeholder={t('common.search')}
                  {...stylesHeader.searchInputField}
                  value={search || ''}
                  onChangeText={text => setSearch(text)}
                />
              </Input>
            </Box>
          </>
        )}
        {/* Right: Notifications, Language & Theme */}
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
          {showLanguage && <LanguageSelector />}
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
          {/* Right: User Menu (only if userMenuPosition is 'right' or default) */}
          {isLoggedIn && userMenuPosition === 'right' && (
            <Menu
              items={PROFILE_MENU_OPTIONS}
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
                          {user?.name || ''}
                        </Text>
                        <HStack {...stylesHeader.userRoleContainer}>
                          <Text {...stylesHeader.userRoleText}>
                            {user?.role || ''}
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
