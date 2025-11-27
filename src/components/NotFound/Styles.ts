export const notFoundStyles = {
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight300' as const,
    backgroundColor: '$white' as const,
  },
  containerBoxShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px',
  contentBox: {
    p: '$6' as const,
  },
  message: {
    fontSize: '$md' as const,
    color: '$textMutedForeground' as const,
  },
} as const;

