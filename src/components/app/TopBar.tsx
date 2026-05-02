"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ModeSwitcher, { AppMode } from "./ModeSwitcher";
import {
  IconChevronLeft, IconUndo, IconRedo, IconCheck,
  IconDownload, IconHelp,
} from "@/components/ui/Icon";
import type { SyncStatus } from "@/hooks/useCloudSync";

interface TopBarProps {
  projectName: string;
  pageName: string;
  pageIndex: number;
  totalPages: number;

  mode: AppMode;
  onModeChange: (m: AppMode) => void;

  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  showGrid: boolean;
  onToggleGrid: (v: boolean) => void;

  onSave: () => void;
  onExport: () => void;
  onHelp: () => void;

  syncStatus: SyncStatus;
  accent: string;
}

export default function TopBar({
  projectName, pageName, pageIndex, totalPages,
  mode, onModeChange,
  canUndo, canRedo, onUndo, onRedo,
  showGrid, onToggleGrid,
  onSave, onExport, onHelp,
  syncStatus, accent,
}: TopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  return (
    <header
      className="flex items-center justify-between gap-4 px-3 py-2 border-b no-export"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-panel)",
        height: 48,
        flexShrink: 0,
      }}
    >
      {/* LEFT — back + brand + project + page */}
      <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
        <Link
          href="/projects"
          className="h-8 w-8 touch-target flex items-center justify-center transition-colors flex-shrink-0"
          style={{ border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)", backgroundColor: "var(--bg-elevated)" }}
          title="Retour aux projets"
          aria-label="Retour"
        >
          <IconChevronLeft size={13} />
        </Link>

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{ backgroundColor: accent, color: "#05080F" }}
          >F1</div>
          <div className="flex flex-col min-w-0">
            <div className="text-[11px] font-semibold uppercase truncate" style={{ letterSpacing: "0.12em" }}>
              {projectName}
            </div>
            <div className="text-[9px] truncate" style={{ color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
              {String(pageIndex + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")} · {pageName}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER — Mode switcher */}
      <div className="flex-1 flex justify-center min-w-0">
        <ModeSwitcher mode={mode} onChange={onModeChange} accent={accent} />
      </div>

      {/* RIGHT — actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Undo/Redo */}
        <div className="flex">
          <IconButton onClick={onUndo} disabled={!canUndo} title="Annuler (⌘Z)">
            <IconUndo size={12} />
          </IconButton>
          <IconButton onClick={onRedo} disabled={!canRedo} title="Rétablir (⌘⇧Z)">
            <IconRedo size={12} />
          </IconButton>
        </div>

        <Sep />

        {/* Grid */}
        <ToggleButton active={showGrid} onClick={() => onToggleGrid(!showGrid)} accent={accent} title="Grille (G)">
          <span style={{ fontSize: 9, letterSpacing: "0.08em" }}>GRID</span>
        </ToggleButton>

        <Sep />

        {/* Sync status + Save */}
        <SyncIndicator status={syncStatus} accent={accent} />

        <button
          onClick={onSave}
          title="Sauvegarder (⌘S)"
          className="h-8 px-3 flex items-center gap-1.5 text-[10px] uppercase font-semibold transition-all"
          style={{
            border: `1px solid ${syncStatus === "saved" ? `${accent}80` : "var(--border-subtle)"}`,
            color: syncStatus === "saved" ? accent : "var(--fg-primary)",
            backgroundColor: syncStatus === "saved" ? `${accent}12` : "var(--bg-elevated)",
            letterSpacing: "0.08em",
            minWidth: 92,
          }}
        >
          {syncStatus === "saved"
            ? <><IconCheck size={11} /> Sauvegardé</>
            : "Sauvegarder"
          }
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          title="Exporter (⌘E)"
          className="h-8 px-3 flex items-center gap-1.5 text-[10px] uppercase font-semibold transition-colors"
          style={{
            border: `1px solid ${accent}80`,
            color: accent,
            backgroundColor: `${accent}12`,
            letterSpacing: "0.08em",
          }}
        >
          <IconDownload size={12} /> Export
        </button>

        <Sep />

        {/* Fullscreen */}
        <IconButton onClick={toggleFullscreen} title={isFullscreen ? "Quitter plein écran" : "Plein écran"}>
          <FullscreenIcon active={isFullscreen} />
        </IconButton>

        {/* Help */}
        <IconButton onClick={onHelp} title="Raccourcis (?)">
          <IconHelp size={12} />
        </IconButton>
      </div>
    </header>
  );
}

// ─── Atoms ─────────────────────────────────────────────────────────────────────

function IconButton({ children, onClick, disabled, title }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="h-8 w-8 touch-target flex items-center justify-center transition-colors disabled:opacity-25"
      style={{
        border: "1px solid var(--border-subtle)",
        color: "var(--fg-secondary)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      {children}
    </button>
  );
}

function ToggleButton({ active, onClick, accent, title, children }: { active: boolean; onClick: () => void; accent: string; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="h-8 px-2.5 flex items-center justify-center transition-colors uppercase"
      style={{
        border: `1px solid ${active ? `${accent}50` : "var(--border-subtle)"}`,
        color: active ? accent : "var(--fg-secondary)",
        backgroundColor: active ? `${accent}10` : "var(--bg-elevated)",
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border-subtle)" }} />;
}

function SyncIndicator({ status, accent }: { status: SyncStatus; accent: string }) {
  if (status === "idle") {
    return <div style={{ width: 0, height: 28 }} aria-hidden />;
  }

  const config = {
    dirty:   { label: "Non sauvegardé",      dot: "var(--fg-muted)",  color: "var(--fg-secondary)" },
    syncing: { label: "Synchronisation…",    dot: accent,             color: "var(--fg-secondary)" },
    saved:   { label: "Sauvegardé",          dot: accent,             color: accent },
    error:   { label: "Erreur de sync",      dot: "#FF5C7A",          color: "#FF5C7A" },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-1.5 px-2 text-[10px] uppercase whitespace-nowrap"
      style={{
        height: 28,
        color: config.color,
        letterSpacing: "0.08em",
        fontWeight: 500,
      }}
    >
      <SyncDot color={config.dot} pulse={status === "syncing"} />
      <span>{config.label}</span>
    </div>
  );
}

function SyncDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: color,
        animation: pulse ? "futur-sync-pulse 1.1s ease-in-out infinite" : "none",
      }}
    />
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {active ? (
        <>
          <path d="M9 4H4v5" /><path d="M15 4h5v5" /><path d="M15 20h5v-5" /><path d="M9 20H4v-5" />
        </>
      ) : (
        <>
          <path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M20 15v5h-5" /><path d="M4 15v5h5" />
        </>
      )}
    </svg>
  );
}
