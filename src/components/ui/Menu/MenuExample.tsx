import React from 'react';
import { CustomMenu } from './index';
import { AddIcon, GlobeIcon, SettingsIcon } from '@gluestack-ui/themed';

// Example 1: Basic usage with default trigger
export const BasicMenuExample = () => {
  const menuItems = [
    {
      key: 'Add account',
      label: 'Add account',
      textValue: 'Add account',
      icon: AddIcon,
    },
    {
      key: 'Community',
      label: 'Community',
      textValue: 'Community',
      icon: GlobeIcon,
    },
    {
      key: 'Settings',
      label: 'Settings',
      textValue: 'Settings',
      icon: SettingsIcon,
    },
  ];

  const handleMenuSelect = (key: string) => {
    console.log('Selected menu item:', key);
    // Add your navigation or action logic here
  };

  return (
    <CustomMenu
      items={menuItems}
      placement="bottom"
      offset={5}
      disabledKeys={['Settings']}
      triggerLabel="Menu"
      onSelect={handleMenuSelect}
    />
  );
};

// Example 2: Menu with custom trigger button
export const CustomTriggerMenuExample = () => {
  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
      textValue: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
      textValue: 'Settings',
    },
    {
      key: 'logout',
      label: 'Logout',
      textValue: 'Logout',
    },
  ];

  return (
    <CustomMenu
      items={menuItems}
      placement="bottom right"
      offset={10}
      onSelect={key => console.log('Selected:', key)}
    />
  );
};

// Example 3: Menu without icons
export const SimpleMenuExample = () => {
  const menuItems = [
    {
      key: 'option1',
      label: 'Option 1',
      textValue: 'Option 1',
    },
    {
      key: 'option2',
      label: 'Option 2',
      textValue: 'Option 2',
    },
    {
      key: 'option3',
      label: 'Option 3',
      textValue: 'Option 3',
    },
  ];

  return (
    <CustomMenu
      items={menuItems}
      triggerLabel="Options"
      onSelect={key => alert(`You selected: ${key}`)}
    />
  );
};
