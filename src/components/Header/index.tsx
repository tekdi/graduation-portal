import React, { useState } from 'react';

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
  Modal,
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
}> = ({
  title,
  rightSideContent,
  leftSideContent,
  search,
  setSearch,
  showLanguage,
  showTheme,
  showNotification,
}) => {
  const { colorMode, setColorMode } = useGlobal();
  const isDark = colorMode === 'dark';
  const { user, logout, isLoggedIn } = useAuth();
  const { isMobile } = usePlatform();
  const { t } = useLanguage();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleMenuSelect = (key: string | undefined) => {
    // Handle menu item selection
    logger.log('Menu selected:', key);
    if (key === 'profile') {
      setIsProfileModalOpen(true);
    } else if (key === 'logout') {
      logout();
    }
  };

  // Create profile data from user object
  const userProfile = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: 'N/A', // User phone not available in current User type
        address: undefined, // User address not available in current User type
        // LC Profile specific fields
        serviceArea: user.role === 'LC' ? 'District 5 - Central Region' : undefined,
        startDate: user.role === 'LC' ? '15/01/2023' : undefined,
        statistics: user.role === 'LC' ? {
          activeParticipants: 12,
          completedIdps: 8,
          visitsLogged: 45,
          pendingTasks: 2,
        } : undefined,
        certifications: user.role === 'LC' ? [
          {
            name: 'Linkage Champion Core Training',
            completedDate: 'January 2023',
            certified: true,
          },
        ] : undefined,
      }
    : undefined;

  // Determine variant based on user role
  const profileVariant = user?.role === 'LC' ? 'lcProfile' : 'profile';

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
                  placeholder={t('common.search')}
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
          {/* User Menu */}
          {isLoggedIn && (
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

      {/* Profile Modal */}
      {userProfile && (
        <Modal
          variant={profileVariant}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title={user?.role === 'LC' ? t('lcProfile.myProfile') : t('common.profile')}
          subtitle={user?.role === 'LC' ? t('lcProfile.linkageChampionProfile') : t('participantDetail.header.viewProfile')}
          profile={userProfile}
        />
      )}
    </Box>
  );
};

export default Header;
