export const stylesLayout = {
  safeAreaView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
} as const;

export const stylesHeader = {
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderDark200',
    px: '$4',
    py: '$2',
    minHeight: 60,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    alignItems: 'center',
    gap: '$4',
  },
  rightColorModeIcon: {
    size: 'lg',
  },
  titleText: {
    size: 'lg',
    bold: true,
  },
} as const;
