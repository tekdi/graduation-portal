import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ViewProps, TextProps } from 'react-native';
import { VStack, HStack, Text, Card, Heading, Button, ButtonText, LucideIcon, Pressable } from '@ui';
import Select from '@components/ui/Inputs/Select';
import PaginatedSelect from '@components/PaginatedSelect';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth, useIsSupervisor } from '@contexts/AuthContext';
import { useParticipantFilterOptions } from '@constants/ASSIGN_USERS_FILTERS';
import { loadLinkageChampions } from '../lcData';
import { getSupervisorsByProvince, getMappedLCsForSupervisor } from '../../../../services/assignUsersService';
import { REASSIGNMENT_REASONS, DEFAULT_REASON } from './constants';
import { DestinationPolicyStyles as styles } from './Styles';

declare const process: { env: { [key: string]: string | undefined } } | undefined;

type Props = {
  /** Number of participants selected in Step 1 */
  selectedCount: number;
  /** Called when Proceed is pressed, with the chosen destination LC and reason */
  /** Province/Site chosen in Step 1 (ids); pre-populate Step 2, which can then change them independently */
  initialProvince?: string;
  initialSite?: string;
  onProceed?: (data: { targetLcId: string; targetLcName: string; reason: string }) => void;
};

const DestinationPolicy = ({ selectedCount, initialProvince, initialSite, onProceed }: Props) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isSupervisor = useIsSupervisor();
  const supervisorId = isSupervisor ? String((user as any)?.id || (user as any)?._id || '') : undefined;
  const [targetLc, setTargetLc] = useState('');
  const [reason, setReason] = useState<string>(DEFAULT_REASON);
  const [province, setProvince] = useState('all-provinces');
  const [site, setSite] = useState('all-sites');
  // Follow Step 1's Province/Site whenever they change there (Step 2 edits never flow back)
  useEffect(() => {
    setProvince(initialProvince || 'all-provinces');
    setSite(initialSite || 'all-sites');
  }, [initialProvince, initialSite]);
  const [supervisor, setSupervisor] = useState<{ id: string; label: string } | null>(null);
  // LC ids mapped to the chosen supervisor (null = no supervisor filter)
  const [supervisorLcIds, setSupervisorLcIds] = useState<Set<string> | null>(null);
  // supervisorId -> mapped LC ids (same API Assign Users uses); each supervisor is fetched at most once
  const supLcCache = useRef(new Map<string, Promise<Set<string>>>());
  const [lcs, setLcs] = useState<Array<{ id: string; name: string; site: string; province: string; count: number }>>([]);

  // All eligible Linkage Champions (not limited to the LC chosen in Step 1)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // @ts-ignore - injected by webpack DefinePlugin / available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      if (!programId) return;
      try {
        const list = await loadLinkageChampions(programId, supervisorId);
        if (!cancelled) setLcs(list);
      } catch (error) {
        console.error('Error fetching destination linkage champions:', error);
        if (!cancelled) setLcs([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [supervisorId]);

  const getSupervisorLcIds = useCallback((supId: string) => {
    let p = supLcCache.current.get(supId);
    if (!p) {
      // @ts-ignore - injected by webpack DefinePlugin / available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID as string;
      p = getMappedLCsForSupervisor({ userId: supId, programId, type: 'org_admin', page: 1, limit: 500 })
        .then((res) => new Set<string>((res.result?.data || []).map((lc: any) => String(lc.userId || ''))))
        .catch((e) => {
          supLcCache.current.delete(supId);
          throw e;
        });
      supLcCache.current.set(supId, p);
    }
    return p;
  }, []);

  // Province/Site changed -> the chosen supervisor may no longer be eligible
  useEffect(() => {
    setSupervisor(null);
  }, [province, site]);

  // Supervisor selected -> the LCs mapped to them
  useEffect(() => {
    if (!supervisor) {
      setSupervisorLcIds(null);
      return;
    }
    let cancelled = false;
    getSupervisorLcIds(supervisor.id)
      .then((ids) => !cancelled && setSupervisorLcIds(ids))
      .catch(() => !cancelled && setSupervisorLcIds(new Set()));
    return () => {
      cancelled = true;
    };
  }, [supervisor, getSupervisorLcIds]);

  // Same Province/Site options as Step 1
  const { filters: [provinceFilter, siteFilter] } = useParticipantFilterOptions(province, true);
  const toOptions = (filter: any) =>
    (filter?.data || []).map((o: any) => ({ value: o.value, label: o.label ?? t(o.labelKey) }));
  const provinceOptions = useMemo(() => toOptions(provinceFilter), [provinceFilter, t]);
  const siteOptions = useMemo(() => toOptions(siteFilter), [siteFilter, t]);

  // LC province/site are labels; filter values are ids, so compare via the option labels
  const visibleLcs = useMemo(() => {
    const norm = (v: any) => String(v ?? '').trim().toLowerCase();
    const labelOf = (opts: any[], value: string) =>
      value.startsWith('all-') ? '' : norm(opts.find((o) => o.value === value)?.label);
    const pl = labelOf(provinceOptions, province);
    const sl = labelOf(siteOptions, site);
    return lcs.filter(
      (lc) =>
        (!pl || norm(lc.province) === pl) &&
        (!sl || norm(lc.site) === sl) &&
        (!supervisorLcIds || supervisorLcIds.has(lc.id))
    );
  }, [lcs, province, site, provinceOptions, siteOptions, supervisorLcIds]);

  // Drop a chosen LC that the filters no longer show
  useEffect(() => {
    if (targetLc && !visibleLcs.some((lc) => lc.id === targetLc)) setTargetLc('');
  }, [visibleLcs, targetLc]);

  const lcOptions = useMemo(
    () =>
      visibleLcs.map((lc) => ({
        value: lc.id,
        label: t(
          lc.site
            ? 'admin.assignUsers.participantReassign.step2.lcOption'
            : 'admin.assignUsers.participantReassign.step2.lcOptionNoSite'
        )
          .replace('{{name}}', lc.name)
          .replace('{{site}}', lc.site)
          .replace('{{count}}', String(lc.count)),
      })),
    [visibleLcs, t]
  );

  // Feeds the shared LC modal from the (province/site filtered) LC options; search/paging local
  const fetchLCsForSelect = useCallback(
    async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
      const q = (search || '').trim().toLowerCase();
      const items = visibleLcs
        .map((lc, i) => ({ value: lc.id, label: lcOptions[i].label, name: lc.name }))
        .filter((o) => !q || o.name.toLowerCase().includes(q));
      return { data: items.slice((page - 1) * limit, page * limit), total: items.length };
    },
    [visibleLcs, lcOptions]
  );

  // Supervisors for the shared modal. Same API as Assign Users -> Participant to Coach.
  // With a destination LC chosen, only supervisors that LC is mapped to are listed.
  const fetchSupervisorsForSelect = useCallback(
    async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
      const toItem = (s: any) => ({
        label: s.name || s.full_name || s.email || 'Unknown',
        value: String(s.id || s._id || s.email || ''),
      });
      if (!targetLc) {
        const res = await getSupervisorsByProvince({ provinceId: province, siteId: site, page, limit, search });
        const data = res.result?.data || [];
        return { data: data.map(toItem), total: res.result?.total ?? res.result?.count ?? data.length };
      }
      const all: any[] = [];
      for (let pg = 1; pg <= 10; pg++) {
        const res = await getSupervisorsByProvince({ provinceId: province, siteId: site, page: pg, limit: 100 });
        const data = res.result?.data || [];
        all.push(...data);
        if (!data.length || all.length >= (res.result?.total ?? res.result?.count ?? data.length)) break;
      }
      const flags = await Promise.all(
        all.map((sv) => getSupervisorLcIds(String(sv.id || sv._id || '')).then((ids) => ids.has(targetLc)).catch(() => false))
      );
      const q = (search || '').trim().toLowerCase();
      const items = all
        .filter((_, i) => flags[i])
        .map(toItem)
        .filter((o) => !q || o.label.toLowerCase().includes(q));
      return { data: items.slice((page - 1) * limit, page * limit), total: items.length };
    },
    [targetLc, province, site, getSupervisorLcIds]
  );

  const reasonOptions = useMemo(
    () => REASSIGNMENT_REASONS.map((r) => ({ value: r.value, label: t(r.labelKey) })),
    [t]
  );

  const canProceed = selectedCount > 0 && !!targetLc;

  return (
    <Card {...(styles.card as ViewProps)}>
      <Heading {...(styles.heading as any)}>{t('admin.assignUsers.participantReassign.step2.title')}</Heading>
      <Text {...(styles.description as TextProps)}>
        {t('admin.assignUsers.participantReassign.step2.description')}
      </Text>

      <VStack {...(styles.fieldsRow as any)}>
        <VStack {...(styles.field as ViewProps)}>
          <Text {...(styles.label as TextProps)}>{t('admin.assignUsers.participantReassign.province')}</Text>
          <Select
            value={province}
            onChange={(v: string) => {
              setProvince(v);
              setSite('all-sites');
            }}
            options={provinceOptions}
            {...styles.input}
          />
        </VStack>
        <VStack {...(styles.field as ViewProps)}>
          <Text {...(styles.label as TextProps)}>{t('admin.assignUsers.participantReassign.site')}</Text>
          <Select value={site} onChange={(v: string) => setSite(v)} options={siteOptions} {...styles.input} />
        </VStack>
        {!isSupervisor && (
        <VStack {...(styles.field as ViewProps)}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text {...(styles.label as TextProps)}>{t('admin.filters.selectSupervisor')}</Text>
            {supervisor && (
              <Pressable onPress={() => setSupervisor(null)}>
                <Text fontSize="$xs" color="$textLight500">{t('common.clear', 'Clear')}</Text>
              </Pressable>
            )}
          </HStack>
          <PaginatedSelect
            value={supervisor?.id || ''}
            displayValue={supervisor?.label || ''}
            onChange={(v: string, label: string) => setSupervisor(v ? { id: v, label } : null)}
            fetchFn={fetchSupervisorsForSelect}
            placeholder={t('admin.filters.chooseSupervisor')}
            modalTitle={t('admin.filters.chooseSupervisor')}
            size="sm"
            bg={styles.input.bg}
            borderColor={styles.input.borderColor}
            borderRadius={styles.input.borderRadius}
            pageSize={20}
            showSearch
          />
        </VStack>
        )}
      </VStack>

      <VStack {...(styles.fieldsRow as any)}>
        <VStack {...(styles.field as ViewProps)}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text {...(styles.label as TextProps)}>
              {t('admin.assignUsers.participantReassign.step2.targetLC')}{' '}
              <Text {...(styles.required as TextProps)}>*</Text>
            </Text>
            {targetLc ? (
              <Pressable onPress={() => setTargetLc('')}>
                <Text fontSize="$xs" color="$textLight500">{t('common.clear', 'Clear')}</Text>
              </Pressable>
            ) : null}
          </HStack>
          <PaginatedSelect
            value={targetLc}
            displayValue={lcOptions.find((o) => o.value === targetLc)?.label || ''}
            onChange={(v: string) => setTargetLc(v)}
            fetchFn={fetchLCsForSelect}
            placeholder={t('admin.assignUsers.participantReassign.step2.targetLCPlaceholder')}
            modalTitle={t('admin.assignUsers.participantReassign.step2.targetLCPlaceholder')}
            dependencyKey={`${province}|${site}|${lcs.length}|${supervisor?.id || ''}`}
            size="sm"
            bg={styles.input.bg}
            borderColor={styles.input.borderColor}
            borderRadius={styles.input.borderRadius}
            pageSize={20}
            showSearch
          />
        </VStack>
        <VStack {...(styles.field as ViewProps)}>
          <Text {...(styles.label as TextProps)}>
            {t('admin.assignUsers.participantReassign.step2.reason')}{' '}
            <Text {...(styles.required as TextProps)}>*</Text>
          </Text>
          <Select
            value={reason}
            onChange={(v: string) => setReason(v)}
            options={reasonOptions}
            {...styles.input}
          />
        </VStack>
      </VStack>

      <Button
        {...(styles.proceedButton as any)}
        onPress={() =>
          onProceed?.({
            targetLcId: targetLc,
            targetLcName: lcs.find((lc) => lc.id === targetLc)?.name || '',
            reason,
          })
        }
        isDisabled={!canProceed} opacity={canProceed ? 1 : 0.5}>
        <HStack space="sm" alignItems="center">
          <LucideIcon name="ArrowLeftRight" size={14} color="white" />
          <ButtonText {...(styles.proceedButtonText as TextProps)}>
            {t('admin.assignUsers.participantReassign.step2.proceed').replace('{{count}}', String(selectedCount))}
          </ButtonText>
        </HStack>
      </Button>
    </Card>
  );
};

export default DestinationPolicy;
