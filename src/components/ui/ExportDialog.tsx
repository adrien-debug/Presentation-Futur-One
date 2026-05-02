"use client";

import React, { useState, useRef } from "react";
import { ArtDirection } from "@/design-system";
import { Page } from "@/data/types";
import { useEditor } from "@/contexts/EditorContext";
import { exportToPDF, exportToPNG, downloadBlob } from "@/utils/export";

export default function ExportDialog({
  theme, pages, currentPageId, onClose,
}: {
  theme: ArtDirection;
  pages: Page[];
  currentPageId: string;
  onClose: () => void;
}) {
  const { switchPage } = useEditor();
  const accent = theme.colors.accent;
  const [format, setFormat] = useState<"pdf" | "png">("pdf");
  const [scope, setScope] = useState<"all" | "current">("all");
  const [dpi, setDpi] = useState<150 | 300>(150);
  const [filename, setFilename] = useState(`futur-one-${Date.now().toString(36)}`);
  const [progress, setProgress] = useState<{ cur: number; total: number; phase: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const exporting = progress !== null;

  const handleExport = async () => {
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    setProgress({ cur: 0, total: 1, phase: "Préparation..." });

    try {
      const onProgress = (cur: number, total: number, phase: string) =>
        setProgress({ cur, total, phase });

      if (format === "png") {
        // PNG: capture the current view only (single spread)
        const blob = await exportToPNG({
          format: "png", scope: "current", dpi,
          onProgress, signal: controller.signal,
        });
        downloadBlob(blob, `${filename}.png`);
      } else {
        // PDF: capture all pages or just current
        const targetIds = scope === "all" ? pages.map((p) => p.id) : [currentPageId];
        const blob = await exportToPDF(targetIds, switchPage, {
          format: "pdf", scope, dpi,
          onProgress, signal: controller.signal,
        });
        downloadBlob(blob, `${filename}.pdf`);
        // Restore current page
        switchPage(currentPageId);
      }
      setProgress(null);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if ((e as DOMException).name !== "AbortError") {
        setError(msg);
      }
      setProgress(null);
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setProgress(null);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={exporting ? undefined : onClose}
    >
      <div
        className="relative w-[min(480px,90vw)]"
        style={{ backgroundColor: "#0D0D14", border: `1px solid ${accent}40`, boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#1E1E2A" }}>
          <div>
            <div className="text-[8px] font-mono uppercase tracking-widest mb-0.5" style={{ color: accent, letterSpacing: "0.2em" }}>
              EXPORTER
            </div>
            <div className="text-[14px] font-bold" style={{ color: "#E8E8EE" }}>
              {pages.length} page{pages.length > 1 ? "s" : ""} · A3 paysage
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={exporting}
            className="text-[14px] font-mono w-7 h-7 flex items-center justify-center disabled:opacity-30"
            style={{ border: "1px solid #2A2A3A", color: "#888" }}
          >×</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Format */}
          <Field label="Format" theme={theme}>
            <div className="grid grid-cols-2 gap-2">
              <SegmentBtn active={format === "pdf"} accent={accent} onClick={() => setFormat("pdf")}>PDF</SegmentBtn>
              <SegmentBtn active={format === "png"} accent={accent} onClick={() => setFormat("png")}>PNG</SegmentBtn>
            </div>
          </Field>

          {/* Scope (PDF only) */}
          {format === "pdf" && (
            <Field label="Étendue" theme={theme}>
              <div className="grid grid-cols-2 gap-2">
                <SegmentBtn active={scope === "all"} accent={accent} onClick={() => setScope("all")}>
                  Toutes ({pages.length})
                </SegmentBtn>
                <SegmentBtn active={scope === "current"} accent={accent} onClick={() => setScope("current")}>
                  Page courante
                </SegmentBtn>
              </div>
            </Field>
          )}

          {/* Quality */}
          <Field label="Qualité" theme={theme}>
            <div className="grid grid-cols-2 gap-2">
              <SegmentBtn active={dpi === 150} accent={accent} onClick={() => setDpi(150)}>
                Preview 150dpi
              </SegmentBtn>
              <SegmentBtn active={dpi === 300} accent={accent} onClick={() => setDpi(300)}>
                Print 300dpi
              </SegmentBtn>
            </div>
            {dpi === 300 && (
              <div className="text-[8px] mt-1" style={{ color: "#E0B070" }}>
                ⚠ 300dpi = capture lente (~2s par page)
              </div>
            )}
          </Field>

          {/* Filename */}
          <Field label="Nom du fichier" theme={theme}>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 text-[10px] font-mono px-2 py-1.5"
                style={{ background: "#16161F", border: "1px solid #2A2A3A", color: "#E5E5EE", outline: "none" }}
              />
              <span className="text-[10px] font-mono" style={{ color: "#666" }}>.{format}</span>
            </div>
          </Field>

          {/* Progress */}
          {progress && (
            <div className="flex flex-col gap-1.5 p-3" style={{ backgroundColor: "#16161F", border: `1px solid ${accent}40` }}>
              <div className="flex justify-between text-[9px] font-mono" style={{ color: accent }}>
                <span>{progress.phase}</span>
                <span>{progress.cur} / {progress.total}</span>
              </div>
              <div className="h-1" style={{ backgroundColor: "#2A2A3A" }}>
                <div
                  className="h-full transition-all duration-200"
                  style={{ backgroundColor: accent, width: `${progress.total ? (progress.cur / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-[10px] p-2" style={{ backgroundColor: "#3A1A1A", color: "#E07070", border: "1px solid #5A2A2A" }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: "#1E1E2A" }}>
          {exporting ? (
            <button
              onClick={handleCancel}
              className="text-[10px] font-mono uppercase px-4 py-1.5"
              style={{ border: "1px solid #5A2A2A", color: "#E07070" }}
            >Annuler</button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="text-[10px] font-mono uppercase px-4 py-1.5"
                style={{ border: "1px solid #2A2A3A", color: "#888" }}
              >Fermer</button>
              <button
                onClick={handleExport}
                className="text-[10px] font-mono uppercase px-4 py-1.5"
                style={{ border: `1px solid ${accent}`, backgroundColor: `${accent}20`, color: accent }}
              >↓ Exporter</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, theme, children }: { label: string; theme: ArtDirection; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function SegmentBtn({ active, accent, onClick, children }: { active: boolean; accent: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] font-mono uppercase py-1.5"
      style={{
        border: `1px solid ${active ? accent : "#2A2A3A"}`,
        backgroundColor: active ? `${accent}22` : "#16161F",
        color: active ? accent : "#C5C5D0",
      }}
    >{children}</button>
  );
}
