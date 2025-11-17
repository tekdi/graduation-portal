import { styled } from '@gluestack-style/react';
import { View, Text } from 'react-native';

// Container for the stats row
export const StatsRowContainer = styled(View, {
  flexDirection: 'row',
  flexWrap: 'wrap',
 // marginVertical: 16,
  marginHorizontal: -8,
});

// Individual stat card container
export const StatCardContainer = styled(View, {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: 12,
  padding: '$6',
  borderWidth: 1,
  borderColor: '#E2E8F0',
  minWidth: 150,
  marginHorizontal: 8,
  marginBottom: 16,
  gap:'$6',
});

export const StatTitle = styled(Text, {
  fontSize: '$sm',
  color: '$textForeground',
  fontWeight: '$medium',
  marginBottom: 8,
});

export const StatCount = styled(Text, {
  fontSize: 24,
  fontWeight: '$normal',
  marginBottom: 4,
});

export const StatSubLabel = styled(Text, {
  fontSize: '$xs',
  color: '$textMutedForeground',
});