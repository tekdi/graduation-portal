export const templateDetailStyles = {
  // Header
  backButtonText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    fontWeight: '$normal' as const,
  },
  headerTitle: {
    fontSize: '$xl' as const,
    fontWeight: '$semibold' as const,
    color: '$textForeground' as const,
    flex: 1 as const,
  },

  // Tab bar
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight200' as const,
    mb: '$5' as const,
  },
  tab: {
    paddingHorizontal: '$4' as const,
    paddingVertical: '$3' as const,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent' as const,
    mr: '$2' as const,
  },
  tabActive: {
    borderBottomColor: '$primary500' as const,
  },
  tabText: {
    fontSize: '$sm' as const,
    fontWeight: '$normal' as const,
    color: '$textMutedForeground' as const,
  },
  tabTextActive: {
    color: '$primary600' as const,
    fontWeight: '$medium' as const,
  },

  // Content panel
  contentPanel: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderLight200' as const,
    borderRadius: '$lg' as const,
    padding: '$6' as const,
  },
  panelTitle: {
    fontSize: '$lg' as const,
    fontWeight: '$semibold' as const,
    color: '$textForeground' as const,
    mb: '$1' as const,
  },
  panelDescription: {
    fontSize: '$sm' as const,
    fontWeight: '$normal' as const,
    color: '$textMutedForeground' as const,
    mb: '$6' as const,
  },

  // Form fields
  fieldLabel: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$textForeground' as const,
    mb: '$1' as const,
  },
  fieldHint: {
    fontSize: '$xs' as const,
    color: '$textMutedForeground' as const,
    mt: '$1' as const,
  },
  fieldContainer: {
    mb: '$4' as const,
  },

  // Task list
  taskCard: {
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderLight200' as const,
    borderRadius: '$md' as const,
    padding: '$4' as const,
    mb: '$3' as const,
  },
  taskCardHeader: {
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
  },
  taskNameText: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$textForeground' as const,
    flex: 1 as const,
  },
  taskDescriptionText: {
    fontSize: '$xs' as const,
    fontWeight: '$normal' as const,
    color: '$textMutedForeground' as const,
    mt: '$1' as const,
  },
  taskExternalId: {
    fontSize: '$xs' as const,
    color: '$textMutedForeground' as const,
    mt: '$0.5' as const,
    fontFamily: 'monospace' as const,
  },
  taskActions: {
    alignItems: 'center' as const,
    space: 'xs' as const,
    flexShrink: 0,
    ml: '$2' as const,
  },
  iconButton: {
    padding: '$1' as const,
    borderRadius: '$sm' as const,
  },

  // Task type badge
  typeBadge: {
    borderRadius: '$full' as const,
    paddingHorizontal: '$2' as const,
    paddingVertical: '$0.5' as const,
    alignSelf: 'flex-start' as const,
    mt: '$1' as const,
  },
  typeBadgeSimple: {
    bg: '$blue100' as const,
  },
  typeBadgeObservation: {
    bg: '$observationTaskBg' as const,
  },
  typeBadgeText: {
    fontSize: '$2xs' as const,
    fontWeight: '$medium' as const,
    textTransform: 'uppercase' as const,
  },
  typeBadgeTextSimple: {
    color: '$blue700' as const,
  },
  typeBadgeTextObservation: {
    color: '$warningIconColor' as const,
  },

  // Subtask
  subtaskContainer: {
    mt: '$3' as const,
    ml: '$4' as const,
    borderLeftWidth: 2,
    borderLeftColor: '$borderLight200' as const,
    paddingLeft: '$3' as const,
  },
  subtaskCard: {
    bg: '$backgroundPrimary' as const,
    borderWidth: 1,
    borderColor: '$borderLight100' as const,
    borderRadius: '$sm' as const,
    padding: '$3' as const,
    mb: '$2' as const,
  },
  subtaskLabel: {
    fontSize: '$xs' as const,
    fontWeight: '$medium' as const,
    color: '$textMutedForeground' as const,
    mb: '$2' as const,
    textTransform: 'uppercase' as const,
  },

  // Loading / empty
  centeredBox: {
    flex: 1 as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    py: '$12' as const,
  },
  emptyText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
  },

  // Modal form
  modalFieldLabel: {
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
    color: '$textForeground' as const,
    mb: '$1' as const,
  },
  modalFieldHint: {
    fontSize: '$xs' as const,
    color: '$textMutedForeground' as const,
    mt: '$1' as const,
  },
  modalFieldContainer: {
    mb: '$4' as const,
  },

  // Category selector
  categoryListContainer: {
    borderWidth: 1,
    borderColor: '$borderLight200' as const,
    borderRadius: '$md' as const,
    maxHeight: 240,
  },
  categoryRow: {
    paddingHorizontal: '$3' as const,
    paddingVertical: '$2.5' as const,
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight100' as const,
    alignItems: 'center' as const,
    space: 'sm' as const,
  },
  categoryRowSelected: {
    bg: '$primary50' as const,
  },
  categoryRowChild: {
    paddingLeft: '$8' as const,
    bg: '$backgroundPrimary' as const,
  },
  categoryRowChildSelected: {
    bg: '$primary50' as const,
  },
  categoryText: {
    fontSize: '$sm' as const,
    color: '$textForeground' as const,
    flex: 1 as const,
  },
  categoryParentText: {
    fontWeight: '$medium' as const,
  },
  categoryChildText: {
    fontWeight: '$normal' as const,
    color: '$textMutedForeground' as const,
  },
  selectedCategoriesContainer: {
    mt: '$2' as const,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '$1' as const,
  },
  selectedCategoryChip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    bg: '$primary100' as const,
    borderRadius: '$full' as const,
    paddingHorizontal: '$2' as const,
    paddingVertical: '$0.5' as const,
    space: 'xs' as const,
  },
  selectedCategoryChipText: {
    fontSize: '$xs' as const,
    color: '$primary700' as const,
    fontWeight: '$medium' as const,
  },
} as const;
