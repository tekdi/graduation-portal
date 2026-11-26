import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Pressable,
} from '@ui';
import DataTable from '@components/DataTable';
import PaginationControls from '@components/DataTable/PaginationControls';
import FilterButton from '@components/Filter';
import { AssignUsersStyles as CardStyles } from '@components/UserAvatarCard/Styles';
import { styles as tableStyles } from '@components/DataTable/Styles';
import type { ColumnDef } from '@app-types/components';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth, useIsSupervisor } from '@contexts/AuthContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { getInitials } from '@utils/helper';
import { useParticipantFilterOptions } from '@constants/ASSIGN_USERS_FILTERS';
import { loadLinkageChampions, type LCItem } from './lcData';
import { ParticipantReassignStyles as styles } from './Styles';
import DestinationPolicy from './DestinationPolicy';
import ReassignParticipantModal, { type ReassignParticipant } from './ReassignParticipantModal';

declare const process: { env: { [key: string]: string | undefined } } | undefined;


const ALL_LCS = 'all-lcs';

const ParticipantReassign = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isSupervisor = useIsSupervisor();
  // Supervisor / tenant admin only works with their own mapped LCs
  const supervisorId = isSupervisor ? String((user as any)?.id || (user as any)?._id || '') : undefined;
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [lcs, setLcs] = useState<LCItem[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
    const [lcsLoaded, setLcsLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reassignTarget, setReassignTarget] = useState<ReassignParticipant | null>(null);
  const [bulkTarget, setBulkTarget] = useState<{ id: string; name: string; participants: ReassignParticipant[] } | null>(null);

  const { filterByProvince, site, search, fromLC } = filterValues;
  const selectedLcId = fromLC && fromLC !== ALL_LCS ? String(fromLC) : '';

  const { filters: provinceSiteFilters } = useParticipantFilterOptions(filterByProvince, true);

  // Feeds the shared modal from the already loaded LCs (search + paging done locally)
  const fetchLCsForSelect = useCallback(
    async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
      const q = (search || '').trim().toLowerCase();
      // Province/site filter values are ids; LCs carry labels, so compare via the option labels
      const norm = (v: any) => String(v ?? '').trim().toLowerCase();
      const labelOf = (filter: any, value: any) =>
        value && !String(value).startsWith('all-')
          ? norm(filter?.data?.find((o: any) => o.value === value)?.label)
          : '';
      const provinceLabel = labelOf(provinceSiteFilters[0], filterByProvince);
      const siteLabel = labelOf(provinceSiteFilters[1], site);
      const items = [
        // Only LCs that actually have participants mapped to them, within the chosen province/site
        ...lcs
          .filter(
            (lc) =>
              lc.participantIds.length > 0 &&
              (!provinceLabel || norm(lc.province) === provinceLabel) &&
              (!siteLabel || norm(lc.site) === siteLabel)
          )
          .map((lc) => ({
          value: lc.id,
          label: t('admin.assignUsers.participantReassign.lcOption')
            .replace('{{name}}', lc.name)
            .replace('{{count}}', String(lc.count)),
          name: lc.name,
        })),
      ].filter((i: any) => !q || String(i.name ?? i.label).toLowerCase().includes(q));
      return { data: items.slice((page - 1) * limit, page * limit), total: items.length };
    },
    [lcs, t, provinceSiteFilters, filterByProvince, site]
  );

  const filterOptions = useMemo(() => {
    const [provinceFilter, siteFilter] = provinceSiteFilters;
    return [
      provinceFilter && { ...provinceFilter, nameKey: 'admin.assignUsers.participantReassign.province' },
      siteFilter && { ...siteFilter, nameKey: 'admin.assignUsers.participantReassign.site' },
      {
        nameKey: 'admin.assignUsers.participantReassign.fromCurrentLC',
        attr: 'fromLC',
        // Opens the shared paginated "choose LC" modal; its title comes from placeholderKey
        type: 'paginated-select' as const,
        bg: '#FFFFFF',
        placeholderKey: 'admin.assignUsers.participantReassign.allLCs',
        fetchFn: fetchLCsForSelect,
        dependencyKey: lcsLoaded ? 'loaded' : 'loading',
        pageSize: 20,
        showSearch: true,
      },
      {
        nameKey: 'admin.assignUsers.participantReassign.searchLabel',
        attr: 'search',
        type: 'search' as const,
        data: [],
        placeholderKey: 'admin.assignUsers.participantReassign.searchPlaceholder',
      },
    ].filter(Boolean);
  }, [provinceSiteFilters, fetchLCsForSelect, lcsLoaded]);

  // Fetch all LCs with the participants currently assigned to each
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // @ts-ignore - injected by webpack DefinePlugin / available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      if (!programId) {
        console.error('GLOBAL_LC_PROGRAM_ID is not defined in environment variables');
        setLcsLoaded(true);
        return;
      }
      try {
        const list = await loadLinkageChampions(programId, supervisorId);
        if (!cancelled) setLcs(list);
      } catch (error) {
        console.error('Error fetching linkage champions:', error);
        if (!cancelled) setLcs([]);
      } finally {
        if (!cancelled) setLcsLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [supervisorId]);

  const scopeLCs = useMemo(
    () => (selectedLcId ? lcs.filter((lc) => lc.id === selectedLcId) : lcs),
    [lcs, selectedLcId]
  );

  // Participants assigned to the selected LC (or all LCs), taken from the already loaded LC-mapped
  // records (accurate name/province/site). Province, site and search are applied on those rows,
  // so the table always matches the filters (no extra API call, ids never need to be matched).
  useEffect(() => {
    if (!lcsLoaded) return;
    const all: any[] = [];
    const seen = new Set<string>();
    scopeLCs.forEach((lc) =>
      lc.participants.forEach((r: any) => {
        const id = String(r.userId || r.userDetails?.id || '');
        if (!id || seen.has(id)) return;
        seen.add(id);
        const d = r.userDetails || {};
        all.push({
          id,
          value: id,
          name: d.name || r.name || d.email || '',
          currentLc: lc.name,
          currentLcId: lc.id,
          pathway: d.pathway?.label || d.pathway || r.pathway?.label || r.pathway || '',
          province: d.province?.label || '',
          site: d.site?.label || d.district?.label || d.local_municipality?.label || '',
        });
      })
    );

    // Province/site filter values are ids; rows carry labels, so compare via the option labels
    const norm = (v: any) => String(v ?? '').trim().toLowerCase();
    const labelOf = (filter: any, value: any) =>
      value && !String(value).startsWith('all-')
        ? norm(filter?.data?.find((o: any) => o.value === value)?.label)
        : '';
    const provinceLabel = labelOf(provinceSiteFilters[0], filterByProvince);
    const siteLabel = labelOf(provinceSiteFilters[1], site);
    const q = norm(search);

    const rows = all.filter(
      (p) =>
        (!provinceLabel || norm(p.province) === provinceLabel) &&
        (!siteLabel || norm(p.site) === siteLabel) &&
        (!q || norm(p.name).includes(q))
    );
    setTotal(rows.length);
    setParticipants(rows);
  }, [lcsLoaded, scopeLCs, filterByProvince, site, search, provinceSiteFilters]);

  // Back to page 1 whenever the filtered result set changes
  useEffect(() => {
    setPage(1);
  }, [selectedLcId, filterByProvince, site, search]);

  const pageRows = useMemo(
    () => participants.slice((page - 1) * pageSize, page * pageSize),
    [participants, page, pageSize]
  );
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((p) => selected.has(p.value));

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
            size="xs"
            variant="outline"
            action="secondary"
            h={32}
            px="$3"
            borderRadius="$md"
            borderWidth={1}
            borderColor="$borderLight200"
            bg="$white"
            $hover-bg="$backgroundLight50"
            $hover-borderColor={theme.tokens.colors.primary500}
            onPress={() => setReassignTarget(item)}
          >
            <LucideIcon name="ArrowLeftRight" size={14} color={theme.tokens.colors.primary500} />
            <ButtonText ml="$1.5" size="sm" fontWeight="$normal" color="$textForeground" $hover-color={theme.tokens.colors.primary500}>{t('admin.assignUsers.participantReassign.reassign')}</ButtonText>
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

      <FilterButton
        data={filterOptions}
        showClearButton={false}
        hideTitleHeader
        showLabels
        searchAtEnd
        _container={{ bg: '$backgroundLight50', borderRadius: '$xl', p: '$4' }}
        _input={{ bg: '$white' }}
        onFilterChange={setFilterValues}
      />

      <HStack justifyContent="space-between" alignItems="center" mt="$5" mb="$3">
        <Text {...(styles.tableSubtitleText as TextProps)} fontSize="$sm">
          {t('admin.assignUsers.participantReassign.showingAssigned').replace('{{count}}', String(pageRows.length))}
        </Text>
        {selected.size > 0 && (
          <Pressable onPress={() => setSelected(new Set())}>
            <Text fontSize="$sm" color="$textLight500" $hover-color="$textForeground">
              {t('admin.assignUsers.participantReassign.clearSelection').replace('{{count}}', String(selected.size))}
            </Text>
          </Pressable>
        )}
      </HStack>

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
                  toggle(pageRows.map((p) => p.value), c)
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
          data={pageRows}
          columns={columns}
          showHeader={false}
          _css={{ _table: { borderWidth: 0, borderRadius: 0 } }}
          getRowKey={(item: any) => item.value}
          isLoading={!lcsLoaded}
          emptyMessage="common.noDataFound"
          responsive={false}
          minWidth={800}
        />
        {/* Same shared pagination controls, rendered here so only this screen gets 10px side padding */}
        <Box px={10}>
          <PaginationControls
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(total / pageSize))}
            pageSize={pageSize}
            totalItems={total}
            startIndex={(page - 1) * pageSize}
            endIndex={Math.min(page * pageSize, total)}
            onPageChange={setPage}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setPage(1);
            }}
            config={{
              enabled: true,
              pageSize,
              maxPageNumbers: 5,
              showPageSizeSelector: true,
              pageSizeOptions: [5, 10, 25, 50],
            }}
          />
        </Box>
      </Box>
    </Card>
    <DestinationPolicy
      selectedCount={selected.size}
      initialProvince={filterByProvince}
      initialSite={site}
      onProceed={({ targetLcId, targetLcName }) =>
        setBulkTarget({
          id: targetLcId,
          name: targetLcName,
          participants: participants.filter((p) => selected.has(p.value)),
        })
      }
    />
    <ReassignParticipantModal
      participant={reassignTarget}
      bulk={bulkTarget}
      onClose={() => {
        setReassignTarget(null);
        setBulkTarget(null);
      }}
    />
    </>
  );
};

export default ParticipantReassign;
