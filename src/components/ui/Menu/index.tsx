import React from 'react';
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  Icon,
  ButtonText,
} from '@gluestack-ui/themed';
import Button from '../Button';

export interface MenuItemData {
  key: string;
  label: string;
  textValue: string;
  icon?: any;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  triggerComponent?: React.ReactElement;
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
  triggerComponent,
  onSelect,
  menuProps = {},
  triggerProps = {},
}) => {
  const handleMenuItemPress = (key: string) => {
    if (onSelect) {
      onSelect(key);
    }
  };

  const renderTrigger = React.useCallback(
    (defaultTriggerProps: any) => {
      if (triggerComponent) {
        return React.cloneElement(triggerComponent, {
          ...defaultTriggerProps,
          ...triggerProps,
        });
      }
      return (
        <DefaultTrigger
          label={triggerLabel}
          triggerProps={{ ...defaultTriggerProps, ...triggerProps }}
        />
      );
    },
    [triggerComponent, triggerProps, triggerLabel],
  );

  return (
    <Menu
      placement={placement}
      offset={offset}
      disabledKeys={disabledKeys}
      trigger={renderTrigger}
      {...menuProps}
    >
      {items.map(item => (
        <MenuItem
          key={item.key}
          textValue={item.textValue}
          onPress={() => handleMenuItemPress(item.key)}
        >
          {item.icon && (
            <Icon as={item.icon} size={item.iconSize || 'sm'} me="$2" />
          )}
          <MenuItemLabel size="sm">{item.label}</MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default CustomMenu;
