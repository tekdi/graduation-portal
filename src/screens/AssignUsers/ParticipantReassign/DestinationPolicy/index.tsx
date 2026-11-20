import React, { useEffect, useMemo, useState } from 'react';
import type { ViewProps, TextProps } from 'react-native';
import { VStack, HStack, Text, Card, Heading, Button, ButtonText, LucideIcon } from '@ui';
import Select from '@components/ui/Inputs/Select';
import { useLanguage } from '@contexts/LanguageContext';
import {
  getLinkageChampions,
  getMappedParticipantsForLC,
} from '../../../../services/assignUsersService';
import { REASSIGNMENT_REASONS, DEFAULT_REASON } from './constants';
import { DestinationPolicyStyles as styles } from './Styles';

declare const process: { env: { [key: string]: string | undefined } } | undefined;

type Props = {
  /** Number of participants selected in Step 1 */
  selectedCount: number;
};

const DestinationPolicy = ({ selectedCount }: Props) => {
  const { t } = useLanguage();
  const [targetLc, setTargetLc] = useState('');
  const [reason, setReason] = useState<string>(DEFAULT_REASON);
  const [lcs, setLcs] = useState<Array<{ id: string; name: string; site: string; count: number }>>([]);

  // All eligible Linkage Champions (not limited to the LC chosen in Step 1)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // @ts-ignore - injected by webpack DefinePlugin / available in React Native
      const programId = process.env.GLOBAL_LC_PROGRAM_ID;
      if (!programId) return;
      try {
        const response = await getLinkageChampions(programId, { excludeMapped: false, limit: 100 });
        const list = await Promise.all(
          (response.result?.data || []).map(async (lc: any) => {
            const id = String(lc.id || lc._id || '');
            const res = await getMappedParticipantsForLC({
              userId: id,
              programId,
              type: 'user',
              page: 1,
              limit: 1,
              search: '',
            });
            return {
              id,
              name: lc.name || lc.full_name || lc.email || '',
              site:
                lc.site?.label ||
                lc.userDetails?.site?.label ||
                lc.userDetails?.district?.label ||
                lc.userDetails?.local_municipality?.label ||
                '',
              count: res.total ?? res.result?.total ?? res.result?.count ?? 0,
            };
          })
        );
        if (!cancelled) setLcs(list.filter((lc) => lc.id));
      } catch (error) {
        console.error('Error fetching destination linkage champions:', error);
        if (!cancelled) setLcs([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const lcOptions = useMemo(
    () =>
      lcs.map((lc) => ({
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
    [lcs, t]
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
          <Text {...(styles.label as TextProps)}>
            {t('admin.assignUsers.participantReassign.step2.targetLC')}{' '}
            <Text {...(styles.required as TextProps)}>*</Text>
          </Text>
          <Select
            value={targetLc}
            onChange={(v: string) => setTargetLc(v)}
            placeholder={t('admin.assignUsers.participantReassign.step2.targetLCPlaceholder')}
            options={lcOptions}
            {...styles.input}
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

      <Button {...(styles.proceedButton as any)} isDisabled={!canProceed} opacity={canProceed ? 1 : 0.5}>
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
