import React from 'react';
import { Box, Text } from '@ui';
import { theme } from '@config/theme';
import { STATUS } from '@constants/app.constant';

export interface StatusBadgeColors {
  bg: string;
  text: string;
  border: string;
}

/**
 * Get status colors based on status value
 * Returns color configuration for background, text, and border
 */
export const getStatusColors = (statusValue: string): StatusBadgeColors => {
  switch (statusValue) {
    case STATUS.NOT_ENROLLED:
      return {
        bg: theme.tokens.colors.gray100,
        text: theme.tokens.colors.gray700,
        border: theme.tokens.colors.gray300,
      };
    case STATUS.ENROLLED:
      return {
        bg: theme.tokens.colors.purple100,
        text: theme.tokens.colors.purple700,
        border: theme.tokens.colors.purple300,
      };
    case STATUS.IN_PROGRESS:
      return {
        bg: theme.tokens.colors.blue100, // TODO: Change to blue100
        text: theme.tokens.colors.blue700,
        border: theme.tokens.colors.blue300, // TODO: Change to blue100
      };
    case STATUS.COMPLETED:
      return {
        bg: theme.tokens.colors.success100,
        text: theme.tokens.colors.success700,
        border: theme.tokens.colors.success300,
      };
    case STATUS.GRADUATED:
      return {
        bg: theme.tokens.colors.success100,
        text: theme.tokens.colors.success700,
        border: theme.tokens.colors.success300,
      };
    case STATUS.DROPOUT:
      return {
        bg: theme.tokens.colors.error100,
        text: theme.tokens.colors.error600,
        border: theme.tokens.colors.error300,
      };
    default:
      return {
        bg: theme.tokens.colors.gray100,
        text: theme.tokens.colors.gray700,
        border: theme.tokens.colors.gray300,
      };
  }
};

/**
 * Status Badge Component for Participants Table
 * Color-coded badge that changes based on status
 */
export const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  if (!status) return null;

  const colors = getStatusColors(status);
  
  return (
    <Box
      bg={colors.bg}
      borderWidth={1}
      borderColor={colors.border}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$full"
      alignSelf="flex-start"
      flexShrink={0}
    >
      <Text
        fontSize="$xs"
        fontWeight="$medium"
        color={colors.text}
        numberOfLines={1}
      >
        {status}
      </Text>
    </Box>
  );
};

