import React from 'react';
import { VStack as GluestackVStack } from '@gluestack-ui/themed';
import { ViewProps } from 'react-native';

export default function VStack({ children, ...props }: ViewProps) {
  return <GluestackVStack {...props}>{children}</GluestackVStack>;
}
