import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, HStack, VStack, Text, Button, ButtonText, ButtonIcon } from '@gluestack-ui/themed';
import Modal from '@components/ui/Modal';
import LucideIcon from '@components/ui/LucideIcon';
import modalStyles from '../../styles';
import { useLanguage } from '@contexts/LanguageContext';
import SchemaFormRenderer, { getValidationIssues, ValidationPopup } from '@components/SchemaFormRenderer';
import type { ValidationIssue } from '@components/SchemaFormRenderer';
import type { FormSection, FormField } from '@components/SchemaFormRenderer/type';
import { TRAINING_FORM_SCHEMA, ACCEPT_SESSION_HIDE_FIELDS } from '@constants/TRAINING_FORM_SCHEMA';
import { ADDITIONAL_SERVICES_SCHEMA, REQUEST_ADDITIONAL_SERVICE_HIDE_FIELDS } from '@constants/ADDITIONAL_SERVICES_SCHEMA';
import { ASSET_SCHEMA, REQUEST_ASSET_HIDE_FIELDS } from '@constants/ASSET_SCHEMA';
import { SUPPORT_CATEGORIES } from '@constants/SUPPORT_PROVIDER_CARDS';
import { getProvincesList, getSitesByProvince } from '../../../../../services/usersService';
import {
  getSessionCategories,
  getDeliveryModes,
  getAdditionalServiceCategories,
  getLivelihoodCategoriesOptions,
  getAssetTypesOptions,
} from '../../../../../services/mentoringService';
import { valueMapping } from '@utils/supportProvider';
import { useTrainingFormOptions } from '@hooks';
// import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const BASE_PATH = 'supportProvider.supportRequests';

const toList = (val: any): any[] => (Array.isArray(val) ? val : val ? [val] : []);
const unwrap = (val: any) => (val && typeof val === 'object' ? val.value ?? val.label : val);

// Request start/end can be unix seconds, ms or an ISO string; datetime fields expect 'YYYY-MM-DDTHH:mm:ss'
const toDateTime = (val: any): string => {
  if (!val) return '';
  const num = Number(val);
  const m = Number.isNaN(num) ? moment(val) : moment(num > 1e12 ? num : num * 1000);
  return m.isValid() ? m.format('YYYY-MM-DDTHH:mm:ss') : '';
};

// Older asset requests stored option labels ("Cash"), so match on value or label
const matchOptionValue = (options: any[], raw: any): string => {
  const key = String(unwrap(raw) ?? '').toLowerCase();
  if (!key) return '';
  const found = options.find(
    (o) => String(o.value).toLowerCase() === key || String(o.label).toLowerCase() === key,
  );
  return found ? found.value : String(unwrap(raw));
};

// The request forms are multi-step; accept shows their sections on one page, without the Review tab
const toSinglePage = (schema: FormSection[]): FormSection[] =>
  schema.filter((tab: any) => tab.id !== 'review').flatMap((tab: any) => tab.children || []);

// Same helper as the asset form: lets one field show a live-computed value
const patchField = (schema: FormSection[], fieldName: string, patcher: (field: FormField) => FormField): FormSection[] =>
  schema.map((node) => ({
    ...node,
    rows: node.rows?.map((row) => ({
      ...row,
      fields: row.fields.map((f) => (f.name === fieldName ? patcher(f) : f)),
    })),
    children: node.children ? patchField(node.children, fieldName, patcher) : node.children,
  }));
export interface AcceptAndScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSubmit?: (data: {
    requestId: string | number;
    province?: string;
    sites?: string[];
    categories?: string[];
    idp_tasks?: string[];
    title?: string;
    description?: string;
    targetAudience?: string;
    delivery_mode?: string;
    start_date?: string;
    end_date?: string;
    capacity?: string;
    estimatedValue?: string;
    location?: string;
    meetingLink?: string;
  }) => void;
}

export default function AcceptAndScheduleModal({
  isOpen,
  onClose,
  item,
  onSubmit,
}: AcceptAndScheduleModalProps): React.JSX.Element {
  const { t } = useLanguage();
  // const navigation = useNavigation();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [deliveryModes, setDeliveryModes] = useState<any[]>([]);
  const [livelihoodCategories, setLivelihoodCategories] = useState<any[]>([]);
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [popupIssues, setPopupIssues] = useState<ValidationIssue[]>([]);

  const isAsset = item?.type === 'assets';
  const isService = item?.type === 'additional_services';
  const formType = isAsset
    ? SUPPORT_CATEGORIES.ASSET
    : isService
      ? SUPPORT_CATEGORIES.ADDITIONAL_SERVICE
      : SUPPORT_CATEGORIES.TRAINING;

  // Same schema as the LC request form, so accept shows exactly the fields that were requested
  const formSchema = useMemo(
    () =>
      toSinglePage(
        isAsset
          ? ASSET_SCHEMA(REQUEST_ASSET_HIDE_FIELDS)
          : isService
            ? ADDITIONAL_SERVICES_SCHEMA(REQUEST_ADDITIONAL_SERVICE_HIDE_FIELDS)
            : TRAINING_FORM_SCHEMA(ACCEPT_SESSION_HIDE_FIELDS),
      ),
    [isAsset, isService],
  );

  const coachName = item?.coach || '';
  const hubName = item?.hub && item.hub !== '-' ? ` (${item.hub} Hub)` : '';

  const [values, setValues] = useState<Record<string, any>>({});

  // Asset: fill the "Total Asset Fund Breakdown" note from value x quantity, like the asset form does
  const renderSchema = useMemo(() => {
    if (!isAsset) return formSchema;
    const perParticipant = Number(values.estimatedValue);
    const quantity = Number(values.availableQuantity);
    const hasFund = !!perParticipant && !!quantity;
    const breakdownText = hasFund
      ? t(
        'supportProvider.assetForm.step1.totalFundBreakdown',
        `R ${perParticipant.toLocaleString()} per participant × ${quantity} funded participants`,
      )
      : '';
    const availableText = hasFund ? `R ${(perParticipant * quantity).toLocaleString()}` : '';
    const withFund = patchField(formSchema, 'totalFundBreakdown', (field) => ({
      ...field,
      subTitle: { ...field.subTitle, fallback: breakdownText } as any,
      badge: field.badge
        ? { ...field.badge, value: { ...field.badge.value, fallback: availableText } }
        : field.badge,
    }));
    // Shorter label so it fits on one line next to Available Quantity in the modal
    return patchField(withFund, 'estimatedValue', (field) => ({
      ...field,
      label: { key: 'estimatedValueAccept', fallback: 'Estimated Value per Participant (R)' },
    }));
  }, [isAsset, formSchema, values.estimatedValue, values.availableQuantity, t]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [provs, cats, modes, livelihoods, types] = await Promise.all([
          getProvincesList(),
          isService ? getAdditionalServiceCategories() : getSessionCategories(),
          getDeliveryModes(),
          getLivelihoodCategoriesOptions(),
          isAsset ? getAssetTypesOptions() : Promise.resolve([]),
        ]);

        setProvinces(provs || []);
        setCategories(cats || []);
        setDeliveryModes(modes || []);
        setLivelihoodCategories(livelihoods || []);
        setAssetTypes(types || []);
      } catch (error) {
        console.error('[AcceptAndScheduleModal] Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [isAsset, isService]);

  // Training / Additional Service options (sites, session types) follow the request forms' own hook
  const { optionsMap: trainingOptionsMap } = useTrainingFormOptions({
    values,
    provinces,
    pillers: categories,
    deliveryModes,
    livelihoodCategories,
  });

  // Asset form uses `province` / `site`, so it loads its sites itself, same as the asset request form
  useEffect(() => {
    let isCurrent = true;

    const fetchSites = async () => {
      if (!isAsset || !values.province) {
        setSites([]);
        return;
      }
      try {
        const res = await getSitesByProvince({ provinceId: values.province });
        if (!isCurrent) return;
        setSites(res?.result?.data || []);
      } catch (error) {
        console.error('[AcceptAndScheduleModal] Error fetching sites:', error);
        if (isCurrent) setSites([]);
      }
    };

    fetchSites();

    return () => {
      isCurrent = false;
    };
  }, [isAsset, values.province]);

  // Pre-fill every field with what the LC entered on the request
  useEffect(() => {
    if (!item) return;

    const raw = item.raw || {};
    const meta = raw.meta || {};
    // Request without dates: same default range SP Create uses (toDatePayload: now .. now + 4 years, none for training)
    const defaultDates = valueMapping({}, false, {}, formType);
    const startDate = toDateTime(raw.session?.start_date ?? raw.start_date) || toDateTime(defaultDates.start_date);
    const endDate = toDateTime(raw.session?.end_date ?? raw.end_date) || toDateTime(defaultDates.end_date);
    const title = raw.title || item.title || '';
    const description = raw.description || raw.agenda || item.justification || '';

    if (isAsset) {
      setValues({
        province: unwrap(toList(meta.provinces ?? meta.province)[0]) || '',
        site: toList(meta.sites ?? meta.site).map(unwrap).filter(Boolean),
        assetType: matchOptionValue(assetTypes, meta.assetType ?? toList(meta.asset_types)[0]),
        livelihoodCategory: matchOptionValue(
          livelihoodCategories,
          meta.livelihoodCategory ?? toList(meta.livelihood_categories)[0] ?? toList(meta.categories)[0],
        ),
        assetTitle: title,
        assetDescription: meta.assetDescription || description,
        estimatedValue: String(meta.estimatedValue ?? meta.estimated_value ?? ''),
        availableQuantity: String(meta.quantity ?? ''),
        startDate,
        endDate,
      });
    } else {
      // Same API -> form mapping the edit / copy screens use for these forms
      setValues({
        ...valueMapping(
          {
            ...meta,
            title,
            description,
            // Older training requests store the type as idp_training_task
            idp_tasks: raw.idp_tasks ?? meta.idp_tasks ?? meta.idp_training_task,
          },
          true,
          {},
          formType,
        ),
        start_date: startDate,
        end_date: endDate,
      });
    }

    setErrors({});
  }, [item, isAsset, formType, assetTypes, livelihoodCategories]);

  // Same dependent-field resets as the request forms
  const handleFieldChange = useCallback((name: string, value: any, other?: any) => {
    setValues(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'province') next.site = [];
      if (name === 'provinces') next.sites = [];
      if (name === 'categories') {
        next.idp_tasks = isService ? [] : '';
        next.livelihoodCategory = '';
        if (!isService) next.title = '';
      }
      if (name === 'idp_tasks' && !isService) {
        next.title = other?.label;
        next.livelihoodCategory = '';
      }
      return next;
    });

    setErrors(prev => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, [isService]);

  const optionsMap = useMemo(
    () =>
      isAsset
        ? {
          provinces: provinces.map(p => ({
            value: p._id || p.id || p.value,
            label: p.name || p.title || p.label,
          })),
          sites: sites.map(s => ({
            value: s._id || s.id || s.value,
            label: s.name || s.title || s.label,
          })),
          assetTypes,
          livelihoodCategories,
        }
        : trainingOptionsMap,
    [isAsset, provinces, sites, assetTypes, livelihoodCategories, trainingOptionsMap]
  );

  // Form values -> the accept API payload (see acceptAndScheduleSupportRequest)
  const buildAcceptData = () => {
    const rawStart = values.start_date || values.startDate;
    const start = rawStart || moment().format('YYYY-MM-DDTHH:mm:ss');
    const end = values.end_date || values.endDate || moment(start).add(2, 'hours').format('YYYY-MM-DDTHH:mm:ss');

    if (isAsset) {
      return {
        province: values.province,
        sites: toList(values.site),
        title: values.assetTitle,
        description: values.assetDescription,
        start_date: start,
        end_date: end,
        delivery_mode: 'offline',
        capacity: values.availableQuantity ? String(values.availableQuantity) : undefined,
        estimatedValue: values.estimatedValue ? String(values.estimatedValue) : undefined,
        assetType: values.assetType,
        livelihoodCategory: values.livelihoodCategory,
      };
    }

    // Reuses the request forms' form -> payload mapping for title, idp_tasks and categories
    const mapped = valueMapping({ ...values }, false, optionsMap, formType);
    return {
      province: toList(mapped.provinces)[0],
      sites: toList(values.sites),
      categories: toList(mapped.categories).filter(Boolean),
      idp_tasks: toList(mapped.idp_tasks),
      title: mapped.title,
      description: values.description,
      targetAudience: values.learning_objectives,
      start_date: start,
      end_date: end,
      delivery_mode: isService ? 'offline' : values.delivery_mode,
      capacity: values.seats_limit ? String(values.seats_limit) : undefined,
      location: values.location,
      meetingLink: values.meeting_link,
      ...(!isService ? { certificate_provided: values.certificate_provided === 'true' } : {}),
    };
  };

  function handleConfirmAndSchedule() {
    const { errors: validationErrors, issues } = getValidationIssues(formSchema, values, optionsMap, t);
    if (issues.length > 0) {
      setErrors(validationErrors);
      setPopupIssues(issues);
      return;
    }

    setErrors({});
    onSubmit?.({ ...buildAcceptData(), requestId: item?.id } as any);
    onClose();
  }

  // The full wizard is a different screen per offering type - route there based on which
  // Support Requests tab this request actually belongs to, not always Training.
  // const FULL_WIZARD_ROUTE: Record<string, string> = {
  //   sessions: 'form-training-session',
  //   additional_services: 'create-additional-service',
  //   assets: 'create-asset',
  // };

  // function handleOpenFullWizard() {
  //   onClose();
  //   const routeName = FULL_WIZARD_ROUTE[item?.type] || 'form-training-session';
  //   (navigation as any).navigate(routeName, { type: 'create' });
  // }

  if (!isOpen) return <></>;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      {...modalStyles.modalPropsLg}
      headerTitle={
        <HStack {...modalStyles.acceptScheduleHeaderTitleRow}>
          <Box {...modalStyles.acceptScheduleBadge}>
            <Text {...modalStyles.acceptScheduleBadgeText}>
              {t(`${BASE_PATH}.labels.sessionForm`, 'Session Form')}
            </Text>
          </Box>
          <Text {...modalStyles.acceptScheduleTitleText}>
            {isAsset
              ? t(`${BASE_PATH}.titles.acceptAssetRequest`, 'Accept Asset Request')
              : isService
                ? t(`${BASE_PATH}.titles.acceptScheduleService`, 'Accept & Schedule Service')
                : t(`${BASE_PATH}.titles.acceptSchedule`, 'Accept & Schedule Training')}
          </Text>
        </HStack>
      }
      headerDescription={
        <VStack space="xs" width="$full">
          <Text {...modalStyles.acceptScheduleHeaderDescText}>
            {t(`${BASE_PATH}.subtitles.preFilledFrom`, 'Pre-filled details from request by ')}
            <Text {...modalStyles.acceptScheduleCoachNameText}>{coachName}</Text>
            {hubName}
          </Text>

          <Box {...modalStyles.openWizard}>
            <HStack {...modalStyles.openWizardTextRow}>
              <Text {...modalStyles.openWizardLabelText}>
                {t(`${BASE_PATH}.banner.requested`, 'Requested')}:
              </Text>

              <Text {...modalStyles.openWizardValueText}>
                {item?.title || ''}
              </Text>

              <Text {...modalStyles.openWizardBulletText}>•</Text>

              <Text {...modalStyles.openWizardLabelText}>
                {t(`${BASE_PATH}.banner.participants`, 'Participants')}:
              </Text>

              <Text {...modalStyles.openWizardValueText}>
                {item?.participants || 0}
              </Text>

              {item?.province && item.province !== '-' && (
                <>
                  <Text {...modalStyles.openWizardBulletText}>•</Text>

                  <Text {...modalStyles.openWizardLabelText}>
                    {t(`${BASE_PATH}.banner.province`, 'Province')}:
                  </Text>

                  <Text {...modalStyles.openWizardValueText}>
                    {item.province}
                  </Text>
                </>
              )}
            </HStack>

            {/* <Button variant="outline" action="primary" {...modalStyles.openWizardBtn} onPress={handleOpenFullWizard}>
              <ButtonText {...modalStyles.openWizardBtnText}>{t(`${BASE_PATH}.buttonTexts.openFullWizard`, 'Open Full Wizard')}</ButtonText>
            </Button> */}
          </Box>
        </VStack>
      }
      footerContent={
        <HStack {...modalStyles.footer}>
          <Button variant="outline" action="secondary" onPress={onClose}  {...modalStyles.cancelButton}>
            <ButtonText {...modalStyles.modalCancelText}>
              {t(`${BASE_PATH}.buttonTexts.cancel`, 'Cancel')}
            </ButtonText>
          </Button>

          <Button variant="solid" action="primary" onPress={handleConfirmAndSchedule}  {...modalStyles.confirmButton}>
            <ButtonIcon as={LucideIcon} name="CheckCircle" {...modalStyles.iconConfirmCheck} />
            <ButtonText {...modalStyles.modalConfirmText}>
              {t(`${BASE_PATH}.buttonTexts.confirmSchedule`, 'Confirm & Schedule')}
            </ButtonText>
          </Button>
        </HStack>
      }
      bodyProps={{ p: 0 }}>
      <Box px="$6" py="$2">
        <SchemaFormRenderer
          schema={renderSchema}
          values={values}
          errors={errors}
          optionsMap={optionsMap}
          onFieldChange={handleFieldChange}
          t={t}
        />
      </Box>

      <ValidationPopup
        isOpen={popupIssues.length > 0}
        onClose={() => setPopupIssues([])}
        issues={popupIssues}
        onSelectIssue={() => setPopupIssues([])}
        t={t}
      />
    </Modal>
  );
}