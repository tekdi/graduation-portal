import React, { useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, HStack, Box, ScrollView } from '@ui';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById, getParticipantProfile } from '../../services/participantService';
import { useLanguage } from '@contexts/LanguageContext';
import NotFound from '@components/NotFound';
import { TabButton } from '@components/Tabs';
import { PARTICIPANT_DETAIL_TABS } from '@constants/TABS';
import InterventionPlan from './InterventionPlan';
import AssessmentSurveys from './AssessmentSurveys';
import { theme } from '@config/theme';
import type { ParticipantStatus } from '@app-types/participant';
import { Modal } from '@ui';

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Extract the id parameter from the route
  const participantId = route.params?.id;
  
  // Fetch participant data from mock data by ID
  // Ensure participantId exists before calling getParticipantById
  const participant = participantId ? getParticipantById(participantId) : undefined;
  const participantProfile = participantId ? getParticipantProfile(participantId) : undefined;
  
  // Error State: Participant Not Found
  if (!participant) {
    return <NotFound message="participantDetail.notFound.title" />;
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
    <>
      <Box flex={1} bg={theme.tokens.colors.accent100}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
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
            onViewProfile={() => setIsProfileModalOpen(true)}
          />
        </VStack>
        {/* Tabs */}
        <Box width="$full" mt="$4" mb="$6">
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
        <Box flex={1} mt="$3" mb="$6" bg="transparent">
          <Box
            maxWidth={1200}
            width="$full"
            marginHorizontal="auto"
            px="$6"
          >
            <Box
              width="$full"
            >
              {activeTab === 'intervention-plan' && <InterventionPlan />}
              {activeTab === 'assessment-surveys' && <AssessmentSurveys participantStatus={status as ParticipantStatus} />}
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>

      {/* Profile Modal - Using Modal with profile variant */}
      {participantProfile && (
        <Modal
          variant="profile"
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title={t('participantDetail.profileModal.title')}
          subtitle={t('participantDetail.profileModal.subtitle', { name: participantName })}
          profile={{
            id: id,
            name: participantName,
            email: participantProfile.email || '',
            phone: participantProfile.phone || '',
            address: participantProfile.address,
          }}
          onAddressEdit={() => {
            // Handle address edit (future enhancement)
          }}
        />
      )}
    </>
  );
}
