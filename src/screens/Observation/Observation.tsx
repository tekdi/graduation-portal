import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import { Container, Spinner, useAlert, VStack, Box } from '@ui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '../../services/api';
import {
  getObservationEntities,
  getObservationSolution,
  getObservationSubmissions,
  searchObservationEntities,
  updateObservationEntities,
} from '../../services/solutionService';
import { useLanguage } from '@contexts/LanguageContext';
import Header from './Header';
import offlineStorage from '../../services/offlineStorage';

interface ObservationData {
  entityId: string;
  observationId: string;
}

// Memoize WebComponentPlayer with custom comparison to ignore getProgress prop changes
const WebComponentPlayerMemoized = React.memo(WebComponentPlayer, (prevProps, nextProps) => {
  // Only rerender if playerConfig actually changes (shallow comparison), ignore getProgress changes
  const prevConfig = prevProps.playerConfig;
  const nextConfig = nextProps.playerConfig;
  
  // Compare key properties of playerConfig
  return (
    prevConfig?.baseURL === nextConfig?.baseURL &&
    prevConfig?.fileSizeLimit === nextConfig?.fileSizeLimit &&
    prevConfig?.userAuthToken === nextConfig?.userAuthToken &&
    prevConfig?.solutionType === nextConfig?.solutionType &&
    prevConfig?.observationId === nextConfig?.observationId &&
    prevConfig?.entityId === nextConfig?.entityId &&
    prevConfig?.evidenceCode === nextConfig?.evidenceCode &&
    prevConfig?.index === nextConfig?.index &&
    prevConfig?.submissionNumber === nextConfig?.submissionNumber &&
    prevConfig?.solutionId === nextConfig?.solutionId &&
    prevConfig?.showSaveDraftButton === nextConfig?.showSaveDraftButton &&
    prevConfig?.progressCalculationLevel === nextConfig?.progressCalculationLevel &&
    prevConfig?.mockData === nextConfig?.mockData
  );
});

const Observation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { id, solutionId } = route.params as {
    id: string;
    solutionId: string;
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
  const [mockData, setMockData] = useState<any>({});

  // Use ref to store progress callback to avoid prop changes causing rerenders
  const progressCallbackRef = useRef<(progressValue: number | { data: { percentage: number }; type: string }) => void | undefined>(undefined);

  const fetchObservationSolution = async ({entityId, observationId,submissionNumber,evidenceCode}: {entityId: string; observationId: string; submissionNumber: number; evidenceCode: string}) => {
    try {
      const observationSubmissions = await getObservationSubmissions({
        observationId,
        entityId,
      });
      let observationSolution: any = null;
      if (observationSubmissions.result.length > 0) {
        const submissionId = observationSubmissions.result[0]._id;
        observationSolution = await offlineStorage.read(submissionId, {
          dbName: 'questionnairePlayer',
          storeName: 'questionnaire',
        });
        // submissionNumber = observationSubmissions.result[0].submissionNumber;
      } else {
        // submissionNumber = 1;
      }

      if (!observationSolution) {
        const response = await getObservationSolution({
          observationId,
          entityId,
          submissionNumber,
          evidenceCode,
        });
        observationSolution = response.result;
      }
      setMockData(observationSolution);
      setObservation({
        entityId: entityId,
        observationId: observationId,
      });
    } catch (error) {
      showAlert('error', t('observation.noParticipantFoundError') + error, {
        duration: 10000,
      });
    }
  };
  
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
          fetchObservationSolution({
            entityId: newData._id,
            observationId: observationId,
            submissionNumber: 1,
            evidenceCode: 'OB',
          });
          // Set participant info
          setParticipantInfo({
            name: newData.name || 'Participant',
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
              if (data) {
                fetchObservationSolution({
                  entityId: entityData._id,
                  observationId: observationId,
                  submissionNumber: 1,
                  evidenceCode: 'OB',
                });
                // Set participant info
                setParticipantInfo({
                  name: entityData.name || 'Participant',
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
      // setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionId, id]);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: Navigate to participant detail if there's no previous screen
      // @ts-ignore
      navigation.navigate('participant-detail', { id });
    }
  }, [navigation, id]);

  // Update ref whenever callback changes
  useEffect(() => {
    progressCallbackRef.current = (
      progressValue: number | { data: { percentage: number }; type: string },
    ) => {
      if (typeof progressValue === 'number') {
        setProgress(Math.round(progressValue));
      } else {
        setProgress(Math.round(progressValue?.data?.percentage || 0));
      }
    };
  }, []);

  // Stable callback that uses ref - this won't change between renders
  const handleProgressUpdate = useCallback(
    (
      progressValue: number | { data: { percentage: number }; type: string },
    ) => {
      progressCallbackRef.current?.(progressValue);
    },
    [],
  );

  // Memoize playerConfig to prevent WebComponentPlayer rerenders
  const playerConfigMemoized = useMemo(
    () => ({
      // @ts-ignore - process.env is injected by webpack DefinePlugin on web
      baseURL: `${process.env.API_BASE_URL}/api`,
      fileSizeLimit: 50,
      userAuthToken: token,
      solutionType: 'observation' as const,
      observationId: observation?.observationId,
      entityId: observation?.entityId,
      evidenceCode: 'OB',
      index: 0,
      submissionNumber: 1,
      solutionId: observation?.observationId,
      showSaveDraftButton: true,
      progressCalculationLevel: 'input' as const,
      mockData: mockData,
    }),
    [token, observation?.observationId, observation?.entityId, mockData],
  );

  if (loading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary500" />
      </VStack>
    );
  }
  
  return (
    <VStack flex={1} backgroundColor="$accent100">
      {/* Header Section */}
      <Header
        title={mockData?.solution?.name || ''}
        progress={progress}
        participantInfo={participantInfo}
        onBackPress={handleBackPress}
      />

      <Container>
        {/* Web Component Player */}
        <Box flex={1} marginTop="$4">
          {mockData && (
            <WebComponentPlayerMemoized
              getProgress={handleProgressUpdate}
              playerConfig={playerConfigMemoized}
            />
          )}
        </Box>
      </Container>
    </VStack>
  );
};

export default Observation;
