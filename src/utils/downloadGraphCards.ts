/**
 * downloadGraphCards
 * ------------------
 * Utility functions to capture DOM elements and download them
 * as a single landscape PDF or JPG file.
 *
 * Exports:
 *   captureElement(id)         → captures a DOM element as a canvas
 *   downloadFromCanvases(...)  → combines canvases into one PDF/JPG and downloads
 *   downloadGraphCards(...)    → simple wrapper: capture array of IDs + download
 *
 * - Hides elements with data-hide-on-download attribute before capture.
 * - Always produces landscape orientation for PDF.
 * - Combines all captured canvases into a single file.
 */

import { Platform } from 'react-native';
import React from 'react';
import { captureAndSaveNative } from './nativeDownloadCapture';

/* ------------------------------------------------------------------ */
/*  Hide / Restore helpers                                            */
/* ------------------------------------------------------------------ */

/** Hide all elements marked with data-hide-on-download. Returns refs to restore later. */
export function hideDownloadElements(): HTMLElement[] {
  if (Platform.OS !== 'web') return [];
  const hidden: HTMLElement[] = [];
  document.querySelectorAll('[data-hide-on-download]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style.display !== 'none') {
      hidden.push(htmlEl);
      htmlEl.style.display = 'none';
    }
  });
  return hidden;
}

/** Restore previously hidden elements. */
export function restoreDownloadElements(hidden: HTMLElement[]): void {
  hidden.forEach((el) => {
    el.style.display = '';
  });
}

/* ------------------------------------------------------------------ */
/*  Capture element                                                    */
/* ------------------------------------------------------------------ */

/** Capture a single DOM element by ID and return the canvas. */
export async function captureElement(elementId: string): Promise<HTMLCanvasElement | null> {
  if (Platform.OS !== 'web') return null;
  const html2canvas = require('html2canvas');
  const el = document.getElementById(elementId);
  if (!el) return null;
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: el.scrollWidth,
    height: el.scrollHeight,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
    scrollX: 0,
    scrollY: -window.scrollY,
    onclone: (clonedDoc: any) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        clonedEl.style.overflow = 'visible';
        clonedEl.style.width = `${el.scrollWidth}px`;
        const svgs = clonedEl.getElementsByTagName('svg');
        for (let i = 0; i < svgs.length; i++) {
          svgs[i].style.overflow = 'visible';
        }
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Combine canvases + download                                       */
/* ------------------------------------------------------------------ */

/** Combine an array of canvases vertically and download as PDF or JPG. */
export function downloadFromCanvases(
  canvases: HTMLCanvasElement[],
  format: 'pdf' | 'jpg',
  filename: string
): void {
  if (canvases.length === 0) return;

  const gap = 40; // px gap between cards
  const maxWidth = Math.max(...canvases.map((c) => c.width));
  const A4_PORTRAIT_RATIO = 1.4142;
  const minPageHeight = maxWidth * A4_PORTRAIT_RATIO;
  const maxCanvasHeight = Math.max(...canvases.map((c) => c.height));

  // A single page should be tall enough to fit the tallest graph plus margins, or standard A4 ratio
  const pageHeight = Math.max(minPageHeight, maxCanvasHeight + gap * 2);

  // Group canvases into pages
  const pages: HTMLCanvasElement[][] = [];
  let currentPage: HTMLCanvasElement[] = [];
  let currentY = gap;

  for (const canvas of canvases) {
    if (currentY + canvas.height > pageHeight - gap && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [canvas];
      currentY = gap + canvas.height + gap;
    } else {
      currentPage.push(canvas);
      currentY += canvas.height + gap;
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const sanitized = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  if (format === 'pdf') {
    const { jsPDF } = require('jspdf');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [maxWidth, pageHeight],
    });

    pages.forEach((pageCanvases, pageIndex) => {
      if (pageIndex > 0) {
        pdf.addPage([maxWidth, pageHeight], 'p');
      }
      let yOffset = gap;
      for (const canvas of pageCanvases) {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const xOffset = (maxWidth - canvas.width) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, canvas.width, canvas.height);
        yOffset += canvas.height + gap;
      }
    });

    pdf.save(`${sanitized}.pdf`);
  } else {
    const JSZip = require('jszip');
    const zip = new JSZip();

    pages.forEach((pageCanvases, pageIndex) => {
      const actualPageHeight = pageCanvases.reduce((sum, c) => sum + c.height, 0) + gap * (pageCanvases.length + 1);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = maxWidth;
      pageCanvas.height = actualPageHeight;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      let yOffset = gap;
      for (const canvas of pageCanvases) {
        const xOffset = (maxWidth - canvas.width) / 2;
        ctx.drawImage(canvas, xOffset, yOffset);
        yOffset += canvas.height + gap;
      }

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const base64Data = imgData.replace(/^data:image\/(png|jpeg);base64,/, "");

      const fileName = pages.length > 1 ? `${sanitized}_page_${pageIndex + 1}.jpg` : `${sanitized}.jpg`;
      zip.file(fileName, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitized}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Simple one-shot wrapper (for cards without toggle)                */
/* ------------------------------------------------------------------ */

export interface DownloadGraphCardsOptions {
  elementIds: string[];
  format: 'pdf' | 'jpg';
  filename?: string;
}

export async function downloadGraphCards(
  options: DownloadGraphCardsOptions
): Promise<void> {
  if (Platform.OS !== 'web') return;
  const { elementIds, format, filename = 'graphs' } = options;

  const hidden = hideDownloadElements();
  try {
    const canvases: HTMLCanvasElement[] = [];
    for (const id of elementIds) {
      const canvas = await captureElement(id);
      if (canvas) canvases.push(canvas);
    }
    downloadFromCanvases(canvases, format, filename);
  } finally {
    restoreDownloadElements(hidden);
  }
}

/* ------------------------------------------------------------------ */
/*  React Element Download Logic                                      */
/* ------------------------------------------------------------------ */

export type DownloadType = 'pdf' | 'jpg' | 'png';

/** Helper to render a React Element off-screen and capture as canvas */
async function renderAndCaptureReactElement(
  elements: React.ReactElement
): Promise<HTMLCanvasElement | null> {
  if (Platform.OS !== 'web') return null;

  const ReactDOMClient = require('react-dom/client');
  const html2canvas = require('html2canvas');
  const { LanguageProvider } = require('@contexts/LanguageContext');
  const { GluestackUIProvider } = require('@gluestack-ui/themed');
  const { theme } = require('@config/theme');

  // Create off-screen container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '1200px'; // Render in standard desktop width
  container.style.backgroundColor = '#ffffff';
  document.body.appendChild(container);

  const root = ReactDOMClient.createRoot(container);

  root.render(
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(
        GluestackUIProvider,
        { config: theme },
        elements
      )
    )
  );

  // Wait 1.5 seconds for UI elements, icons, and charts to fully render & animate
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      onclone: (clonedDoc: any) => {
        const paths = clonedDoc.getElementsByTagName('path');
        for (let i = 0; i < paths.length; i++) {
          paths[i].removeAttribute('stroke-dasharray');
          paths[i].removeAttribute('stroke-dashoffset');
          paths[i].style.strokeDasharray = 'none';
          paths[i].style.strokeDashoffset = '0';
        }
      }
    });
    return canvas;
  } finally {
    // Unmount and clean up DOM
    root.unmount();
    document.body.removeChild(container);
  }
}

export const donloadReactElement = async (
  elements: React.ReactElement,
  type: DownloadType = 'pdf',
  filename: string = 'download',
  nativeRef?: React.RefObject<any>,
) => {
  if (type === 'pdf') {
    return await donloadPdfByReactElement(elements, filename, nativeRef);
  }

  return await donloadImageByReactElement(elements, type, filename, nativeRef);
};

export const downloadReactElement = donloadReactElement;

export const donloadPdfByReactElement = async (
  elements: React.ReactElement,
  filename: string = 'download',
  nativeRef?: React.RefObject<any>,
) => {
  try {
    const sanitized = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // ── Native (Android/iOS) ──────────────────────────────────────────
    if (Platform.OS !== 'web') {
      const res = await captureAndSaveNative(nativeRef!, 'pdf', sanitized);
      return res;
    }

    // ── Web ──────────────────────────────────────────────────────────
    const canvas = await renderAndCaptureReactElement(elements);
    if (!canvas) {
      throw new Error('Failed to capture canvas from React Element');
    }

    const { jsPDF } = require('jspdf');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const orientation = canvas.width > canvas.height ? 'l' : 'p';

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${sanitized}.pdf`);

    return {
      success: true,
      type: 'pdf' as const,
    };
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
};

export const downloadPdfByReactElement = donloadPdfByReactElement;

export const donloadImageByReactElement = async (
  elements: React.ReactElement,
  type: 'jpg' | 'png' = 'jpg',
  filename: string = 'download',
  nativeRef?: React.RefObject<any>,
) => {
  try {
    const sanitized = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // ── Native (Android/iOS) ──────────────────────────────────────────
    if (Platform.OS !== 'web') {
      const res = await captureAndSaveNative(nativeRef!, type, sanitized);
      return res;
    }

    // ── Web ──────────────────────────────────────────────────────────
    const canvas = await renderAndCaptureReactElement(elements);
    if (!canvas) {
      throw new Error('Failed to capture canvas from React Element');
    }

    const mimeType = type === 'png' ? 'image/png' : 'image/jpeg';
    const extension = type === 'png' ? 'png' : 'jpg';

    const imgData = canvas.toDataURL(mimeType, 0.95);
    const base64Data = imgData.replace(/^data:image\/(png|jpeg);base64,/, "");

    const JSZip = require('jszip');
    const zip = new JSZip();
    zip.file(`${sanitized}.${extension}`, base64Data, { base64: true });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitized}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      type,
    };
  } catch (error) {
    console.error('Image download failed:', error);
    throw error;
  }
};

export const downloadImageByReactElement = donloadImageByReactElement;
// Cache bust
