import React, { useEffect, useMemo, useState } from 'react';
import type { ViewProps, TextProps } from 'react-native';
import {
  VStack,
  HStack,
  Text,
  Card,
  Box,
  LucideIcon,
  Heading,
  Button,
  ButtonText,
  Badge,
  BadgeText,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
} from '@ui';
import DataTable from '@components/DataTable';
import FilterButton from '@components/Filter';
import { AssignUsersStyles as CardStyles } from '@components/UserAvatarCard/Styles';
import { styles as tableStyles } from '@components/DataTable/Styles';
import type { ColumnDef } from '@app-types/components';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { getInitials } from '@utils/helper';
import { useParticipantFilterOptions } from '@constants/ASSIGN_USERS_FILTERS';
import {
  getLinkageChampions,
  getMappedParticipantsForLC,
  getParticipants,
} from '../../../services/assignUsersService';
import { ParticipantReassignStyles as styles } from './Styles';
import DestinationPolicy from './DestinationPolicy';

declare const process: { env: { [key: string]: string | undefined } } | undefined;

type LCItem = { id: string; name: string; participantIds: string[]; count: number };

const ALL_LCS = 'all-lcs';

const ParticipantReassign = () => {
  const { t } = useLanguage();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [lcs, setLcs] = useState<LCItem[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { filterByProvince, site, search, fromLC } = filterValues;
  const selectedLcId = fromLC && fromLC !== ALL_LCS ? String(fromLC) : '';

  const { filters: provinceSiteFilters } = useParticipantFilterOptions(filterByProvince, true);

  const filterOptions = useMemo(() => {
    const [provinceFilter, siteFilter] = provinceSiteFilters;
    return [
      provinceFilter && { ...provinceFilter, nameKey: 'admin.assignUsers.participantReassign.province' },
      siteFilter && { ...siteFilter, nameKey: 'admin.assignUsers.participantReassign.site' },
      {
        nameKey: 'admin.assignUsers.participantReassign.fromCurrentLC',
        attr: 'fromLC',
        type: 'select' as const,
        placeholderKey: '',
        data: [
          { labelKey: 'admin.assignUsers.participantReassign.allLCs', value: ALL_LCS },
          ...lcs.map((lc) => ({
            label: t('admin.assignUsers.participantReassign.lcOption')
              .replace('{{name}}', lc.name)
              .replace('{{count}}', String(lc.count)),
            value: lc.id,
          })),
        ],
      },
      {
        nameKey: 'admin.assignUsers.participantReassign.searchLabel',
        attr: 'search',
        type: 'search' as const,
        data: [],
        placeholderKey: 'admin.assignUsers.participantReassign.searchPlaceholder',
      },
    ].filter(Boolean);
  }, [provinceSiteFilters, lcs, t]);

  // Fetch all LCs with the participants currently assigned to each
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // @ts-ignore - injected by webpack DefinePlugin / available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      if (!programId) {
        console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
        return;
      }
      try {
        const lcResponse = await getLinkageChampions(programId, { excludeMapped: false, limit: 100 });
        const list = await Promise.all(
          (lcResponse.result?.data || []).map(async (lc: any): Promise<LCItem> => {
            const id = String(lc.id || lc._id || '');
            const res = await getMappedParticipantsForLC({
              userId: id,
              programId,
              type: 'user',
              page: 1,
              limit: 500,
              search: '',
            });
            const participantIds = (res.result?.data || [])
              .map((r: any) => String(r.userId || r.userDetails?.id || ''))
              .filter(Boolean);
            return {
              id,
              name: lc.name || lc.full_name || lc.email || '',
              participantIds,
              count: res.total ?? res.result?.total ?? res.result?.count ?? participantIds.length,
            };
          })
        );
        if (!cancelled) setLcs(list.filter((lc) => lc.id));
      } catch (error) {
        console.error('Error fetching linkage champions:', error);
        if (!cancelled) setLcs([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const scopeLCs = useMemo(
    () => (selectedLcId ? lcs.filter((lc) => lc.id === selectedLcId) : lcs),
    [lcs, selectedLcId]
  );

  useEffect(() => {
    setPage(1);
  }, [selectedLcId, filterByProvince, site, search]);

  // Fetch participants assigned to the selected LC (or all LCs) with filters applied
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // @ts-ignore
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      const lcByParticipant = new Map<string, string>();
      scopeLCs.forEach((lc) => lc.participantIds.forEach((pid) => lcByParticipant.set(pid, lc.name)));
      const userIds = Array.from(lcByParticipant.keys());
      if (!programId || userIds.length === 0) {
        setParticipants([]);
        setTotal(0);
        return;
      }
      try {
        setIsLoading(true);
        const response = await getParticipants(programId, {
          excludeMapped: false,
          page,
          limit: pageSize,
          userIds,
          province: filterByProvince && filterByProvince !== 'all-provinces' ? filterByProvince : undefined,
          site: site && site !== 'all-sites' ? site : undefined,
          search: search && String(search).trim() ? String(search).trim() : undefined,
        });
        if (cancelled) return;
        setTotal((response as any).total || response.result?.total || response.result?.count || 0);
        setParticipants(
          (response.result?.data || []).map((p: any) => {
            const id = String(p.id || p._id || '');
            return {
              id,
              value: id,
              name: p.name || p.full_name || p.email || '',
              currentLc: lcByParticipant.get(id) || '',
              pathway: p.pathway?.label || p.pathway || p.userDetails?.pathway?.label || p.userDetails?.pathway || '',
              province: p.province?.label || p.userDetails?.province?.label || '',
              site:
                p.site?.label ||
                p.userDetails?.site?.label ||
                p.userDetails?.district?.label ||
                p.userDetails?.local_municipality?.label ||
                '',
            };
          })
        );
      } catch (error) {
        console.error('Error fetching assigned participants:', error);
        if (!cancelled) {
          setParticipants([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [scopeLCs, page, pageSize, filterByProvince, site, search]);

  const allOnPageSelected =
    participants.length > 0 && participants.every((p) => selected.has(p.value));

  const toggle = (ids: string[], checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  const renderCheckbox = (value: string, checked: boolean, onChange: (c: boolean) => void) => (
    <Checkbox value={value} isChecked={checked} onChange={onChange}>
      <CheckboxIndicator borderWidth={1} borderColor="$textForeground">
        <CheckboxIcon as={CheckIcon} color="$modalBackground" />
      </CheckboxIndicator>
    </Checkbox>
  );

  // Shared column layout so the custom header row lines up with the table rows
  const columnLayout = {
    select: { width: 32 },
    participant: { flex: 2 },
    currentLc: { flex: 2 },
    siteProvince: { flex: 2 },
    pathway: { flex: 1.5 },
    action: { width: 120 },
  } as const;

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        key: 'select',
        label: '',
        ...columnLayout.select,
        render: (item: any) =>
          renderCheckbox(item.value, selected.has(item.value), (c) => toggle([item.value], c)),
      },
      {
        key: 'participant',
        label: 'admin.assignUsers.participantReassign.participant',
        align: 'left',
        ...columnLayout.participant,
        render: (item: any) => (
          <HStack {...(styles.avatarHStack as ViewProps)}>
            <Box {...(styles.avatarBgStyles as ViewProps)}>
              <Text {...(styles.avatarFallbackTextStyles as TextProps)}>{getInitials(item.name)}</Text>
            </Box>
            <VStack space="xs">
              <Text {...(styles.tableRowNameText as TextProps)}>{item.name}</Text>
              <Text {...(styles.tableRowIdText as TextProps)}>
                PAR-{String(item.id).padStart(3, '0')}
              </Text>
            </VStack>
          </HStack>
        ),
      },
      {
        key: 'currentLc',
        label: 'admin.assignUsers.participantReassign.currentLC',
        align: 'left',
        ...columnLayout.currentLc,
        render: (item: any) => (
          <HStack {...(styles.locationHStack as ViewProps)}>
            <LucideIcon name="UserCheck" size={14} color={theme.tokens.colors.primary500} />
            <Text {...(styles.tableRowNameText as TextProps)}>{item.currentLc || '-'}</Text>
          </HStack>
        ),
      },
      {
        key: 'siteProvince',
        label: 'admin.assignUsers.participantReassign.siteAndProvince',
        align: 'left',
        ...columnLayout.siteProvince,
        render: (item: any) => (
          <Text {...(styles.tableRowDataText as TextProps)}>
            {[item.site, item.province].filter(Boolean).join(' • ') || '-'}
          </Text>
        ),
      },
      {
        key: 'pathway',
        label: 'admin.assignUsers.participantReassign.pathway',
        align: 'left',
        ...columnLayout.pathway,
        render: (item: any) =>
          item.pathway ? (
            <Badge variant="outline" bg="$backgroundLight100" borderColor="$backgroundLight100" borderRadius="$md">
              <BadgeText color="$textForeground" fontSize="$xs" textTransform="none">
                {item.pathway}
              </BadgeText>
            </Badge>
          ) : (
            <Text {...(styles.tableRowDataText as TextProps)}>-</Text>
          ),
      },
      {
        key: 'action',
        label: 'admin.assignUsers.participantReassign.quickAction',
        align: 'right',
        ...columnLayout.action,
        render: (item: any) => (
          <Button
            size="sm"
            variant="outline"
            onPress={() => setSelected(new Set([item.value]))}
          >
            <LucideIcon name="ArrowLeftRight" size={14} color={theme.tokens.colors.primary500} />
            <ButtonText ml="$2">{t('admin.assignUsers.participantReassign.reassign')}</ButtonText>
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, t]
  );

  const headerCells: Array<{ key: string; label?: string; align?: 'right'; checkbox?: boolean }> = [
    { key: 'select', checkbox: true },
    { key: 'participant', label: 'admin.assignUsers.participantReassign.participant' },
    { key: 'currentLc', label: 'admin.assignUsers.participantReassign.currentLC' },
    { key: 'siteProvince', label: 'admin.assignUsers.participantReassign.siteAndProvince' },
    { key: 'pathway', label: 'admin.assignUsers.participantReassign.pathway' },
    { key: 'action', label: 'admin.assignUsers.participantReassign.quickAction', align: 'right' },
  ];

  return (
    <>
    <Card {...(CardStyles.coverCardStyles as ViewProps)} borderWidth={1} borderColor="$borderLight200">
      <Heading {...(CardStyles.headingStyles as any)}>{t('admin.assignUsers.participantReassign.step1Title')}</Heading>
      <Text {...(CardStyles.descriptionTextStyles as TextProps)}>
        {t('admin.assignUsers.participantReassign.step1Description')}
      </Text>

      <FilterButton data={filterOptions} showClearButton={false} onFilterChange={setFilterValues} />

      <Text {...(styles.tableSubtitleText as TextProps)} fontSize="$sm" mt="$4" mb="$2">
        {t('admin.assignUsers.participantReassign.showingAssigned').replace('{{count}}', String(total))}
      </Text>

      <Box borderWidth={1} borderColor="$borderLight300" borderRadius="$2xl" overflow="hidden">
        <HStack {...tableStyles.tableHeader} minWidth={800}>
          {headerCells.map((cell) => (
            <Box
              key={cell.key}
              {...(columnLayout as any)[cell.key]}
              alignItems={cell.align === 'right' ? 'flex-end' : 'flex-start'}
            >
              {cell.checkbox ? (
                renderCheckbox('all', allOnPageSelected, (c) =>
                  toggle(participants.map((p) => p.value), c)
                )
              ) : (
                <Text {...TYPOGRAPHY.label} color="$textForeground">
                  {t(cell.label as string)}
                </Text>
              )}
            </Box>
          ))}
        </HStack>
        <DataTable
          data={participants}
          columns={columns}
          showHeader={false}
          _css={{ _table: { borderWidth: 0, borderRadius: 0 } }}
          getRowKey={(item: any) => item.value}
          isLoading={isLoading}
          emptyMessage="common.noDataFound"
          responsive={false}
          minWidth={800}
          pagination={{
            enabled: true,
            pageSize,
            maxPageNumbers: 5,
            showPageSizeSelector: true,
            pageSizeOptions: [5, 10, 25, 50],
            serverSide: { total, count: page },
          }}
          onPageChange={setPage}
          onPageSizeChange={(size: number) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Box>
    </Card>
    <DestinationPolicy selectedCount={selected.size} />
    </>
  );
};

export default ParticipantReassign;
