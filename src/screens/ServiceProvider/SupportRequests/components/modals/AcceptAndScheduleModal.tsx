import React, { useState, useEffect, useMemo, useCallback } from 'react';
import moment from 'moment';
import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
} from '@gluestack-ui/themed';
import Modal from '@components/ui/Modal';
import LucideIcon from '@components/ui/LucideIcon';
import modalStyles from '../../styles';
import { useLanguage } from '@contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import SchemaFormRenderer from '@components/SchemaFormRenderer';
import { ACCEPT_AND_SCHEDULE_FORM_SCHEMA } from '@constants/ACCEPT_AND_SCHEDULE_FORM_SCHEMA';
import { FORM_MODE } from '@constants/SUPPORT_PROVIDER_CARDS';
import { getProvincesList } from '../../../../../services/usersService';
import { getSessionCategories, getDeliveryModes } from '../../../../../services/mentoringService';

const DURATION_HOURS: Record<string, number> = {
  '1_hour': 1,
  '1.5_hours': 1.5,
  '2_hours': 2,
  '3_hours': 3,
  full_day: 8,
};

const BASE_PATH = 'supportProvider.supportRequests';

const DURATION_OPTIONS = [
  { label: `${BASE_PATH}.durationOptions.1hour`, value: '1_hour' },
  { label: `${BASE_PATH}.durationOptions.1_5hours`, value: '1.5_hours' },
  { label: `${BASE_PATH}.durationOptions.2hours`, value: '2_hours' },
  { label: `${BASE_PATH}.durationOptions.3hours`, value: '3_hours' },
  { label: `${BASE_PATH}.durationOptions.fullDay`, value: 'full_day' },
];

// Fallback shown until getDeliveryModes() resolves (or if it comes back empty).
const DEFAULT_FORMAT_OPTIONS = [
  { value: 'offline', label: 'In-Person (Offline)' },
  { value: 'online', label: 'Online (Virtual)' },
  { value: 'hybrid', label: 'Hybrid' },
];

export interface AcceptAndScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSubmit?: (data: {
    province: string;
    category: string;
    title: string;
    description: string;
    targetAudience: string;
    date: string;
    time: string;
    duration: string;
    delivery_mode: string;
    capacity: string;
    location: string;
    meetingLink: string;
  }) => void;
}

export default function AcceptAndScheduleModal({
  isOpen,
  onClose,
  item,
  onSubmit,
}: AcceptAndScheduleModalProps): React.JSX.Element {
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [formatOptions, setFormatOptions] = useState(DEFAULT_FORMAT_OPTIONS);
  const [values, setValues] = useState<Record<string, string>>({
    province: '',
    category: '',
    title: '',
    description: '',
    targetAudience: '',
    date: '',
    time: '',
    duration: DURATION_OPTIONS[3].value,
    delivery_mode: 'offline',
    capacity: '',
    location: '',
    meetingLink: '',
  });

  const handleFieldChange = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Load dropdown data once — province list & session pillars/categories are
  // shared master data, delivery formats come from mentoringService.
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [provincesRes, pillarsRes, deliveryModesRes] = await Promise.all([
          getProvincesList(),
          getSessionCategories(),
          getDeliveryModes(),
        ]);
        setProvinces(provincesRes || []);
        setPillars(pillarsRes || []);
        if (deliveryModesRes && deliveryModesRes.length > 0) {
          setFormatOptions(deliveryModesRes);
        }
      } catch (err) {
        console.error('[AcceptAndScheduleModal] Failed to load form options:', err);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (item) {
      const raw = item?.raw || {};
      const meta = raw?.meta || {};
      const preferredMoment = item?.preferredDate && item?.preferredTime ? moment(`${item.preferredDate} ${item.preferredTime}`, 'DD MMM YYYY hh:mm A') : null;

      setValues({
        province: meta.provinces?.[0] || '',
        category: meta.categories?.[0] || '',
        title: item?.title || '',
        description: item?.justification || '',
        targetAudience: item?.participantDetails || '',
        date: preferredMoment?.isValid() ? preferredMoment.format('YYYY-MM-DD') : '',
        time: preferredMoment?.isValid() ? preferredMoment.format('HH:mm') : '',
        duration: DURATION_OPTIONS[3].value,
        delivery_mode: meta.delivery_mode || 'offline',
        capacity: String(item?.participants ?? item?.participantsCount ?? ''),
        location: meta.meeting_info?.location || item?.preferredLocation || item?.location || '',
        meetingLink: meta.meeting_info?.link || '',
      });
    }
  }, [item]);

  const optionsMap = useMemo(() => {
    return {
      durationOptions: DURATION_OPTIONS.map(opt => ({
        value: opt.value,
        label: t(opt.label) || opt.value,
      })),
      provinces: provinces.map((p: any) => ({ value: p._id, label: p.name })),
      pillars: pillars.map((p: any) => ({ value: p.value, label: p.label })),
      formatOptions: formatOptions.map((f: any) => ({ value: f.value, label: f.label })),
    };
  }, [t, provinces, pillars, formatOptions]);

  if (!isOpen) return <></>;

  const coachName = item?.coach || '-';
  const hubName = item?.hub || '-';
  const requestTitle = item?.title || '';
  const participants = item?.participants ?? item?.participantsCount ?? 0;
  const province = item?.province || '-';

  const handleOpenFullWizard = () => {
    const startMoment = values.date && values.time ? moment(`${values.date} ${values.time}`, 'YYYY-MM-DD HH:mm') : null;
    const durationHours = DURATION_HOURS[values.duration] ?? DURATION_HOURS[DURATION_OPTIONS[3].value];
    const endMoment = startMoment?.isValid() ? startMoment.clone().add(durationHours, 'hours') : null;

    navigation.navigate('form-training-session', {
      type: FORM_MODE.CREATE,
      prefill: {
        provinces: values.province || '',
        categories: values.category || '',
        idp_training_task: 'custom',
        sessionTypeOther: values.title || '',
        description: values.description || '',
        delivery_mode: values.delivery_mode || 'offline',
        seats_limit: values.capacity || '',
        location: values.location || '',
        meeting_link: values.meetingLink || '',
        start_date: startMoment?.isValid() ? startMoment.format('YYYY-MM-DDTHH:mm:ss') : undefined,
        end_date: endMoment?.isValid() ? endMoment.format('YYYY-MM-DDTHH:mm:ss') : undefined,
      },
    });
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.({
      province: values.province || '',
      category: values.category || '',
      title: values.title || '',
      description: values.description || '',
      targetAudience: values.targetAudience || '',
      date: values.date || '',
      time: values.time || '',
      duration: values.duration || DURATION_OPTIONS[3].value,
      delivery_mode: values.delivery_mode || 'offline',
      capacity: values.capacity || '',
      location: values.location || '',
      meetingLink: values.meetingLink || '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      {...modalStyles.modalPropsLg}
      headerContent={
        <VStack {...modalStyles.acceptScheduleHeaderCol}>
          <Box {...modalStyles.sessionFormBadge}>
            <Text {...modalStyles.sessionFormBadgeText}>
              {t(`${BASE_PATH}.badges.sessionForm`)}
            </Text>
          </Box>
          <Text {...modalStyles.acceptScheduleTitleText}>
            {t(`${BASE_PATH}.titles.acceptSchedule`)}
          </Text>
          <Text {...modalStyles.acceptScheduleSubtitleText}>
            {t(`${BASE_PATH}.labels.prefilledFromRequest`)} {coachName} ({hubName})
          </Text>
        </VStack>
      }
      footerContent={
        <HStack {...modalStyles.modalFooterRow}>
          {/* Cancel Button */}
          <Pressable
            onPress={onClose}
            {...modalStyles.modalCancelBtn}
          >
            <Text {...modalStyles.modalCancelText}>
              {t(`${BASE_PATH}.buttonTexts.cancel`)}
            </Text>
          </Pressable>

          {/* Confirm & Schedule Button */}
          <Pressable
            onPress={handleSubmit}
            {...modalStyles.modalConfirmBtn}
          >
            <HStack {...modalStyles.modalConfirmRow}>
              <LucideIcon name="CheckCircle" {...modalStyles.iconConfirmCheck} />
              <Text {...modalStyles.modalConfirmText}>
                {t(`${BASE_PATH}.buttonTexts.confirmSchedule`)}
              </Text>
            </HStack>
          </Pressable>
        </HStack>
      }
    >
      <VStack {...modalStyles.modalBodyVStack}>
        {/* Light Blue Summary Bar */}
        <Box {...modalStyles.summaryBox}>
          <HStack {...modalStyles.summaryBarRow}>
            <Text {...modalStyles.summaryBarText}>
              <Text {...modalStyles.summaryBarText} {...modalStyles.summaryBarTextBold}>
                {t(`${BASE_PATH}.labels.requested`)}:
              </Text>{' '}
              {requestTitle} • {t(`${BASE_PATH}.labels.participants`)}: {participants} • {t(`${BASE_PATH}.labels.province`)}: {province}
            </Text>

            <Pressable onPress={handleOpenFullWizard} {...modalStyles.openWizardBtn}>
              <Text {...modalStyles.openWizardBtnText}>
                {t(`${BASE_PATH}.buttonTexts.openFullWizard`)}
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Form rendered via Schema */}
        <SchemaFormRenderer
          schema={ACCEPT_AND_SCHEDULE_FORM_SCHEMA}
          values={values}
          optionsMap={optionsMap}
          onFieldChange={handleFieldChange}
          t={t}
        />
      </VStack>
    </Modal>
  );
}
