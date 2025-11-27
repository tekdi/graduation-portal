import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  HStack,
  VStack,
  Text,
  Heading,
  Box,
  Input,
  InputField,
  CloseIcon,
  Icon as GluestackIcon,
} from '@gluestack-ui/themed';
import { Pressable } from 'react-native';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { useLanguage } from '@contexts/LanguageContext';
import { ConfirmationModalProps } from '@app-types/components';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonColor = theme.tokens.colors.primary500,
  confirmButtonVariant,
  maxWidth,
  headerIcon,
  showInput = false,
  inputLabel,
  inputPlaceholder,
  inputHint,
  inputRequired = false,
  inputValue: controlledInputValue,
  onInputChange,
}) => {
  const { t } = useLanguage();

  // Internal state for input if not controlled
  const [internalInputValue, setInternalInputValue] = useState('');

  // Use controlled or uncontrolled input
  const inputValue =
    controlledInputValue !== undefined
      ? controlledInputValue
      : internalInputValue;
  const setInputValue = onInputChange || setInternalInputValue;

  // Reset internal state when modal closes
  useEffect(() => {
    if (!isOpen && !controlledInputValue) {
      setInternalInputValue('');
    }
  }, [isOpen, controlledInputValue]);

  const handleConfirm = () => {
    if (showInput) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const isConfirmDisabled = showInput && inputRequired && !inputValue.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} marginTop={350}>
      <ModalBackdrop bg={theme.tokens.colors.modalBackdrop} opacity={1} />
      <ModalContent
        maxWidth={maxWidth}
        width="70%"
        minWidth="$96"
        $web-width="auto"
        borderRadius="$xl"
        bg={theme.tokens.colors.backgroundPrimary.light}
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.2}
        shadowRadius={16}
        elevation={24}
        marginHorizontal="$4"
        marginVertical="auto"
        alignSelf="center"
      >
        {/* Header with Icon and Title */}
        <ModalHeader borderBottomWidth={0} padding="$6" paddingBottom="$4">
          <HStack space="md" alignItems="center" flex={1}>
            {/* Header Icon */}
            {headerIcon && (
              <Box
                width={48}
                height={48}
                borderRadius="$full"
                bg={theme.tokens.colors.iconBackground}
                alignItems="center"
                justifyContent="center"
              >
                {headerIcon}
              </Box>
            )}

            {/* Title */}
            <Heading
              {...TYPOGRAPHY.h3}
              flex={1}
              color={theme.tokens.colors.textPrimary}
            >
              {t(title)}
            </Heading>

            {/* Close Button */}
            <Pressable onPress={onClose}>
              <Box
                padding="$2"
                borderRadius="$sm"
                $web-cursor="pointer"
                sx={{
                  ':hover': {
                    bg: '$backgroundLight100',
                  },
                }}
              >
                <GluestackIcon as={CloseIcon} size="xl" color="$textLight600" />
              </Box>
            </Pressable>
          </HStack>
        </ModalHeader>

        {/* Body with Message and Optional Input */}
        <ModalBody padding="$6" paddingTop="$2" paddingBottom="$4">
          <VStack space="lg">
            {/* Description Message */}
            <Text
              {...TYPOGRAPHY.paragraph}
              color={theme.tokens.colors.textSecondary}
              lineHeight="$xl"
            >
              {t(message)}
            </Text>

            {/* Optional Input Field */}
            {showInput && (
              <VStack space="sm">
                {/* Input Label */}
                {inputLabel && (
                  <Text
                    {...TYPOGRAPHY.label}
                    color={theme.tokens.colors.textPrimary}
                    fontWeight="$medium"
                  >
                    {t(inputLabel)}
                    {!inputRequired && (
                      <Text color={theme.tokens.colors.textMuted}>
                        {' '}
                        {t('common.optional')}
                      </Text>
                    )}
                  </Text>
                )}

                {/* Input Field */}
                <Input
                  variant="outline"
                  size="lg"
                  borderWidth={2}
                  borderColor={theme.tokens.colors.inputBorder}
                  borderRadius="$md"
                  bg={theme.tokens.colors.modalBackground}
                  $focus-borderColor={theme.tokens.colors.inputFocusBorder}
                  $focus-borderWidth={2}
                  minHeight={80}
                >
                  <InputField
                    placeholder={inputPlaceholder ? t(inputPlaceholder) : ''}
                    value={inputValue}
                    onChangeText={setInputValue}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    paddingTop="$3"
                    placeholderTextColor={theme.tokens.colors.textMuted}
                  />
                </Input>

                {/* Input Hint */}
                {inputHint && (
                  <Text
                    {...TYPOGRAPHY.bodySmall}
                    color={theme.tokens.colors.textSecondary}
                    lineHeight="$sm"
                  >
                    {t(inputHint)}
                  </Text>
                )}
              </VStack>
            )}
          </VStack>
        </ModalBody>

        {/* Footer with Action Buttons */}
        <ModalFooter borderTopWidth={0} padding="$6" paddingTop="$4">
          <HStack space="md" width="$full" justifyContent="flex-end">
            {/* Cancel Button */}
            <Button
              variant="outline"
              onPress={onClose}
              borderWidth={1}
              borderColor={theme.tokens.colors.inputBorder}
              bg={theme.tokens.colors.modalBackground}
              paddingHorizontal="$6"
              paddingVertical="$3"
              borderRadius="$md"
              $hover-bg={theme.tokens.colors.hoverBackground}
              $web-cursor="pointer"
            >
              <ButtonText
                color={theme.tokens.colors.textPrimary}
                {...TYPOGRAPHY.button}
              >
                {t(cancelText)}
              </ButtonText>
            </Button>

            {/* Confirm Button */}
            <Button
              variant={confirmButtonVariant}
              bg={confirmButtonColor}
              onPress={handleConfirm}
              paddingHorizontal="$6"
              paddingVertical="$3"
              borderRadius="$md"
              $hover-bg={confirmButtonColor}
              $hover-opacity={0.9}
              $web-cursor="pointer"
              isDisabled={isConfirmDisabled}
              opacity={isConfirmDisabled ? 0.5 : 1}
            >
              <ButtonText color={theme.tokens.colors.modalBackground}>
                {t(confirmText)}
              </ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
