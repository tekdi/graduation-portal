import { theme } from '@config/theme';

/**
 * AssessmentSurveyCard Styles
 * Centralized styles for AssessmentSurveyCard component
 */
export const assessmentSurveyCardStyles = {
  cardContainer: {
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$lg',
    p: '$6',
    width: '$full',
    space: '$4',
  },
  cardHeader: {
    mb: '$4',
    width: '$full',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: '$md',
    bg: theme.tokens.colors.iconBackground,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  title: {
    fontSize: '$md',
    fontWeight: '$semibold',
    color: '$textForeground',
    flex: 1,
  },
  statusBadgeNotStarted: {
    bg: '$backgroundLight200',
    borderRadius: '$full',
    px: '$3',
    py: '$1',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    gap: '$1',
  },
  statusBadgeInProgress: {
    bg: '$backgroundLight200',
    borderRadius: '$full',
    px: '$3',
    py: '$1',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  statusBadgeCompleted: {
    bg: '$backgroundLight200',
    borderRadius: '$full',
    px: '$3',
    py: '$1',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  statusBadgeGraduated: {
    bg: theme.tokens.colors.success600,
    borderRadius: '$full',
    px: '$3',
    py: '$1',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    gap: '$1',
  },
  statusBadgeText: {
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$textForeground',
    $web: {
      whiteSpace: 'nowrap' as const,
    },
  },
  statusBadgeTextGraduated: {
    fontSize: '$xs',
    fontWeight: '$medium',
    color: '$white',
    $web: {
      whiteSpace: 'nowrap' as const,
    },
  },
  contentContainer: {
    mb: '$4',
  },
  description: {
    fontSize: '$sm',
    color: '$textMutedForeground',
    lineHeight: '$md',
  },
  additionalInfo: {
    fontSize: '$xs',
    color: '$textMutedForeground',
    fontStyle: 'italic' as const,
  },
  buttonPrimary: {
    bg: theme.tokens.colors.primary500,
    borderRadius: '$md',
    px: '$4',
    py: '$3',
    width: '$full',
  },
  buttonSecondary: {
    bg: '$backgroundLight100',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$md',
    px: '$4',
    py: '$3',
    width: '$full',
  },
  buttonText: {
    fontSize: '$sm',
    fontWeight: '$medium',
  },
} as const;

