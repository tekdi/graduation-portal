import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';

const OverallProgramGraduationRate: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.rateCard}>
      <VStack space="md">
        {/* Header */}
        <HStack {...graduationCriteriaStyles.rateHeader}>
          <HStack {...graduationCriteriaStyles.rateHeaderLeft}>
            <LucideIcon name="Info" size={16} color="$textMutedForeground" />
            <Text {...graduationCriteriaStyles.rateTitle}>
              {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.title')}
            </Text>
          </HStack>
          
          {/* Formula on the Right */}
          <Box {...graduationCriteriaStyles.formulaPill}>
            <Text {...graduationCriteriaStyles.formulaText}>
              {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.formula')}
            </Text>
          </Box>
        </HStack>

        {/* Content Body */}
        <HStack {...graduationCriteriaStyles.rateBody}>
          {/* Left stats */}
          <VStack {...graduationCriteriaStyles.rateBodyLeft}>
            <HStack {...graduationCriteriaStyles.rateValueRow}>
              <Text {...graduationCriteriaStyles.rateValue}>85%</Text>
              <Text {...graduationCriteriaStyles.rateSubText}>
                {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.subText')}
              </Text>
            </HStack>
            <Text {...graduationCriteriaStyles.rateDescription}>
              {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.description')}
            </Text>
          </VStack>

          {/* Right metrics */}
          <HStack {...graduationCriteriaStyles.rateBodyRight}>
            {/* Ready Rate Box */}
            <Box {...graduationCriteriaStyles.subMetricBox}>
              <Text {...graduationCriteriaStyles.subMetricLabel}>
                {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.readyRate')}
              </Text>
              <Text {...graduationCriteriaStyles.subMetricValue}>39%</Text>
            </Box>

            {/* Total Exits Box */}
            <Box {...graduationCriteriaStyles.subMetricBox}>
              <Text {...graduationCriteriaStyles.subMetricLabel}>
                {t('requestorDashboard.graduationCriteria.overallProgramGraduationRate.totalExits')}
              </Text>
              <Text {...graduationCriteriaStyles.subMetricValue}>13</Text>
            </Box>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default OverallProgramGraduationRate;
