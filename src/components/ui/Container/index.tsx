import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { theme } from '@config/theme';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  const containerSizes = theme.tokens.sizes.container;
  
  return (
    <Box
      px="$4"                     // padding like container padding
      w="100%"                    // full width
      maxWidth={containerSizes[0]}             // mobile: 100%
      $sm-maxWidth={containerSizes.sm}        // sm: 540px
      $md-maxWidth={containerSizes.md}        // md: 720px
      $lg-maxWidth={containerSizes.lg}        // lg: 960px
      $xl-maxWidth={containerSizes.xl}       // xl: 1280px
      $2xl-maxWidth={containerSizes['2xl']}      // 2xl: 1320px
      mx="auto"                   // center align horizontally
    >
      {children}
    </Box>
  );
};

export default Container;

