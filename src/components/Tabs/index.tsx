import React from 'react';
import { TabButtonProps } from '@app-types/components';
import { theme } from '@config/theme';
import { Text, Pressable, HStack } from '@gluestack-ui/themed';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { tabButtonStyles } from './Styles';

export const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onPress,
  variant = 'default',
}) => {
  const { t } = useLanguage();
  const { key, label, icon, isDisabled = false } = tab;

  const isButtonTabVariant = variant === 'ButtonTab';

  const containerStyles = isButtonTabVariant
    ? tabButtonStyles.buttonTabContainer(isActive)
    : tabButtonStyles.defaultContainer(isActive);

  const textStyles = isButtonTabVariant
    ? tabButtonStyles.buttonTabText(isActive)
    : tabButtonStyles.defaultText(isActive);

  const iconColor = isButtonTabVariant
    ? tabButtonStyles.buttonTabIconColor
    : isActive
    ? theme.tokens.colors.primary500
    : theme.tokens.colors.mutedForeground;

  return (
    <Pressable
      onPress={() => !isDisabled && onPress(key)}
      {...containerStyles}
      opacity={isDisabled ? 0.5 : 1}
    >
      {icon ? (
        <HStack alignItems="center" justifyContent="center" gap="$2" p="$1">
          <LucideIcon name={icon} size={20} color={iconColor} />
          <Text {...textStyles}>{t(label)}</Text>
        </HStack>
      ) : (
        <Text {...textStyles}>{t(label)}</Text>
      )}
    </Pressable>
  );
};