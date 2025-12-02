import { theme } from '@config/theme';

export const interventionPlanStyles = {
  container: {
    flex: 1,
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$2xl',
    p: '$6',
  },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    space: 'lg' as const,
  },
  iconContainer: {
    mb: '$4',
  },
  iconColor: theme.tokens.colors.mutedForeground,
  title: {
    fontSize: '$xl',
    fontWeight: '$bold',
    color: '$textForeground',
    textAlign: 'center' as const,
  },
  description: {
    fontSize: '$md',
    color: '$textMutedForeground',
    textAlign: 'center' as const,
    maxWidth: 500,
  },
  button: {
    bg: '$btnPrimary',
    borderRadius: '$md',
    px: '$6',
    py: '$3',
    mt: '$4',
  },
  buttonText: {
    color: '$white',
    fontSize: '$md',
    fontWeight: '$medium',
  },
} as const;

