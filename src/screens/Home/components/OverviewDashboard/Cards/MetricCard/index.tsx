import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { metricCardStyles } from './Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
}

const getIconBgColor = (color: string) => {
  switch (color) {
    case '$primary500':
      return '$primary100';
    case '$info100':
      return '$blue50';
    case '$success600':
      return '$success100';
    case '$blue500':
      return '$blue100';
    default:
      return `${color}20`;
  }
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconColor = '$primary500',
}) => {
  return (
    <Box {...metricCardStyles.container}>
      <HStack {...metricCardStyles.content}>
        {icon && (
          <Box {...metricCardStyles.iconContainer} bg={getIconBgColor(iconColor)}>
            <LucideIcon name={icon} size={20} color={iconColor} />
          </Box>
        )}
        <VStack {...metricCardStyles.textContainer}>
          <Text {...metricCardStyles.titletext} color="$textSecondary">
            {title}
          </Text>
          <Text {...metricCardStyles.valueText}>{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MetricCard;

