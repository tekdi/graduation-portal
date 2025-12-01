import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, Text, Box, Pressable, Button, ButtonText, LucideIcon } from '@ui';
import { participantHeaderStyles } from './Styles';
import type { ParticipantStatus, PathwayType } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import ParticipantProgressCard from './ParticipantProgressCard';

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

  /**
   * Render Action Buttons
   * Displays action buttons based on participant status
   * 
   * @returns Action buttons JSX based on status
   */
  const renderActionButtons = () => {
    // Not Enrolled: View Profile + Enroll Participant (disabled)
    if (status === 'not-enrolled') {
      return (
        <HStack
          {...participantHeaderStyles.actionButtonsContainer}
          $md-flexDirection="row"
          $md-width="auto"
        >
          <Button
            variant="outline"
            size="md"
            borderColor="$borderLight300"
            bg="$white"
            borderRadius="$xl"
            height="$9"
            paddingHorizontal="$3"
            paddingVertical="$2"
            width="$full"
            minWidth={120}
            onPress={() => {}}
            $md-width="auto"
          >
            <HStack {...participantHeaderStyles.outlineButtonContent}>
              <LucideIcon name="User" size={16} color="#000" />
              <ButtonText {...participantHeaderStyles.outlineButtonText}>
                {t('participantDetail.header.viewProfile')}
              </ButtonText>
            </HStack>
          </Button>

          <Button
            {...participantHeaderStyles.solidButtonPrimary}
            onPress={() => {}}
            isDisabled={true}
            $md-width="auto"
          >
            <HStack {...participantHeaderStyles.solidButtonContent}>
              <LucideIcon name="User" size={16} color="#fff" />
              <ButtonText {...participantHeaderStyles.solidButtonText}>
                {t('participantDetail.header.enrollParticipant')}
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      );
    }

    // Dropout: Only View Profile (read-only mode)
    if (status === 'dropout') {
      return (
        <Button
          variant="outline"
          size="md"
          borderColor="$borderLight300"
          bg="$white"
          borderRadius="$xl"
          height="$9"
          paddingHorizontal="$3"
          paddingVertical="$2"
          width="$full"
          minWidth={120}
          onPress={() => {}}
          $md-width="auto"
        >
          <HStack {...participantHeaderStyles.outlineButtonContent}>
            <LucideIcon name="User" size={16} color="#000" />
            <ButtonText {...participantHeaderStyles.outlineButtonText}>
              {t('participantDetail.header.viewProfile')}
            </ButtonText>
          </HStack>
        </Button>
      );
    }

    // Enrolled, In Progress, Completed: View Profile + Log Visit
    return (
      <HStack
        {...participantHeaderStyles.actionButtonsContainer}
        $md-flexDirection="row"
        $md-width="auto"
      >
        <Button
          variant="outline"
          size="md"
          borderColor="$borderLight300"
          bg="$white"
          borderRadius="$xl"
          height="$9"
          paddingHorizontal="$3"
          paddingVertical="$2"
          width="$full"
          minWidth={120}
          onPress={() => {}}
          $md-width="auto"
        >
          <HStack {...participantHeaderStyles.outlineButtonContent}>
            <LucideIcon name="User" size={16} color="#000" />
            <ButtonText {...participantHeaderStyles.outlineButtonText}>
              {t('participantDetail.header.viewProfile')}
            </ButtonText>
          </HStack>
        </Button>

        <Button
          {...participantHeaderStyles.solidButtonPrimary}
          onPress={() => {}}
          $md-width="auto"
        >
          <HStack {...participantHeaderStyles.solidButtonContent}>
            <LucideIcon name="FileText" size={16} color="#fff" />
            <ButtonText {...participantHeaderStyles.solidButtonText}>
              {t('participantDetail.header.logVisit')}
            </ButtonText>
          </HStack>
        </Button>
      </HStack>
    );
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
          {renderActionButtons()}
        </Box>
      </HStack>

      {/* Participant Status Card/Warning */}
      <ParticipantProgressCard
        status={status}
        graduationProgress={graduationProgress}
        graduationDate={graduationDate}
      />
    </VStack>
  );
};

export default ParticipantHeader;

