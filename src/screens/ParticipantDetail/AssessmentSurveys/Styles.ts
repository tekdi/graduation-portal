export const assessmentSurveysStyles = {
  scrollView: {
    flex: 1,
    width: '$full',
  },
  container: {
    flex: 1,
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$lg',
    m: '$4',
    p: '$6',
  },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  cardsContainer: {
    width: '$full',
    p: '$4',
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    space: '$4',
  },
  emptyIconContainer: {
    mb: '$4',
  },
  emptyTextContainer: {
    alignItems: 'center' as const,
    space: '$2',
    width: '$full',
  },
  emptyTitle: {
    fontSize: '$xl',
    fontWeight: '$bold',
    color: '$textForeground',
    textAlign: 'center' as const,
  },
  emptyDescription: {
    fontSize: '$md',
    color: '$textMutedForeground',
    textAlign: 'center' as const,
  },
} as const;
