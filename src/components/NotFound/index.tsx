import React from 'react';
import { ScrollView, VStack, Text, Box } from '@ui';
import { notFoundStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

interface NotFoundProps {
  message: string; // Translation key or already translated message
  showScrollView?: boolean;
}

/**
 * NotFound Component
 * Reusable not found error component for displaying error states.
 */
const NotFound: React.FC<NotFoundProps> = ({
  message,
  showScrollView = true,
}) => {
  const { t } = useLanguage();
  
  const content = (
    <VStack
      {...notFoundStyles.container}
      $web-boxShadow={notFoundStyles.containerBoxShadow}
    >
      <Box {...notFoundStyles.contentBox}>
        <Text {...notFoundStyles.message}>{t(message)}</Text>
      </Box>
    </VStack>
  );

  if (showScrollView) {
    return (
      <ScrollView flex={1} bg="$white">
        {content}
      </ScrollView>
    );
  }

  return content;
};

export default NotFound;

