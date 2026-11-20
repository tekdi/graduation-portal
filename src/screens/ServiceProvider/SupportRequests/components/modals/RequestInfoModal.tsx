import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Pressable } from '@gluestack-ui/themed';
import LucideIcon from '@components/ui/LucideIcon';
import Modal from '@components/ui/Modal';
import modalStyles from '../../styles';
import { useLanguage } from '@contexts/LanguageContext';
import { getUserProfile } from '../../../../../services/authenticationService';

const BASE_PATH = 'supportProvider.supportRequests';

export interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
}

export default function RequestInfoModal({
  isOpen,
  onClose,
  item,
}: RequestInfoModalProps): React.JSX.Element {
  const { t } = useLanguage();
  const [coachProfile, setCoachProfile] = useState<any>(null);

  const raw = item?.raw || {};
  const coachId =
    raw.requestor_id ?? raw.requester_id ?? raw.user_id ?? raw.created_by ??
    raw.user_details?.id ?? raw.user?.id ?? null;

  // Fetch the coach's actual profile via the existing User Profile Read API
  useEffect(() => {
    if (!isOpen || !coachId) {
      setCoachProfile(null);
      return;
    }
    let isMounted = true;
    getUserProfile(String(coachId))
      .then((profile) => { if (isMounted) setCoachProfile(profile); })
      .catch(() => { if (isMounted) setCoachProfile(null); });
    return () => { isMounted = false; };
  }, [isOpen, coachId]);

  if (!isOpen) return <></>;

  const toText = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return String(val.label || val.name || val.value || '').trim();
    return String(val).trim();
  };

  const requestTitle = item?.title || '';
  const coachName = toText(coachProfile?.name) || item?.coach || '';
  const rawPhoneCode = toText(coachProfile?.phone_code) || item?.phoneCode || '';
  const phoneCode = rawPhoneCode && !rawPhoneCode.startsWith('+') ? `+${rawPhoneCode}` : rawPhoneCode;
  const phone = toText(coachProfile?.phone) || item?.phone;
  const email = toText(coachProfile?.email) || item?.email;
  const province = toText(coachProfile?.province) || item?.province;
  const site = toText(coachProfile?.site) || item?.site;

  const fields = [
    { icon: 'User', label: t(`${BASE_PATH}.labels.coachName`), value: coachName || '-' },
    { icon: 'Phone', label: t(`${BASE_PATH}.labels.phone`), value: [phoneCode, phone].filter(Boolean).join(' ') || '-' },
    { icon: 'Mail', label: t(`${BASE_PATH}.labels.email`), value: email || '-' },
    { icon: 'MapPin', label: t(`${BASE_PATH}.labels.province`), value: province || '-' },
    { icon: 'Building2', label: t(`${BASE_PATH}.labels.site`), value: site || '-' },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      {...modalStyles.modalPropsMd}
      headerTitle={t(`${BASE_PATH}.titles.requestInfo`)}
      headerDescription={t(`${BASE_PATH}.titles.requestInfoDescription`)}
      footerContent={
        <HStack {...modalStyles.modalFooterRow}>
          {/* Cancel Button */}
          <Pressable
            onPress={handleClose}
            {...modalStyles.declineCancelBtn}
          >
            <Text {...modalStyles.declineModalCancelText}>
              {t(`${BASE_PATH}.buttonTexts.cancel`)}
            </Text>
          </Pressable>
        </HStack>
      }
    >
      <VStack {...modalStyles.modalBodyVStack}>
        <Box flexDirection="row" flexWrap="wrap" mx={-6}>
          {fields.map((f) => (
            <Box key={f.icon} width="$full" sx={{ '@md': { width: '50%' } }} p="$1.5">
              <VStack space="xs" bg="rgba(248, 250, 252, 1.00)" borderWidth={1} borderColor="$borderLight100" borderRadius="$xl" px="$4" py="$3">
                <HStack space="sm" alignItems="center">
                  <LucideIcon name={f.icon} size={16} color="#64748B" />
                  <Text fontSize="$xs" fontWeight="$medium" color="$textLight500" textTransform="uppercase" letterSpacing={0.5}>
                    {f.label}
                  </Text>
                </HStack>
                <Text fontSize="$sm" fontWeight="$semibold" color="$textDark900" pt={5}>
                  {f.value}
                </Text>
              </VStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </Modal>
  );
}
