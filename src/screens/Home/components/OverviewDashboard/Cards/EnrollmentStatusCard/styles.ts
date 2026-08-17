export const enrollmentStatusStyles = {
  card: {
    bg: '$white',
    borderRadius: '$xl',
    p: '$5',
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
    h: '$full',
  },
  header: {
    space: 'sm',
    alignItems: 'center',
    mb: '$8',
  },
  cardtitle: {
    fontSize: 16,
    fontWeight: "$normal",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    bg: '$primary100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    space: 'md',
  },
  statusItem: {
    space: 'xs',
  },
  statusRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    borderRadius: '$full',
  },
} as const;
