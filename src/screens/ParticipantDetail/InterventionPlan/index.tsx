import React, { useState } from 'react';
import { Box, VStack, Text, Button, ButtonText, HStack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon } from '@ui';
import { interventionPlanStyles } from './Styles';
import ProjectPlayer, {
  ProjectPlayerData,
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

  // Determine ProjectPlayer config and data based on participant status and edit mode
  let configData;
  let projectData;

  // If ENROLLED and edit mode is triggered, use editMode config
  if (participantStatus === STATUS.ENROLLED && isEditMode) {
    configData = PROJECT_PLAYER_CONFIGS.editMode;
    projectData = COMPLEX_PROJECT_DATA;
  } else {
    switch (participantStatus) {
      case STATUS.ENROLLED:
        configData = PROJECT_PLAYER_CONFIGS.previewMode;
        projectData = COMPLEX_PROJECT_DATA;
        break;
      case STATUS.IN_PROGRESS:
        configData = PROJECT_PLAYER_CONFIGS.editMode;
        projectData = COMPLEX_PROJECT_DATA;
        break;
      case STATUS.COMPLETED:
        configData = PROJECT_PLAYER_CONFIGS.editMode;
        projectData = COMPLEX_PROJECT_DATA;
        break;
      case STATUS.DROPOUT:
        configData = PROJECT_PLAYER_CONFIGS.readOnlyMode;
        projectData = COMPLEX_PROJECT_DATA;
        break;
      default:
        // Default to preview mode if status is unknown
        configData = PROJECT_PLAYER_CONFIGS.previewMode;
        projectData = COMPLEX_PROJECT_DATA;
    }
  }

  const ProjectPlayerConfigData: ProjectPlayerData = {
    solutionId: configData.solutionId,
    projectId: 'projectId' in configData ? configData.projectId : undefined,
    localData: projectData,
  };

  // For IN_PROGRESS: Show empty state with button, then ProjectPlayer on click
  if (participantStatus === STATUS.ENROLLED && !showPlayer) {
    return (
      <Box {...interventionPlanStyles.container}>
        <VStack {...interventionPlanStyles.content}>
          {/* Icon */}
          <Box {...interventionPlanStyles.iconContainer}>
            <LucideIcon
              name="FileText"
              size={48}
              color={interventionPlanStyles.iconColor}
            />
          </Box>

          {/* Title */}
          <Text {...interventionPlanStyles.title}>
            {t('participantDetail.interventionPlan.noPlanAssigned')}
          </Text>

          {/* Description */}
          <Text {...interventionPlanStyles.description}>
            {t('participantDetail.interventionPlan.noPlanDescription')}
          </Text>

          {/* Action Button */}
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

  if (participantStatus === STATUS.ENROLLED) {
    return (
      <Box flex={1}>
        <VStack flex={1}>
          <Box flex={1}>
            <ProjectPlayer config={configData} data={ProjectPlayerConfigData} />
          </Box>

          {/* Submit Intervention Plan Button - Only show in preview mode */}
          {!isEditMode && (
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
  }

  // For other statuses: Show ProjectPlayer directly
  return (
    <Box flex={1}>
      <ProjectPlayer config={configData} data={ProjectPlayerConfigData} />
    </Box>
  );
};

export default InterventionPlan;
