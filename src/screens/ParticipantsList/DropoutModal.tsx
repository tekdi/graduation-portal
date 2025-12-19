import React from 'react';
import { VStack, Text, Input, InputField } from '@ui';
import { Modal } from '@ui';
import { LucideIcon } from '@components/ui';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { styles } from '../../components/DataTable/Styles';

interface DropoutModalProps {
  isOpen: boolean;
  itemName: string;
  dropoutReason: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  onReasonChange: (reason: string) => void;
}

const DropoutModal: React.FC<DropoutModalProps> = ({
  isOpen,
  itemName,
  dropoutReason,
  onClose,
  onConfirm,
  onReasonChange,
}) => {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={t('actions.confirmDropout') || 'Confirm Dropout'}
      headerIcon={
        <LucideIcon
          name="UserX"
          size={24}
          color={theme.tokens.colors.error.light}
        />
      }
      maxWidth={500}
      cancelButtonText={t('common.cancel') || 'Cancel'}
      confirmButtonText={t('actions.confirmDropout') || 'Confirm Dropout'}
      onCancel={onClose}
      onConfirm={() => onConfirm(dropoutReason)}
      confirmButtonColor={theme.tokens.colors.error.light}
    >
      <VStack space="lg">
        <Text
          {...TYPOGRAPHY.paragraph}
          color={theme.tokens.colors.textSecondary}
          lineHeight="$xl"
        >
          {t('actions.dropoutMessage', { name: itemName }) ||
            `Mark ${itemName} as dropout from the program`}
        </Text>

        <VStack space="sm">
          <Text
            {...TYPOGRAPHY.label}
            color={theme.tokens.colors.textPrimary}
            fontWeight="$medium"
          >
            {t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
          </Text>
          <Input
            {...styles.modalInput}
            borderColor={theme.tokens.colors.inputBorder}
            bg={theme.tokens.colors.modalBackground}
            $focus-borderColor={theme.tokens.colors.inputFocusBorder}
            $focus-borderWidth={2}
          >
            <InputField
              placeholder={
                t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
              }
              value={dropoutReason}
              onChangeText={onReasonChange}
              {...styles.modalInputField}
              placeholderTextColor={theme.tokens.colors.textMuted}
            />
          </Input>
          <Text
            {...TYPOGRAPHY.bodySmall}
            color={theme.tokens.colors.textSecondary}
            lineHeight="$sm"
          >
            {t('actions.dropoutHint') ||
              'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'}
          </Text>
        </VStack>
      </VStack>
    </Modal>
  );
};

export default DropoutModal;

