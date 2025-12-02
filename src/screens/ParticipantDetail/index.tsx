import React, { useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, ScrollView, HStack, Box } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById } from '@constants/PARTICIPANTS_LIST';
import type { ParticipantStatus } from '@app-types/participant';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import { theme } from '@config/theme';

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
  const [activeTab, setActiveTab] = useState<string>('intervention-plan');
  
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
    <Box flex={1} bg="$white">
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
      {/* Tabs */}
      <Box width="$full" mt="$4">
        <Box 
          maxWidth={1200} 
          width="$full" 
          marginHorizontal="auto"
          px="$6"
        >
          <HStack
            width="$full"
            bg="$backgroundLight50"
            borderRadius={50}
            p={4}
            gap={4}
            alignItems="center"
          >
            {PARTICIPANT_DETAIL_TABS?.map(tab => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeTab === tab.key}
                onPress={setActiveTab}
                variant="ButtonTab"
              />
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Tab Content */}
      <Box flex={1} mt="$3" bg="transparent">
        <Box
          maxWidth={1200}
          width="$full"
          marginHorizontal="auto"
          px="$6"
        >
          <Box
            width="$full"
//borderRadius="$2xl"
            bg="$white"
          
          >
            {activeTab === 'intervention-plan' && <InterventionPlan />}
            {activeTab === 'assessment-surveys' && <AssessmentSurveys participantStatus={status as ParticipantStatus} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
