export const filterStyles = {
  container: {
    mt: '$5' as const,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  titleContainer: {
    mb: '$4' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  titleText: {
    fontSize: '$md' as const,
    fontWeight: '$semibold' as const,
    ml: '$2' as const,
  },
  filterFieldsContainer: {
    gap: '$4' as const,
    alignItems: 'flex-end' as const,
    flexWrap: 'wrap' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  searchContainer: {
    flex: 1,
    minWidth: 250,
  },
  roleContainer: {
    flex: 1,
    minWidth: 200,
  },
  statusContainer: {
    flex: 1,
    minWidth: 200,
  },
  filterContainer: {
    flex: 1,
    minWidth: 200,
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
};

