import React, { useEffect, useState } from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import {
  Container,
  Spinner,
  useAlert,
  HStack,
  VStack,
  Text,
  Box,
  Pressable,
  Progress,
  ProgressFilledTrack,
  LucideIcon,
} from '@ui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '../../services/api';
import {
  getObservationEntities,
  searchObservationEntities,
  updateObservationEntities,
} from '../../services/solutionService';
import { isWeb } from '@utils/platform';
import { useLanguage } from '@contexts/LanguageContext';

interface ObservationData {
  entityId: string;
  observationId: string;
}

const Observation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { id, solutionId, participantName } = route.params as {
    id: string;
    solutionId: string;
    participantName?: string;
  };
  const [observation, setObservation] = useState<ObservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [participantInfo, setParticipantInfo] = useState<{
    name: string;
    date: string;
  } | null>(null);
  const { showAlert } = useAlert();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchObservation = async () => {
      const tokenData = await getToken();
      setToken(tokenData);
      const observationData = await getObservationEntities({
        solutionId,
        profileData: {},
      });
      const observationId = observationData?.result?._id;
      if (
        observationData.result?.entityType === 'participant' &&
        Array.isArray(observationData.result?.entities)
      ) {
        const newData = observationData.result.entities.find(
          (entity: any) => entity.externalId === id,
        );
        if (newData) {
          setObservation({
            entityId: newData._id,
            observationId: observationId,
          });
          // Set participant info
          setParticipantInfo({
            name: newData.name || participantName || 'Participant',
            date: new Date().toISOString().split('T')[0],
          });
          setLoading(false);
        } else if (observationId) {
          const entitiesData = await searchObservationEntities({
            observationId: observationId,
            // search: "sagar",
          });
          const entityData = entitiesData.result?.[0]?.data.find(
            (entity: any) => entity.externalId === id,
          );
          if (entityData) {
            try {
              const data = await updateObservationEntities({
                observationId,
                data: [entityData._id],
              });
              console.log('data', data);
              if (data) {
                setObservation({
                  entityId: entityData._id,
                  observationId: observationId,
                });
                // Set participant info
                setParticipantInfo({
                  name: entityData.name || participantName || 'Participant',
                  date: new Date().toISOString().split('T')[0],
                });
                setLoading(false);
              }
            } catch (error) {
              showAlert(
                'error',
                t('observation.noParticipantFoundError') + error,
                {
                  duration: 10000,
                },
              );
            }
          }
        } else {
          showAlert('error', t('observation.noParticipantFound'));
        }
      } else {
        showAlert('error', t('observation.noParticipantFound'));
      }
    };
    if (solutionId && id) {
      fetchObservation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionId, id, participantName]);

  const handleBackPress = () => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: Navigate to participant detail if there's no previous screen
      // @ts-ignore
      navigation.navigate('participant-detail', { id: route.params?.id });
    }
  };

  const handleProgressUpdate = (progressValue: number) => {
    setProgress(Math.round(progressValue));
  };

  if (loading) {
    return (
      <Spinner
        height={isWeb ? '$calc(100vh - 68px)' : '$full'}
        size="large"
        color="$primary500"
      />
    );
  }

  return (
      <VStack flex={1} backgroundColor="$accent100">
        {/* Header Section */}
        <VStack space="md" padding="$4" backgroundColor="$white">
          {/* Top Row: Back Button and Action Buttons */}
          <HStack
            justifyContent="space-between"
            alignItems="flex-start"
            width="$full"
          >
            {/* Back Button */}
            <Pressable onPress={handleBackPress}>
              <HStack alignItems="center" space="xs">
                <LucideIcon
                  name="ArrowLeft"
                  size={20}
                  color={theme.tokens.colors.textForeground}
                />
                {t('common.back')}
              </HStack>
            </Pressable>
          </HStack>

          {/* Title and Progress Badge Row */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            width="$full"
            marginTop="$2"
          >
            <Text
              fontSize="$xl"
              fontWeight="$semibold"
              color="$textPrimary"
              flex={1}
            >
              {t('logVisit.individualEnterpriseVisit.title')}
            </Text>

            {/* Progress Badge */}
            <Box
              backgroundColor="$gray100"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$full"
            >
              <Text fontSize="$sm" color="$gray700" fontWeight="$medium">
                {progress}% {t('common.complete') || 'Complete'}
              </Text>
            </Box>
          </HStack>

          {/* Progress Bar */}
          <Box width="$full" marginTop="$2">
            <Progress value={progress} width="$full" size="md">
              <ProgressFilledTrack backgroundColor="$blue600" />
            </Progress>
          </Box>

          {/* Participant Name and Date */}
          {participantInfo && (
            <Text
              fontSize="$sm"
              color="$textSecondary"
              marginTop="$2"
            >
              {participantInfo.name} • {participantInfo.date}
            </Text>
          )}
        </VStack>
    <Container>

        {/* Web Component Player */}
        <Box flex={1} marginTop="$4">
          <WebComponentPlayer
            getProgress={handleProgressUpdate}
            playerConfig={{
              // @ts-ignore - process.env is injected by webpack DefinePlugin on web
              baseURL: `${process.env.API_BASE_URL}/api`,
              fileSizeLimit: 50,
              userAuthToken: token,
              solutionType: 'observation',
              observationId: observation?.observationId,
              entityId: observation?.entityId,
              evidenceCode: 'OB',
              index: 0,
              submissionNumber: 1,
              solutionId: observation?.observationId,
              showSaveDraftButton: true,
              onProgress: handleProgressUpdate,
            }}
          />
        </Box>
    </Container>
    </VStack>
  );
};

export default Observation;
