import React, { useState, useRef } from 'react';
import { Box, Pressable, VStack, HStack, Text } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Modal as RNModal } from 'react-native';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import ConfirmationModal from '../ConfirmationModal';
import Icon from '../Icon';
import { ActionItem, ActionsMenuProps } from '@app-types/components';

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
  const [dropoutReason, setDropoutReason] = useState('');
  const buttonRef = useRef<any>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  // ✅ Capture item properties immediately - not in closures
  const thisItemId = getItemId(item);
  const thisItemName = getItemName(item);

  // Store the actual item in ref to always have latest
  const itemRef = useRef(item);
  itemRef.current = item;

  const defaultActions: ActionItem[] = [
    {
      key: 'view-details',
      label: t('actions.viewDetails') || 'View Details',
      icon: (
        <Icon
          name="eyeIcon"
          size={20}
          tintColor={theme.tokens.colors.mutedForeground}
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
          name="logVisitIcon"
          size={20}
          tintColor={theme.tokens.colors.mutedForeground}
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
          name="dropoutIcon"
          size={20}
          tintColor={theme.tokens.colors.error.light}
        />
      ),
      color: theme.tokens.colors.error.light,
      action: 'modal',
    },
  ];
  const effectiveActions = actions ?? defaultActions;

  const handleMenuOpen = (e: any) => {
    e?.stopPropagation?.();

    console.log('Item ID:', thisItemId);
    console.log('Item:', item);

    // Measure button position
    if (buttonRef.current) {
      buttonRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number,
        ) => {
          // Position menu below the button
          setMenuPosition({
            top: pageY + height + 5, // 5px below button
            left: pageX - 140, // Align to right side of button
          });
          setShowMenu(true);
        },
      );
    } else {
      // Fallback if measure fails
      setShowMenu(true);
    }
  };

  const handleMenuClose = (e?: any) => {
    e?.stopPropagation?.();
    setShowMenu(false);
  };

  const handleActionClick = (actionItem: ActionItem) => (e: any) => {
    e?.stopPropagation?.();

    // Get fresh item ID at click time
    const currentItemId = getItemId(itemRef.current);

    console.log('Action:', actionItem.key);
    console.log('Item ID:', currentItemId);
    console.log('Item:', itemRef.current);

    handleMenuClose();

    if (actionItem.action === 'navigate' && actionItem.route) {
      // @ts-ignore - Navigation type inference
      navigation.navigate(actionItem.route, { participantId: currentItemId });
    } else if (actionItem.action === 'modal') {
      setTimeout(() => {
        setShowDropoutModal(true);
      }, 100);
    }
  };

  const handleDropoutConfirm = (reason?: string) => {
    const currentItemId = getItemId(itemRef.current);
    console.log('Item ID:', currentItemId);
    console.log('Item:', itemRef.current);
    console.log('Dropout reason:', reason);

    setShowDropoutModal(false);
    setDropoutReason(''); // Reset reason
    onDropout?.(itemRef.current);
  };

  return (
    <>
      {/* Three-dot Button */}
      <Box ref={buttonRef}>
        <Pressable
          onPress={handleMenuOpen}
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
            name="threeDotIcon"
            size={30}
            tintColor={theme.tokens.colors.mutedForeground}
          />
        </Pressable>
      </Box>

      {/* Dropdown Menu Modal - Renders outside table hierarchy */}
      <RNModal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={handleMenuClose}
        statusBarTranslucent
      >
        {/* Full-screen transparent backdrop */}
        <Pressable onPress={handleMenuClose} flex={1} bg="$transparent">
          {/* Menu positioned absolutely - below the three-dot icon */}
          <Box
            position="absolute"
            top={menuPosition.top}
            left={menuPosition.left}
            minWidth={200}
            maxWidth={220}
            zIndex={99999}
          >
            <Pressable onPress={e => e?.stopPropagation?.()}>
              <Box
                bg="$white"
                borderRadius="$md"
                borderWidth={1}
                borderColor="$borderLight300"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.15}
                shadowRadius={12}
                elevation={20}
                $web-boxShadow="0px 8px 24px rgba(0, 0, 0, 0.2)"
              >
                <VStack space="xs" padding="$2">
                  {effectiveActions.map(actionItem => (
                    <Pressable
                      key={actionItem.key}
                      onPress={handleActionClick(actionItem)}
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
          </Box>
        </Pressable>
      </RNModal>

      {/* Dropout Confirmation Modal with Input */}
      <ConfirmationModal
        isOpen={showDropoutModal}
        onClose={() => {
          setShowDropoutModal(false);
          setDropoutReason(''); // Reset on close
        }}
        onConfirm={handleDropoutConfirm}
        title={t('actions.confirmDropout') || 'Confirm Dropout'}
        message={
          t('actions.dropoutMessage', { name: thisItemName }) ||
          `Mark ${thisItemName} as dropout from the program`
        }
        confirmText={t('actions.confirmDropout') || 'Confirm Dropout'}
        cancelText={t('common.cancel') || 'Cancel'}
        confirmButtonColor={theme.tokens.colors.error.light}
        headerIcon={
          <Icon
            name="dropoutIcon"
            size={24}
            tintColor={theme.tokens.colors.error.light}
          />
        }
        showInput
        inputLabel={t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
        inputPlaceholder={
          t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
        }
        inputHint={
          t('actions.dropoutHint') ||
          'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'
        }
        inputValue={dropoutReason}
        onInputChange={setDropoutReason}
        inputRequired={false}
        maxWidth={500}
      />
    </>
  );
};

export default ActionsMenu;
