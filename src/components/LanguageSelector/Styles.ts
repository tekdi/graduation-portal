export const stylesLanguageSelector = {
  menuTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '$1',
    px: '$2',
    py: '$1',
    rounded: '$lg',
    bg: 'transparent',
    _hover: { bg: '$backgroundLight100' },
  },
  menuTriggerText: {
    fontSize: '$sm',
  },
  menuTriggerIcon: {
    fontSize: '$xs',
  },
  modalContent: {
    rounded: '$2xl',
    maxHeight: '70%',
  },
  modalHeaderText: {
    fontSize: '$lg',
    fontWeight: '$bold',
  },
  languageItem: {
    rounded: '$lg',
    p: '$3',
  },
  languageItemText: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} as const;
