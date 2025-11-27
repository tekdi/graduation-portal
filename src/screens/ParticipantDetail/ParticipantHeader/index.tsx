import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, Text, Button, ButtonText, Box, Pressable } from '@ui';
import Icon from '@components/ui/Icon';
import { participantHeaderStyles } from './Styles';
import type { ParticipantStatus, PathwayType } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';

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

  // Render Action Buttons - returns different button combinations based on participant status
  const renderActionButtons = () => {
    // Not Enrolled: View Profile + Enroll Participant (disabled)
    if (status === 'not-enrolled') {
      return (
        <HStack 
          {...participantHeaderStyles.actionButtonsContainer}
          // Responsive: stack on mobile, row on desktop
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
              <Icon name="user" size={16} tintColor="#000" />
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
              <Icon name="user" size={16} tintColor="#fff" />
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
            <Icon name="user" size={16} tintColor="#000" />
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
        // Responsive: stack on mobile, row on desktop
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
            <Icon name="user" size={16} tintColor="#000" />
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
            {/* Using chart icon as clipboard alternative */}
            <Icon name="chart" size={16} tintColor="#fff" />
            <ButtonText {...participantHeaderStyles.solidButtonText}>
              {t('participantDetail.header.logVisit')}
            </ButtonText>
          </HStack>
        </Button>
      </HStack>
    );
  };

  // Render In Progress Status Card - shows graduation readiness progress with percentage and progress bar
  const renderInProgressCard = () => {
    if (status === 'in-progress') {
      // Use nullish coalescing for safer default value (only use default if null/undefined)
      const progress = graduationProgress ?? 57;
      return (
        <Box 
          {...participantHeaderStyles.progressCard}
          // @ts-ignore - Web-specific props not in Gluestack UI types
          $web-boxShadow={participantHeaderStyles.progressCardBoxShadow}
          $web-backgroundImage={participantHeaderStyles.progressCardBackgroundImage}
        >
          <Text {...participantHeaderStyles.progressCardTitle}>
            {t('participantDetail.header.graduationReadiness')}
          </Text>
          <VStack 
            {...participantHeaderStyles.progressCardContent}
            // Mobile: stack vertically, Desktop: horizontal layout
            $md-flexDirection="row"
            $md-justifyContent="space-between"
            $md-alignItems="center"
            space="sm"
          >
            <Text {...participantHeaderStyles.progressPercentage}>
              {progress}%
            </Text>
            <Box 
              {...participantHeaderStyles.progressBarContainer}
              // Mobile: full width, Desktop: auto width with maxWidth
              $md-width="auto"
            >
              <Box {...participantHeaderStyles.progressBarBackground}>
                <Box 
                  {...participantHeaderStyles.progressBarFill}
                  width={`${progress}%`}
                />
              </Box>
            </Box>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  // Render Completed Status Card - shows graduation completion status with date and checkmark icon
  const renderCompletedCard = () => {
    if (status === 'completed') {
      // Use nullish coalescing for safer default value (only use default if null/undefined)
      const date = graduationDate ?? '2025-09-20';
      return (
        <Box 
          {...participantHeaderStyles.completedCard}
          // @ts-ignore - Web-specific props not in Gluestack UI types
          $web-boxShadow={participantHeaderStyles.completedCardBoxShadow}
          $web-backgroundImage={participantHeaderStyles.completedCardBackgroundImage}
        >
          <VStack space="sm">
            <Text {...participantHeaderStyles.completedCardTitle}>
              {t('participantDetail.header.programStatus')}
            </Text>
            <HStack {...participantHeaderStyles.completedCardContent}>
              <VStack flex={1} space="xs">
                <Text {...participantHeaderStyles.completedStatus}>
                  {t('participantDetail.header.graduatedComplete')}
                </Text>
                <Text {...participantHeaderStyles.completedDate}>
                  {t('participantDetail.header.graduatedOn', { date })}
                </Text>
              </VStack>
              <Box {...participantHeaderStyles.completedCheckmark}>
                <Text {...participantHeaderStyles.completedCheckmarkText}>
                  ✓
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      );
    }
    return null;
  };

  /**
   * Render Dropout Warning
   * Shows warning message box for dropout participants
   * Displays red warning icon, title, and descriptive message
   * 
   * @returns Warning box component if status is 'dropout', null otherwise
   */
  const renderDropoutWarning = () => {
    if (status === 'dropout') {
      return (
        <Box {...participantHeaderStyles.dropoutWarningBox}>
          <HStack {...participantHeaderStyles.dropoutWarningContent}>
            <Box {...participantHeaderStyles.dropoutWarningIcon}>
              <Text {...participantHeaderStyles.dropoutWarningIconText}>
                ×
              </Text>
            </Box>
            <VStack {...participantHeaderStyles.dropoutWarningTextContainer}>
              <Text {...participantHeaderStyles.dropoutWarningTitle}>
                {t('participantDetail.header.participantDroppedOut')}
              </Text>
              <Text {...participantHeaderStyles.dropoutWarningMessage}>
                {t('participantDetail.header.dropoutWarning')}
              </Text>
            </VStack>
          </HStack>
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
        <Box 
          width="$full"
          $md-width="auto"
        >
          {renderActionButtons()}
        </Box>
      </HStack>

      {/* In Progress: Graduation Readiness Card */}
      {renderInProgressCard()}

      {/* Completed: Graduation Status Card */}
      {renderCompletedCard()}

      {/* Dropout Warning Box */}
      {renderDropoutWarning()}
    </VStack>
  );
};

export default ParticipantHeader;

