export const overviewStyles = {
  contentContainer: {
    space: 'lg' as const,
  },
  metricsRow: {
    flexWrap: 'wrap' as const,
    gap: '$4' as const,
    $md: {
      flexWrap: 'nowrap' as const,
    },
  },
  cardsRow: {
    flexWrap: 'wrap' as const,
    gap: '$4' as const,
    $md: {
      flexWrap: 'nowrap' as const,
    },
  },
  cardColumn: {
    flex: 1,
    minWidth: '100%' as const,
    $md: {
      minWidth: '48%' as const,
    },
  },
} as const;
