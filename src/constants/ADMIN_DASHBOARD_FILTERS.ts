/**
 * Admin Dashboard Filter Configurations
 * Data-driven filter definitions for the Admin Dashboard screen
 */
import { useEffect, useMemo, useState } from 'react';
import {
  getProvincesList,
  getSitesByProvince,
  getUsersList,
} from '../services/usersService';
import type { ProvinceEntity, SiteEntity, UserSearchParams } from '@app-types/Users';

/** API user type for Linkage Champion / org admin lists (see assignUsersService) */
const LINKAGE_CHAMPION_USER_TYPE = 'org_admin';

// Type definition for filter configuration
type FilterConfig = {
  name?: string;
  nameKey?: string;
  attr: string;
  type?: string;
  data?: any[];
  placeholder?: string;
  placeholderKey?: string;
  disabled?: boolean;
  [key: string]: any;
};

// Date filter configurations (using search type with date placeholder)
export const FromDateFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.fromDate',
  attr: 'fromDate',
  type: 'date',
  data: [],
  placeholderKey: 'admin.dashboardFilters.datePlaceholder',
};

export const ToDateFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.toDate',
  attr: 'toDate',
  type: 'date',
  data: [],
  placeholderKey: 'admin.dashboardFilters.datePlaceholder',
};

// Time Period filter
export const TimePeriodFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.timePeriod',
  attr: 'timePeriod',
  type: 'select',
  data: [
    { labelKey: 'admin.filters.allTimePeriod', value: 'all-time' },
    { labelKey: 'admin.dashboardFilters.last6Months', value: 'last-6-months' },
    { labelKey: 'admin.dashboardFilters.last3Months', value: 'last-3-months' },
    { labelKey: 'admin.dashboardFilters.lastMonth', value: 'last-month' },
    { labelKey: 'admin.dashboardFilters.lastWeek', value: 'last-week' },
    { labelKey: 'admin.dashboardFilters.custom', value: 'custom' },
  ],
};

export const ProvincesFilter: FilterConfig = {
  nameKey: 'admin.filters.filterByProvince',
  attr: 'province',
  type: 'select',
  data: [],
};

export const SitesFilter: FilterConfig = {
  nameKey: 'admin.filters.site',
  attr: 'site',
  type: 'select',
  data: [],
};

export const ChampionsFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.champions',
  attr: 'champions',
  type: 'select',
  data: [],
};

// Genders filter
export const GendersFilter: FilterConfig = {
  nameKey: 'admin.dashboardFilters.genders',
  attr: 'genders',
  type: 'select',
  data: [
    { labelKey: 'admin.dashboardFilters.allGenders', value: 'all-genders' },
    { labelKey: 'admin.dashboardFilters.male', value: 'male' },
    { labelKey: 'admin.dashboardFilters.female', value: 'female' },
    { labelKey: 'admin.dashboardFilters.other', value: 'other' },
  ],
};

/**
 * Builds dashboard filter rows with provinces, sites, and linkage champions from the API.
 * Pass current `filters` from the screen so sites and LC lists react to province/site.
 */
export const useAdminDashboardFilters = (filters: Record<string, any>) => {
  const [provinces, setProvinces] = useState<ProvinceEntity[]>([]);
  const [sites, setSites] = useState<SiteEntity[]>([]);
  const [champions, setChampions] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getProvincesList();
      if (!cancelled) setProvinces(list);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const selectedProvince = filters.province;

    const run = async () => {
      if (!selectedProvince || selectedProvince === 'all-provinces') {
        if (!cancelled) setSites([]);
        return;
      }
      try {
        const sitesResponse = await getSitesByProvince({
          provinceId: selectedProvince,
          page: 1,
          limit: 100,
        });
        if (!cancelled) setSites(sitesResponse.result?.data || []);
      } catch {
        if (!cancelled) setSites([]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [filters.province]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const apiParams: UserSearchParams = {
          tenant_code: 'brac',
          type: LINKAGE_CHAMPION_USER_TYPE,
          page: 1,
          limit: 200,
        };
        if (filters.province && filters.province !== 'all-provinces') {
          apiParams.province = filters.province;
        }
        if (filters.site && filters.site !== 'all-sites') {
          apiParams.site = filters.site;
        }
        const response = await getUsersList(apiParams);
        const usersData = response.result?.data || [];
        if (!cancelled) setChampions(usersData);
      } catch {
        if (!cancelled) setChampions([]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [filters.province, filters.site]);

  const filterOptions = useMemo(() => {
    const provinceOptions = [
      { labelKey: 'admin.filters.allProvinces', value: 'all-provinces' },
      ...provinces.map((p) => ({ label: p.name, value: p._id })),
    ];

    const isProvinceSelected =
      Boolean(filters.province) && filters.province !== 'all-provinces';

    const siteOptions = [
      { labelKey: 'admin.filters.allSites', value: 'all-sites' },
      ...sites.map((s) => ({ label: s.name, value: s._id })),
    ];

    const championsOptions = [
      { labelKey: 'admin.dashboardFilters.allChampions', value: 'all-champions' },
      ...champions.map((u: any) => ({
        label: u.name || u.email || String(u.id ?? ''),
        value: String(u.id),
      })),
    ];

    const showCustomRange = filters.timePeriod === 'custom';

    return [
      TimePeriodFilter,
      ...(showCustomRange ? [FromDateFilter, ToDateFilter] : []),
      { ...ProvincesFilter, data: provinceOptions },
      {
        ...SitesFilter,
        data: siteOptions,
        disabled: !isProvinceSelected,
      },
      { ...ChampionsFilter, data: championsOptions },
      GendersFilter,
    ];
  }, [provinces, sites, champions, filters.province, filters.timePeriod]);

  return { filterOptions };
};
