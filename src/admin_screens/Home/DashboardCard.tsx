import React from 'react';
import { Box, HStack, Icon, RepeatIcon, Text, VStack } from '@ui';
import { dashboardCardStyles } from './Styles';

const DashboardCard = ({ title, value, change, subText }: any) => (
  <Box {...dashboardCardStyles.container}>
    <VStack {...dashboardCardStyles.contentVStack}>
      <Text {...dashboardCardStyles.titleText}>{title || ''}</Text>
      <Text {...dashboardCardStyles.valueText}>{value || ''}</Text>

      {change ? (
        <HStack {...dashboardCardStyles.changeHStack}>
          <Icon as={RepeatIcon} color="$success600" size="sm" />
          <Text {...dashboardCardStyles.changeText}>{change || ''}</Text>
        </HStack>
      ) : null}

      {subText ? (
        <Text {...dashboardCardStyles.subText}>{subText || ''}</Text>
      ) : null}
    </VStack>
  </Box>
);

export default DashboardCard;
