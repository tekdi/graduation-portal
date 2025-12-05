// src/components/MyButton.tsx
import React from 'react';
import { Pressable, Text } from '@ui';

export const MyButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable bg="$primary500" px="$4" py="$2" rounded="$md" onPress={onPress}>
      <Text color="white">{label}</Text>
    </Pressable>
  );
};
