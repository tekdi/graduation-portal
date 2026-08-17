import React from 'react';
import { Box, HStack, VStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';
import { GRADUATION_RATE_DATA, GraduationRateData, GRADUATION_RATE_ITEMS } from '@constants/DASHBOARD_LC';

const getLightTint = (color: string) => {
  switch (color.toLowerCase()) {
    case '#60a5fa': // blue
      return '#EFF6FF';
    case '#f59e0b': // yellow
      return '#FEF3C7';
    case '#22c55e': // green
      return '#DCFCE7';
    case '#ef4444': // red
      return '#FEE2E2';
    case '#4b5563': // grey
    case '#9ca3af':
    case '#374151':
    default:
      return '#F3F4F6';
  }
};

const GraduationRateItems: React.FC = () => {
  const { t } = useLanguage();
  const data: GraduationRateData = GRADUATION_RATE_DATA;

  return (
    <HStack width="$full" space="sm" mb="$4">
      {GRADUATION_RATE_ITEMS.map((item) => {
        let value = 0;
        let percent: number | undefined = undefined;

        if (item.isTotal) {
          value = data.totalParticipants || 36;
        } else if (item.isNotGraduated) {
          value = data.notGraduated || 25;
        } else {
          const segment = data.segments.find(
            (seg) => seg.labelKey.split('.').pop() === item.key
          );
          if (segment) {
            value = segment.value;
            percent = segment.percent;
          }
        }

        return (
          <VStack
            {...graduationCriteriaStyles.rateItemBox}
            key={item.key}
            borderColor={item.color as any}
            space="xs"
            p="$3"
          >
            <HStack alignItems="center" space="xs" width="$full">
              <Box
                bg={getLightTint(item.color)}
                p="$1.5"
                borderRadius="$full"
                alignItems="center"
                justifyContent="center"
              >
                {item.icon && (
                  <LucideIcon name={item.icon} size={14} color={item.color as any} />
                )}
              </Box>
            </HStack>
            <Text fontSize={20} fontWeight="$bold" color="$textForeground" mt="$1.5">
              {value}
            </Text>
            <Text fontSize={11} color="$textMutedForeground" numberOfLines={2} fontWeight="$medium">
              {t(item.labelKey)}
            </Text>
            {percent !== undefined && (
              <Text fontSize={11} color="$textMutedForeground">
                ({percent}%)
              </Text>
            )}
          </VStack>
        );
      })}
    </HStack>
  );
};

export default GraduationRateItems;
