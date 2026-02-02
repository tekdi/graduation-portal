/**
 * Shared filter type definitions
 * Used across different filter configuration files
 */

// Type definition for filter configuration
export type FilterConfig = {
  name?: string; // Fallback if nameKey is not provided
  nameKey?: string; // Translation key for the filter name
  attr: string;
  type: 'search' | 'select';
  data: Array<
    string | { label?: string; labelKey?: string; value: string | null }
  >;
  placeholder?: string; // Fallback if placeholderKey is not provided
  placeholderKey?: string; // Translation key for the placeholder
  disabled?: boolean; // Disable the filter (e.g., district when no province selected)
};
