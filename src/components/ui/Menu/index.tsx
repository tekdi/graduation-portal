import React from 'react';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  Icon,
  ButtonText,
  Button,
  Box,
  Divider,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * Menu Component - Enhanced with Icon and Divider Support
 * 
 * - Added `showDividerAfter` property to MenuItemData for visual menu organization
 * - Added icon support: `iconElement` (custom ReactNode), `iconName` (LucideIcon name), `icon` (Gluestack Icon)
 * - Added `iconColor` and `iconSizeValue` for fine-grained icon styling control
 * - Dividers render as disabled MenuItem with Box separator for consistent menu structure
 */
export interface MenuItemData {
  key: string;
  label: string;
  textValue: string;
  icon?: any;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconElement?: React.ReactNode; // Custom ReactNode for icon (e.g., React.createElement pattern)
  iconName?: string; // LucideIcon name (e.g., 'Home', 'User', 'LogOut')
  iconColor?: string; // Icon color value
  iconSizeValue?: number; // Icon size in pixels
  color?: string;
  showDividerAfter?: boolean; // Render divider after this menu item
}

export interface CustomMenuProps {
  items: MenuItemData[];
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'left top'
    | 'left bottom'
    | 'right top'
    | 'right bottom';
  offset?: number;
  disabledKeys?: string[];
  triggerLabel?: string;
  trigger?: (triggerProps: any) => React.ReactElement;
  onSelect?: (key: string) => void;
  menuProps?: any;
  triggerProps?: any;
}

const DefaultTrigger: React.FC<{ label: string; triggerProps: any }> = ({
  label,
  triggerProps,
}) => {
  return (
    <Button {...triggerProps}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
};

export const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  placement = 'bottom',
  offset = 5,
  disabledKeys = [],
  triggerLabel = 'Menu',
  triggerProps = {},
  trigger,
  onSelect,
  ...menuProps
}) => {
  const { t } = useLanguage();
  const handleMenuItemPress = (key: string) => {
    if (onSelect) {
      onSelect(key);
    }
  };

  const renderTrigger = React.useCallback(
    (defaultTriggerProps: any) => {
      // If custom trigger provided, use it
      if (trigger) {
        return trigger(defaultTriggerProps);
      }
      // Otherwise use default trigger
      return (
        <DefaultTrigger
          label={t(triggerLabel)}
          triggerProps={{ ...defaultTriggerProps, ...triggerProps }}
        />
      );
    },
    [triggerProps, triggerLabel, t, trigger],
  );

  return (
    <Menu
      placement={placement}
      offset={offset}
      disabledKeys={disabledKeys}
      trigger={renderTrigger}
      {...menuProps}
    >
      {items?.map((item: MenuItemData, index: number) => {
        // Render menu item with icon support (priority: iconElement > iconName > icon)
        const menuItem = (
          <MenuItem
            key={item.key || index.toString()}
            textValue={item.textValue}
            onPress={() => handleMenuItemPress(item.key)}
          >
            {item.iconElement ? (
              // Custom ReactNode icon (used in constants for React.createElement pattern)
              <Box mr="$2">
                {item.iconElement}
              </Box>
            ) : item.iconName ? (
              // LucideIcon by name (flexible icon rendering)
              <Box mr="$2">
                <LucideIcon 
                  name={item.iconName} 
                  size={item.iconSizeValue || 16} 
                  color={item.iconColor} 
                />
              </Box>
            ) : item.icon ? (
              // Gluestack Icon component
              <Icon as={item.icon} size={item.iconSize || 'sm'} me="$2" />
            ) : null}
            <MenuItemLabel size="sm" color={item.color}>
              {t(item.label)}
            </MenuItemLabel>
          </MenuItem>
        );

        // Render divider after menu item if showDividerAfter is true
        // Uses disabled MenuItem wrapper with Box separator for consistent menu structure
        if (item.showDividerAfter) {
          return (
            <React.Fragment key={item.key || index.toString()}>
              {menuItem}
              <MenuItem
                key={item.key ? `${item.key}-separator` : `separator-${index}`}
                textValue="separator"
                disabled={true}
                onPress={() => {}} padding="$0"
              >
                <Box height={1} width="100%" bg="$borderLight200" my="$1" />
              </MenuItem>
            </React.Fragment>
          );
        }

        return menuItem;
      })}
    </Menu>
  );
};

export default CustomMenu;
