/**
 * Export utilities — PDF + PNG of spread pages.
 * Lazy-loads html-to-image and jspdf to keep initial bundle slim.
 *
 * Strategy: capture the existing on-screen .spread-wrapper at higher pixelRatio.
 * The capture target has class .no-export removed from its UI overlays via CSS.
 */

export interface ExportOptions {
  scope: "all" | "current";
  format: "pdf" | "png";
  dpi: 150 | 300;
  filename?: string;
  onProgress?: (cur: number, total: number, phase: string) => void;
  signal?: AbortSignal;
}

interface PageRef {
  id: string;
  index: number;
  // The actual DOM node will be looked up by [data-export-page-id]
}

const A3_LANDSCAPE_MM = { w: 420, h: 297 };
const PX_PER_MM_AT_96DPI = 96 / 25.4; // ~3.78
const NATURAL_PX = {
  w: Math.round(A3_LANDSCAPE_MM.w * PX_PER_MM_AT_96DPI), // ~1587
  h: Math.round(A3_LANDSCAPE_MM.h * PX_PER_MM_AT_96DPI), // ~1123
};

function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Export aborted", "AbortError");
}

async function captureSpread(node: HTMLElement, dpi: 150 | 300): Promise<string> {
  const { toPng } = await import("html-to-image");
  // pixelRatio: 96dpi viewport → target dpi
  const pixelRatio = dpi / 96;
  return toPng(node, {
    pixelRatio,
    cacheBust: true,
    backgroundColor: undefined, // preserve theme bg
    style: { transform: "none" } as Partial<CSSStyleDeclaration>,
  });
}

function findSpreadNodes(): HTMLElement[] {
  // The current visible spread is a single .spread-wrapper. For multi-page export,
  // we'd need to switch pages first; this single-page version captures the current view.
  const nodes = document.querySelectorAll<HTMLElement>(".spread-wrapper");
  return Array.from(nodes);
}

export async function exportToPNG(options: ExportOptions): Promise<Blob> {
  const { dpi, signal, onProgress } = options;
  const nodes = findSpreadNodes();
  if (nodes.length === 0) throw new Error("Aucun spread à exporter");

  onProgress?.(0, 1, "Capture...");
  checkAbort(signal);
  const dataUrl = await captureSpread(nodes[0], dpi);
  checkAbort(signal);

  // Convert dataURL → Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  onProgress?.(1, 1, "Terminé");
  return blob;
}

export async function exportToPDF(
  pageIds: string[],
  switchPage: (id: string) => void,
  options: ExportOptions,
): Promise<Blob> {
  const { dpi, signal, onProgress } = options;
  const { default: jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

  for (let i = 0; i < pageIds.length; i++) {
    checkAbort(signal);
    onProgress?.(i, pageIds.length, `Page ${i + 1}/${pageIds.length}`);

    // Switch page in the editor
    switchPage(pageIds[i]);
    // Wait for React to re-render (double rAF for safety)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // Extra delay for fonts/images to settle
    await new Promise((r) => setTimeout(r, 200));
    checkAbort(signal);

    const nodes = findSpreadNodes();
    if (nodes.length === 0) continue;
    const dataUrl = await captureSpread(nodes[0], dpi);
    checkAbort(signal);

    if (i > 0) pdf.addPage("a3", "landscape");
    pdf.addImage(dataUrl, "PNG", 0, 0, A3_LANDSCAPE_MM.w, A3_LANDSCAPE_MM.h, undefined, "FAST");
  }

  onProgress?.(pageIds.length, pageIds.length, "Encodage PDF...");
  checkAbort(signal);
  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { NATURAL_PX, A3_LANDSCAPE_MM };
