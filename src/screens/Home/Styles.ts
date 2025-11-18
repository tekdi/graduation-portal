export const dashboardStyles = {
  scrollView: {
    p: '$4',
    bg: '$backgroundLight0',
  },
  mainVStack: {
    space: 'lg',
  },
  titleText: {
    fontSize: '$2xl',
    fontWeight: '$bold',
  },
  welcomeText: {
    color: '$textLight500',
  },
  statsHStack: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionsContainer: {
    flexWrap: 'wrap',
    space: 'lg',
  },
  sectionBox: {
    flex: 1,
    w: '100%',
  },
  sectionTitle: {
    fontWeight: '$bold',
    mb: '$2',
  },
  // Quick Actions Card
  quickActionsCard: {
    borderWidth: 1,
    borderColor: '$borderLight300',
    rounded: '$2xl',
    p: '$4',
    bg: '$backgroundLight0',
  },
} as const;
