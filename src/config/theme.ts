import { config as gluestackConfig } from '@gluestack-ui/config';
export const theme = {
  ...gluestackConfig,
  tokens: {
    ...gluestackConfig.tokens,
    colors: {
      ...gluestackConfig.tokens.colors,
      primary500: '#8B2842',
      primary600: '#A53E54',
      primary700: '#6B1E31',
      info100: '#0ea5e9',
      accent100: '#F1F5F94D',
      accent200: '#10B981',
      backgroundPrimary: {
        light: '#ffffff',
        dark: '#1a1a1a',
      },
      foreground: 'oklch(0.145 0 0)',
      mutedForeground: '#717182',
      textMutedForeground: '#64748b',
      textForeground: '#2d2d2d',
      bgSidebar: '#f8fafc',
    },
  },
  components: {
    ...gluestackConfig.components,
    Button: {
      ...gluestackConfig.components.Button,
    },
  },
} as const;
