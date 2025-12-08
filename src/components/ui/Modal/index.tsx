import React, { useState, useEffect } from 'react';
import {
  Modal as GluestackModal,
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
import { LucideIcon } from '@ui';
import { usePlatform } from '@utils/platform';
import { profileStyles, commonModalContentStyles, commonModalContainerStyles, LCProfileStyles } from './Styles';
import Select from '../Inputs/Select';
import { PROVINCES } from '@constants/PARTICIPANTS_LIST';
import { getSitesByProvince } from '../../../services/participantService';
import { LC_PROFILE_MOCK } from '@constants/LC_PROFILE_MOCK';

const Modal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  variant = 'confirmation',
  onConfirm,
  title,
  subtitle,
  message,
  confirmText = 'common.confirm',
  cancelText = 'common.cancel',
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
  profile,
  onAddressEdit,
  isEditingAddress = false,
  editedAddress,
  onAddressChange,
  onSaveAddress,
  onCancelEdit,
  isSavingAddress = false,
}) => {
  const { t } = useLanguage();
  const { isWeb } = usePlatform();
  
  const isProfileVariant = variant === 'profile';
  const isLcProfileVariant = variant === 'lcProfile';

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
    if (onConfirm) {
      if (showInput) {
        onConfirm(inputValue);
      } else {
        onConfirm();
      }
    }
  };

  const isConfirmDisabled = showInput && inputRequired && !inputValue.trim();

  // LC Profile Variant Rendering (lg for both web and mobile)
  if (isLcProfileVariant && profile) {
    // Use mock data for LC profile (will be replaced by API later)
    const lcProfileData = LC_PROFILE_MOCK;
    const profileDetails = lcProfileData.profileDetails;
    const { isMobile } = usePlatform();

    return (
      <GluestackModal isOpen={isOpen} onClose={onClose} size="lg" {...commonModalContainerStyles}>
        <ModalBackdrop />
        <ModalContent {...profileStyles.modalContent}>

          <ModalHeader {...profileStyles.modalHeader}>
            <HStack space="md" alignItems="center" flex={1}>
              <Box 
                {...LCProfileStyles.headerAvatar}
                bg={theme.tokens.colors.primary500}
                $web-backgroundImage="linear-gradient(to right bottom, rgb(139, 40, 66) 0%, oklab(0.999994 0.0000455678 0.0000200868 / 0.9) 100%)"
              >
                <LucideIcon name="User" size={30} color="#fff" />
              </Box>

              <VStack flex={1}>
                <Text {...profileStyles.modalTitle}>{t(title)}</Text>
                {subtitle && <Text {...profileStyles.modalSubtitle}>{t(subtitle)}</Text>}
              </VStack>
            </HStack>

            <Pressable onPress={onClose}>
              <Box {...LCProfileStyles.closeBtn}>
                <LucideIcon name="X" size={16} color={theme.tokens.colors.textForeground} />
              </Box>
            </Pressable>
          </ModalHeader>

          <ModalBody {...profileStyles.modalBody}>
            
            <VStack 
              {...LCProfileStyles.lcProfileCard}
              $md-p="$6"
            >
              <Box 
                {...LCProfileStyles.lcFieldWrapper}
                $md-flexDirection="row"
                $md-gap="$6"
              >

                {/* Full Name */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="User" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.fullName')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.fullName}</Text>
                  </Box>
                </Box>

                {/* LC ID */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="Award" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.lcId')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.lcId}</Text>
                  </Box>
                </Box>

                {/* Email Address */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="Mail" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.emailAddress')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.emailAddress}</Text>
                  </Box>
                </Box>

                {/* Phone Number */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="Phone" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.phoneNumber')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.phoneNumber}</Text>
                  </Box>
                </Box>

                {/* Service Area - Full Width */}
                <Box width="$full">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="MapPin" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.serviceArea')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.serviceArea}</Text>
                  </Box>
                </Box>

                {/* Start Date */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <LucideIcon name="Calendar" size={16} color={theme.tokens.colors.textMutedForeground} />
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.startDate')}</Text>
                  </HStack>
                  <Box {...LCProfileStyles.lcValueField}>
                    <Text {...profileStyles.fieldLabel}>{profileDetails.startDate}</Text>
                  </Box>
                </Box>

                {/* Language Preference */}
                <Box {...LCProfileStyles.lcItem} $md-width="auto">
                  <HStack mb="$2" space="sm">
                    <Text {...profileStyles.fieldValue}>{t('lcProfile.languagePreference')}</Text>
                  </HStack>
                  <HStack space="sm">
                    <Pressable>
                      <Box
                        bg={profileDetails.languagePreference === 'en' ? theme.tokens.colors.primary500 : 'transparent'}
                        borderWidth={profileDetails.languagePreference === 'en' ? 0 : 1}
                        borderColor={theme.tokens.colors.primary500}
                        px="$3"
                        py="$1"
                        borderRadius="$full"
                      >
                        <Text
                          color={profileDetails.languagePreference === 'en' ? "#fff" : theme.tokens.colors.primary500}
                          fontSize="$xs" fontWeight="$medium"
                        >
                          {t('languages.en')}
                        </Text>
                      </Box>
                    </Pressable>
                    <Pressable>
                      <Box
                        bg={profileDetails.languagePreference === 'es' ? theme.tokens.colors.primary500 : 'transparent'}
                        borderWidth={profileDetails.languagePreference === 'es' ? 0 : 1}
                        borderColor={theme.tokens.colors.primary500}
                        px="$3"
                        py="$1"
                        borderRadius="$full"
                      >
                        <Text
                          color={profileDetails.languagePreference === 'es' ? "#fff" : theme.tokens.colors.primary500}
                          fontSize="$xs" 
                          fontWeight="$medium"
                        >
                          {t('languages.es')}
                        </Text>
                      </Box>
                    </Pressable>
                  </HStack>
                </Box>

              </Box>
            </VStack>

          </ModalBody>
        </ModalContent>
      </GluestackModal>
    );
  }


  // Profile Variant Rendering (Participant Profile: sm desktop, lg mobile)
  if (isProfileVariant && profile) {
    return (
      <GluestackModal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={isWeb ? "sm" : "lg"}
        {...commonModalContainerStyles}
      >
        <ModalBackdrop />
          <ModalContent 
            {...profileStyles.modalContent}
          >
          <ModalHeader {...profileStyles.modalHeader}>
            <VStack space="sm" flex={1}>
              <Text {...profileStyles.modalTitle}>
                {t(title)}
              </Text>
              {subtitle && (
                <Text {...profileStyles.modalSubtitle}>
                  {t(subtitle)}
                </Text>
              )}
            </VStack>
            <Pressable onPress={onClose}>
              <LucideIcon 
                name="X" 
                size={20} 
                color={theme.tokens.colors.textForeground} 
              />
            </Pressable>
          </ModalHeader>

          <ModalBody {...profileStyles.modalBody}>
            <VStack space="lg">
              {/* Name Field */}
              <VStack space="xs" {...profileStyles.fieldSection}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.name')}
                </Text>
                <Text {...profileStyles.fieldValue}>
                  {profile.name}
                </Text>
              </VStack>

              {/* ID Field */}
              <VStack space="xs" {...profileStyles.fieldSection}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.id')}
                </Text>
                <Text {...profileStyles.fieldValue}>
                  {profile.id}
                </Text>
              </VStack>

              {/* Contact Section */}
              <VStack space="xs" {...(profile.address ? profileStyles.fieldSection : {})}>
                <Text {...profileStyles.fieldLabel}>
                  {t('common.profileFields.contact')}
                </Text>
                <VStack space="sm">
                  <Text {...profileStyles.fieldValue}>
                    {profile.phone}
                  </Text>
                  <Text {...profileStyles.fieldValue}>
                    {profile.email}
                  </Text>
                </VStack>
              </VStack>

              {/* Address Section */}
              {profile.address && (
                <VStack space="xs">
                  {!isEditingAddress ? (
                    <>
                      <HStack alignItems="center" justifyContent="space-between">
                        <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.address')}
                        </Text>
                        {onAddressEdit && (
                          <Pressable onPress={onAddressEdit}>
                            <LucideIcon 
                              name="Pencil" 
                              size={16} 
                              color={theme.tokens.colors.primary500} 
                            />
                          </Pressable>
                        )}
                      </HStack>
                      <Text {...profileStyles.fieldValue}>
                        {profile.address}
                      </Text>
                    </>
                  ) : (
                    <VStack space="sm">
                      {/* Street Address Input */}
                      <VStack space="xs">
                        
                      <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.address')}
                        </Text>
                        <Input
                          {...profileStyles.input}
                          $focus-borderColor={theme.tokens.colors.inputFocusBorder}
                        >
                          <InputField
                            placeholder={t('common.profileFields.addressFields.street')}
                            value={editedAddress?.street || ''}
                            onChangeText={(value) => onAddressChange?.('street', value)}
                          />
                        </Input>
                      </VStack>

                      {/* Province Dropdown */}
                      <VStack space="xs">
                        {/* <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.addressFields.province')}
                        </Text> */}
                        <Select 
                          options={PROVINCES.map(p => ({ label: p.label, value: p.value }))}
                          value={editedAddress?.province || ''}
                          onChange={(value) => onAddressChange?.('province', value)}
                          placeholder={t('participantDetail.profileModal.selectProvince')}
                          bg="$white" borderColor="transparent"
                        />
                      </VStack>

                      {/* Site Dropdown */}
                      <VStack space="xs">
                        {/* <Text {...profileStyles.fieldLabel}>
                          {t('common.profileFields.addressFields.site')}
                        </Text> */}
                        <Select
                          options={getSitesByProvince(editedAddress?.province || '').map(s => ({ 
                            label: s.label, 
                            value: s.value 
                          }))}
                          value={editedAddress?.site || ''}
                          onChange={(value) => onAddressChange?.('site', value)}
                          placeholder={t('participantDetail.profileModal.selectSite')}
                          bg="$white"
                          borderColor="transparent"
                        />
                      </VStack>
                    </VStack>
                  )}
                </VStack>
              )}
            </VStack>
          </ModalBody>

          {/* Footer with Edit Mode Buttons */}
          {isEditingAddress && (
            <ModalFooter borderTopWidth={0} padding="$6" paddingTop="$4">
              <HStack space="md" width="$full" justifyContent="flex-end">
                {/* Cancel Button */}
                <Button
                  variant="outline"
                  onPress={onCancelEdit}
                  borderWidth={1}
                  borderColor={theme.tokens.colors.inputBorder}
                  bg={theme.tokens.colors.modalBackground}
                  paddingHorizontal="$6"
                  paddingVertical="$3"
                  borderRadius="$md"
                  $hover-bg={theme.tokens.colors.hoverBackground}
                  $web-cursor="pointer"
                  isDisabled={isSavingAddress}
                >
                  <ButtonText
                    color={theme.tokens.colors.textPrimary}
                    {...TYPOGRAPHY.button}
                  >
                    {t('common.cancel')}
                  </ButtonText>
                </Button>

                {/* Save Location Button */}
                <Button
                  variant="solid"
                  bg={theme.tokens.colors.primary500}
                  onPress={onSaveAddress}
                  paddingHorizontal="$6"
                  paddingVertical="$3"
                  borderRadius="$md"
                  $hover-bg={theme.tokens.colors.primary500}
                  $hover-opacity={0.9}
                  $web-cursor="pointer"
                  isDisabled={isSavingAddress || !editedAddress?.street || !editedAddress?.province || !editedAddress?.site}
                  opacity={isSavingAddress ? 0.5 : 1}
                >
                  <ButtonText color={theme.tokens.colors.modalBackground}>
                    {isSavingAddress ? t('common.loading') : t('participantDetail.profileModal.saveLocation')}
                  </ButtonText>
                </Button>
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </GluestackModal>
    );
  }

  // Confirmation Variant Rendering (Default)
  return (
    <GluestackModal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md"
      {...commonModalContainerStyles}
    >
      <ModalBackdrop />
        <ModalContent
          {...commonModalContentStyles}
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
            {message && (
              <Text
                {...TYPOGRAPHY.paragraph}
                color={theme.tokens.colors.textSecondary}
                lineHeight="$xl"
              >
                {t(message)}
              </Text>
            )}

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
            {onConfirm && (
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
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </GluestackModal>
  );
};

export default Modal;

