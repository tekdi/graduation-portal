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

export const dashboardCardStyles = {
  container: {
    borderWidth: 1,
    borderColor: '$borderLight300',
    rounded: '$2xl',
    p: '$4',
    flex: 1,
    minWidth: 160,
    m: '$2',
    bg: '$backgroundLight0',
  },
  contentVStack: {
    space: 'xs',
  },
  titleText: {
    fontSize: '$sm',
    color: '$textLight500',
  },
  valueText: {
    fontSize: '$3xl',
    fontWeight: '$bold',
  },
  changeHStack: {
    alignItems: 'center',
    space: 'xs',
  },
  changeText: {
    color: '$success600',
    fontSize: '$xs',
  },
  subText: {
    fontSize: '$xs',
    color: '$textLight400',
  },
} as const;

export const quickActionCardStyles = {
  pressable: {
    // Empty, handled by parent
  },
  container: {
    alignItems: 'center',
    p: '$4',
    my: '$2',
    borderWidth: 1,
    borderColor: '$borderLight300',
    rounded: '$2xl',
    bg: '$backgroundLight0',
    space: 'md',
  },
  iconBox: {
    p: '$3',
    rounded: '$full',
  },
  contentVStack: {
    // Empty, default styling
  },
  titleText: {
    fontWeight: '$bold',
  },
  subtitleText: {
    color: '$textLight500',
    fontSize: '$sm',
  },
} as const;

export const recentActivityItemStyles = {
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    my: '$2',
  },
  leftHStack: {
    alignItems: 'center',
    space: 'md',
  },
  contentVStack: {
    // Empty, default styling
  },
  itemTitle: {
    // Empty, default styling
  },
  itemSubtitle: {
    fontSize: '$xs',
    color: '$textLight500',
  },
  badge: {
    size: 'sm',
    rounded: '$full',
    variant: 'solid',
    px: '$2',
    py: '$1',
  },
} as const;
