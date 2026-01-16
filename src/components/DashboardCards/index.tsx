import React from 'react';
import { HStack, Box, Card, VStack, Text, Pressable, Badge, BadgeText } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@config/theme';
import { AssessmentSurveyCardData } from '@app-types/participant';

interface DashboardCardsProps {
  cards: AssessmentSurveyCardData[];
  userId?: string;
}

/**
 * DashboardCards Component
 * Displays a horizontal stack of indicator cards for the admin dashboard
 */
const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  cards, 
  userId = '' 
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const handleCardPress = (card: AssessmentSurveyCardData) => {
    if (card.navigationUrl) {
      // @ts-ignore - Navigation type inference
      navigation.navigate(card.navigationUrl as never);
    }
  };

  return (
    <HStack space="md" mt="$4" flexWrap="wrap">
      {cards.map(card => (
        <Pressable
          key={card.id}
          flex={1}
          minWidth="$64"
          onPress={() => handleCardPress(card)}
          $web-cursor="pointer"
        >
          <Card
            size="md"
            variant="outline"
            borderWidth={1}
            borderColor="$borderLight200"
            borderRadius="$lg"
            p="$4"
            $web-hover={{
              borderColor: '$primary500',
              shadowColor: '$foreground',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <VStack space="md" flex={1}>
              {/* Icon and Title Row */}
              <HStack space="md" alignItems="flex-start" justifyContent="space-between">
                <HStack space="md" alignItems="flex-start" flex={1}>
                  {/* Icon Container */}
                  <Box
                    bg={card.iconColor || theme.tokens.colors.error100}
                    borderRadius="$md"
                    width={40}
                    height={40}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LucideIcon 
                      name={card.icon} 
                      size={20} 
                      color={theme.tokens.colors.error500} 
                    />
                  </Box>

                  {/* Title */}
                  <VStack flex={1} space="xs">
                    <Text 
                      fontSize="$md" 
                      fontWeight="$semibold" 
                      color="$textForeground"
                    >
                      {t(card.title)}
                    </Text>
                  </VStack>
                </HStack>

                {/* Right Arrow Icon */}
                <LucideIcon 
                  name="ChevronRight" 
                  size={20} 
                  color="$textMutedForeground" 
                />
              </HStack>

              {/* Description */}
              <Text 
                fontSize="$sm" 
                color="$textMutedForeground" 
                flex={1}
              >
                {t(card.description)}
              </Text>

              {/* Topics Badge */}
              {card.status && (
                <HStack justifyContent="flex-start" alignItems="center">
                  <Badge bg="$backgroundDark950" borderRadius="$md" px="$3" py="$1">
                    <BadgeText color="$textLight0" fontSize="$xs">
                      {t(card.status.label)}
                    </BadgeText>
                  </Badge>
                </HStack>
              )}
            </VStack>
          </Card>
        </Pressable>
      ))}
    </HStack>
  );
};

export default DashboardCards;
