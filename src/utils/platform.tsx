import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface PlatformInfo {
  /**
   * The current platform OS ('web' | 'ios' | 'android')
   */
  platform: 'web' | 'ios' | 'android';
  /**
   * Whether the device is mobile
   * - On web: true if window width < 768px
   * - On native: always true (iOS/Android are mobile platforms)
   */
  isMobile: boolean;
  /**
   * Convenience property: true if platform is web
   */
  isWeb: boolean;
  /**
   * Convenience property: true if platform is native (iOS or Android)
   */
  isNative: boolean;
}

/**
 * Hook to get platform information and mobile detection
 * @param mobileBreakpoint - Width breakpoint for mobile detection on web (default: 768)
 * @returns PlatformInfo object with platform, isMobile, isWeb, and isNative
 *
 * @example
 * ```tsx
 * const { platform, isMobile, isWeb } = usePlatform();
 * if (isWeb && !isMobile) {
 *   // Desktop web code
 * }
 * ```
 *
 * @example
 * ```tsx
 * const { isMobile } = usePlatform(1024); // Custom breakpoint
 * ```
 */
export const usePlatform = (mobileBreakpoint: number = 768): PlatformInfo => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return window.innerWidth < mobileBreakpoint;
      }
      return false;
    }
    // Native platforms (iOS/Android) are always mobile
    return true;
  });

  const platform = Platform.OS as 'web' | 'ios' | 'android';
  const isWeb = platform === 'web';
  const isNative = !isWeb;

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return;
      }

      const handleResize = () => {
        setIsMobile(window.innerWidth < mobileBreakpoint);
      };

      // Set initial value
      handleResize();

      // Listen for window resize
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [mobileBreakpoint]);

  return {
    platform,
    isMobile,
    isWeb,
    isNative,
  };
};
