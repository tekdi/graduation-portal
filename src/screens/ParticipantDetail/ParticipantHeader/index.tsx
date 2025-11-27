import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, Text, Button, ButtonText, Box, Pressable } from '@gluestack-ui/themed';
import { Platform } from 'react-native';
import Icon from '@components/ui/Icon';
import { participantHeaderStyles } from './Styles';
import { ParticipantStatus } from '@constants/PARTICIPANTS_MOCK_DATA';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * ParticipantHeader Props
 * 
 * @property participantName - Full name of the participant
 * @property participantId - Unique identifier for the participant
 * @property status - Current enrollment status (determines UI variations)
 * @property pathway - Pathway type key ('employment' | 'entrepreneurship') used for translation
 * @property graduationProgress - Progress percentage (0-100) for in-progress status
 * @property graduationDate - Graduation date string for completed status
 */
interface ParticipantHeaderProps {
  participantName: string;
  participantId: string;
  status?: ParticipantStatus;
  pathway?: 'employment' | 'entrepreneurship';
  graduationProgress?: number;
  graduationDate?: string;
}

/**
 * ParticipantHeader Component
 * 
 * Displays participant information header with status-based variations.
 * The component dynamically renders different UI elements based on the participant's status:
 * 
 * **Status-based rendering:**
 * - **not-enrolled**: View Profile + Enroll Participant (disabled) buttons
 * - **enrolled/in-progress/completed**: View Profile + Log Visit buttons
 * - **in-progress**: Shows "Graduation Readiness" progress card with percentage
 * - **completed**: Shows "Program Status" card with graduation date
 * - **dropout**: Shows red "Dropped Out" badge + warning message, read-only mode
 * 
 * **Web-specific features:**
 * - Hover effects on back navigation link
 * - Box shadows and gradient backgrounds (via $web-* props)
 * 
 * @remarks
 * Web-specific props ($web-boxShadow, $web-backgroundImage) require @ts-ignore
 * because Gluestack UI's TypeScript definitions don't include web-specific props.
 * These props are handled by the underlying styled-components system.
 * 
 * @example
 * ```tsx
 * <ParticipantHeader
 *   participantName="John Doe"
 *   participantId="1001"
 *   status="in-progress"
 *   pathway="Employment Pathway"
 *   graduationProgress={57}
 * />
 * ```
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
  const [isBackLinkHovered, setIsBackLinkHovered] = useState(false);

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
   * Handle Back Link Hover (Web only)
   * Updates hover state for visual feedback on web platform
   */
  const handleBackLinkMouseEnter = () => {
    if (Platform.OS === 'web') {
      setIsBackLinkHovered(true);
    }
  };

  const handleBackLinkMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsBackLinkHovered(false);
    }
  };

  /**
   * Handle View Profile
   * Navigates to participant profile screen
   * 
   * @remarks
   * Implementation pending - will navigate to profile detail screen
   */
  const handleViewProfile = () => {
    // Navigation to profile screen will be implemented when profile screen is available
    // navigation.navigate('participant-profile', { id: participantId });
  };

  /**
   * Handle Enroll Participant
   * Opens enrollment flow for not-enrolled participants
   * 
   * @remarks
   * Implementation pending - will open enrollment modal/flow
   */
  const handleEnrollParticipant = () => {
    // Enrollment flow will be implemented when enrollment feature is available
    // This button is currently disabled in the UI
  };

  /**
   * Handle Log Visit
   * Opens visit logging interface for enrolled/in-progress/completed participants
   * 
   * @remarks
   * Implementation pending - will open visit logging modal/form
   */
  const handleLogVisit = () => {
    // Visit logging will be implemented when visit logging feature is available
    // navigation.navigate('log-visit', { participantId });
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
   * Returns different button combinations based on participant status
   * 
   * **Button combinations by status:**
   * - **not-enrolled**: View Profile + Enroll Participant (disabled)
   * - **dropout**: View Profile only (read-only mode)
   * - **enrolled/in-progress/completed**: View Profile + Log Visit
   * 
   * @returns Button components based on status
   */
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
            {...participantHeaderStyles.outlineButton}
            onPress={handleViewProfile}
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
            onPress={handleEnrollParticipant}
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
          {...participantHeaderStyles.outlineButton}
          onPress={handleViewProfile}
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
          {...participantHeaderStyles.outlineButton}
          onPress={handleViewProfile}
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
          onPress={handleLogVisit}
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

  /**
   * Render In Progress Status Card
   * Shows graduation readiness progress card for in-progress participants
   * Displays progress percentage and visual progress bar
   * 
   * @remarks
   * Uses nullish coalescing (??) for safer default value handling.
   * Web-specific props ($web-boxShadow, $web-backgroundImage) require @ts-ignore
   * because Gluestack UI TypeScript definitions don't include web-specific props.
   * 
   * @returns Progress card component if status is 'in-progress', null otherwise
   */
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
          <HStack {...participantHeaderStyles.progressCardContent}>
            <Text {...participantHeaderStyles.progressPercentage}>
              {progress}%
            </Text>
            <Box {...participantHeaderStyles.progressBarContainer}>
              <Box {...participantHeaderStyles.progressBarBackground}>
                <Box 
                  {...participantHeaderStyles.progressBarFill}
                  width={`${progress}%`}
                />
              </Box>
            </Box>
          </HStack>
        </Box>
      );
    }
    return null;
  };

  /**
   * Render Completed Status Card
   * Shows graduation completion status card for completed participants
   * Displays graduation status, date, and checkmark icon
   * 
   * @remarks
   * Uses nullish coalescing (??) for safer default value handling.
   * Web-specific props ($web-boxShadow, $web-backgroundImage) require @ts-ignore
   * because Gluestack UI TypeScript definitions don't include web-specific props.
   * 
   * @returns Completed card component if status is 'completed', null otherwise
   */
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
      <Pressable 
        onPress={handleBackPress}
        onHoverIn={handleBackLinkMouseEnter}
        onHoverOut={handleBackLinkMouseLeave}
      >
        <HStack {...participantHeaderStyles.backLinkContainer}>
          <Text 
            {...participantHeaderStyles.backLinkText}
            color={isBackLinkHovered ? '$primary500' : '$textForeground'}
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

