import React from 'react';
import { HStack as GluestackHStack } from '@gluestack-ui/themed';
import { ViewProps } from 'react-native';

export default function HStack({ children, ...props }: ViewProps) {
  return <GluestackHStack {...props}>{children}</GluestackHStack>;
}
