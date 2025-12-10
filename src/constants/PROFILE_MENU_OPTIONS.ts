import { theme } from '@config/theme';
import { MenuItemData } from '@components/ui/Menu';

/**
 * Profile Menu Options - Enhanced for LC Support
 * 
 * - Separated LC_MENU_OPTIONS from ADMIN_MENU_OPTIONS for role-specific menu configurations
 * - LC menu includes: icons (via iconName + iconColor), dividers (showDividerAfter), and i18n labels
 * - Uses React.createElement pattern in constants for icon rendering (iconElement)
 * - Dividers placed after Home and Service Providers for visual menu organization
 * - Logout item uses error color (error600) to indicate destructive action
 */
// Admin menu options (original - backward compatible)
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

// LC menu options with icons, dividers, and i18n labels
export const LC_MENU_OPTIONS: MenuItemData[] = [
  {
    key: 'home',
    label: 'lc.menu.home',
    textValue: 'home',
    iconName: 'Home', // LucideIcon name
    iconSizeValue: 16,
    iconColor: theme.tokens.colors.textForegroundColor,
    showDividerAfter: true, // Divider after Home (separates navigation from profile actions)
    route: 'welcome', // Navigation route for home menu item
  },
  {
    key: 'dashboard',
    label: 'lc.menu.dashboard',
    textValue: 'dashboard',
    iconName: 'LayoutDashboard',
    iconSizeValue: 16,
    iconColor: theme.tokens.colors.textForegroundColor,
    showDividerAfter: false,
    route: 'dashboard', // Navigation route for dashboard menu item
  },
  {
    key: 'myProfile',
    label: 'lc.menu.myProfile',
    textValue: 'myProfile',
    iconName: 'User',
    iconSizeValue: 16,
    iconColor: theme.tokens.colors.textForegroundColor,
    showDividerAfter: false,
    // route: 'myProfile', // Add route when myProfile screen is implemented
  },
  {
    key: 'serviceProviders',
    label: 'lc.menu.serviceProviders',
    textValue: 'serviceProviders',
    iconName: 'Building2',
    iconSizeValue: 16,
    iconColor: theme.tokens.colors.textForegroundColor,
    showDividerAfter: true, // Divider after Service Providers (separates actions from logout)
    // route: 'serviceProviders', // Add route when serviceProviders screen is implemented
  },
  {
    key: 'logout',
    label: 'common.logout',
    textValue: 'logout',
    iconName: 'LogOut',
    iconSizeValue: 16,
    iconColor: theme.tokens.colors.error600, // Error color indicates destructive action
    showDividerAfter: false,
    // No route for logout - handled by logout function
  },
];

// Default export for Admin (backward compatibility)
export default ADMIN_MENU_OPTIONS;
