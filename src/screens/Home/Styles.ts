export const dashboardStyles = {
  container: {
    flex: 1,
    bg: '$backgroundColor',
  },
  pageHeaderTitle: {
    color: '$primary500' as const,
    fontSize: '$3xl' as const,
    fontWeight: '$bold' as const,
    pb: 8 as const,
  },
  pageHeaderSubtitle: {
    color: '$textMutedForeground' as const,
    fontSize: 16 as const,
    mt: '$1' as const,
  },
  contentWrapper: {
    bg: '$backgroundColor',
    flex: 1,
  },
  mainVStack: {
    space: 'lg' as const,
    px: '$4' as const,
    py: '$4' as const,
    $md: {
      px: '$6' as const,
      py: '$6' as const,
    },
  },
  contentContainer: {
    space: 'lg' as const,
  },
  placeholderBox: {
    p: '$8' as const,
    bg: '$white' as const,
    borderRadius: '$xl' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 200,
  },
  titleText: {
    fontSize: '$2xl' as const,
    fontWeight: '$bold' as const,
  },
  welcomeText: {
    color: '$textLight500' as const,
  },
  statsHStack: {
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },
  sectionsContainer: {
    flexWrap: 'wrap' as const,
    space: 'lg' as const,
  },
  sectionBox: {
    flex: 1,
    w: '100%' as const,
  },
  sectionTitle: {
    fontWeight: '$bold' as const,
    mb: '$2' as const,
  },
  quickActionsCard: {
    borderWidth: 1,
    borderColor: '$borderLight300' as const,
    rounded: '$2xl' as const,
    p: '$4' as const,
    bg: '$backgroundLight0' as const,
  },
} as const;
