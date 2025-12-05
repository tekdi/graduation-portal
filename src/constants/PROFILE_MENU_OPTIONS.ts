import React from 'react';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import { MenuItemData } from '@components/ui/Menu';

// Admin menu options (original)
export const ADMIN_MENU_OPTIONS: MenuItemData[] = [
  {
    key: 'profile',
    label: 'common.profile',
    textValue: 'profile',
  },
  {
    key: 'settings',
    label: 'common.settings',
    textValue: 'settings',
  },
  {
    key: 'logout',
    label: 'common.logout',
    textValue: 'logout',
  },
];

// LC menu options (with icons)
export const LC_MENU_OPTIONS: MenuItemData[] = [
  {
    key: 'home',
    label: 'lc.menu.home',
    textValue: 'home',
    iconElement: React.createElement(LucideIcon, { name: 'Home', size: 16, color: theme.tokens.colors.textForegroundColor }),
    showDividerAfter: true,
  },
  {
    key: 'dashboard',
    label: 'lc.menu.dashboard',
    textValue: 'dashboard',
    iconElement: React.createElement(LucideIcon, { name: 'LayoutDashboard', size: 16, color: theme.tokens.colors.textForegroundColor }),
    showDividerAfter: false,
  },
  {
    key: 'myProfile',
    label: 'lc.menu.myProfile',
    textValue: 'myProfile',
    iconElement: React.createElement(LucideIcon, { name: 'User', size: 16, color: theme.tokens.colors.textForegroundColor }),
    showDividerAfter: false,
  },
  {
    key: 'serviceProviders',
    label: 'lc.menu.serviceProviders',
    textValue: 'serviceProviders',
    iconElement: React.createElement(LucideIcon, { name: 'Building2', size: 16, color: theme.tokens.colors.textForegroundColor }),
    showDividerAfter: true,
  },
  {
    key: 'logout',
    label: 'common.logout',
    textValue: 'logout',
    iconElement: React.createElement(LucideIcon, { name: 'LogOut', size: 16, color: theme.tokens.colors.error600 }),
    showDividerAfter: false,
  },
];

// Default export for Admin (backward compatibility)
export default ADMIN_MENU_OPTIONS;
