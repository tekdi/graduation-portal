import React from 'react';
import { VStack, Text, Box } from '@ui';
import { participantHeaderStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';

interface InProgressCardProps {
  graduationProgress?: number;
}

/**
 * InProgressCard Component
 * Shows graduation readiness progress with percentage and progress bar.
 */
const InProgressCard: React.FC<InProgressCardProps> = ({
  graduationProgress,
}) => {
  const { t } = useLanguage();
  const progress = graduationProgress ?? 57;

  return (
    <Box
      {...participantHeaderStyles.progressCard}
      // @ts-ignore - Web-specific props not in Gluestack UI types
      $web-boxShadow={participantHeaderStyles.progressCardBoxShadow}
      $web-backgroundImage={participantHeaderStyles.progressCardBackgroundImage}
    >
      <Text {...participantHeaderStyles.progressCardTitle}>
        {t('participantDetail.header.graduationReadiness')}
      </Text>
      <VStack
        {...participantHeaderStyles.progressCardContent}
        $md-flexDirection="row"
        $md-justifyContent="space-between"
        $md-alignItems="center"
        space="sm"
      >
        <Text {...participantHeaderStyles.progressPercentage}>
          {progress}%
        </Text>
        <Box
          {...participantHeaderStyles.progressBarContainer}
          $md-width="auto"
        >
          <Box {...participantHeaderStyles.progressBarBackground}>
            <Box
              {...participantHeaderStyles.progressBarFill}
              width={`${progress}%`}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default InProgressCard;

