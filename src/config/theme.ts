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
      error: {
        light: '#dc2626',
        dark: '#f87171',
      },
      // Modal & UI colors
      modalBorder: '#8B2842',
      modalBackground: '#FFFFFF',
      modalBackdrop: 'rgba(0, 0, 0, 0.5)',
      inputBorder: '#E5E7EB',
      inputFocusBorder: '#8B2842',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      iconBackground: 'rgba(139, 40, 66, 0.08)',
      hoverBackground: '#F9FAFB',
    },
  },
  components: {
    ...gluestackConfig.components,
    Button: {
      ...gluestackConfig.components.Button,
    },
  },
} as const;
