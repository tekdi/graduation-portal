import React from 'react';
import { Box, VStack, HStack, Text } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import SimpleMultiLineChart from '@components/charts/SimpleMultiLineChart';
import { graduationCriteriaStyles } from '../../styles';

const TIMELINE_SERIES = [
  {
    id: 'graduated',
    label: 'Graduated',
    color: '#7B1D3A',
    data: [
      { x: 'Jan', y: 76 },
      { x: 'Feb', y: 74 },
      { x: 'Mar', y: 74 },
      { x: 'Apr', y: 75 },
      { x: 'May', y: 76 },
      { x: 'Jun', y: 85 },
    ],
  },
  {
    id: 'failedToGraduate',
    label: 'Failed to Graduate',
    color: '#EF4444',
    dashArray: '4 4',
    data: [
      { x: 'Jan', y: 8 },
      { x: 'Feb', y: 9 },
      { x: 'Mar', y: 11 },
      { x: 'Apr', y: 9 },
      { x: 'May', y: 8 },
      { x: 'Jun', y: 0 },
    ],
  },
  {
    id: 'droppedOff',
    label: 'Dropped Off',
    color: '#9CA3AF',
    dashArray: '2 2',
    data: [
      { x: 'Jan', y: 16 },
      { x: 'Feb', y: 17 },
      { x: 'Mar', y: 12 },
      { x: 'Apr', y: 16 },
      { x: 'May', y: 16 },
      { x: 'Jun', y: 15 },
    ],
  },
];

const GraduationRateTimeline: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box {...graduationCriteriaStyles.graduationRateTimelineCard}>
      <HStack {...graduationCriteriaStyles.timelineHeaderRow}>
        <VStack space="xs" flex={1}>
          <Text
            fontSize={16}
            fontWeight="$semibold"
            color="$textForeground"
          >
            {t('requestorDashboard.graduationCriteria.timeline.title')}
          </Text>
          <Text
            fontSize={12}
            color="$textMutedForeground"
          >
            {t('requestorDashboard.graduationCriteria.timeline.description')}
          </Text>
        </VStack>
        <Text
          fontSize={11}
          color="$textMutedForeground"
          mt="$1"
        >
          {t('requestorDashboard.graduationCriteria.timeline.countsInPercent')}
        </Text>
      </HStack>

      <Box {...graduationCriteriaStyles.timelineChart}>
        <SimpleMultiLineChart
          series={TIMELINE_SERIES}
          height={280}
          yMin={0}
          yMax={100}
        />
      </Box>
    </Box>
  );
};

export default GraduationRateTimeline;
