// Base column text style - common properties shared by all column text styles
const columnTextBase = {
  fontWeight: '$normal' as const,
  fontSize: '$sm' as const,
};

export const templateManagementStyles = {
    infoBox: {
        borderWidth: 1,
        borderColor: '$borderLight200',
        bg: '$white',
        borderRadius: '$lg',
        paddingVertical: '$3',
        paddingHorizontal: '$4',
        mt: '$6',
    },
    infoBoxTitle: {
        fontWeight: '$medium',
        fontSize: '$sm',
        color: '$textForeground',
    },
    infoBoxDescription: {
        fontWeight: '$normal',
        fontSize: '$sm',
        color: '$textMutedForeground',
    },
    tableHeaderContainer: {
        mt: '$6',
        mb: '$4',
    },
    tableHeaderTitle: {
        fontWeight: '$semibold',
        fontSize: '$lg',
        color: '$textForeground',
    },
} as const;

export const styles = {
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: '$2' as const,
    paddingVertical: '$0.5' as const,
    borderRadius: '$md' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  statusBadgeText: {
    color: '$white' as const,
    fontWeight: '$medium' as const,
    fontSize: '$xs' as const,
  },
  statusBadgeActive: {
    bg: '$success600' as const,
  },
  statusBadgeInactive: {
    bg: '$textMutedForeground' as const,
  },

  // Column Text Styles - using base style with color overrides
  templateNameText: {
    ...columnTextBase,
    color: '$textForeground' as const,
  },
  uploadedViaText: {
    ...columnTextBase,
    color: '$textMutedForeground' as const,
    fontSize: '$xs' as const,
  },
  creatorText: {
    ...columnTextBase,
    color: '$textForeground' as const,
  },
  tasksText: {
    ...columnTextBase,
    color: '$textForeground' as const,
  },
  createdDateText: {
    ...columnTextBase,
    color: '$textForeground' as const,
  },
} as const;