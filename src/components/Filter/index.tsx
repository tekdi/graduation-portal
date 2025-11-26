import React from "react";
import { VStack, HStack, Text, Image, Input, InputField, Button } from "@ui";
import Select from "../ui/Inputs/Select";
import { filterStyles } from "./Styles";
import filterIcon from "../../assets/images/FilterIcon.png";
import { useLanguage } from "@contexts/LanguageContext";

export default function FilterButton({ data }: any) {
  const { t } = useLanguage();
  const [value, setValue] = React.useState<any>({});

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

  return (
    <VStack {...filterStyles.container}>
      {/* Title */}
      <HStack {...filterStyles.titleContainer}>
        <Image 
          source={filterIcon}
          style={{ width: 20, height: 20 }}
          alt="Filter icon"
        />
        <Text {...filterStyles.titleText}>
          {t('common.filters')}
        </Text>
      </HStack>

      {/* Filters Row */}
      <HStack {...filterStyles.filterFieldsContainer}>
        {data.map((item: any) => (
          <VStack 
            key={item.attr}
            {...(item.type === 'search' 
              ? filterStyles.searchContainer 
              : filterStyles.roleContainer)}
          >
            <Text {...filterStyles.label}>
              {item.nameKey ? t(item.nameKey) : item.name}
            </Text>
            {item.type === 'search' ? (
              <Input {...filterStyles.input}>
                <InputField
                  placeholder={
                    item.placeholderKey 
                      ? t(item.placeholderKey) 
                      : item.placeholder || (item.nameKey ? `${t('common.search')} ${t(item.nameKey).toLowerCase()}...` : `Search ${item.name?.toLowerCase()}...`)
                  }
                  value={value?.[item.attr] || ""}
                  onChangeText={(v: any) => {
                    if (!v || v.trim() === "") {
                      const { [item.attr]: removed, ...rest } = value;
                      setValue(rest);
                    } else {
                      setValue({ ...value, [item.attr]: v });
                    }
                  }}
                />
              </Input>
            ) : (
              <Select
                value={value?.[item.attr] || getDefaultDisplayValue(item)}
                onChange={(e) => {
                  const v = e;

                  // ❗ If actual null (marked), empty string, or undefined → remove from state
                  // Note: String "null" is kept in state, only actual null/empty removes the key
                  if (v == null || v === '__NULL_VALUE__' || v === '') {
                    const { [item.attr]: removed, ...rest } = value;
                    setValue(rest);
                  } else {
                    // Otherwise store the selected value (including string "null")
                    setValue({
                      ...value,
                      [item.attr]: v,
                    });
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
        ))}

        {/* Clear Filters Button */}
        <VStack {...filterStyles.clearButtonContainer}>
          <Button 
            onPress={handleClearFilters}
            {...filterStyles.button}
          >
            <Text {...filterStyles.buttonText}>{t('common.clearFilters')}</Text>
          </Button>
        </VStack>
      </HStack>

    </VStack>
  );
}

