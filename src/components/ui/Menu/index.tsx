import React from 'react';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  Icon,
  ButtonText,
  Button,
} from '@gluestack-ui/themed';
import { useLanguage } from '@contexts/LanguageContext';

export interface MenuItemData {
  key: string;
  label: string;
  textValue: string;
  icon?: any;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconElement?: React.ReactNode;
  color?: string;
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
      {items?.map((item: MenuItemData, index: number) => (
        <MenuItem
          key={item.key || index.toString()}
          textValue={item.textValue}
          onPress={() => handleMenuItemPress(item.key)}
        >
          {item.iconElement ? (
            item.iconElement
          ) : item.icon ? (
            <Icon as={item.icon} size={item.iconSize || 'sm'} me="$2" />
          ) : null}
          <MenuItemLabel size="sm" color={item.color}>
            {t(item.label)}
          </MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default CustomMenu;
