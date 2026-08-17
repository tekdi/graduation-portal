export const metricCardStyles = {
  container: {
    flex: 1,
    minWidth: 200,
    bg: '$white',
    borderRadius: '$xl',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '$borderColor',
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    '$web-boxShadow': '0px 1px 3px rgba(0, 0, 0, 0.1)' as const,
  },
  content: {
    space: 'md',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: '$lg',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    space: 'xs',
  },
  titletext: {
    fontSize: '$xs',
    fontWeight: '$normal',
    color: '$textSecondary',
  },
  valueText: {
    fontSize: '$xl',
    fontWeight: '$normal',
    color: '$textPrimary',
  },
} as const;

