import React from 'react';
import {
  HStack,
  VStack,
  Text,
  Box,
  Pressable,
  Progress,
  ProgressFilledTrack,
  LucideIcon,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';

interface HeaderProps {
  title: string;
  progress: number;
  participantInfo: {
    name: string;
    date: string;
  } | null;
  onBackPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, progress, participantInfo, onBackPress }) => {
  const { t } = useLanguage();

  return (
    <VStack space="md" padding="$4" backgroundColor="$white">
      {/* Top Row: Back Button and Action Buttons */}
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        width="$full"
      >
        {/* Back Button */}
        <Pressable onPress={onBackPress}>
          <HStack alignItems="center" space="xs">
            <LucideIcon name="ArrowLeft" size={20} color="$textPrimary" />
            <Text>{t('common.back')}</Text>
          </HStack>
        </Pressable>
      </HStack>

      {/* Title and Progress Badge Row */}
      <HStack
        justifyContent="space-between"
        alignItems="center"
        width="$full"
        marginTop="$2"
      >
        <Text
          fontSize="$xl"
          fontWeight="$semibold"
          color="$textPrimary"
          flex={1}
        >
          {title || t('logVisit.individualEnterpriseVisit.title')}
        </Text>

        {/* Progress Badge */}
        <Box
          backgroundColor="$gray100"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius="$full"
        >
          <Text fontSize="$sm" color="$gray700" fontWeight="$medium">
            {progress}% {t('common.complete') || 'Complete'}
          </Text>
        </Box>
      </HStack>

      {/* Progress Bar */}
      <Box width="$full" marginTop="$2">
        <Progress value={progress} width="$full" size="md">
          <ProgressFilledTrack backgroundColor="$blue600" />
        </Progress>
      </Box>

      {/* Participant Name and Date */}
      {participantInfo && (
        <Text fontSize="$sm" color="$textSecondary" marginTop="$2">
          {participantInfo.name} • {participantInfo.date}
        </Text>
      )}
    </VStack>
  );
};

export default Header;

