// Layout Styles
export const layoutStyles = {
  container: {
    bg: '$backgroundLight0' as const,
    minHeight: '$full' as '$full',
    flexDirection: 'row' as const,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    width: '$full' as const,
    flexDirection: 'column' as const,
  },
  mainContent: {
    flex: 1,
    width: '$full' as const,
    bg: '$backgroundLight0' as const,
    padding: '$6',
  },
  headerContent: {
    bg: '$backgroundLight0' as const,
    minHeight: '$16',
    width: '$full' as const,
  },
};
