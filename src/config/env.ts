/**
 * Environment configuration that works for both React Native and Web
 * 
 * For React Native (Android/iOS): Uses @env module created by babel-plugin-dotenv-import
 * For Web: Uses process.env injected by webpack.DefinePlugin via dotenv-webpack
 */

// Type declaration for @env module (React Native)
// This module is created by babel-plugin-dotenv-import at build time
declare module '@env' {
  export const API_BASE_URL: string;
  export const REACT_APP_API_BASE_URL: string;
  export const NODE_ENV: string;
}

// Type declaration for process.env (Web)
declare const process: {
  env: {
    API_BASE_URL?: string;
    REACT_APP_API_BASE_URL?: string;
    NODE_ENV?: string;
  };
} | undefined;

/**
 * Get API base URL from environment variables
 * Works for both React Native (Android/iOS) and Web platforms
 */
const getApiBaseUrl = (): string => {
  let apiBaseUrl: string | undefined;

  // Try React Native @env module first (created by babel-plugin-dotenv-import)
  // This works for Android and iOS builds
  try {
    // @ts-ignore - @env module is created at build time by babel-plugin-dotenv-import
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { API_BASE_URL: rnApiUrl, REACT_APP_API_BASE_URL: rnReactApiUrl } = require('@env');
    apiBaseUrl = rnApiUrl || rnReactApiUrl;
  } catch (e) {
    // @env module not available (likely web platform), continue to process.env
  }

  // Fallback to process.env (for web platform via webpack.DefinePlugin)
  if (!apiBaseUrl && typeof process !== 'undefined' && process?.env) {
    apiBaseUrl = process.env.API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  }

  // Return non-empty string or fallback to default
  const finalUrl = (apiBaseUrl && apiBaseUrl.trim()) || 'https://brac-dev.tekdinext.com';
  return finalUrl;
};

export const API_BASE_URL = getApiBaseUrl();

export default {
  API_BASE_URL,
};

