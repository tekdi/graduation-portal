import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Pressable,
  Icon,
  Divider,
  ScrollView,
  Modal,
  ModalBackdrop,
  ModalContent,
  Image,
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  SettingsIcon,
  ThreeDotsIcon,
  ArrowUpIcon,
  GlobeIcon,
  CloseIcon,
} from '@ui';
import { useNavigation } from '@react-navigation/native';
import { sidebarStyles, sidebarItemStyles } from '@layout/admin/styles';
import logoImage from '@assets/images/logo.png';
import { Platform } from 'react-native';

interface SidebarItem {
  key: string;
  label: string;
  icon: any;
  route?: string;
  children?: SidebarItem[];
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  isMobile,
}) => {
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['user-management']),
  );
  const [expandedQuickActions, setExpandedQuickActions] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');

  const handleClose = () => {
    if (onClose) {
      // Parent is controlling, notify parent to close
      onClose();
    }
  };

  const handleNavigation = (route?: string) => {
    if (route) {
      // @ts-ignore
      navigation.navigate(route);
      setActiveRoute(route);
      // Close drawer on mobile after navigation
      if (isMobile) {
        handleClose();
      }
    }
  };

  const mainItems: SidebarItem[] = [
    {
      key: 'user-management',
      label: 'User Management',
      icon: SettingsIcon,
      route: 'UserManagement',
    },
    {
      key: 'template-management',
      label: 'Template Management',
      icon: EditIcon,
      route: 'TemplateManagement',
    },
    {
      key: 'audit-log',
      label: 'Audit Log',
      icon: ThreeDotsIcon,
      route: 'AuditLog',
    },
  ];

  const quickActionItems: SidebarItem[] = [
    {
      key: 'upload-users',
      label: 'Upload Users (CSV)',
      icon: ArrowUpIcon,
      route: 'UploadUsers',
    },
    {
      key: 'new-lc',
      label: 'Create User',
      icon: AddIcon,
      route: 'NewLC',
    },
  ];

  const toggleExpand = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, isChild = false) => {
    const isExpanded = expandedItems.has(item.key);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeRoute === item.route;

    return (
      <Box key={item.key}>
        <Pressable
          onPress={() => {
            if (hasChildren) {
              toggleExpand(item.key);
            } else {
              handleNavigation(item.route);
            }
          }}
          bg={isActive ? '$primary100' : 'transparent'}
          {...sidebarItemStyles.container(isChild)}
          $hover={sidebarItemStyles.pressableHover}
        >
          <HStack {...sidebarItemStyles.itemContainer}>
            <HStack {...sidebarItemStyles.itemContent}>
              <Icon as={item.icon} {...sidebarItemStyles.itemIcon(isActive)} />
              <Text {...sidebarItemStyles.itemText(isActive)}>
                {item.label}
              </Text>
            </HStack>
            {hasChildren && (
              <Icon
                as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                {...sidebarItemStyles.chevronIcon}
              />
            )}
          </HStack>
        </Pressable>
        {hasChildren && isExpanded && (
          <VStack {...sidebarItemStyles.childContainer}>
            {item.children?.map(child => renderSidebarItem(child, true))}
          </VStack>
        )}
      </Box>
    );
  };

  const sidebarContent = (
    <>
      {/* Left: Menu Button (mobile only) & Logo */}
      <HStack {...sidebarStyles.mobileMenuButton}>
        <HStack {...sidebarStyles.logoContainer}>
          <Image
            source={logoImage}
            style={sidebarStyles.logoImage}
            resizeMode="contain"
          />
          <VStack {...sidebarStyles.brandContainer}>
            <HStack {...sidebarStyles.brandRow}>
              <Text {...sidebarStyles.brandTextPrimary}>brac</Text>
              <Text {...sidebarStyles.brandTextSecondary}>GBL Admin</Text>
            </HStack>
            <Text {...sidebarStyles.versionText}>Console v3.1</Text>
          </VStack>
        </HStack>
      </HStack>
      <ScrollView {...sidebarStyles.scrollContent}>
        {/* MAIN Section */}
        <Box {...sidebarStyles.mainSection}>
          <Text {...sidebarStyles.sectionTitle}>MAIN</Text>
          <VStack space="xs">
            {mainItems.map(item => renderSidebarItem(item))}
          </VStack>
        </Box>

        <Divider my="$4" />

        {/* QUICK ACTIONS Section */}
        <Box>
          <Pressable
            onPress={() => setExpandedQuickActions(!expandedQuickActions)}
            {...sidebarStyles.quickActionsHeader}
          >
            <HStack {...sidebarStyles.quickActionsTitleContainer}>
              <Text {...sidebarStyles.quickActionsTitle}>QUICK ACTIONS</Text>
              <Icon
                as={expandedQuickActions ? ChevronUpIcon : ChevronDownIcon}
                {...sidebarStyles.quickActionsChevron}
              />
            </HStack>
          </Pressable>
          {expandedQuickActions && (
            <VStack {...sidebarStyles.quickActionsContent}>
              {quickActionItems.map(item => renderSidebarItem(item))}
            </VStack>
          )}
        </Box>
      </ScrollView>

      {/* Bottom: Language & System Status */}
      <Box {...sidebarStyles.bottomSection}>
        <VStack {...sidebarStyles.bottomContent}>
          {/* Language Selector */}
          <Pressable
            onPress={() => {
              // Handle language selection
            }}
          >
            <HStack {...sidebarStyles.languageSelectorContainer}>
              <Icon as={GlobeIcon} {...sidebarStyles.languageIcon} />
              <Text {...sidebarStyles.languageText}>English</Text>
              <Icon as={ChevronDownIcon} {...sidebarStyles.languageChevron} />
            </HStack>
          </Pressable>

          {/* System Status */}
          <HStack {...sidebarStyles.statusContainer}>
            <Box {...sidebarStyles.statusIndicator} />
            <Text {...sidebarStyles.statusText}>System Active</Text>
          </HStack>
        </VStack>
      </Box>
    </>
  );

  // Render as Drawer (using Modal) for mobile, as fixed sidebar for desktop
  if (isMobile) {
    return (
      <Modal isOpen={isOpen}>
        <ModalBackdrop />
        <ModalContent
          {...sidebarStyles.drawerContent}
          height={Platform.OS !== 'web' ? '100%' : 'auto'}
        >
          {/* Drawer Header */}
          <Box {...sidebarStyles.drawerHeader}>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Text {...sidebarStyles.drawerTitle}>Menu</Text>
              <Pressable onPress={handleClose} {...sidebarStyles.closeButton}>
                <Icon as={CloseIcon} size="md" />
              </Pressable>
            </HStack>
          </Box>
          {/* Drawer Body */}
          <Box {...sidebarStyles.drawerBody}>{sidebarContent}</Box>
        </ModalContent>
      </Modal>
    );
  }

  // Desktop: Render as fixed sidebar
  return (
    <Box {...sidebarStyles.container} display={isOpen ? 'flex' : 'none'}>
      {sidebarContent}
    </Box>
  );
};

export default AdminSidebar;
