import { SHADOW_STYLES } from '@constants/STYLE_CONSTANTS';

/**
 * ParticipantDetail Styles
 * Centralized styles for ParticipantDetail screen component
 */
export const participantDetailStyles = {
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight300' as const,
    backgroundColor: '$white' as const,
  },
  containerBoxShadow: SHADOW_STYLES.containerBoxShadow,
} as const;