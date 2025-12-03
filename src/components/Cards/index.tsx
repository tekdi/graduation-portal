import React from 'react';
import { Card, Box, VStack, HStack, Text, Button, ButtonText } from '@ui';
import { AssessmentSurveyCardProps } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { assessmentSurveyCardStyles } from './Styles';
import { theme } from '@config/theme';

/**
 * AssessmentCard Component
 * Reusable card component for displaying assessment survey information
 */
export const AssessmentCard: React.FC<AssessmentSurveyCardProps> = ({
  card,
}) => {
  const { t } = useLanguage();
  const { title, description, additionalInfo, icon, status, actionButton } = card;

  // Get status badge styling based on status type
  // Note: status.type uses card status values ('not-started', 'in-progress', 'completed', 'graduated')
  // not participant STATUS constants
  const getStatusBadgeStyle = () => {
    switch (status.type) {
      case 'graduated':
        return assessmentSurveyCardStyles.statusBadgeGraduated;
      case 'completed':
        return assessmentSurveyCardStyles.statusBadgeCompleted;
      case 'in-progress':
        return assessmentSurveyCardStyles.statusBadgeInProgress;
      case 'not-started':
      default:
        return assessmentSurveyCardStyles.statusBadgeNotStarted;
    }
  };

  // Format status label (replace placeholder with percentage if needed)
  const formatStatusLabel = () => {
    if (status.percentage !== undefined) {
      return t(status.label, { percentage: status.percentage });
    }
    return t(status.label);
  };

  // Get button styling based on variant
  const getButtonStyle = () => {
    return actionButton.variant === 'primary'
      ? assessmentSurveyCardStyles.buttonPrimary
      : assessmentSurveyCardStyles.buttonSecondary;
  };

  return (
    <Card
      {...assessmentSurveyCardStyles.cardContainer}
      $web-boxShadow="none" // Remove shadow on web
    >
      {/* Card Header with Icon and Status Badge */}
      <HStack
        {...assessmentSurveyCardStyles.cardHeader}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <HStack alignItems="center" gap="$2" flex={1}>
          <Box {...assessmentSurveyCardStyles.iconContainer}>
            <LucideIcon
              name={icon}
              size={24}
              color={theme.tokens.colors.primary500}
            />
          </Box>
          <Text {...assessmentSurveyCardStyles.title}>{t(title)}</Text>
        </HStack>
        <Box {...getStatusBadgeStyle()}>
          <HStack alignItems="center" gap="$1">
            {(status.type === 'graduated' || status.type === 'completed') && (
              <LucideIcon
                name="CheckCircle"
                size={12}
                color={
                  status.type === 'graduated'
                    ? theme.tokens.colors.white || '#ffffff'
                    : theme.tokens.colors.success600
                }
              />
            )}
            <Text
              {...(status.type === 'graduated'
                ? assessmentSurveyCardStyles.statusBadgeTextGraduated
                : status.type === 'completed'
                ? assessmentSurveyCardStyles.statusBadgeTextCompleted
                : assessmentSurveyCardStyles.statusBadgeText)}
            >
              {formatStatusLabel()}
            </Text>
          </HStack>
        </Box>
      </HStack>

      {/* Card Description */}
      <VStack {...assessmentSurveyCardStyles.contentContainer} space="md">
        <Text {...assessmentSurveyCardStyles.description}>
          {t(description)}
        </Text>
        {additionalInfo && (
          <Text {...assessmentSurveyCardStyles.additionalInfo}>
            {t(additionalInfo)}
          </Text>
        )}
      </VStack>

      {/* Action Button */}
      <Button
        {...getButtonStyle()}
        onPress={() => {
          if (actionButton.onPress) {
            actionButton.onPress();
          } else {
            // Default action - can be customized
            console.log(`Action: ${actionButton.label}`);
          }
        }}
      >
        <HStack alignItems="center" gap="$2">
          <LucideIcon
            name={actionButton.icon}
            size={16}
            color={
              actionButton.variant === 'primary'
                ? '#ffffff'
                : theme.tokens.colors.textForeground
            }
          />
          <ButtonText
            {...assessmentSurveyCardStyles.buttonText}
            color={
              actionButton.variant === 'primary'
                ? '$white'
                : theme.tokens.colors.textForeground
            }
          >
            {t(actionButton.label)}
          </ButtonText>
        </HStack>
      </Button>
    </Card>
  );
};

