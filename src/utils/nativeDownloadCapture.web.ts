/**
 * nativeDownloadCapture.web.ts
 * ----------------------------
 * Web stub — webpack resolves this file instead of the native
 * implementation, preventing react-native-view-shot from being
 * bundled into the web build.
 *
 * captureAndSaveNative is a no-op on web; all web download logic
 * is handled by html2canvas inside downloadGraphCards.ts.
 */

import type { NativeCaptureResult, NativeDownloadFormat } from './nativeDownloadCapture';

export type { NativeCaptureResult, NativeDownloadFormat };

export async function captureAndSaveNative(
  _ref: React.RefObject<any>,
  format: NativeDownloadFormat,
  _filename: string,
): Promise<NativeCaptureResult> {
  console.warn('captureAndSaveNative: called on web — this is a no-op. Use html2canvas instead.');
  return { success: false, type: format };
}
