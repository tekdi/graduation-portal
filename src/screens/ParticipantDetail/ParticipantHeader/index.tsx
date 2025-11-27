import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, Text, Box, Pressable } from '@ui';
import { participantHeaderStyles } from './Styles';
import type { ParticipantStatus, PathwayType } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import ActionButtons from './ActionButtons';
import InProgressCard from './InProgressCard';
import CompletedCard from './CompletedCard';
import DropoutWarning from './DropoutWarning';

/**
 * ParticipantHeader Props
 * Component props for displaying participant header with status-based UI variations.
 */
interface ParticipantHeaderProps {
  participantName: string;
  participantId: string;
  status?: ParticipantStatus;
  pathway?: PathwayType;
  graduationProgress?: number;
  graduationDate?: string;
}

/**
 * ParticipantHeader Component
 * Displays participant header with status-based UI variations and action buttons.
 */
const ParticipantHeader: React.FC<ParticipantHeaderProps> = ({
  participantName,
  participantId,
  status,
  pathway,
  graduationProgress,
  graduationDate,
}) => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  /**
   * Handle Back Navigation
   * Navigates back to the previous screen (Caseload)
   */
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };



  /**
   * Render Status Badge
   * Shows red "Dropped Out" badge for dropout participants
   * 
   * @returns Badge component if status is 'dropout', null otherwise
   */
  const renderStatusBadge = () => {
    if (status === 'dropout') {
      return (
        <Box {...participantHeaderStyles.statusBadge}>
          <Text {...participantHeaderStyles.statusBadgeText}>
            {t('participantDetail.header.droppedOut')}
          </Text>
        </Box>
      );
    }
    return null;
  };


  return (
    <VStack 
      {...participantHeaderStyles.container}
      // Responsive padding: smaller on mobile, larger on desktop
      $md-p="$6"
    >
      {/* Back Navigation Link */}
      <Pressable onPress={handleBackPress}>
        <HStack {...participantHeaderStyles.backLinkContainer}>
          <Text 
            {...participantHeaderStyles.backLinkText}
            $hover={{
              color: '$primary500',
            }}
          >
            {t('participantDetail.header.backToCaseload')}
          </Text>
        </HStack>
      </Pressable>

      {/* Participant Info and Actions Row */}
      <HStack 
        {...participantHeaderStyles.participantInfoRow}
        // Responsive: stack on mobile, row on desktop
        $md-flexDirection="row"
        $md-justifyContent="space-between"
      >
        {/* Left: Participant Name and ID */}
        <VStack {...participantHeaderStyles.participantInfoContainer}>
          <HStack {...participantHeaderStyles.participantNameRow}>
            <Text {...participantHeaderStyles.participantName}>
              {participantName}
            </Text>
            {renderStatusBadge()}
          </HStack>
          
          <HStack {...participantHeaderStyles.participantIdRow}>
            <Text {...participantHeaderStyles.participantId}>
              {participantId}
            </Text>
            {pathway && (
              <>
                <Text {...participantHeaderStyles.pathwaySeparator}>
                  •
                </Text>
                <Text {...participantHeaderStyles.pathway}>
                  {t(`participantDetail.pathways.${pathway}`)}
                </Text>
              </>
            )}
          </HStack>
        </VStack>

        {/* Right: Action Buttons */}
        <Box width="$full" $md-width="auto">
          <ActionButtons status={status} />
        </Box>
      </HStack>

      {/* In Progress: Graduation Readiness Card */}
      {status === 'in-progress' && (
        <InProgressCard graduationProgress={graduationProgress} />
      )}

      {/* Completed: Graduation Status Card */}
      {status === 'completed' && (
        <CompletedCard graduationDate={graduationDate} />
      )}

      {/* Dropout Warning Box */}
      {status === 'dropout' && <DropoutWarning />}
    </VStack>
  );
};

export default ParticipantHeader;

