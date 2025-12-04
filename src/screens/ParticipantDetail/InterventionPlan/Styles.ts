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
    space: '$4' as const,
  },
  iconContainer: {
  },
  iconColor: theme.tokens.colors.textMutedForeground,
  title: {
    fontSize: '$md',
    fontWeight: '$normal',
    color: '$textForeground',
    textAlign: 'center' as const,
  },
  description: {
    fontSize: '$md',
    color: '$textMutedForeground',
    textAlign: 'center' as const,
  },
  button: {
    bg: '$btnPrimary',
    borderRadius: '$xl',
    px: '$4',
    py: '$2',
    mt: '$4',
  },
  buttonText: {
    color: '$white',
    fontSize: '$sm',
    fontWeight: '$medium',
  },
} as const;

