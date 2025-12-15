import React, { useState, useMemo } from 'react';
import { Box, VStack, Text, Button, ButtonText, HStack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { interventionPlanStyles } from './Styles';
import ProjectPlayer, {
  ProjectPlayerData,
  ProjectPlayerConfig,
} from '../../../project-player/index';
import {
  COMPLEX_PROJECT_DATA,
  PROJECT_PLAYER_CONFIGS,
} from '@constants/PROJECTDATA';
import { STATUS } from '@constants/app.constant';
import type { InterventionPlanProps } from '../../../types/screens';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';

const InterventionPlan: React.FC<InterventionPlanProps> = ({
  participantStatus,
}) => {
  const { t } = useLanguage();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Memoize ProjectPlayer config based on status and edit mode
  const config: ProjectPlayerConfig = useMemo(() => {
    // Handle undefined participantStatus
    if (!participantStatus) {
      return PROJECT_PLAYER_CONFIGS.previewMode;
    }

    // Store in const to ensure TypeScript knows it's defined
    const status = participantStatus;

    // ENROLLED status: use editMode if isEditMode is true, otherwise previewMode
    if (status === STATUS.ENROLLED) {
      return isEditMode
        ? PROJECT_PLAYER_CONFIGS.editMode
        : PROJECT_PLAYER_CONFIGS.previewMode;
    }

    // Map other statuses to their respective configs
    const statusConfigMap: Record<string, ProjectPlayerConfig> = {
      [STATUS.IN_PROGRESS]: PROJECT_PLAYER_CONFIGS.editMode,
      [STATUS.COMPLETED]: PROJECT_PLAYER_CONFIGS.editMode,
      [STATUS.DROPOUT]: PROJECT_PLAYER_CONFIGS.readOnlyMode,
    };

    return statusConfigMap[status] || PROJECT_PLAYER_CONFIGS.previewMode;
  }, [participantStatus, isEditMode]);

  // Memoize ProjectPlayer data - all statuses use COMPLEX_PROJECT_DATA
  const projectPlayerData: ProjectPlayerData = useMemo(
    () => ({
      solutionId: config.solutionId,
      projectId: config.projectId,
      localData: COMPLEX_PROJECT_DATA,
    }),
    [config.solutionId, config.projectId],
  );

  // Show empty state for ENROLLED status when player is not shown yet
  if (participantStatus === STATUS.ENROLLED && !showPlayer) {
    return (
      <Box {...interventionPlanStyles.container}>
        <VStack {...interventionPlanStyles.content}>
          <Box {...interventionPlanStyles.iconContainer}>
            <LucideIcon
              name="FileText"
              size={48}
              color={interventionPlanStyles.iconColor}
            />
          </Box>
          <Text {...interventionPlanStyles.title}>
            {t('participantDetail.interventionPlan.noPlanAssigned')}
          </Text>
          <Text {...interventionPlanStyles.description}>
            {t('participantDetail.interventionPlan.noPlanDescription')}
          </Text>
          <Button
            {...interventionPlanStyles.button}
            onPress={() => setShowPlayer(true)}
          >
            <ButtonText {...interventionPlanStyles.buttonText}>
              {t('participantDetail.interventionPlan.developPlan')}
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  // Single ProjectPlayer render point for all statuses
  return (
    <Box flex={1}>
      <VStack flex={1}>
        <Box flex={1}>
          <ProjectPlayer config={config} data={projectPlayerData} />
        </Box>

        {/* Submit Intervention Plan Button - Only show for ENROLLED status in preview mode */}
        {participantStatus === STATUS.ENROLLED && !isEditMode && (
          <Box
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderLight300"
            bg="$backgroundPrimary.light"
          >
            <HStack justifyContent="flex-end" width="$full">
              <Button
                bg="$primary500"
                borderRadius="$md"
                paddingHorizontal="$6"
                paddingVertical="$3"
                onPress={() => setIsEditMode(true)}
                $hover-bg="$primary600"
                $web-cursor="pointer"
              >
                <ButtonText
                  color="$backgroundPrimary.light"
                  {...TYPOGRAPHY.button}
                  fontWeight="$semibold"
                >
                  {t(
                    'participantDetail.interventionPlan.submitInterventionPlan',
                  )}
                </ButtonText>
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default InterventionPlan;
