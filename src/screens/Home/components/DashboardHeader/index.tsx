import React from 'react';
import { HStack, VStack, LucideIcon } from '@ui';
import FilterButton from '@components/Filter';
import { TabButton } from '@components/Tabs';
import { DASHBOARD_FILTERS, DASHBOARD_TABS } from '@constants/DASHBOARD_LC';
import { dashboardHeaderStyles } from './Styles';

interface DashboardHeaderProps {
  activeTab: 'overview' | 'outcomes' | 'graduationCriteria';
  onTabChange: (tab: 'overview' | 'outcomes' | 'graduationCriteria') => void;
  selectedTime: string;
  onTimeChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  onTabChange,
  selectedTime,
  onTimeChange,
  selectedStatus,
  onStatusChange,
  selectedGender,
  onGenderChange,
}) => {
  const handleFilterChange = (filters: Record<string, any>) => {
    const timeVal = filters.time || 'All Time';
    const statusVal = filters.status || 'All Statuses';
    const genderVal = filters.gender || 'All Gender';

    if (timeVal !== selectedTime) {
      onTimeChange(timeVal);
    }
    if (statusVal !== selectedStatus) {
      onStatusChange(statusVal);
    }
    if (genderVal !== selectedGender) {
      onGenderChange(genderVal);
    }
  };

  return (
    <VStack {...dashboardHeaderStyles.container}>
      {/* Filter Box with custom wrapper styling */}
      <HStack {...dashboardHeaderStyles.filterBoxWrapper}>
        <LucideIcon name="Filter" size={13} color="$primary500" />
        <FilterButton
          data={DASHBOARD_FILTERS}
          onFilterChange={handleFilterChange}
          showClearButton={false}
          hideTitleHeader={true}
          _container={dashboardHeaderStyles.filterButtonOverride}
          _input={dashboardHeaderStyles.filterInputOverride}
        />
      </HStack>

      {/* Tabs list */}
      <HStack {...dashboardHeaderStyles.tabsContainer}>
        {DASHBOARD_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={(key) => onTabChange(key as any)}
            variant="ButtonTab"
            _container={dashboardHeaderStyles.tabButton(activeTab === tab.key)}
            _text={dashboardHeaderStyles.tabText(activeTab === tab.key)}
          />
        ))}
      </HStack>
    </VStack>
  );
};

export default DashboardHeader;
