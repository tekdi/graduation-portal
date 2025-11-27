import React from 'react';
import { ScrollView, VStack, Text, Box } from '@ui';
import { notFoundStyles } from './Styles';

interface NotFoundProps {
  message: string;
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
  const content = (
    <VStack
      {...notFoundStyles.container}
      $web-boxShadow={notFoundStyles.containerBoxShadow}
    >
      <Box {...notFoundStyles.contentBox}>
        <Text {...notFoundStyles.message}>{message}</Text>
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

