// Layout Styles
export const layoutStyles = {
  container: {
    bg: '$backgroundLight0' as const,
    minHeight: '100%' as '100%',
    flexDirection: 'row' as const,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column' as const,
    minHeight: '100%',
  },
  mainContent: {
    width: '100%' as '100%',
    bg: '$backgroundLight0' as const,
    padding: 24,
    // minHeight: '100%' as '100%',
  },
  headerContent: {
    bg: '$backgroundLight0' as const,
    minHeight: 64,
    width: '100%' as '100%',
  },
};
