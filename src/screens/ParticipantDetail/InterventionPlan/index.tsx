import React, { useState, useMemo } from 'react';
import { Box, VStack, Text, Button, ButtonText } from '@ui';
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
      const baseConfig = isEditMode
        ? PROJECT_PLAYER_CONFIGS.editMode
        : PROJECT_PLAYER_CONFIGS.previewMode;

      // Add submit button config for ENROLLED status in preview mode
      if (!isEditMode) {
        return {
          ...baseConfig,
          showSubmitButton: true,
          onSubmitInterventionPlan: () => setIsEditMode(true),
        };
      }

      return baseConfig;
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
      data: COMPLEX_PROJECT_DATA,
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
      <ProjectPlayer config={config} data={projectPlayerData} />
    </Box>
  );
};

export default InterventionPlan;
