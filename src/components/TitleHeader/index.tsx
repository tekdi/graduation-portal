import React from 'react';
import { HStack, VStack, Text } from '@ui';
import { titleHeaderStyles } from './Styles';

export interface TitleHeaderProps {
  title: string;
  description: string;
  right?: React.ReactNode;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title, description, right }) => {
  return (
    <HStack 
      justifyContent="space-between" 
      alignItems="flex-start" 
      width="100%"
      flexWrap="wrap"
    >
      <VStack {...titleHeaderStyles.textContainer} flex={1}>
        <Text {...titleHeaderStyles.titleText}>{title}</Text>
        <Text {...titleHeaderStyles.descriptionText}>{description}</Text>
      </VStack>
      
      {/* 
        Conditionally render right-side content (action buttons, icons, etc.)
        - Only renders if 'right' prop is provided (not null/undefined)
        - Wraps in VStack with flex-end alignment to position content on the right
        - This allows screens to optionally include action buttons without breaking layout
      */}
      {right && (
        <VStack alignItems="flex-end">
          {right}
        </VStack>
      )}
    </HStack>
  );
};

export default TitleHeader;

