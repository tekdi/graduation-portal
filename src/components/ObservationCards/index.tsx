import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card, Box, VStack, HStack, Text, Button, ButtonText, Pressable } from '@ui';
import { AssessmentSurveyCardProps } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { assessmentSurveyCardStyles } from './Styles';
import { theme } from '@config/theme';
import { CARD_STATUS } from '@constants/app.constant';
import logger from '@utils/logger';
import { ICONS } from '@constants/LOG_VISIT_CARDS';

interface IconMeta {
  icon: string;
  color: string;
  iconColor: string;
}

/**
 * AssessmentCard Component
 * Reusable card component for displaying assessment survey information
 */
export const AssessmentCard: React.FC<AssessmentSurveyCardProps> = ({
  card,
  userId
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const { name, description, navigationUrl, entity } = card;
  const [iconMeta,setIconMeta] = useState<IconMeta | null>(null);

  useEffect(() => {
    const iconMeta = ICONS[card.id as keyof typeof ICONS] || ICONS?.[card?.name?.toLowerCase() as keyof typeof ICONS];
    setIconMeta(iconMeta as IconMeta);
  }, [card]);


  // Get status badge styling based on status type
  const getStatusBadgeStyle = () => {
    if (!entity?.status) return null;
    switch (entity?.status) {
      case CARD_STATUS.GRADUATED:
        return assessmentSurveyCardStyles.statusBadgeGraduated;
      case CARD_STATUS.COMPLETED:
        return assessmentSurveyCardStyles.statusBadgeCompleted;
      case CARD_STATUS.IN_PROGRESS:
        return assessmentSurveyCardStyles.statusBadgeInProgress;
      case CARD_STATUS.NOT_STARTED:
      default:
        return assessmentSurveyCardStyles.statusBadgeNotStarted;
    }
  };

  // Get button styling based on variant
  const getButtonStyle = () => {
    return entity?.status === CARD_STATUS.COMPLETED
      ? assessmentSurveyCardStyles.buttonSecondary
      : assessmentSurveyCardStyles.buttonPrimary;
  };
  
  return (
    <Card
      {...assessmentSurveyCardStyles.cardContainer}
      $web-boxShadow="none" // Remove shadow on web
    ><VStack space="lg">
      {/* Card Header with Icon, name, Description, Action Button and Status Badge */}
      <HStack {...assessmentSurveyCardStyles.cardHeader}>
        <HStack alignItems="flex-start" space={entity?.status ? "sm" : "lg"} flex={1}>
          <Box  {...(!entity?.status && {...assessmentSurveyCardStyles.iconContainer,bg:iconMeta?.color || '$primary500'})}>
            <LucideIcon name={iconMeta?.icon || 'info'} size={!entity?.status ? 24 : 20} color={iconMeta?.iconColor || '$white'} />
          </Box>
          <VStack flex={1} space="md">
            <Text {...assessmentSurveyCardStyles.title}>{t(name)}</Text>
            {/* Card Description */}
            {!entity?.status && (
            <VStack space="sm">
              <Text {...assessmentSurveyCardStyles.description}>
                {t(description)}
              </Text>
            </VStack>)}
          </VStack>
          {/* Status Badge - only show if status exists */}
        {entity?.status && (
          <Box {...getStatusBadgeStyle()}>
            <HStack alignItems="center" gap="$1">
              {(entity?.status === CARD_STATUS.GRADUATED || entity?.status === CARD_STATUS.COMPLETED) && (
                <LucideIcon
                  name="CheckCircle"
                  size={12}
                  color={
                    entity?.status === CARD_STATUS.GRADUATED
                      ? "$white"
                      : "$success600"
                  }
                />
              )}
              <Text
                {...(entity?.status === CARD_STATUS.GRADUATED
                  ? assessmentSurveyCardStyles.statusBadgeTextGraduated
                  : entity?.status === CARD_STATUS.COMPLETED
                  ? assessmentSurveyCardStyles.statusBadgeTextCompleted
                  : assessmentSurveyCardStyles.statusBadgeText)}
              >
                {entity?.status}
              </Text>
            </HStack>
          </Box>
        )}
        </HStack>

        {/* Navigation Arrow - show if navigationUrl exists */}
        {!entity?.status && navigationUrl && (
          <Pressable
            onPress={() => {
              // @ts-ignore
              navigation.navigate(navigationUrl as never, { id: userId || '',solutionId:card?.solutionId || card?.id });
            }}
            $web-cursor="pointer"
          >
            <LucideIcon
              name="ArrowRight"
              size={20}
              color={theme.tokens.colors.textMutedForeground}
            />
          </Pressable>
        )}
      </HStack>
      {entity?.status && (
        <VStack space="lg">
          <Text {...assessmentSurveyCardStyles.additionalInfo}>
            {t(description)}
          </Text>

        {/* Action Button */}
        {entity?.status && (
          <Button
            {...getButtonStyle()}
            onPress={() => {
              if(navigationUrl && userId) {
                // @ts-ignore
                navigation.navigate(navigationUrl as never, { id: userId || '',solutionId:card?.solutionId || card?.id });
              } else {
                logger.log('userId is required');
              }
            }}
          >
            <HStack alignItems="center" gap="$2">
              <LucideIcon
                name={"FileText"}
                size={16}
                color={
                  entity?.status === CARD_STATUS.COMPLETED
                  ? '$textForeground'
                  : '$white'
                }
              />
              <ButtonText
                {...assessmentSurveyCardStyles.buttonText}
                color={
                  entity?.status === CARD_STATUS.COMPLETED
                  ? '$textForeground'
                  : '$white'
                }
              >
                {t(entity?.status === CARD_STATUS.COMPLETED ? `View ${card?.name}` : `Fill ${card?.name}`)}
              </ButtonText>
            </HStack>
          </Button>
        )}
        </VStack>
      )}
      </VStack>
    </Card>
  );
};

