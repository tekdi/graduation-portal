import React, { useState } from 'react';
import {
  Box,
  Pressable,
  VStack,
  HStack,
  Text,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  Heading,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  Icon,
  ThreeDotsIcon,
  EyeIcon,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { getBackdropStyle, getDropdownStyle } from './Styles';

interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  action: 'navigate' | 'modal';
  route?: string;
}

interface ActionsMenuProps<T = any> {
  item: T;
  actions?: ActionItem[];
  onDropout?: (item: T) => void;
  getItemId?: (item: T) => string;
  getItemName?: (item: T) => string;
}

/**
 * ActionsMenu Component
 * Shows a dropdown menu with actions for a table row
 */
const ActionsMenu = <T = any,>({
  item,
  actions,
  onDropout,
  getItemId = (data: any) => data.id,
  getItemName = (data: any) => data.name || data.id,
}: ActionsMenuProps<T>) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropoutModal, setShowDropoutModal] = useState(false);

  const itemId = getItemId(item);
  const itemName = getItemName(item);

  const defaultActions: ActionItem[] = [
    {
      key: 'view-details',
      label: t('actions.viewDetails') || 'View Details',
      icon: (
        <Icon
          as={EyeIcon}
          size="md"
          color={theme.tokens.colors.mutedForeground}
        />
      ),
      action: 'navigate',
      route: 'participant-detail',
    },
    {
      key: 'log-visit',
      label: t('actions.logVisit') || 'Log Visit',
      icon: (
        <Icon
          as={EyeIcon}
          size="md"
          color={theme.tokens.colors.mutedForeground}
        />
      ),
      action: 'navigate',
      route: 'log-visit',
    },
    {
      key: 'dropout',
      label: t('actions.dropout') || 'Dropout',
      icon: (
        <Icon
          as={AlertCircleIcon}
          size="md"
          color={theme.tokens.colors.error.light}
        />
      ),
      color: theme.tokens.colors.error.light,
      action: 'modal',
    },
  ];
  const effectiveActions = actions ?? defaultActions;

  const handleActionClick = (actionItem: ActionItem) => {
    setShowMenu(false);

    if (actionItem.action === 'navigate' && actionItem.route) {
      // @ts-ignore - Navigation type inference
      navigation.navigate(actionItem.route, { participantId: itemId });
    } else if (actionItem.action === 'modal') {
      setShowDropoutModal(true);
    }
  };

  const handleDropoutConfirm = () => {
    setShowDropoutModal(false);
    onDropout?.(item);
  };

  const handleMenuClick = (e: any) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleBackdropClick = (e: any) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  return (
    <>
      {/* Actions Button */}
      <Box position="relative">
        <Pressable
          onPress={handleMenuClick}
          padding="$2"
          borderRadius="$sm"
          $web-cursor="pointer"
          sx={{
            ':hover': {
              bg: '$backgroundLight100',
            },
          }}
        >
          <Icon
            as={ThreeDotsIcon}
            size="md"
            color={theme.tokens.colors.mutedForeground}
          />
        </Pressable>

        {/* Backdrop to prevent see-through and handle outside clicks */}
        {showMenu && (
          <Pressable onPress={handleBackdropClick} style={getBackdropStyle()} />
        )}

        {/* Dropdown Menu */}
        {showMenu && (
          <Pressable
            onPress={e => {
              e.stopPropagation();
            }}
            style={getDropdownStyle()}
          >
            <Box
              bg="#FFFFFF"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$borderLight300"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={12}
              elevation={15}
              $web-boxShadow="0px 8px 24px rgba(0, 0, 0, 0.2)"
            >
              <VStack space="xs" padding="$2">
                {effectiveActions.map(actionItem => (
                  <Pressable
                    key={actionItem.key}
                    onPress={() => handleActionClick(actionItem)}
                    padding="$3"
                    borderRadius="$sm"
                    $web-cursor="pointer"
                    sx={{
                      ':hover': {
                        bg: '$backgroundLight50',
                      },
                    }}
                  >
                    <HStack space="md" alignItems="center">
                      {actionItem.icon}
                      <Text
                        {...TYPOGRAPHY.bodySmall}
                        color={
                          actionItem.color || theme.tokens.colors.foreground
                        }
                      >
                        {t(actionItem.label)}
                      </Text>
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </Box>
          </Pressable>
        )}
      </Box>

      {/* Dropout Confirmation Modal */}
      <Modal
        isOpen={showDropoutModal}
        onClose={() => setShowDropoutModal(false)}
      >
        <ModalBackdrop />
        <ModalContent maxWidth={450}>
          <ModalHeader>
            <Heading {...TYPOGRAPHY.h3}>
              {t('actions.confirmDropout') || 'Confirm Dropout'}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text {...TYPOGRAPHY.paragraph}>
              {t('actions.dropoutMessage', { name: itemName }) ||
                `Are you sure you want to mark "${itemName}" as dropout? This action can be reversed later.`}
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" width="$full" justifyContent="flex-end">
              <Button
                variant="outline"
                onPress={() => setShowDropoutModal(false)}
              >
                <ButtonText>{t('common.cancel') || 'Cancel'}</ButtonText>
              </Button>
              <Button
                bg={theme.tokens.colors.error.light}
                onPress={handleDropoutConfirm}
                $hover-bg={theme.tokens.colors.error.light}
              >
                <ButtonText>{t('actions.dropout') || 'Dropout'}</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionsMenu;
