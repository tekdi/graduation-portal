/**
 * Icon Assets
 * Centralized icon imports for consistent usage across the app
 */

// Import all icon images using ES6 imports (better for web compatibility)
import userIcon from '../assets/images/userIcon.png';
import chartIcon from '../assets/images/chartIcon.png';
import chatIcon from '../assets/images/chatIcon.png';
import logoIcon from '../assets/images/logo.png';
import searchIcon from '../assets/images/searchIcon.png';

export const ICONS = {
  user: userIcon,
  chart: chartIcon,
  chat: chatIcon,
  logo: logoIcon,
  search: searchIcon,
} as const;

// Type for autocomplete
export type IconName = keyof typeof ICONS;
