import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack, LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';
import { PARTICIPANTS_DATA } from '@constants/PARTICIPANTS_LIST';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import ParticipantSelector from '../../../OutcomesDashboard/ParticipantSelector';

interface IndividualGraduationReadinessProps {
  selectedParticipant: string;
  onParticipantChange: (id: string) => void;
}

const IndividualGraduationReadiness: React.FC<IndividualGraduationReadinessProps> = ({
  selectedParticipant,
  onParticipantChange,
}) => {
  const { t } = useLanguage();

  const participant = PARTICIPANTS_DATA.find((p) => p.id === selectedParticipant);
  const progress = participant ? (participant.graduationProgress ?? participant.progress ?? 0) : 0;

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Graduated':
      case 'Completed':
      case 'Onboarded':
        return { name: 'CheckCircle2', color: '$success600', bg: '$success50', fill: '$success500' };
      case 'In Progress':
        return { name: 'Clock', color: '$warning600', bg: '$warning50', fill: '$warning500' };
      case 'Dropped out':
      case 'Not Onboarded':
      default:
        return { name: 'XCircle', color: '$error600', bg: '$error50', fill: '$error500' };
    }
  };

  const statusDetails = participant ? getStatusDetails(participant.status) : null;

  return (
    <VStack space="md" width="$full">
      {/* Section Title */}
      <Text {...graduationCriteriaStyles.checklistSectionTitle}>
        {t('requestorDashboard.graduationCriteria.checklist.readinessTitle')}
      </Text>

      {/* Participant Selector */}
      <Box {...graduationCriteriaStyles.participantSelectorBox}>
        <ParticipantSelector
          selectedParticipant={selectedParticipant}
          onParticipantChange={onParticipantChange}
          label={t('requestorDashboard.graduationCriteria.checklist.viewingReadinessLabel')}
        />
      </Box>

      {/* Empty State vs Selected Card */}
      {!participant ? (
        <Box {...graduationCriteriaStyles.emptyStateContainer}>
          <Text {...graduationCriteriaStyles.emptyStateText}>
            {t('requestorDashboard.graduationCriteria.checklist.emptyStateMessage')}
          </Text>
        </Box>
      ) : (
        statusDetails && (
          <Box {...graduationCriteriaStyles.participantReadinessCard}>
            <HStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$4">
              <HStack alignItems="center" space="md">
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: statusDetails.bg === '$success50' ? '#F0FDF4' : statusDetails.bg === '$warning50' ? '#FEF3C7' : '#FEF2F2',
                    alignItems: 'center',
                    justifyContent: 'center',
                  } as any}
                >
                  <LucideIcon name={statusDetails.name as any} size={22} color={statusDetails.color as any} />
                </Box>
                <VStack space="xs">
                  <Text fontSize={16} fontWeight="$bold" color="$textForeground">
                    {participant.name}
                  </Text>
                  <Box
                    alignSelf="flex-start"
                    style={{
                      backgroundColor: statusDetails.bg === '$success50' ? '#ECFDF5' : statusDetails.bg === '$warning50' ? '#FFFBEB' : '#FEF2F2',
                      borderColor: statusDetails.bg === '$success50' ? '#A7F3D0' : statusDetails.bg === '$warning50' ? '#FDE68A' : '#FECACA',
                      borderWidth: 1,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    } as any}
                  >
                    <Text fontSize={11} fontWeight="$semibold" color={statusDetails.color as any}>
                      {participant.status}
                    </Text>
                  </Box>
                </VStack>
              </HStack>

              <VStack space="xs" style={{ width: '100%', maxWidth: 240 } as any}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} color="$textSecondary" fontWeight="$medium">
                    {t('requestorDashboard.graduationCriteria.checklist.title')}
                  </Text>
                  <Text fontSize={14} fontWeight="$bold" color="$textForeground">
                    {progress}%
                  </Text>
                </HStack>
                <Progress value={progress} w="$full" h="$1.5" bg="$progressBarBackground" borderRadius="$full">
                  <ProgressFilledTrack bg={statusDetails.fill} />
                </Progress>
              </VStack>
            </HStack>
          </Box>
        )
      )}
    </VStack>
  );
};

export default IndividualGraduationReadiness;
