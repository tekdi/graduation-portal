import { SHADOW_STYLES } from '@constants/styleConstants';

export const notFoundStyles = {
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '$borderLight300' as const,
    backgroundColor: '$white' as const,
  },
  containerBoxShadow: SHADOW_STYLES.containerBoxShadow,
  contentBox: {
    p: '$6' as const,
  },
  message: {
    fontSize: '$md' as const,
    color: '$textMutedForeground' as const,
  },
} as const;

