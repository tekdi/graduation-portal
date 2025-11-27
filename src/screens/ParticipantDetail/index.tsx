import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VStack, ScrollView, Text, Box } from '@gluestack-ui/themed';
import ParticipantHeader from './ParticipantHeader';
import { participantDetailStyles } from './Styles';
import { getParticipantById, ParticipantStatus } from '@constants/PARTICIPANTS_MOCK_DATA';
import { useLanguage } from '@contexts/LanguageContext';

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
 * 
 * Main screen component that displays participant details.
 * Fetches participant data from mock data based on ID from route params.
 * Uses ParticipantHeader component for status-based header variations.
 * 
 * @remarks
 * In production, replace `getParticipantById` with an API call to fetch
 * participant data from the backend. The mock data structure matches the
 * expected API response format.
 * 
 * @example
 * ```tsx
 * // Navigate to participant detail
 * navigation.navigate('participant-detail', { id: '1001' });
 * ```
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
  
  /**
   * Error State: Participant Not Found
   * 
   * Displays an error message when:
   * - No participant ID is provided in route params
   * - Participant ID doesn't exist in mock data
   * 
   * Provides helpful information about available participant IDs for testing.
   */
  if (!participant) {
    return (
      <ScrollView flex={1} bg="$white">
        <VStack {...participantDetailStyles.container} $web-boxShadow={participantDetailStyles.containerBoxShadow}>
          <Box p="$6">
            <Text fontSize="$lg" color="$error600" fontWeight="$semibold">
              {t('participantDetail.notFound.title')}
            </Text>
            <Text fontSize="$md" color="$textMutedForeground" mt="$2">
              {participantId 
                ? t('participantDetail.notFound.message', { id: participantId })
                : t('participantDetail.notFound.noIdProvided')}
            </Text>
            <Text fontSize="$sm" color="$textMutedForeground" mt="$4">
              {t('participantDetail.notFound.availableIds')}
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    );
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
