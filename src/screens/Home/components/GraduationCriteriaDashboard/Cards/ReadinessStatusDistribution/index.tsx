import React from 'react';
import { Box, HStack, VStack, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import SimplePieChart from '@components/charts/SimplePieChart';
import { graduationCriteriaStyles } from '../../styles';

const PIE_DATA = [
  { label: 'Ready to Graduate', value: 39, color: '#7B1D3A' },
  { label: 'Near Ready', value: 17, color: '#F59E0B' },
  { label: 'Not Ready', value: 44, color: '#EF4444' },
];

const READINESS_TIERS = [
  {
    tierKey: 'requestorDashboard.graduationCriteria.readinessStatus.readyToGraduateTier',
    countKey: 'requestorDashboard.graduationCriteria.readinessStatus.readyToGraduateCount',
    color: '#7B1D3A',
  },
  {
    tierKey: 'requestorDashboard.graduationCriteria.readinessStatus.nearReadyTier',
    countKey: 'requestorDashboard.graduationCriteria.readinessStatus.nearReadyCount',
    color: '#F59E0B',
  },
  {
    tierKey: 'requestorDashboard.graduationCriteria.readinessStatus.notReadyTier',
    countKey: 'requestorDashboard.graduationCriteria.readinessStatus.notReadyCount',
    color: '#EF4444',
  },
];

const ReadinessStatusDistribution: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.readinessStatusCard}>
      {/* Card title + description */}
      <VStack space="xs" mb="$4">
        <Text fontSize={16} fontWeight="$semibold" color="$textForeground">
          {t('requestorDashboard.graduationCriteria.readinessStatus.title')}
        </Text>
        <Text fontSize={12} color="$textMutedForeground">
          {t('requestorDashboard.graduationCriteria.readinessStatus.description')}
        </Text>
      </VStack>

      {/* Body: pie chart left, detail boxes right */}
      <HStack alignItems="center" space="md" flex={1}>
        {/* Left: compact donut chart */}
        <Box width={140} flexShrink={0}>
          <SimplePieChart
            data={PIE_DATA}
            variant="donut"
            showLabels={false}
            showLegend={false}
          />
        </Box>

        {/* Right: 3 grey tier boxes */}
        <VStack space="sm" flex={1}>
          {READINESS_TIERS.map((tier) => (
            <Box
              key={tier.tierKey}
              bg="$backgroundLight50"
              borderRadius={10}
              px="$3"
              py="$2.5"
            >
              <HStack alignItems="center" space="xs" mb="$0.5">
                <Box
                  width={8}
                  height={8}
                  borderRadius={999}
                  bg={tier.color as any}
                  flexShrink={0}
                />
                <Text
                  fontSize={13}
                  fontWeight="$semibold"
                  color="$textForeground"
                  flexShrink={1}
                >
                  {t(tier.tierKey)}
                </Text>
              </HStack>
              <Text fontSize={12} color={tier.color as any} ml="$4">
                {t(tier.countKey)}
              </Text>
            </Box>
          ))}
        </VStack>
      </HStack>
    </Box>
  );
};

export default ReadinessStatusDistribution;

