import React, { useEffect, useState } from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import { Container, Spinner, useAlert } from '@ui';
import { useRoute } from '@react-navigation/native';
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
  const { t } = useLanguage();
  const { id, solutionId } = route.params as {
    id: string;
    solutionId: string;
  };
  const [observation, setObservation] = useState<ObservationData | null>(null);
  const [loading, setLoading] = useState(true);
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
      const observationId = observationData.result._id;
      if (
        observationData.result?.entityType === 'participant' &&
        observationData.result?.entities.length > 0
      ) {
        const newData = observationData.result.entities.find(
          (entity: any) => entity.externalId === id,
        );
        if (newData) {
          setObservation({
            entityId: newData._id,
            observationId: observationId,
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
  }, [solutionId, id]);

  const getProgress = (progress: number) => {
    console.log('getProgress', progress);
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
    <Container>
      <WebComponentPlayer
        getProgress={getProgress}
        playerConfig={{
          baseURL: `${process.env.API_BASE_URL}/api`,
          fileSizeLimit: 50,
          userAuthToken: token,
          solutionType: 'observation',
          // profileData: {
          //   state: '6852c86c7248c20014b38a4d',
          //   district: '6852c8ae7248c20014b38a57',
          //   block: '6852c8de7248c20014b38a9d',
          //   cluster: '6852c9027248c20014b38c34',
          //   school: '6852c9237248c20014b39fa0',
          //   professional_role: '6825939a97b5680013e6a166',
          //   professional_subroles: '68259c4397b5680013e6a1fb',
          //   organizations: '[object Object]',
          // },
          observationId: observation?.observationId,
          entityId: observation?.entityId,
          evidenceCode: 'OB',
          index: 0,
          submissionNumber: 1,
          solutionId: observation?.observationId,
          // mockData: mockData,
        }}
      />
    </Container>
  );
};

export default Observation;
