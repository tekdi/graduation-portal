export const userManagementStyles = {
  scrollView: {
    flex: 1,
    width: '100%',
    p: '$4',
    bg: '$backgroundLight0',
  },
 mainVStack: {
   
  },
  titleText: {
    fontSize: '$2xl',
    fontWeight: '$bold',
    lineHeight: 36,
  },
  welcomeText: {
    color: '$textLight500',
    fontSize: "$md",
    lineHeight: "$md",
  },
  statsHStack: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionsContainer: {
    flexWrap: 'wrap',
    space: 'lg',
  },
  sectionBox: {
    flex: 1,
    w: '100%',
  },
  sectionTitle: {
    fontWeight: '$bold',
    mb: '$2',
  },
  // Quick Actions Card
  quickActionsCard: {
    borderWidth: 1,
    borderColor: '$borderLight300',
    rounded: '$2xl',
    p: '$4',
    bg: '$backgroundLight0',
  },
  // Buttons
  bulkUploadButton: {
    bg: '$white',
    borderWidth: 1,
    borderColor: '$borderLight300',
    borderRadius: '$md',
    px: '$3',
    py: '$2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulkUploadButtonText: {
    fontSize: '$sm',
    color: '$textForeground',
    fontWeight: '$medium',
  },
  createUserButton: {
    bg: '$btnPrimary',
    borderRadius: '$md',
    px: '$3',
    py: '$2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  createUserButtonText: {
    fontSize: '$sm',
    color: '$white',
    fontWeight: '$medium',
  },
} as const;
