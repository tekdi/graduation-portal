import React from 'react';
import WebComponentPlayer from '@components/WebComponent/WebComponentPlayer';
import { Container } from '@ui';
import mockData  from '@constants/mockData';
import { useRoute } from '@react-navigation/native';

const Observation = () => {
    const route = useRoute();    
    const getProgress = (progress: number) => {
      console.log('getProgress', progress);
    };
  return (
    <Container>
      <WebComponentPlayer
        getProgress={getProgress}
        playerConfig={{
          baseURL: process.env.ELEVATE_API_URL || 'https://qa.elevate-apis.shikshalokam.org',
          fileSizeLimit: 50,
          userAuthToken:
            localStorage.getItem('accToken'),
          solutionType: 'observation',
          profileData: {
            state: '6852c86c7248c20014b38a4d',
            district: '6852c8ae7248c20014b38a57',
            block: '6852c8de7248c20014b38a9d',
            cluster: '6852c9027248c20014b38c34',
            school: '6852c9237248c20014b39fa0',
            professional_role: '6825939a97b5680013e6a166',
            professional_subroles: '68259c4397b5680013e6a1fb',
            organizations: '[object Object]',
          },
          observationId: route.params?.observationId,
          entityId: '6852c9237248c20014b39fa0',
          evidenceCode: 'OB',
          index: 0,
          submissionNumber: 2,
          solutionId: '69282a8f46ad572ba097e0ed',
          mockData: mockData,
        }}
      /></Container>
  );
};

export default Observation;