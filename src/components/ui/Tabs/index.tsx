import React from 'react';
import { TabButtonProps } from '@app-types/components';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { Text, Pressable } from '@gluestack-ui/themed';
import { useLanguage } from '@contexts/LanguageContext';

export const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  onPress,
}) => {
  const { t } = useLanguage();
  const { key, label, isDisabled = false } = tab;

  return (
    <Pressable
      flex={1}
      onPress={() => !isDisabled && onPress(key)}
      paddingHorizontal="$6"
      paddingVertical="$3"
      borderBottomWidth={3}
      borderBottomColor={
        isActive ? theme.tokens.colors.primary500 : 'transparent'
      }
      opacity={isDisabled ? 0.5 : 1}
    >
      <Text
        textAlign="center"
        {...TYPOGRAPHY.label}
        color={
          isActive
            ? theme.tokens.colors.primary500
            : theme.tokens.colors.mutedForeground
        }
      >
        {t(label)}
      </Text>
    </Pressable>
  );
};
