export const graduationCriteriaStyles = {
  container: {
    space: 'md' as const,
    w: '$full' as const,
  },
  rateCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$6' as const,
    width: '$full' as const,
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
  rateHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    width: '$full' as const,
  },
  rateHeaderLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'xs' as const,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '$textForeground' as const,
  },
  rateBody: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    mt: '$4' as const,
    width: '$full' as const,
    flexWrap: 'wrap' as const,
    gap: '$4' as const,
  },
  rateBodyLeft: {
    flexDirection: 'column' as const,
    space: 'xs' as const,
  },
  rateValueRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    space: 'sm' as const,
    flexWrap: 'wrap' as const,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },
  rateSubText: {
    fontSize: 14,
    color: '$textSecondary' as const,
    fontWeight: '$medium' as const,
  },
  rateDescription: {
    fontSize: 12,
    color: '$textMutedForeground' as const,
  },
  rateBodyRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'md' as const,
  },
  formulaPill: {
    bg: '$backgroundLight50' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 6,
    px: '$3' as const,
    py: '$1.5' as const,
  },
  formulaText: {
    fontSize: 11,
    color: '$textMutedForeground' as const,
    fontWeight: '$medium' as const,
  },
  subMetricBox: {
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 10,
    p: '$3' as const,
    bg: '$backgroundLight50' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minWidth: 100,
  },
  subMetricLabel: {
    fontSize: 10,
    color: '$textMutedForeground' as const,
    fontWeight: '$semibold' as const,
    mb: '$1' as const,
    textAlign: 'center' as const,
  },
  subMetricValue: {
    fontSize: 18,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
    textAlign: 'center' as const,
  },
  metricCard: {
    width: '$full' as const,
  },
  metricRow: {
    flexDirection: 'row' as const,
    flexWrap: 'nowrap' as const,
    width: '$full' as const,
    alignItems: 'stretch' as const,
    gap: '$3' as const,
  },
  metricItem: (_isLast: boolean) => ({
    flex: 1 as const,
    flexDirection: 'column' as const,
    p: '$5' as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    minWidth: 0,
    justifyContent: 'flex-start' as const,
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    '$web-boxShadow': '0px 1px 3px rgba(0, 0, 0, 0.1)' as const,
  }),
  metricTopAccent: (colorToken: string) => ({
    h: 3,
    bg: colorToken,
    width: '$full' as const,
    borderRadius: 2,
    mb: '$3' as const,
  } as any),
  metricTextContainer: {
    flex: 1,
  },
  metricIcon: (bgToken: string) => ({
    p: '$1.5' as const,
    borderRadius: 8,
    bg: bgToken,
  }),
  metricLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    mb: '$4' as const,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '$bold' as const,
    mb: 0,
  },
  metricDescription: {
    fontSize: '$xs !important',
    color: '$textMutedForeground' as const,
    flexWrap: 'wrap' as const,
    mt: 4,
  },
  // kept for backwards compat — no longer rendered
  metricLeftAccent: (_colorToken: string) => ({} as any),

  // ── Distribution cards row ──────────────────────────────────────
  distributionCardsRow: {
    flexDirection: 'row' as const,
    width: '$full' as const,
    gap: '$4' as const,
    alignItems: 'stretch' as const,
  },

  // ── Readiness Status Distribution card ─────────────────────────
  readinessStatusCard: {
    flex: 1 as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    '$web-boxShadow': '0px 1px 3px rgba(0, 0, 0, 0.1)' as const,
    minHeight: 280,
  },

  // ── Program Exit Distribution card ─────────────────────────────
  programExitCard: {
    flex: 1 as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    '$web-boxShadow': '0px 1px 3px rgba(0, 0, 0, 0.1)' as const,
    minHeight: 280,
  },

  // ── Progress bar row (Program Exit items) ──────────────────────
  exitProgressRow: {
    width: '$full' as const,
    mb: '$4' as const,
  },
  exitProgressLabel: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    mb: '$1.5' as const,
  },
  exitProgressLabelText: {
    fontSize: 14,
    fontWeight: '$medium' as const,
    color: '$textForeground' as const,
  },
  exitProgressValueText: {
    fontSize: 12,
    color: '$textMutedForeground' as const,
  },
  exitTotalBox: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    mt: '$4' as const,
    borderTopWidth: 1,
    borderTopColor: '$borderColor' as const,
    pt: '$4' as const,
  },
  exitTotalLabel: {
    fontSize: 10,
    fontWeight: '$semibold' as const,
    color: '$textMutedForeground' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  exitTotalFormula: {
    fontSize: 12,
    fontWeight: '$semibold' as const,
    color: '$textForeground' as const,
    mt: '$1' as const,
  },
  exitTotalRate: {
    fontSize: 12,
    color: '$textMutedForeground' as const,
    mt: '$0.5' as const,
  },
  exitTotalValue: {
    fontSize: 32,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },

  // ── Graduation Rate Timeline card ──────────────────────────────
  graduationRateTimelineCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    width: '$full' as const,
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
  timelineHeaderRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    width: '$full' as const,
    mb: '$2' as const,
  },
  timelineChart: {
    width: '$full' as const,
    mt: '$2' as const,
  },

  // ── Graduation Filters bar ─────────────────────────────────────
  graduationFilters: {
    bg: '$backgroundLight50' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$2' as const,
    width: '$full' as const,
    shadowColor: '$shadowColor' as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // ── Graduation Rate Card ───────────────────────────────────────
  graduationRateCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    width: '$full' as const,
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
  rateCardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    width: '$full' as const,
    mb: '$1' as const,
  },
  rateCardTitle: {
    fontSize: 16,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },
  rateCardPercent: {
    fontSize: 24,
    fontWeight: '$bold' as const,
    color: '$error600' as const,
  },
  rateCardSubtitle: {
    fontSize: 12,
    color: '$textMutedForeground' as const,
    mb: '$4' as const,
  },
  segmentBar: {
    flexDirection: 'row' as const,
    width: '$full' as const,
    height: 36,
    borderRadius: 6,
    overflow: 'hidden' as const,
    mb: '$4' as const,
  },
  segmentLegendGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '$3' as const,
  },
  segmentLegendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'xs' as const,
    minWidth: 140,
  },
  // 7 stat items in GraduationRateCard header row
  rateItemBox: {
    flex: 1 as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 14,
    p: '$3' as const,
    alignItems: 'flex-start' as const,
    shadowColor: '$shadowColor' as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  // ── Graduation Indicators ──────────────────────────────────────
  indicatorsSectionTitle: {
    fontSize: 18,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
    mb: '$3' as const,
  },
  indicatorsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '$3' as const,
    width: '$full' as const,
  },
  indicatorCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 16,
    p: '$4' as const,
    width: '48.5%' as const,
    shadowColor: '$shadowColor' as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  indicatorIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    bg: '$error50' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    mr: '$3' as const,
  },
  indicatorProgressRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    mb: '$0.5' as const,
    mt: '$2.5' as const,
  },
  indicatorProgressLabel: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'xs' as const,
    flex: 1 as const,
  },
  // Checklist-specific styles
  checklistSectionTitle: {
    fontSize: 18,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
    mt: '$4' as const,
  },
  checklistCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    width: '$full' as const,
    shadowColor: '$shadowColor' as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  checklistHeader: {
    flexDirection: 'column' as const,
    space: 'xs' as const,
    mb: '$4' as const,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },
  checklistSubtitle: {
    fontSize: 12,
    color: '$textMutedForeground' as const,
  },
  emptyStateContainer: {
    bg: '$white' as const,
    borderRadius: 16,
    p: '$12' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 120,
    width: '$full' as const,
  },
  emptyStateText: {
    fontSize: 14,
    color: '$textMutedForeground' as const,
    textAlign: 'center' as const,
  },
  participantReadinessCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
    width: '$full' as const,
    shadowColor: '$shadowColor' as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'column' as const,
  },
  participantSelectorBox: {
    bg: '$white' as const,
    width: '$full' as const,
  },
  summaryGrid: {
    flexDirection: 'row' as const,
    gap: '$3' as const,
    width: '$full' as const,
    mb: '$5' as const,
    flexWrap: 'wrap' as const,
  },
  summaryBox: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let bg = '$success50';
    let borderColor = '$success200';
    if (status === 'On Track') {
      bg = '$warning50';
      borderColor = '$warning200';
    } else if (status === 'At Risk') {
      bg = '$error50';
      borderColor = '$error200';
    }
    return {
      flex: 1 as const,
      bg,
      borderWidth: 1,
      borderColor,
      borderRadius: 12,
      p: '$4' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minWidth: 100,
    };
  },
  summaryValue: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let color = '$success700';
    if (status === 'On Track') {
      color = '$warning700';
    } else if (status === 'At Risk') {
      color = '$error700';
    }
    return {
      fontSize: 20,
      fontWeight: '$bold' as const,
      color,
    };
  },
  summaryLabel: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let color = '$success600';
    if (status === 'On Track') {
      color = '$warning600';
    } else if (status === 'At Risk') {
      color = '$error600';
    }
    return {
      fontSize: 11,
      fontWeight: '$medium' as const,
      color,
      mt: '$0.5' as const,
    };
  },
  categoriesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '$4' as const,
    width: '$full' as const,
  },
  categoryCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 20,
    p: '$5' as const,
  },
  categoryHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    mb: '$4' as const,
  },
  categoryIconBox: (colorKey: string) => {
    let bg = '$success50';
    if (colorKey === 'financialInclusion') bg = '$success50';
    else if (colorKey === 'socialEmpowerment') bg = '$blue50';
    else if (colorKey === 'genderEquality') bg = '$error50';
    else bg = '$error50'; // livelihoods (brown/red icon container)
    return {
      width: 32,
      height: 32,
      borderRadius: 8,
      bg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      mr: '$3' as const,
    };
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },
  categorySubtitle: {
    fontSize: 11,
    color: '$textMutedForeground' as const,
    mt: '$0.5' as const,
  },
  criterionCard: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let borderColor = '$success200';
    if (status === 'On Track') borderColor = '$warning200';
    else if (status === 'At Risk') borderColor = '$error200';
    return {
      borderWidth: 1,
      borderColor,
      borderRadius: 12,
      p: '$3' as const,
      mb: '$3' as const,
      bg: '$white' as const,
    };
  },
  criterionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    mb: '$2' as const,
  },
  criterionTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'sm' as const,
    flex: 1 as const,
  },
  criterionTitleText: {
    fontSize: 14,
    fontWeight: '$bold' as const,
    color: '$textForeground' as const,
  },
  criterionStatusBadge: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let bg = '$success50';
    let borderColor = '$success100';
    let color = '$success700';
    if (status === 'On Track') {
      bg = '$warning50';
      borderColor = '$warning100';
      color = '$warning700';
    } else if (status === 'At Risk') {
      bg = '$error50';
      borderColor = '$error100';
      color = '$error700';
    }
    return {
      bg,
      borderColor,
      borderWidth: 1,
      borderRadius: 6,
      px: '$2' as const,
      py: '$0.5' as const,
      text: {
        fontSize: 11,
        fontWeight: '$semibold' as const,
        color,
      },
    };
  },
  criterionDescBox: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let bg = '$success50';
    if (status === 'On Track') bg = '$warning50';
    else if (status === 'At Risk') bg = '$error50';
    return {
      bg,
      p: '$3' as const,
      borderRadius: 8,
      mt: '$1' as const,
    };
  },
  criterionDescText: (status: 'Achieved' | 'On Track' | 'At Risk') => {
    let color = '$success800';
    if (status === 'On Track') color = '$warning800';
    else if (status === 'At Risk') color = '$error800';
    return {
      fontSize: 12,
      color,
      lineHeight: 18,
    };
  },
  criterionLogicLink: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    space: 'xs' as const,
    mt: '$2' as const,
  },
  criterionLogicText: {
    fontSize: 11,
    color: '$textMutedForeground' as const,
    fontWeight: '$medium' as const,
  },
  criterionNoteBadge: {
    bg: '$backgroundLight50' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: 12,
    px: '$2.5' as const,
    py: '$0.5' as const,
    alignSelf: 'flex-start' as const,
    mt: '$2' as const,
  },
  criterionNoteText: {
    fontSize: 10,
    color: '$textMutedForeground' as const,
    fontWeight: '$medium' as const,
  },
} as const;
