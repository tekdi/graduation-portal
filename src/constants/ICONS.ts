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
import threeDotIcon from '../assets/images/Button.png';
import eyeIcon from '../assets/images/EyeIcon.png';
import logVisitIcon from '../assets/images/logVisitIcon.png';
import dropoutIcon from '../assets/images/DropoutIcon.png';
import checkCircleIcon from '../assets/images/check-circle-green.png';

export const ICONS = {
  user: userIcon,
  chart: chartIcon,
  chat: chatIcon,
  logo: logoIcon,
  search: searchIcon,
  threeDotIcon: threeDotIcon,
  eyeIcon: eyeIcon,
  logVisitIcon: logVisitIcon,
  dropoutIcon: dropoutIcon,
  checkCircleIcon: checkCircleIcon,
} as const;

// Type for autocomplete
export type IconName = keyof typeof ICONS;
