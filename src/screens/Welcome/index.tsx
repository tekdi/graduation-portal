import React from 'react';
import { Box, VStack, ScrollView, Text, Heading } from '@gluestack-ui/themed';
import FeatureCard from '@ui/FeatureCard';
import { useAuth } from '@contexts/AuthContext';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { WELCOME_CARDS } from '@constants/WELCOME_CARDS';

const WelcomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <ScrollView
      bg={theme.tokens.colors.accent100}
      flex={1}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Box
        padding="$6"
        flex={1}
        $md-padding="$8"
        justifyContent="center"
        alignItems="center"
      >
        <VStack
          space="2xl"
          width="$full"
          maxWidth={1200}
          alignSelf="center"
          alignItems="center"
        >
          {/* Welcome Header */}
          <VStack
            space="sm"
            alignItems="center"
            marginTop="$8"
            marginBottom="$4"
          >
            <Heading {...TYPOGRAPHY.h1} color="$textDark900">
              {t('welcome.WelcomeBack')}, {user?.name}
            </Heading>
            <Text {...TYPOGRAPHY.paragraph} color="$textDark600">
              {t('welcome.ChooseOptionBelowToGetStarted')}
            </Text>
          </VStack>

          {/* Cards Grid */}
          <Box
            flexDirection="column"
            $md-flexDirection="row"
            gap="$5"
            $md-gap="$6"
            width="$full"
            maxWidth={1100}
          >
            {WELCOME_CARDS?.map(card => (
              <Box key={card.id} width="$full" $md-width="33.33%" $md-flex={1}>
                <FeatureCard
                  color={card.color}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  navigationUrl={card.navigationUrl}
                  isDisabled={card.isDisabled}
                  pressableActionText={card.pressableActionText}
                />
              </Box>
            ))}
          </Box>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default WelcomePage;
