/**
 * nativeDownloadCapture
 * ----------------------
 * Utility to capture a native React ref (via react-native-view-shot)
 * and save the result as a PDF, JPG, or PNG on Android / iOS.
 *
 * This file is intentionally NOT used on Web — all web download logic
 * lives in downloadGraphCards.ts. Platform guards are included here as
 * a safety net.
 */

import { Platform } from 'react-native';

export type NativeDownloadFormat = 'pdf' | 'jpg' | 'png';

export interface NativeCaptureResult {
  success: boolean;
  type: NativeDownloadFormat;
  filePath?: string;
}

/**
 * Capture a native view ref and save the output to the device's
 * Downloads / Gallery folder.
 *
 * @param ref        - React ref attached to the view to capture
 * @param format     - 'pdf' | 'jpg' | 'png'
 * @param filename   - base filename (no extension, no special chars)
 */
export async function captureAndSaveNative(
  ref: React.RefObject<any>,
  format: NativeDownloadFormat,
  filename: string,
): Promise<NativeCaptureResult> {
  // This function should only run on Android / iOS
  if (Platform.OS === 'web') {
    console.warn('captureAndSaveNative: called on web — skipping.');
    return { success: false, type: format };
  }

  if (!ref || !ref.current) {
    throw new Error('captureAndSaveNative: ref is null or not attached to a view.');
  }

  const { captureRef } = require('react-native-view-shot');
  const ReactNativeBlobUtil = require('react-native-blob-util').default;

  // Determine image format for view-shot
  const imageFormat: 'jpg' | 'png' = format === 'png' ? 'png' : 'jpg';

  // Capture the view as a temporary file URI
  const tempUri: string = await captureRef(ref, {
    format: imageFormat,
    quality: 0.95,
  });

  // Determine save directory
  const dirs = ReactNativeBlobUtil.fs.dirs;
  const saveDir =
    Platform.OS === 'android'
      ? dirs.DownloadDir          // Android: /sdcard/Download
      : dirs.DocumentDir;         // iOS: app Documents folder

  const sanitized = filename.replace(/[^a-z0-9_]/gi, '_').toLowerCase();

  if (format === 'pdf') {
    // ── PDF: embed the captured image into a minimal single-page PDF ──
    const { jsPDF } = require('jspdf');

    // Read captured image as base64
    const base64Img: string = await ReactNativeBlobUtil.fs.readFile(tempUri, 'base64');

    // We don't know exact pixel size without the DOM, so use A4 landscape
    const pageW = 842;
    const pageH = 595;

    const pdf = new jsPDF({
      orientation: 'l',
      unit: 'px',
      format: [pageW, pageH],
    });
    pdf.addImage(`data:image/${imageFormat};base64,${base64Img}`, 'JPEG', 0, 0, pageW, pageH);

    const pdfBase64: string = pdf.output('datauristring').split(',')[1];
    const destPath = `${saveDir}/${sanitized}.pdf`;

    await ReactNativeBlobUtil.fs.writeFile(destPath, pdfBase64, 'base64');

    // Clean up temp file
    try { await ReactNativeBlobUtil.fs.unlink(tempUri); } catch (_) {}

    return { success: true, type: 'pdf', filePath: destPath };
  } else {
    // ── Image (JPG / PNG): move temp file to final destination ──
    const extension = imageFormat;
    const destPath = `${saveDir}/${sanitized}.${extension}`;

    await ReactNativeBlobUtil.fs.mv(tempUri, destPath);

    // On Android, notify the media scanner so the file appears in Gallery
    if (Platform.OS === 'android') {
      try {
        const { NativeModules } = require('react-native');
        if (NativeModules.RNFetchBlob?.scanFile) {
          NativeModules.RNFetchBlob.scanFile([{ path: destPath }]);
        }
      } catch (_) {}
    }

    return { success: true, type: format, filePath: destPath };
  }
}
