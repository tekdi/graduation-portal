import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

export const tabButtonStyles = {
  // Default variant unchanged
  defaultContainer: (isActive: boolean) => ({
    paddingHorizontal: '$6',
    paddingVertical: '$3',
    borderBottomWidth: 3,
    borderBottomColor: isActive
      ? theme.tokens.colors.primary500
      : 'transparent',
  }),

  defaultText: (isActive: boolean) => ({
    textAlign: 'center' as const,
    ...TYPOGRAPHY.label,
    color: isActive
      ? theme.tokens.colors.primary500
      : theme.tokens.colors.mutedForeground,
  }),

  // ---------------------------------------------
  // BUTTON TAB VARIANT (UPDATED: inactive is grey)
  // ---------------------------------------------
  buttonTabContainer: (isActive: boolean) => ({
    flex: 1,
    paddingVertical: '$1',
    paddingHorizontal: '$4',
  
    // Active = white pill, Inactive = transparent over blue bg
    bg: isActive ? '$white' : 'transparent',
  
    // Full rounded pill for active tab
    borderRadius: isActive ? 50 : 0,
  
    alignItems: 'center',
    justifyContent: 'center',
  
    $web: {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  }),
  
  

  buttonTabText: (isActive: boolean) => ({
    fontSize: 14,
    fontWeight: isActive ? '$medium' : '$normal',
    color: isActive
      ? theme.tokens.colors.textForeground
      : theme.tokens.colors.textForeground,
    textAlign: 'center',
  }),
 
  buttonTabIconColor: theme.tokens.colors.textForeground,
} as const;