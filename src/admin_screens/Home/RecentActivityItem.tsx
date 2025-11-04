import React from 'react';
import {
  CheckCircleIcon,
  HStack,
  Icon,
  InfoIcon,
  Text,
  VStack,
  Badge,
} from '@ui';
import { recentActivityItemStyles } from './Styles';

const RecentActivityItem = ({ title, subtitle, status }: any) => {
  const statusMap: Record<
    string,
    { icon: typeof CheckCircleIcon; color: string }
  > = {
    success: { icon: CheckCircleIcon, color: '$success600' },
    info: { icon: InfoIcon, color: '$info600' },
    warning: { icon: InfoIcon, color: '$warning600' },
  };
  const { icon, color } =
    statusMap[status as keyof typeof statusMap] || statusMap.info;

  return (
    <HStack {...recentActivityItemStyles.container}>
      <HStack {...recentActivityItemStyles.leftHStack}>
        <Icon as={icon} color={color} size="md" />
        <VStack {...recentActivityItemStyles.contentVStack}>
          <Text {...recentActivityItemStyles.itemTitle}>{title || ''}</Text>
          <Text {...recentActivityItemStyles.itemSubtitle}>
            {subtitle || ''}
          </Text>
        </VStack>
      </HStack>
      <Badge {...recentActivityItemStyles.badge} action={status}>
        <Text>{status?.charAt(0).toUpperCase() + status?.slice(1) || ''}</Text>
      </Badge>
    </HStack>
  );
};

export default RecentActivityItem;
