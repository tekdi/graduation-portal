// Layout Styles
export const layoutStyles = {
  container: {
    bg: '$backgroundLight0' as const,
    minHeight: '100%' as '100%',
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
    padding: 24,
  },
  headerContent: {
    bg: '$backgroundLight0' as const,
    minHeight: 64,
    width: '$full' as const,
  },
};
