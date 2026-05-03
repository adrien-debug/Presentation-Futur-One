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
      className="flex items-center justify-between gap-5 no-export"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-panel)",
        height: 52,
        flexShrink: 0,
        paddingLeft: 14,
        paddingRight: 14,
      }}
    >
      {/* LEFT — back + brand + project + page */}
      <div className="flex items-center flex-shrink-0 min-w-0" style={{ gap: 14 }}>
        <Link
          href="/projects"
          className="touch-target flex items-center justify-center transition-colors flex-shrink-0 no-focus-ring"
          style={{
            height: 28,
            width: 28,
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)",
            backgroundColor: "transparent",
          }}
          title="Retour aux projets"
          aria-label="Retour"
        >
          <IconChevronLeft size={13} />
        </Link>

        <div className="flex items-center min-w-0" style={{ gap: 12 }}>
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              border: "1px solid var(--border-strong)",
              color: "var(--fg-primary)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
            aria-hidden
          >
            F1
          </div>
          <div className="flex flex-col min-w-0" style={{ lineHeight: 1.15 }}>
            <div
              className="truncate"
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                color: "var(--fg-primary)",
              }}
              title={projectName}
            >
              {projectName}
            </div>
            <div
              className="truncate"
              style={{
                fontSize: 11,
                color: "var(--fg-muted)",
                marginTop: 2,
              }}
            >
              <span style={{ fontFeatureSettings: "'tnum' 1", fontVariantNumeric: "tabular-nums" }}>
                {String(pageIndex + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>
              <span style={{ margin: "0 6px", color: "var(--border-strong)" }}>·</span>
              <span>{pageName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER — Mode switcher */}
      <div className="flex-1 flex justify-center min-w-0">
        <ModeSwitcher mode={mode} onChange={onModeChange} accent={accent} />
      </div>

      {/* RIGHT — actions */}
      <div className="flex items-center flex-shrink-0" style={{ gap: 6 }}>
        {/* Undo/Redo — paired group */}
        <div className="flex" style={{ gap: 0 }}>
          <IconButton onClick={onUndo} disabled={!canUndo} title="Annuler (⌘Z)">
            <IconUndo size={12} />
          </IconButton>
          <IconButton onClick={onRedo} disabled={!canRedo} title="Rétablir (⌘⇧Z)" attached="left">
            <IconRedo size={12} />
          </IconButton>
        </div>

        <Sep />

        {/* Grid */}
        <ToggleButton active={showGrid} onClick={() => onToggleGrid(!showGrid)} accent={accent} title="Grille (G)">
          <span style={{ fontSize: 10, letterSpacing: "0.06em", fontWeight: 500 }}>Grille</span>
        </ToggleButton>

        <Sep />

        {/* Sync status */}
        <SyncIndicator status={syncStatus} accent={accent} />

        {/* Save — neutre élevé, confirmation discrète */}
        <button
          onClick={onSave}
          title="Sauvegarder (⌘S)"
          className="flex items-center justify-center transition-colors"
          style={{
            height: 28,
            padding: "0 12px",
            gap: 6,
            border: "1px solid var(--border-subtle)",
            color: syncStatus === "saved" ? "var(--fg-primary)" : "var(--fg-secondary)",
            backgroundColor: "var(--bg-elevated)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            minWidth: 96,
          }}
        >
          {syncStatus === "saved"
            ? <><IconCheck size={11} /> Sauvegardé</>
            : "Sauvegarder"
          }
        </button>

        {/* Export — CTA primaire, l'unique aplat accent */}
        <button
          onClick={onExport}
          title="Exporter (⌘E)"
          className="flex items-center justify-center transition-colors"
          style={{
            height: 28,
            padding: "0 14px",
            gap: 6,
            border: `1px solid ${accent}`,
            color: "#05080F",
            backgroundColor: accent,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "-0.005em",
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

function IconButton({ children, onClick, disabled, title, attached }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string; attached?: "left" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="touch-target flex items-center justify-center transition-colors disabled:opacity-25"
      style={{
        height: 28,
        width: 28,
        border: "1px solid var(--border-subtle)",
        borderLeftWidth: attached === "left" ? 0 : 1,
        color: "var(--fg-secondary)",
        backgroundColor: "transparent",
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
      className="flex items-center justify-center transition-colors"
      style={{
        height: 28,
        padding: "0 10px",
        border: "1px solid var(--border-subtle)",
        color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
        backgroundColor: active ? "var(--bg-elevated)" : "transparent",
        boxShadow: active ? `inset 0 -1px 0 ${accent}` : "none",
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 18, margin: "0 4px", backgroundColor: "var(--border-subtle)" }} />;
}

function SyncIndicator({ status, accent }: { status: SyncStatus; accent: string }) {
  if (status === "idle") {
    return <div style={{ width: 0, height: 28 }} aria-hidden />;
  }

  const config = {
    dirty:   { label: "Non sauvegardé",   dot: "var(--fg-muted)",     color: "var(--fg-muted)" },
    syncing: { label: "Synchronisation",  dot: "var(--fg-secondary)", color: "var(--fg-secondary)" },
    saved:   { label: "Sauvegardé",       dot: accent,                color: "var(--fg-secondary)" },
    error:   { label: "Erreur de sync",   dot: "#E07070",             color: "#E07070" },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center whitespace-nowrap"
      style={{
        height: 28,
        gap: 8,
        padding: "0 8px",
        color: config.color,
        fontSize: 11,
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
