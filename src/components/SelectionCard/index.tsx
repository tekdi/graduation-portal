import React, { useState } from 'react';
import {
  Text,
  Card,
  Heading,
  Avatar,
  AvatarFallbackText,
  View,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  CheckboxLabel,
  VStack,
  HStack,
  Divider,
  Button,
  Pressable,
} from '@ui';
import FilterButton from '@components/Filter';
import { AssignUsersStyles } from './Styles';
import type { TextProps, ViewProps } from 'react-native';
import { useLanguage } from '@contexts/LanguageContext';
import { selectedLCList } from '@constants/USER_MANAGEMENT_FILTERS';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';

interface SelectionCardProps {
  title: string;
  description: string;
  filterOptions?: any;
  onChange?: (values: Record<string, any>) => void;
  selectedValues?: Record<string, any>;
  showSelectedCard?: boolean;
  showLcList?: boolean;
  showLcListforSupervisorTeam?: boolean;
  onLcSelect?: (lc: any) => void;
}

const SelectionCard = ({
  title,
  description,
  filterOptions,
  onChange,
  selectedValues = {},
  showSelectedCard = false,
  showLcList = true,
  showLcListforSupervisorTeam = false,
  onLcSelect,
}: SelectionCardProps) => {
  const { t } = useLanguage();

  const [selectedLc, setSelectedLc] = useState<any>(null);
  // Handler to receive filter changes from FilterButton and pass to parent
  const handleFilterChange = (values: Record<string, any>) => {
    // Call parent's onChange handler if provided
    onChange?.(values);
  };

  return (
    <Card size="md" variant="outline">
      <Heading size="md">{t(title)}</Heading>
      <Text size="sm">{t(description)}</Text>

      {!showLcListforSupervisorTeam && (
        <FilterButton
          data={filterOptions}
          showClearFilterButton={false}
          onChange={handleFilterChange}
        />
      )}
      {/* Display selected values if showSelectedCard is true and values exist */}
      {showSelectedCard && selectedValues && (
        <Card {...(AssignUsersStyles.cardStyles as ViewProps)}>
          <Avatar>
            <AvatarFallbackText>
              {selectedValues.selectSupervisor ||
                selectedValues.selectedValue ||
                selectedValues.labelKey ||
                ''}
            </AvatarFallbackText>
          </Avatar>
          <View>
            <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
              {selectedValues.selectSupervisor ||
                selectedValues.selectedValue ||
                ''}
            </Text>
            <Text {...(AssignUsersStyles.provinceName as TextProps)}>
              {selectedValues.filterByProvince || selectedValues.province || ''}
            </Text>
          </View>
        </Card>
      )}
      {showLcList && (
        <VStack marginTop={'$3'}>
          <Text {...(AssignUsersStyles.provinceName as TextProps)}>
            {'Selected Linkage Champions'}
          </Text>
          <Card variant="outline">
            {selectedLCList?.map((lc: any) => (
              <>
                <Checkbox
                  key={lc.value}
                  isDisabled={false}
                  isInvalid={false}
                  size="md"
                  value={lc.value}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} color="$modalBackground" />
                  </CheckboxIndicator>

                  <CheckboxLabel>
                    <View {...(AssignUsersStyles.viewstyles as ViewProps)}>
                      <Avatar>
                        <AvatarFallbackText>{lc.labelKey}</AvatarFallbackText>
                      </Avatar>

                      <View>
                        <Text
                          {...(AssignUsersStyles.supervisorName as TextProps)}
                        >
                          {lc.labelKey}
                        </Text>
                        <Text
                          {...(AssignUsersStyles.provinceName as TextProps)}
                        >
                          {lc.location}
                        </Text>
                      </View>
                      <Button
                        {...titleHeaderStyles.outlineButton}
                        marginLeft="auto"
                      >
                        <HStack>
                          <Text {...titleHeaderStyles.outlineButtonText}>
                            {lc.status}
                          </Text>
                        </HStack>
                      </Button>
                    </View>
                  </CheckboxLabel>
                </Checkbox>
                <Divider />
              </>
            ))}
          </Card>

          <Button
            {...titleHeaderStyles.solidButton}
            mt={'$3'}
            onPress={() => {
              // Handle create user
            }}
          >
            <HStack space="sm" alignItems="center">
              <Text {...titleHeaderStyles.solidButtonText}>
                {'Assign LCs to Supervisor'}
              </Text>
            </HStack>
          </Button>
        </VStack>
      )}

      {showLcListforSupervisorTeam &&
        selectedLCList?.map((lc: any) => {
          const isSelected = selectedLc?.value === lc.value;

          return (
            <Pressable
              key={lc.value}
              onPress={() => {
                setSelectedLc(lc); // local highlight
                onLcSelect?.(lc); // notify parent
              }}
            >
              <Card
                {...(isSelected
                  ? (AssignUsersStyles.cardStyles as ViewProps)
                  : (AssignUsersStyles.selectedCardStyles as ViewProps))}
              >
                <Avatar>
                  <AvatarFallbackText>{lc.labelKey || ''}</AvatarFallbackText>
                </Avatar>

                <View>
                  <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
                    {lc.labelKey}
                  </Text>
                  <Text {...(AssignUsersStyles.provinceName as TextProps)}>
                    {lc.location}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
    </Card>
  );
};

export default SelectionCard;
