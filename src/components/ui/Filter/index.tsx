import React, { useState, useEffect, useRef } from "react";
import { VStack, HStack, Text, Button, Image, InputField } from "@ui";
import { Input } from "../Inputs/input";
import Select from "../Inputs/Select";
import { filterStyles } from "./Styles";
import filterIcon from "../../../assets/images/FilterIcon.png";

export interface FilterConfig {
  name: string;
  attr: string;
  data: string[];
  type?: 'select' | 'search';
  placeholder?: string;
}

interface FilterProps {
  data: FilterConfig[];
  initialValues?: Record<string, string>; // Pre-filled filter values as JSON
  onFilterChange?: (filters: Record<string, string>) => void; // Returns all filters as JSON
  showClearButton?: boolean;
}

const Filters: React.FC<FilterProps> = ({ 
  data, 
  initialValues,
  onFilterChange,
  showClearButton = true 
}) => {
    // Initialize state for all filters dynamically
    // Use initialValues if provided, otherwise use defaults
    const getInitialFilters = (): Record<string, string> => {
      const defaults: Record<string, string> = {};
      data.forEach(filter => {
        // Check if initialValues has a value for this filter
        if (initialValues && initialValues[filter.attr] !== undefined) {
          defaults[filter.attr] = initialValues[filter.attr];
        } else {
          // For select filters, default to first option (usually "All...")
          // For search filters, default to empty string
          if (filter.type === 'search') {
            defaults[filter.attr] = '';
          } else {
            defaults[filter.attr] = filter.data[0] || '';
          }
        }
      });
      return defaults;
    };

    const [filters, setFilters] = useState<Record<string, string>>(getInitialFilters());
    
    // Use ref to store callback and previous filters to avoid infinite loops
    const onFilterChangeRef = useRef(onFilterChange);
    const dataRef = useRef(data);
    const previousFiltersRef = useRef<string>('');
    const hasInitializedRef = useRef(false);

    // Update refs when props change
    useEffect(() => {
      onFilterChangeRef.current = onFilterChange;
      dataRef.current = data;
    }, [onFilterChange, data]);

    // Update filters when initialValues prop changes - only on mount
    useEffect(() => {
      if (initialValues && !hasInitializedRef.current) {
        hasInitializedRef.current = true;
        setFilters(prev => {
          const updated = { ...prev };
          dataRef.current.forEach(filter => {
            if (initialValues[filter.attr] !== undefined) {
              updated[filter.attr] = initialValues[filter.attr];
            }
          });
          return updated;
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Notify parent when filters change - only if filters actually changed
    useEffect(() => {
      if (onFilterChangeRef.current) {
        // Ensure we always return all filter values as JSON
        const allFilters: Record<string, string> = {};
        dataRef.current.forEach(filter => {
          allFilters[filter.attr] = filters[filter.attr] || '';
        });
        
        // Serialize filters to compare with previous
        const filtersString = JSON.stringify(allFilters);
        
        // Only call onFilterChange if filters actually changed
        if (filtersString !== previousFiltersRef.current) {
          previousFiltersRef.current = filtersString;
          onFilterChangeRef.current(allFilters);
        }
      }
    }, [filters]); // Only depend on filters

    const handleFilterChange = (attr: string, value: string) => {
      setFilters(prev => ({
        ...prev,
        [attr]: value,
      }));
    };

    const handleClearFilters = () => {
      const clearedFilters: Record<string, string> = {};
      data.forEach(filter => {
        if (filter.type === 'search') {
          clearedFilters[filter.attr] = '';
        } else {
          clearedFilters[filter.attr] = filter.data[0] || '';
        }
      });
      setFilters(clearedFilters);
    };

    // Convert filter data array to Select options format
    const getSelectOptions = (filterData: string[]) => {
      return filterData.map(item => ({
        value: item,
        name: item,
      }));
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
                <Text {...filterStyles.titleText} ml='$2'>
                    Filters
                </Text>
            </HStack>

            {/* Filters Row */}
            <HStack {...filterStyles.filterFieldsContainer}>
                {/* Dynamically render filters based on data prop */}
                {data.map((filter) => (
                    <VStack 
                        key={filter.attr}
                        {...(filter.type === 'search' 
                            ? filterStyles.searchContainer 
                            : filterStyles.roleContainer)}
                    >
                        <Text {...filterStyles.label}>{filter.name}</Text>
                        {filter.type === 'search' ? (
                            <Input {...filterStyles.input}>
                                <InputField
                                    placeholder={filter.placeholder || `Search ${filter.name.toLowerCase()}...`}
                                    value={filters[filter.attr] || ''}
                                    onChangeText={(value: string) => handleFilterChange(filter.attr, value)}
                                />
                            </Input>
                        ) : (
                            <Select
                                value={filters[filter.attr] || filter.data[0] || ''}
                                onChange={(value) => handleFilterChange(filter.attr, value)}
                                options={getSelectOptions(filter.data)}
                                {...filterStyles.input}
                            />
                        )}
                    </VStack>
                ))}

                {/* Clear Filters Button */}
                {showClearButton && (
                    <VStack {...filterStyles.clearButtonContainer}>
                        <Button 
                            onPress={handleClearFilters}
                            {...filterStyles.button}
                        >
                            <Text {...filterStyles.buttonText}>Clear Filters</Text>
                        </Button>
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

export default Filters;