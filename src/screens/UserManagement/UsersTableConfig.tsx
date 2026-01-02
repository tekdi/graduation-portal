import React from 'react';
import { HStack, Text, Pressable, Progress, ProgressFilledTrack } from '@ui';
import { ColumnDef } from '@app-types/components';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { LucideIcon, Menu } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { User } from '@constants/USER_MANAGEMENT_MOCK_DATA';
import { styles as dataTableStyles } from '@components/DataTable/Styles';
import { MenuItemData } from '@components/ui/Menu';
import { styles } from './Styles';

/**
 * Role Badge Component
 */
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  return (
    <HStack
      bg={styles.roleColors[role as keyof typeof styles.roleColors] || '$textSecondary'}
      {...styles.roleBadge}
    >
      <Text
        {...TYPOGRAPHY.bodySmall}
        {...styles.roleBadgeText}
      >
        {role}
      </Text>
    </HStack>
  );
};

/**
 * Status Badge Component
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const isActive = status === 'Active';

  return (
    <HStack
      {...(isActive ? styles.statusBadgeActive : styles.statusBadgeInactive)}
      {...styles.statusBadge}
    >
      <Text
        {...TYPOGRAPHY.bodySmall}
        {...styles.statusBadgeText}
      >
        {status}
      </Text>
    </HStack>
  );
};

/**
 * Details Component
 * Shows either assigned count or progress bar
 */
const DetailsCell: React.FC<{ details: User['details'] }> = ({ details }) => {
  if (!details) {
    return null;
  }

  if (details.type === 'assigned') {
    return (
      <Pressable $web-cursor="pointer">
        <Text
          {...TYPOGRAPHY.bodySmall}
          {...styles.districtText}
        >
          {details.value} assigned
        </Text>
      </Pressable>
    );
  }

  // Progress type
  return (
    <HStack {...styles.detailsProgressContainer}>
      <Progress value={details.value} flex={1} size="sm" bg="$progressBarBackground">
        <ProgressFilledTrack bg="$primary500" />
      </Progress>
      <Text
        {...TYPOGRAPHY.bodySmall}
        {...styles.detailsProgressText}
      >
        {details.value}%
      </Text>
    </HStack>
  );
};

/**
 * Custom trigger for actions menu
 */
const getCustomTrigger = (triggerProps: any) => (
  <Pressable {...triggerProps} {...dataTableStyles.customTrigger}>
    <LucideIcon
      name="MoreVertical"
      size={20}
      color={theme.tokens.colors.textForeground}
    />
  </Pressable>
);

/**
 * Get User Menu Items
 */
const getUserMenuItems = (t: (key: string) => string): MenuItemData[] => [
  {
    key: 'view-profile',
    label: 'admin.users.actionMenu.viewProfile',
    textValue: 'View Profile',
    iconName: 'Eye',
    iconColor: theme.tokens.colors.textForeground,
    iconSizeValue: 20,
  },
  {
    key: 'edit',
    label: 'admin.users.actionMenu.edit',
    textValue: 'Edit',
    iconName: 'Pencil',
    iconColor: theme.tokens.colors.textForeground,
    iconSizeValue: 20,
  },
  {
    key: 'reset-password',
    label: 'admin.users.actionMenu.resetPassword',
    textValue: 'Reset Password',
    iconName: 'RotateCcw',
    iconColor: theme.tokens.colors.textForeground,
    iconSizeValue: 20,
  },
  {
    key: 'deactivate',
    label: 'admin.users.actionMenu.deactivate',
    textValue: 'Deactivate',
    iconName: 'UserX',
    iconColor: theme.tokens.colors.error600,
    iconSizeValue: 20,
    color: theme.tokens.colors.error600,
  },
];

/**
 * Actions Column Component
 */
const ActionsColumn: React.FC<{ user: User }> = ({ user }) => {
  const { t } = useLanguage();

  const handleMenuSelect = (key: string) => {
    switch (key) {
      case 'view-profile':
        console.log('View profile for user:', user.id);
        // TODO: Navigate to user profile
        break;
      case 'edit':
        console.log('Edit user:', user.id);
        // TODO: Open edit modal or navigate to edit page
        break;
      case 'reset-password':
        console.log('Reset password for user:', user.id);
        // TODO: Open reset password modal
        break;
      case 'deactivate':
        console.log('Deactivate user:', user.id);
        // TODO: Implement deactivate logic - API call to deactivate user
        break;
      default:
        console.log('Action:', key, 'for user:', user.id);
    }
  };

  const menuItems = getUserMenuItems(t);

  return (
    <Menu
      items={menuItems}
      placement="bottom right"
      offset={5}
      trigger={getCustomTrigger}
      onSelect={handleMenuSelect}
    />
  );
};

/**
 * All possible columns for Users Table
 */
export const getUsersColumns = (): ColumnDef<User>[] => [
  {
    key: 'name',
    label: 'admin.users.name',
    flex: 1.5,
    render: (user) => (
      <Text {...TYPOGRAPHY.paragraph} {...styles.nameText}>
        {user.name}
      </Text>
    ),
    mobileConfig: {
      leftRank: 1,
      showLabel: false,
    },
  },
  {
    key: 'email',
    label: 'admin.users.email',
    flex: 2,
    render: (user) => (
      <Text {...TYPOGRAPHY.paragraph} {...styles.emailText}>
        {user.email}
      </Text>
    ),
    mobileConfig: {
      fullWidthRank: 1,
      showLabel: false,
    },
  },
  {
    key: 'role',
    label: 'admin.users.role',
    flex: 1.2,
    render: (user) => <RoleBadge role={user.role} />,
    mobileConfig: {
      rightRank: 1,
      showLabel: false,
    },
  },
  {
    key: 'status',
    label: 'admin.users.status',
    flex: 1.2,
    render: (user) => <StatusBadge status={user.status} />,
    mobileConfig: {
      rightRank: 2,
      showLabel: false,
    },
  },
  {
    key: 'province',
    label: 'admin.users.province',
    flex: 1.2,
    render: (user) => (
      <Text {...TYPOGRAPHY.paragraph} {...styles.provinceText}>
        {user.province}
      </Text>
    ),
    mobileConfig: {
      leftRank: 3,
      showLabel: false,
    },
  },
  {
    key: 'district',
    label: 'admin.users.district',
    flex: 1.2,
    render: (user) => (
      <Pressable $web-cursor="pointer">
        <Text {...TYPOGRAPHY.paragraph} {...styles.districtText}>
          {user.district}
        </Text>
      </Pressable>
    ),
    mobileConfig: {
      rightRank: 3,
      showLabel: false,
    },
  },
  {
    key: 'lastLogin',
    label: 'admin.users.lastLogin',
    flex: 1.2,
    render: (user) => (
      <Text {...TYPOGRAPHY.paragraph} {...styles.lastLoginText}>
        {user.lastLogin}
      </Text>
    ),
    mobileConfig: {
      leftRank: 5,
      showLabel: false,
    },
  },
  {
    key: 'details',
    label: 'admin.users.details',
    flex: 1.5,
    render: (user) => <DetailsCell details={user.details} />,
    mobileConfig: {
      leftRank: 4,
      showLabel: false,
    },
  },
  {
    key: 'actions',
    label: 'admin.users.actions',
    flex: 0.8,
    render: (user) => <ActionsColumn user={user} />,
    mobileConfig: {
      fullWidthRank: 2,
      showLabel: false,
    },
  },
];

