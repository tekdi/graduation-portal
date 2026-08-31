import React, { useCallback, useEffect, useState } from 'react';
import { VStack } from '@ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { adminDashboardStyles } from './Styles';
import TitleHeader from '@components/TitleHeader';
import FilterButton from '@components/Filter';
import DashboardCards from './DashboardCards';
import { useAdminDashboardFilters } from '@constants/ADMIN_DASHBOARD_FILTERS';
import { indicatorCards } from '@constants/ADMIN_DASHBOARD_CARDS';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';

const AdminDashboard = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filtersHydrated, setFiltersHydrated] = useState(false);
  const { filterOptions } = useAdminDashboardFilters(filters);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.ADMIN_DASHBOARD_FILTERS);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as Record<string, any>;
          if (!parsed.province || parsed.province === 'all-provinces') {
            delete parsed.site;
          }
          if (parsed.timePeriod !== 'custom') {
            delete parsed.fromDate;
            delete parsed.toDate;
          }
          setFilters(parsed);
        }
      } catch {
        // ignore malformed storage
      } finally {
        if (!cancelled) setFiltersHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!filtersHydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.ADMIN_DASHBOARD_FILTERS, JSON.stringify(filters)).catch(
      () => undefined,
    );
  }, [filters, filtersHydrated]);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => {
      const next = { ...newFilters };
      const prevProvince = prev?.province;
      const nextProvince = next?.province;
      const provinceChanged = prevProvince !== nextProvince;
      const provinceCleared = !nextProvince || nextProvince === 'all-provinces';

      if (provinceChanged || provinceCleared) {
        delete next.site;
      }

      if (next.timePeriod !== 'custom') {
        delete next.fromDate;
        delete next.toDate;
      }

      return next;
    });
  }, []);

  return (
    <VStack {...adminDashboardStyles.container}>
      {/* Title Header */}
      <TitleHeader title="admin.dashboard" description="admin.dashboardDescription" />

      {/* Filter Button */}
      {filtersHydrated && (
        <FilterButton
          data={filterOptions as any[]}
          filterValues={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Dashboard Cards with Info Card */}
      <DashboardCards 
        cards={indicatorCards}
        infoHeadingKey="admin.selectIndicatorType"
        infoDescriptionKey="admin.indicatorTypeDescription"
      />
    </VStack>
  );
};

export default AdminDashboard;