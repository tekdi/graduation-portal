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
    },
  },
  components: {
    ...gluestackConfig.components,
    Button: {
      ...gluestackConfig.components.Button,
    },
  },
} as const;
