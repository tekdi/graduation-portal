import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text, Card, Heading } from '@ui';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import FilterButton from '@components/Filter';
import { AssignLCFilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';

const AssignUsersScreen = () => {
  const { t } = useLanguage();
  const data = [...AssignLCFilterOptions];

  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Handler to receive filter changes from FilterButton
  const handleFilterChange = (values: Record<string, any>) => {
    setFilterValues(values);
    console.log('Filter values changed:', values);
    setSelectedSupervisor(values);
    // You can add your logic here to handle filter changes
    // For example: filter data, make API calls, etc.
    // Example usage:
    // - filterValues.province - selected province value
    // - filterValues.district - selected district value
    // - filterValues.search - search text value
  };

  // Use filterValues to perform actions when filters change
  useEffect(() => {
    if (Object.keys(filterValues).length > 0) {
      console.log('Current filter values:', filterValues);
      // Add your filtering/fetching logic here
      // Example: fetchFilteredUsers(filterValues);
    }
  }, [filterValues]);

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title="admin.menu.assignUsers"
        description="admin.assignUsersDescription"
        bottom={
          <HStack space="md" alignItems="center">
            <Button
              {...titleHeaderStyles.solidButton}
              onPress={() => {
                // Handle create user
              }}
            >
              <HStack space="sm" alignItems="center">
                <Text {...titleHeaderStyles.solidButtonText}>
                  {t('admin.actions.lctosupervisior')}
                </Text>
              </HStack>
            </Button>

            <Button
              {...titleHeaderStyles.outlineButton}
              onPress={() => {
                // Handle bulk upload
              }}
            >
              <HStack space="sm" alignItems="center">
                <Text {...titleHeaderStyles.outlineButtonText}>
                  {t('admin.actions.participanttolc')}
                </Text>
              </HStack>
            </Button>
          </HStack>
        }
      />

      <Card size="md" variant="outline">
        <Heading size="md">
          {t('admin.assignUsers.step1SelectSupervisor')}
        </Heading>
        <Text size="sm">
          {t('admin.assignUsers.filterbyprovinceandchoosesp')}
        </Text>

        <FilterButton
          data={data}
          showClearFilterButton={false}
          onChange={handleFilterChange}
        />
      </Card>
    </VStack>
    // <div>hi</div>
  );
};

export default AssignUsersScreen;
