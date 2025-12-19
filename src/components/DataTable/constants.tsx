import React from 'react';
import { Box } from '@ui';
import { LucideIcon } from '@components/ui';
import { theme } from '@config/theme';
import { MenuItemData } from '@components/ui/Menu';
import { styles } from './Styles';

/**
 * Default menu items configuration for DataTable actions menu
 * Used when no custom menu items are provided to getActionsColumn()
 * 
 * This can be imported and customized by consumers if needed
 */
export const getDefaultMenuItems = (t: (key: string) => string): MenuItemData[] => [
  {
    key: 'view-log',
    label: 'actions.viewLog',
    textValue: 'View Log',
    iconElement: (
      <Box {...styles.menuIconContainer}>
        <LucideIcon
          name="FileText"
          size={20}
          color={theme.tokens.colors.mutedForeground}
        />
      </Box>
    ),
  },
  {
    key: 'log-visit',
    label: 'actions.logVisit',
    textValue: 'Log Visit',
    iconElement: (
      <Box {...styles.menuIconContainer}>
        <LucideIcon
          name="ClipboardCheck"
          size={20}
          color={theme.tokens.colors.mutedForeground}
        />
      </Box>
    ),
  },
  {
    key: 'dropout',
    label: 'actions.dropout',
    textValue: 'Dropout',
    iconElement: (
      <Box {...styles.menuIconContainer}>
        <LucideIcon
          name="UserX"
          size={20}
          color={theme.tokens.colors.error.light}
        />
      </Box>
    ),
    color: theme.tokens.colors.error.light,
  },
];

