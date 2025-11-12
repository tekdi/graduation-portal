/**
 * Typography Styles
 * Reusable typography configurations for Gluestack UI
 */

export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: '$2xl',
    fontWeight: '$medium' as const, // 500
    lineHeight: '$2xl', // ~1.5
  },
  h2: {
    fontSize: '$xl',
    fontWeight: '$medium' as const, // 500
    lineHeight: '$xl', // ~1.5
  },
  h3: {
    fontSize: '$lg',
    fontWeight: '$medium' as const, // 500
    lineHeight: '$lg', // ~1.5
  },
  h4: {
    fontSize: '$md', // base
    fontWeight: '$medium' as const, // 500
    lineHeight: '$md', // 1.5
  },

  // Text Elements
  label: {
    fontSize: '$md', // base
    fontWeight: '$medium' as const, // 500
    lineHeight: '$md', // 1.5
  },
  paragraph: {
    fontSize: '$md', // base
    fontWeight: '$normal' as const, // 400
    lineHeight: '$md', // 1.5
  },
  input: {
    fontSize: '$md', // base
    fontWeight: '$normal' as const, // 400
    lineHeight: '$md', // 1.5
  },
  button: {
    fontSize: '$md', // base
    fontWeight: '$medium' as const, // 500
    lineHeight: '$md', // 1.5
  },

  // Additional utility styles
  bodyLarge: {
    fontSize: '$lg',
    fontWeight: '$normal' as const,
    lineHeight: '$lg',
  },
  bodySmall: {
    fontSize: '$sm',
    fontWeight: '$normal' as const,
    lineHeight: '$sm',
  },
  caption: {
    fontSize: '$xs',
    fontWeight: '$normal' as const,
    lineHeight: '$xs',
  },
} as const;

// Type for autocomplete
export type TypographyVariant = keyof typeof TYPOGRAPHY;
