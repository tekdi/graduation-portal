import React from 'react';
import { Box, HStack, Icon, Pressable, Text, VStack } from '@ui';
import { quickActionCardStyles } from './Styles';

const QuickActionCard = ({ title, subtitle, icon, bg }: any) => (
  <Pressable {...quickActionCardStyles.pressable}>
    <HStack {...quickActionCardStyles.container}>
      <Box bg={bg} {...quickActionCardStyles.iconBox}>
        <Icon as={icon} color="$primary600" size="md" />
      </Box>
      <VStack {...quickActionCardStyles.contentVStack}>
        <Text {...quickActionCardStyles.titleText}>{title || ''}</Text>
        <Text {...quickActionCardStyles.subtitleText}>{subtitle || ''}</Text>
      </VStack>
    </HStack>
  </Pressable>
);

export default QuickActionCard;
