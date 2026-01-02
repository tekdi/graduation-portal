import React from "react";
import { VStack, HStack, Text, Image, Input, InputField, Pressable } from "@ui";
import Select from "../ui/Inputs/Select";
import { filterStyles } from "./Styles";
import filterIcon from "../../assets/images/FilterIcon.png";
import { useLanguage } from "@contexts/LanguageContext";
import { usePlatform } from "@utils/platform";

interface FilterButtonProps {
  data: any[];
  filteredCount?: number;
  totalCount?: number;
  userLabel?: string; // e.g., "users", "participants"
  onFilterChange?: (filters: Record<string, any>) => void;
  // Configuration for right section (User Count + Clear Button)
  showCount?: boolean; // Show filtered count (default: true if filteredCount and totalCount are provided)
  showClearButton?: boolean; // Show clear button (default: true)
  rightContent?: React.ReactNode; // Custom right content (overrides default count + clear button)
  countFormatter?: (filtered: number, total: number, label: string) => string; // Custom count format function
}

export default function FilterButton({ 
  data, 
  filteredCount, 
  totalCount,
  userLabel = 'users',
  onFilterChange,
  showCount,
  showClearButton = true,
  rightContent,
  countFormatter
}: FilterButtonProps) {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const [value, setValue] = React.useState<any>({});

  // Notify parent when filters change
  React.useEffect(() => {
    onFilterChange?.(value);
  }, [value, onFilterChange]);

  // Get default display values for UI (not included in output)
  const getDefaultDisplayValue = (item: any) => {
    if (item.type !== 'search' && item.data && item.data.length > 0) {
      const firstItem = item.data[0];
      // Extract the actual value string from the first item
      if (typeof firstItem === 'string') {
        return firstItem;
      } else if (firstItem?.value !== undefined) {
        // Use marker for actual null to match option values
        // Empty strings are handled directly
        if (firstItem.value === null) {
          return '__NULL_VALUE__';
        } else {
          return String(firstItem.value);
        }
      }
    }
    return "";
  };

  const handleClearFilters = () => {
    setValue({});
  };

  // Determine if count should be shown
  const shouldShowCount = showCount !== undefined 
    ? showCount 
    : (filteredCount !== undefined && totalCount !== undefined);

  // Format count text
  const getCountText = () => {
    if (!shouldShowCount || filteredCount === undefined || totalCount === undefined) {
      return null;
    }
    if (countFormatter) {
      return countFormatter(filteredCount, totalCount, userLabel);
    }
    return `${filteredCount} of ${totalCount} ${userLabel}`;
  };

  // Render right section content
  const renderRightContent = () => {
    // If custom right content is provided, use it
    if (rightContent) {
      return rightContent;
    }

    // Otherwise, render default count + clear button
    const countText = getCountText();
    
    return (
      <HStack space="md" alignItems="center">
        {countText && (
          <Text {...filterStyles.userCountText}>
            {countText}
          </Text>
        )}
        {showClearButton && (
          <Pressable onPress={handleClearFilters}>
            <Text {...filterStyles.clearLinkText} $web-cursor="pointer">
              {t('common.clear')}
            </Text>
          </Pressable>
        )}
      </HStack>
    );
  };

  // Render a single filter item
  const renderFilterItem = (item: any, containerStyle?: any) => (
    <VStack 
      key={item.attr}
      {...(containerStyle || (item.type === 'search' 
        ? filterStyles.searchContainer 
        : filterStyles.roleContainer))}
    >
      {/* <Text {...filterStyles.label}>
        {item.nameKey ? t(item.nameKey) : item.name}
      </Text> */}
      {item.type === 'search' ? (
        <Input {...filterStyles.input}>
          <InputField
            placeholder={
              item.placeholderKey 
                ? t(item.placeholderKey) 
                : item.placeholder || (item.nameKey ? `${t('common.search')} ${t(item.nameKey).toLowerCase()}...` : `Search ${item.name?.toLowerCase()}...`)
            }
            value={value?.[item.attr] || ""}
            onChangeText={(text: string) => {
              if (!text || text.trim() === "") {
                setValue((prev: any) => {
                  const updated = { ...prev };
                  delete updated[item.attr];
                  return updated;
                });
              } else {
                setValue((prev: any) => ({ ...prev, [item.attr]: text }));
              }
            }}
          />
        </Input>
      ) : (
        <Select
          value={value?.[item.attr] || getDefaultDisplayValue(item)}
          onChange={(v) => {
            // ❗ If actual null (marked), empty string, or undefined → remove from state
            // Note: String "null" is kept in state, only actual null/empty removes the key
            if (v == null || v === '__NULL_VALUE__' || v === '') {
              setValue((prev: any) => {
                const updated = { ...prev };
                delete updated[item.attr];
                return updated;
              });
            } else {
              // Otherwise store the selected value (including string "null")
              setValue((prev: any) => ({
                ...prev,
                [item.attr]: v,
              }));
            }
          }}
          options={
            item?.data?.map((option: any) => {
              // If it's a string, return as-is (backward compatibility)
              if (typeof option === 'string') {
                return option;
              }
              // If it's an object with labelKey, translate it
              if (option.labelKey) {
                return {
                  ...option,
                  label: t(option.labelKey),
                };
              }
              // If it has label, return as-is
              return option;
            }) || []
          }
          {...filterStyles.input}
        />
      )}
    </VStack>
  );

  return (
    <VStack {...filterStyles.container}>
      {/* Title Row with User Count and Clear Button */}
      <HStack {...filterStyles.titleContainer}>
        {/* Left: Filter Icon + Title */}
        <HStack alignItems="center">
          <Image 
            source={filterIcon}
            style={{ width: 16, height: 16 }}
            alt="Filter icon"
          />
          <Text {...filterStyles.titleText}>
            {t('common.filters')}
          </Text>
        </HStack>

        {/* Right: Configurable content (User Count + Clear Button or custom) */}
        {renderRightContent()}
      </HStack>

      {/* Filters Row */}
      {isMobile ? (
        <VStack space="md" width="$full">
          {data.map((item: any) => renderFilterItem(item, { width: '$full' }))}
        </VStack>
      ) : (
        <HStack {...filterStyles.filterFieldsContainer}>
          {data.map((item: any) => renderFilterItem(item))}
        </HStack>
      )}

    </VStack>
  );
}

