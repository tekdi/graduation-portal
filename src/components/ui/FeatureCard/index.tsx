import React, { useState } from 'react';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FeatureCardProps } from '@app-types/components';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import Icon from '@ui/Icon';
const FeatureCard: React.FC<FeatureCardProps> = ({ card }) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [isHovered, setIsHovered] = useState(false);

  const {
    color,
    icon,
    title,
    description,
    navigationUrl,
    isDisabled = false,
    pressableActionText,
  } = card;

  const handleMouseEnter = () => {
    if (Platform.OS === 'web' && !isDisabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsHovered(false);
    }
  };

  const handlePress = () => {
    if (navigationUrl && !isDisabled) {
      // @ts-ignore - Navigation type inference
      navigation.navigate(navigationUrl);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={{ opacity: isDisabled ? 0.5 : 1 }}
    >
      <Box
        bg={theme.tokens.colors.backgroundPrimary.light}
        borderRadius="$lg"
        borderTopWidth={4}
        borderTopColor={color}
        shadowColor={theme.tokens.colors.foreground}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={3}
        $web-boxShadow={
          isHovered
            ? '0px 8px 24px rgba(0, 0, 0, 0.15)'
            : '0px 2px 8px rgba(0, 0, 0, 0.1)'
        }
        minHeight={250}
        flex={1}
        $web-transition="all 0.3s ease-in-out"
        $web-transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
        $web-cursor={isDisabled ? 'not-allowed' : 'pointer'}
        // @ts-ignore - Web-specific event handlers
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Content */}
        <VStack space="md" padding="$5" justifyContent="space-between" flex={1}>
          <VStack space="md">
            {/* Icon Container */}
            <Box
              bg={color}
              borderRadius="$xl"
              width={64}
              height={64}
              alignItems="center"
              justifyContent="center"
            >
              {/* Render Icon component here with the icon name */}
              <Icon name={icon} size={32} />
            </Box>

            {/* Title */}
            <Text {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground}>
              {t(title)}
            </Text>

            {/* Description */}
            <Text
              {...TYPOGRAPHY.paragraph}
              color={theme.tokens.colors.mutedForeground}
              numberOfLines={2}
            >
              {t(description)}
            </Text>
          </VStack>

          {/* Get Started Link - Only visible on hover for enabled cards */}
          {Platform.OS === 'web' && pressableActionText && (
            <Box
              flexDirection="row"
              alignItems="center"
              gap="$1"
              marginTop="$3"
              opacity={isHovered ? 1 : 0}
              $web-transition="opacity 0.3s ease-in-out"
            >
              <Text fontSize="$sm" fontWeight="$semibold" color={color}>
                {t(pressableActionText)}
              </Text>
              <Text fontSize="$sm" fontWeight="$semibold" color={color}>
                {'>'}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};

export default FeatureCard;
