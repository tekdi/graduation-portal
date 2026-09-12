import React, { useState, useEffect, useMemo } from 'react';
import { Box, VStack, HStack, Text, Heading, Pressable } from '@gluestack-ui/themed';
import { Container, LucideIcon, Loader } from '@ui';
import { useAuth } from '@contexts/AuthContext';
import { useLanguage } from '@contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import ProjectAsTaskComponent from '../../../project-player/components/ProjectComponent/ProjectAsTaskComponent';
import { ProjectProvider } from '../../../project-player/context/ProjectContext';
import dataService from '../../../services/dataService';
import { ProjectData } from '../../../project-player/types';
import { MODE } from '@constants/PROJECTDATA';
import { theme } from '@config/theme';
import { idpProgressStyles } from './Styles';
import { isWeb } from '@utils/platform';
import { sortTasksWithChildren } from '@utils/helper';

const IdpProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      // The participant's own external/entity ID is stored in externalId or userId on the auth user
      const participantId = (user as any)?.externalId || (user as any)?.userId || user?.id || '';
      const authUserId = user?.id || '';

      if (!participantId || !authUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const detailResult = await dataService.getParticipantDetails(participantId, authUserId);
        const pData = detailResult?.data || null;

        if (pData) {
          const projectId =
            pData?.status === 'NOT_ONBOARDED' && pData?.onBoardedProjectId
              ? pData.onBoardedProjectId
              : pData?.idpProjectId || pData?.onBoardedProjectId || '';

          if (projectId) {
            const response = await dataService.getProject<ProjectData>(
              pData?.id || participantId,
              projectId,
              authUserId,
            );
            if (response?.data) {
              setProjectData(response.data);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch IDP project data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [user]);

  const pillars = useMemo(() => {
    if (!projectData) return [];
    const rawPillars = projectData.children?.length
      ? [...projectData.children]
      : projectData.tasks?.filter((task: any) => task.children?.length || task.tasks?.length) ?? [];
    return sortTasksWithChildren(rawPillars);
  }, [projectData]);

  const handleBackToHome = () => {
    // @ts-ignore
    navigation.navigate('participant-portal');
  };

  return (
    <Box {...idpProgressStyles.page}>
      <Box {...idpProgressStyles.topHeaderBar}>
        <Container {...idpProgressStyles.headerContainer}>
          <HStack {...idpProgressStyles.headerTitleRow}>
            <Pressable
              {...idpProgressStyles.backPressable}
              {...(isWeb && {
                onHoverIn: () => setIsBackHovered(true),
                onHoverOut: () => setIsBackHovered(false),
              })}
              onPress={handleBackToHome}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Box
                {...idpProgressStyles.backIconBox}
                {...(isBackHovered ? idpProgressStyles.backIconBoxHover : {})}
              >
                <LucideIcon
                  name="ArrowLeft"
                  size={16}
                  color={isBackHovered ? theme.tokens.colors.primary500 : '$textDark900'}
                  strokeWidth={1.5}
                />
              </Box>
            </Pressable>
            <Heading {...idpProgressStyles.title}>
              {t('participantJourney.cards.idpProgress')}
            </Heading>
          </HStack>
        </Container>
      </Box>

      <Box {...idpProgressStyles.contentArea}>
        <Container {...idpProgressStyles.container}>
          <VStack {...idpProgressStyles.content}>
            <Text {...idpProgressStyles.subtitle}>
              {t('participantJourney.idpProgressSubtitle')}
            </Text>

            <Box {...idpProgressStyles.idpContent}>
              {isLoading ? (
                <Loader />
              ) : !projectData || pillars.length === 0 ? (
                <Text>{t('projectPlayer.failToLoad')}</Text>
              ) : (
                <ProjectProvider config={MODE.readOnlyMode} initialData={projectData} oldProjectData={null}>
                  <VStack space="md">
                    {pillars.map((pillar: any, index: number) => (
                      <ProjectAsTaskComponent
                        key={pillar._id}
                        task={pillar}
                        parentIndex={index}
                      />
                    ))}
                  </VStack>
                </ProjectProvider>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default IdpProgressScreen;
