import React from 'react';
import { View } from 'react-native';
import { StatCardContainer, StatTitle, StatCount, StatSubLabel, StatsRowContainer } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

interface StatCardProps {
  title: string; // Can be a translation key or plain text
  count: number | string;
  subLabel: string; // Can be a translation key or plain text
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  count, 
  subLabel,
  color = '$textForeground' 
}) => {
  const { t } = useLanguage();
  
  return (
    <StatCardContainer>
      <StatTitle>{t(title)}</StatTitle>
      <View>
         <StatCount style={{ color }}>{count}</StatCount>
         <StatSubLabel>{t(subLabel)}</StatSubLabel>
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