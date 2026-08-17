import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../styles';

const EXIT_DATA = [
  { labelKey: 'requestorDashboard.graduationCriteria.programExit.graduated', value: 85, display: '85% (11 participants)', color: '#22C55E' },
  { labelKey: 'requestorDashboard.graduationCriteria.programExit.failedToGraduate', value: 0, display: '0% (0 participants)', color: '#EF4444' },
  { labelKey: 'requestorDashboard.graduationCriteria.programExit.droppedOff', value: 15, display: '15% (2 participants)', color: '#9CA3AF' },
];

const ProgramExitDistribution: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.programExitCard}>
      <VStack space="xs">
        <Text
          fontSize={16}
          fontWeight="$semibold"
          color="$textForeground"
        >
          {t('requestorDashboard.graduationCriteria.programExit.title')}
        </Text>
        <Text
          fontSize={12}
          color="$textMutedForeground"
          mb="$4"
        >
          {t('requestorDashboard.graduationCriteria.programExit.description')}
        </Text>
      </VStack>

      <VStack space="none" flex={1}>
        {EXIT_DATA.map((item) => (
          <Box key={item.labelKey} {...graduationCriteriaStyles.exitProgressRow}>
            <HStack {...graduationCriteriaStyles.exitProgressLabel}>
              <HStack alignItems="center" space="xs">
                <Box
                  width={10}
                  height={10}
                  borderRadius={999}
                  bg={item.color as any}
                />
                <Text {...graduationCriteriaStyles.exitProgressLabelText}>
                  {t(item.labelKey)}
                </Text>
              </HStack>
              <Text {...graduationCriteriaStyles.exitProgressValueText}>
                {item.display}
              </Text>
            </HStack>
            <Progress
              value={item.value}
              w="$full"
              h="$2"
              bg="$backgroundLight100"
              borderRadius="$full"
            >
              <ProgressFilledTrack
                bg={item.color as any}
                borderRadius="$full"
              />
            </Progress>
          </Box>
        ))}

        {/* Total Program Exits footer */}
        <HStack {...graduationCriteriaStyles.exitTotalBox}>
          <VStack space="none">
            <Text {...graduationCriteriaStyles.exitTotalLabel}>
              {t('requestorDashboard.graduationCriteria.programExit.totalProgramExits')}
            </Text>
            <Text {...graduationCriteriaStyles.exitTotalFormula}>
              {t('requestorDashboard.graduationCriteria.programExit.formula')}
            </Text>
            <Text {...graduationCriteriaStyles.exitTotalRate}>
              {t('requestorDashboard.graduationCriteria.programExit.overallRate')}
            </Text>
          </VStack>
          <Text fontSize={22} fontWeight="$bold" color="$textForeground">
            {t('requestorDashboard.graduationCriteria.programExit.totalValue')}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProgramExitDistribution;
