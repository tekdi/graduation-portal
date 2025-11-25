import React from 'react';
import { View } from 'react-native';
import { StatCardContainer, StatTitle, StatCount, StatSubLabel, StatsRowContainer } from './Styles';

interface StatCardProps {
  title: string;
  count: number | string;
  subLabel: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  count, 
  subLabel,
  color = '$textForeground' 
}) => {
  return (
    <StatCardContainer>
      <StatTitle>{title}</StatTitle>
      <View>
         <StatCount style={{ color }}>{count}</StatCount>
         <StatSubLabel>{subLabel}</StatSubLabel>
      </View>
     
    </StatCardContainer>
  );
};

// Container component for the stats row
const StatsRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StatsRowContainer>{children}</StatsRowContainer>;
};

export { StatsRow };
export default StatCard;