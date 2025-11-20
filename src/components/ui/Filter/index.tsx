import React from "react";
import { VStack, HStack, Text, Image, Input, InputField, Button } from "@ui";
import Select from "../Inputs/Select";
import { filterStyles } from "./Styles";
import filterIcon from "../../../assets/images/FilterIcon.png";

export default function FilterButton({ data }: any) {
  const [value, setValue] = React.useState<any>({});

  // Get default display values for UI (not included in output)
  const getDefaultDisplayValue = (item: any) => {
    if (item.type !== 'search' && item.data && item.data.length > 0) {
      return item.data[0]; // First option (usually "All Roles" or "All Status")
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
          Filters
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
            <Text {...filterStyles.label}>{item.name}</Text>
            {item.type === 'search' ? (
              <Input {...filterStyles.input}>
                <InputField
                  placeholder={item.placeholder || `Search ${item.name.toLowerCase()}...`}
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
                onChange={(v) => {
                  // If user selects "All ..." → remove filter from output
                  if (!v || v.startsWith("All")) {
                    const { [item.attr]: removed, ...rest } = value;
                    setValue(rest);
                  } else {
                    // Otherwise set selected value
                    setValue({ ...value, [item.attr]: v });
                  }
                }}
                options={item?.data?.map((e: any) => ({
                  value: e,
                  name: e,
                }))}
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
            <Text {...filterStyles.buttonText}>Clear Filters</Text>
          </Button>
        </VStack>
      </HStack>

      {/* Display current filter values */}
      {/* <VStack mt="$4">
        <Text fontSize="$sm" color="$textLight500">
          {"Value : {"}
          {Object.keys(value)
            .map((e) => `${e}: ${value[e]}`)
            .join(", ")}
          {"}"}
        </Text>
      </VStack> */}
    </VStack>
  );
}

