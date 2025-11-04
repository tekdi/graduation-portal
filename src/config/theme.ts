import { config as gluestackConfig } from '@gluestack-ui/config';
export const theme = {
  ...gluestackConfig,
  tokens: {
    ...gluestackConfig.tokens,
    colors: {
      ...gluestackConfig.tokens.colors,
      primary: '#8B2842',
      primaryLight: '#A53E54',
      primaryDark: '#6B1E31',
      secondary: '#9c27b0',
      background: '#f5f5f5',
      surface: '#fff',
      error: '#d32f2f',
      text: '#212121',
    },
  },
  components: {
    ...gluestackConfig.components,
    Button: {
      ...gluestackConfig.components.Button,
    },
  },
} as const;
