import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, ScrollView } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById } from '@constants/PARTICIPANTS_LIST';
import type { ParticipantStatus } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';

/**
 * Route parameters type definition for ParticipantDetail screen
 */
type ParticipantDetailRouteParams = {
  id?: string;
  participantId?: string;
};

/**
 * Route type for ParticipantDetail screen
 */
type ParticipantDetailRouteProp = RouteProp<{
  params: ParticipantDetailRouteParams;
}>;

/**
 * ParticipantDetail Component
 * Displays participant details with status-based header variations.
 */
export default function ParticipantDetail() {
  const route = useRoute<ParticipantDetailRouteProp>();
  const { t } = useLanguage();
  
  // Extract the id parameter from the route
  const routeParams = route.params;
  const participantId = routeParams?.id || routeParams?.participantId;
  
  // Fetch participant data from mock data by ID
  // Ensure participantId exists before calling getParticipantById
  const participant = participantId ? getParticipantById(participantId) : undefined;
  
  // Error State: Participant Not Found
  if (!participant) {
    return <NotFound message={t('participantDetail.notFound.title')} />;
  }
  
  // Extract participant data
  // Type assertion not needed as participant is guaranteed to exist here
  const {
    name: participantName,
    id,
    status,
    pathway,
    graduationProgress,
    graduationDate,
  } = participant;

  return (
    <ScrollView flex={1} bg="$white">
      <VStack 
        {...participantDetailStyles.container} 
        $web-boxShadow={participantDetailStyles.containerBoxShadow}
      
      >
        {/* Participant Header with status-based variations */}
        <ParticipantHeader
          participantName={participantName}
          participantId={id}
          status={status}
          pathway={pathway}
          graduationProgress={graduationProgress}
          graduationDate={graduationDate}
        />
      </VStack>
    </ScrollView>
  );
}
