import React, { useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, HStack, Box } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById } from '../../services/participantService';
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
 * The route path is configured as '/participants/:id', so the parameter is extracted as 'id'
 * @example navigate('ParticipantDetail', { id: 'P-006' })
 */
type ParticipantDetailRouteParams = {
  id?: string;
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
  const participantId = route.params?.id;
  
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
    <Box flex={1} bg={theme.tokens.colors.accent100}>
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

      {/* Tabs Header - with margin from header */}
  
        <Box width="$full" mt="$6">
          <Box
            maxWidth={1200}
            width="$full"
            marginHorizontal="auto"
          >
            <HStack
              width="$full"
              bg="#f1f5f9"
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
        <Box bg="transparent" flex={1} mt="$3">
          <Box
            maxWidth={1200}
            width="$full"
            marginHorizontal="auto"      
          >
            {activeTab === 'intervention-plan' && <InterventionPlan />}
            {activeTab === 'assessment-surveys' && (
              <AssessmentSurveys participantStatus={status} />
            )}
          </Box>
        </Box>  
    </Box>
  );
}
