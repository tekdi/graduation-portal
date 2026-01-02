export const filterStyles = {
  container: {
    mt: '$5' as const,
    bg: '$white' as const,
    borderWidth: 1,
    borderColor: '$borderColor' as const,
    borderRadius: '$xl' as const,
    p: '$6' as const,
    width: '$full' as const,
  },
  titleContainer: {
    mb: '$4' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  titleText: {
    fontSize: '$sm' as const,
    fontWeight: '$normal' as const,
    ml: '$2' as const,
    color: '$foreground',
  },
  filterFieldsContainer: {
    gap: '$2' as const,
    alignItems: 'flex-end' as const,
    flexWrap: 'wrap' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  searchContainer: {
    flex: 1,
    minWidth: 485,
  },
  roleContainer: {
    flex: 1,
    //minWidth: 200,
  },
  statusContainer: {
    flex: 1,
    minWidth: 200,
  },
  filterContainer: {
    flex: 1,
    //minWidth: 200,
  },
  clearButtonContainer: {
    flex: 1,
    minWidth: 150,
    justifyContent: 'flex-end' as const,
  },
  label: {
    fontSize: '$sm' as const,
    mb: '$1' as const,
    fontWeight: '$normal' as const,
    color: '$textLight900' as const,
  },
  input: {
    variant: 'outline' as const,
    size: 'md' as const,
    borderRadius: '$md' as const,
    bg: '$backgroundLight50' as const,
    borderColor: '$borderLight300' as const,
    height: '$9' as const,
  },
  button: {
    variant: 'outline' as const,
    size: 'md' as const,
    borderRadius: '$md' as const,
    bg: 'transparent' as const,
    borderColor: '$borderLight300' as const,
  },
  buttonText: {
    color: '$textLight900' as const,
    fontSize: '$sm' as const,
    fontWeight: '$medium' as const,
  },
  userCountText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    fontWeight: '$normal' as const,
  },
  clearLinkText: {
    fontSize: '$sm' as const,
    color: '$textMutedForeground' as const,
    fontWeight: '$medium' as const,
    textDecorationLine: 'none' as const,
  },
}

