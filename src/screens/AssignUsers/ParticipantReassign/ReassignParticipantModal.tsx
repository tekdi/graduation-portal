import React, { useEffect, useMemo, useState } from 'react';
import { VStack, HStack, Text, Box, Button, ButtonText, Heading, Badge, BadgeText, LucideIcon } from '@ui';
import Modal from '@components/ui/Modal';
import PaginationControls from '@components/DataTable/PaginationControls';
import Select from '@components/ui/Inputs/Select';
import { useLanguage } from '@contexts/LanguageContext';
import { useAuth, useIsSupervisor } from '@contexts/AuthContext';
import { useParticipantFilterOptions } from '@constants/ASSIGN_USERS_FILTERS';
import { theme } from '@config/theme';
import { filterStyles } from '@components/Filter/Styles';
import { loadLinkageChampions, type LCItem } from './lcData';
import { REASSIGNMENT_REASONS, DEFAULT_REASON } from './DestinationPolicy/constants';

export type ReassignParticipant = {
  id: string;
  name: string;
  currentLc: string;
  currentLcId?: string;
  province: string;
  site: string;
};

type Props = {
  participant: ReassignParticipant | null;
  /** Bulk confirmation (Step 2 Proceed): participants selected in Step 1 and the target LC */
  bulk?: { id: string; name: string; participants: ReassignParticipant[] } | null;
  onClose: () => void;
  /** Called with the chosen destination LC id and reason once the user confirms. */
  onConfirm?: (data: { participantId: string; targetLcId: string; reason: string }) => void | Promise<void>;
};

const K = 'admin.assignUsers.participantReassign.reassignModal';

const ReassignParticipantModal = ({ participant, bulk, onClose, onConfirm }: Props) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isSupervisor = useIsSupervisor();
  const supervisorId = isSupervisor ? String((user as any)?.id || (user as any)?._id || '') : undefined;
  const [lcs, setLcs] = useState<LCItem[]>([]);
  const [targetLc, setTargetLc] = useState('');
  const [province, setProvince] = useState('all-provinces');
  const [site, setSite] = useState('all-sites');
  const [reason, setReason] = useState<string>(DEFAULT_REASON);
  const [submitting, setSubmitting] = useState(false);
  const [showList, setShowList] = useState(false);
  const [listPage, setListPage] = useState(1);

  const isOpen = !!participant || !!bulk;

  // Reset the form every time a different participant is opened
  useEffect(() => {
    setTargetLc('');
    setProvince('all-provinces');
    setSite('all-sites');
    setReason(DEFAULT_REASON);
  }, [participant?.id]);

  // Keep the selected list collapsed (and on page 1) each time the modal opens
  useEffect(() => {
    setShowList(false);
    setListPage(1);
  }, [bulk]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    // @ts-ignore - injected by webpack DefinePlugin / available in React Native
    const programId = process.env.GLOBAL_LC_PROGRAM_ID;
    if (!programId) return;
    loadLinkageChampions(programId, supervisorId)
      .then((list) => !cancelled && setLcs(list))
      .catch((e) => console.warn('Could not load linkage champions for reassignment', e));
    return () => {
      cancelled = true;
    };
  }, [isOpen, supervisorId]);

  // Same Province/Site options as the other Reassign steps
  const { filters: [provinceFilter, siteFilter] } = useParticipantFilterOptions(province, isOpen);
  const toOptions = (filter: any) =>
    (filter?.data || []).map((o: any) => ({ value: o.value, label: o.label ?? t(o.labelKey) }));
  const provinceOptions = useMemo(() => toOptions(provinceFilter), [provinceFilter, t]);
  const siteOptions = useMemo(() => toOptions(siteFilter), [siteFilter, t]);

  const lcOptions = useMemo(
    () =>
      lcs
        .filter((lc) => lc.id !== participant?.currentLcId)
        .filter((lc) => {
          // LC province/site are labels; filter values are ids, so compare via the option labels
          const norm = (v: any) => String(v ?? '').trim().toLowerCase();
          const labelOf = (opts: any[], value: string) =>
            value.startsWith('all-') ? '' : norm(opts.find((o) => o.value === value)?.label);
          const pl = labelOf(provinceOptions, province);
          const sl = labelOf(siteOptions, site);
          return (!pl || norm(lc.province) === pl) && (!sl || norm(lc.site) === sl);
        })
        .map((lc) => ({
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
    [lcs, participant?.currentLcId, t, province, site, provinceOptions, siteOptions]
  );

  // Drop a chosen LC that the filters no longer show
  useEffect(() => {
    if (targetLc && !lcOptions.some((o) => o.value === targetLc)) setTargetLc('');
  }, [lcOptions, targetLc]);
  const reasonOptions = useMemo(
    () => REASSIGNMENT_REASONS.map((r) => ({ value: r.value, label: t(r.labelKey) })),
    [t]
  );

  const canConfirm = bulk ? !submitting : !!participant && !!targetLc && !submitting;

  const handleConfirm = async () => {
    if (!bulk && (!participant || !targetLc)) return;
    try {
      setSubmitting(true);
      await onConfirm?.({
        participantId: bulk ? bulk.participants.map((p) => p.id).join(',') : participant!.id,
        targetLcId: bulk ? bulk.id : targetLc,
        reason,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const LIST_PAGE_SIZE = 5;
  const bulkTotal = bulk?.participants.length ?? 0;
  const listRows = (bulk?.participants ?? []).slice((listPage - 1) * LIST_PAGE_SIZE, listPage * LIST_PAGE_SIZE);

  const location = [participant?.site, participant?.province].filter(Boolean).join(' • ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      maxWidth={500}
      headerProps={{ padding: '$5', paddingBottom: '$3' }}
      bodyProps={{ padding: '$5', paddingTop: '$1', paddingBottom: '$0' }}
      contentProps={{ borderRadius: '$xl', borderWidth: 1, borderColor: '$borderLight200' }}
      headerAlignment="flex-start"
      headerContent={
        <VStack flex={1} space="xs">
          <HStack space="sm" alignItems="center">
            <LucideIcon name="ArrowLeftRight" size={20} color={theme.tokens.colors.primary500} />
            <Heading size="lg" color="$textForeground">
              {bulk ? t(`${K}.bulkTitle`) : `${t(`${K}.title`)}: ${participant?.name || ''}`}
            </Heading>
          </HStack>
          <Text size="sm" color="$textLight500" mt="$2">
            {bulk ? t(`${K}.bulkDescription`) : t(`${K}.description`)}
          </Text>
        </VStack>
      }
      footerContent={
        <HStack space="sm" width="$full" justifyContent="flex-end" pt="$4">
          <Button
            variant="outline"
            action="secondary"
            size="sm"
            h={40}
            px="$4"
            borderRadius="$lg"
            borderWidth={1}
            borderColor="$borderLight200"
            bg="$white"
            $hover-bg="$backgroundLight100"
            $active-bg="$backgroundLight200"
            onPress={onClose}
            isDisabled={submitting}
          >
            <ButtonText color="$textForeground" fontWeight="$medium">{t(`${K}.cancel`)}</ButtonText>
          </Button>
          <Button
            size="sm"
            h={40}
            px="$4"
            borderRadius="$lg"
            borderWidth={0}
            bg={theme.tokens.colors.primary500}
            $hover-bg={theme.tokens.colors.primary500}
            isDisabled={!canConfirm}
            opacity={canConfirm ? 1 : 0.5}
            onPress={handleConfirm}
          >
            <ButtonText color="$white">{bulk ? t(`${K}.execute`) : t(`${K}.confirm`)}</ButtonText>
          </Button>
        </HStack>
      }
    >
      {bulk ? (
        <VStack space="md">
          <HStack
            borderWidth={1}
            borderColor="$borderLight200"
            backgroundColor="$backgroundLight50"
            borderRadius="$lg"
            px="$4"
            py="$3"
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack space="xs">
              <Text size="xs" fontWeight="$medium" color="$textLight500" textTransform="uppercase">
                {t(`${K}.participants`)}
              </Text>
              <Text fontWeight="$bold" color={theme.tokens.colors.primary500}>
                {t(`${K}.selectedCount`).replace('{{count}}', String(bulk.participants.length))}
              </Text>
              <Button
                variant="link"
                size="xs"
                h="$5"
                px="$0"
                mt="$1"
                alignSelf="flex-start"
                onPress={() => setShowList((v) => !v)}
              >
                <ButtonText size="xs" fontWeight="$normal" color="$textLight500" textDecorationLine="underline">
                  {t(`${K}.${showList ? 'hideSelected' : 'viewSelected'}`)}
                </ButtonText>
              </Button>
            </VStack>
            <LucideIcon name="ArrowRight" size={18} color={theme.tokens.colors.textMutedForeground} />
            <VStack space="xs" alignItems="flex-end">
              <Text size="xs" fontWeight="$medium" color="$textLight500" textTransform="uppercase">
                {t(`${K}.targetLC`)}
              </Text>
              <Text fontWeight="$bold" color="$textForeground">{bulk.name || '-'}</Text>
            </VStack>
          </HStack>

          {showList && (
          <VStack space="xs">
            <Text size="sm" fontWeight="$medium" color="$textForeground">{t(`${K}.selectedList`)}</Text>
            <VStack borderWidth={1} borderColor="$borderLight200" borderRadius="$lg" px="$3">
              {listRows.map((p, i) => (
                <HStack
                  key={p.id}
                  justifyContent="space-between"
                  py="$2"
                  borderTopWidth={i ? 1 : 0}
                  borderColor="$borderLight100"
                >
                  <Text size="sm" fontWeight="$medium" color="$textForeground">
                    {p.name}{' '}
                    <Text size="xs" color="$textLight500">({`PAR-${String(p.id).padStart(3, '0')}`})</Text>
                  </Text>
                  <Text size="xs" color="$textLight500">
                    {t(`${K}.from`)} <Text size="xs" fontWeight="$medium" color="$textForeground">{p.currentLc || '-'}</Text>
                  </Text>
                </HStack>
              ))}
            </VStack>
            {bulkTotal > LIST_PAGE_SIZE && (
              <PaginationControls
                currentPage={listPage}
                totalPages={Math.ceil(bulkTotal / LIST_PAGE_SIZE)}
                pageSize={LIST_PAGE_SIZE}
                totalItems={bulkTotal}
                startIndex={(listPage - 1) * LIST_PAGE_SIZE}
                endIndex={Math.min(listPage * LIST_PAGE_SIZE, bulkTotal)}
                onPageChange={setListPage}
                config={{ enabled: true, maxPageNumbers: 3 }}
              />
            )}
          </VStack>
          )}
        </VStack>
      ) : (
      <VStack space="md">
        <Box
          borderWidth={1}
          borderColor="$borderLight200"
          backgroundColor="$backgroundLight50"
          borderRadius="$lg"
          px="$3"
          py="$3"
        >
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack space="xs" flex={1}>
              <Text size="xs" fontWeight="$medium" color="$textLight500" textTransform="uppercase">
                {t(`${K}.currentLC`)}
              </Text>
              <Text fontWeight="$bold" color="$textForeground">
                {participant?.currentLc || '-'}
              </Text>
              <Text size="sm" color="$textLight500">
                {location || '-'}
              </Text>
            </VStack>
            <Badge variant="outline" action="warning" borderRadius="$md">
              <BadgeText textTransform="none">{t(`${K}.transferring`)}</BadgeText>
            </Badge>
          </HStack>
        </Box>

        <HStack space="md">
          <VStack space="xs" flex={1}>
            <Text size="sm" fontWeight="$medium" color="$textForeground">
              {t('admin.assignUsers.participantReassign.province')}
            </Text>
            <Select
              value={province}
              onChange={(v: string) => {
                setProvince(v);
                setSite('all-sites');
              }}
              options={provinceOptions}
              {...filterStyles.input}
            />
          </VStack>

          <VStack space="xs" flex={1}>
            <Text size="sm" fontWeight="$medium" color="$textForeground">
              {t('admin.assignUsers.participantReassign.site')}
            </Text>
            <Select value={site} onChange={(v: string) => setSite(v)} options={siteOptions} {...filterStyles.input} />
          </VStack>
        </HStack>

        <VStack space="xs">
          <Text size="sm" fontWeight="$medium" color="$textForeground">
            {t(`${K}.newLC`)} <Text color="$error500">*</Text>
          </Text>
          <Select
            value={targetLc}
            onChange={(v: string) => setTargetLc(v)}
            placeholder={t(`${K}.newLCPlaceholder`)}
            options={lcOptions}
            {...filterStyles.input}
          />
        </VStack>

        <VStack space="xs">
          <Text size="sm" fontWeight="$medium" color="$textForeground">
            {t(`${K}.reason`)} <Text color="$error500">*</Text>
          </Text>
          <Select
            value={reason}
            onChange={(v: string) => setReason(v)}
            options={reasonOptions}
            {...filterStyles.input}
          />
        </VStack>
      </VStack>
      )}
    </Modal>
  );
};

export default ReassignParticipantModal;
