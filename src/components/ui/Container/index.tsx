import React from 'react';
import { Box } from '@ui';

interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Bootstrap-like responsive container with fixed max-width
 * Uses responsive breakpoints: mobile (100%), sm (540px), md (720px), lg (960px), xl (1140px), 2xl (1320px)
 */
export function Container({ children }: ContainerProps) {
  return (
    <Box
      px="$4"                     // padding like container padding
      w="100%"                    // full width
      maxWidth="100%"             // mobile: 100%
      $sm-maxWidth="540px"        // sm: 540px
      $md-maxWidth="720px"        // md: 720px
      $lg-maxWidth="960px"        // lg: 960px
      $xl-maxWidth="1280px"       // xl: 1140px
      $2xl-maxWidth="1320px"      // 2xl: 1320px
      mx="auto"                   // center align horizontally
    >
      {children}
    </Box>
  );
}

