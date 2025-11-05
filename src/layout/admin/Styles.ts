// Layout Styles
export const layoutStyles = {
  container: {
    bg: '$backgroundLight0' as const,
    minHeight: '100%' as '100%',
    flexDirection: 'row' as const,
  },
  contentContainer: {
    alignItems: 'flex-start' as const,
    height: '100%' as '100%',
    flex: 1,
    flexDirection: 'column' as const,
  },
  mainContent: {
    width: '100%' as '100%',
    bg: '$backgroundLight0' as const,
    // minHeight: '100%' as '100%',
  },
  headerContent: {
    bg: '$backgroundLight0' as const,
    minHeight: 64,
    width: '100%' as '100%',
  },
};
