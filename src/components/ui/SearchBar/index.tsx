import React, { useState, useEffect, useCallback } from 'react';
import { Box, Input, InputField, InputSlot } from '@gluestack-ui/themed';
import Icon from '../Icon';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { SearchBarProps } from '@app-types/components';

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 500,
  defaultValue = '',
}) => {
  const [searchText, setSearchText] = useState(defaultValue);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchText, debounceMs, onSearch]);

  const handleChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  return (
    <Box width="$full">
      <Input
        variant="outline"
        size="lg"
        borderColor={theme.tokens.colors.backgroundPrimary.light}
        borderRadius="$md"
        bg={theme.tokens.colors.backgroundPrimary.light}
        $hover={{
          borderColor: theme.tokens.colors.primary500,
        }}
      >
        <InputSlot paddingLeft="$3">
          <Icon
            name="search"
            size={20}
            tintColor={theme.tokens.colors.mutedForeground}
          />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleChange}
          {...TYPOGRAPHY.input}
          placeholderTextColor={theme.tokens.colors.mutedForeground}
        />
      </Input>
    </Box>
  );
};

export default SearchBar;
