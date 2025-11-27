import React from 'react';
import { HStack, Button, ButtonText, LucideIcon } from '@ui';
import { participantHeaderStyles } from './Styles';
import type { ParticipantStatus } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';

interface ActionButtonsProps {
  status?: ParticipantStatus;
}

/**
 * ActionButtons Component
 * Displays action buttons based on participant status.
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ status }) => {
  const { t } = useLanguage();

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

export default ActionButtons;

