import React from 'react';
import { Platform, I18nManager } from 'react-native';
import i18n from '../../../../config/i18n';
import {
  SelectItem,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectContent,
  SelectBackdrop,
  Select as GluestackSelect,
  SelectIcon,
  SelectInput,
  SelectTrigger,
  ChevronDownIcon,
  SelectPortal,
} from '@gluestack-ui/themed';

type Option = {
  value: string;
  name?: string;
  nativeName?: string;
  isRTL?: boolean;
};

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder,
}: SelectProps) {
  // For mobile, we need to ensure the Select component is properly configured
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue =
    selectedOption?.nativeName ||
    selectedOption?.name ||
    selectedOption?.value ||
    '';

  // Get localized placeholder with fallback
  const localizedPlaceholder =
    placeholder ?? i18n.t('common.selectOption', 'Select an option');

  // Determine writing direction for RTL support
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  const handleValueChange = (newValue: string | undefined) => {
    if (newValue && typeof newValue === 'string' && newValue.trim() !== '') {
      onChange(newValue);
    }
  };

  return (
    <GluestackSelect
      selectedValue={value}
      onValueChange={handleValueChange}
      {...(Platform.OS === 'web' ? { defaultValue: value } : {})}
    >
      <SelectTrigger variant="outline" size="md" width="$full">
        <SelectInput
          placeholder={localizedPlaceholder}
          value={displayValue}
          // @ts-ignore - writingDirection is a valid style prop but may not be in types
          style={{ writingDirection }}
        />
        <SelectIcon mr="$3">
          <ChevronDownIcon />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {options.map((option: Option, index: number) => (
            <SelectItem
              key={option?.value ?? option?.name ?? index.toString()}
              label={option?.nativeName || option?.name || option?.value}
              value={option?.value ?? option?.name ?? ''}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </GluestackSelect>
  );
}
