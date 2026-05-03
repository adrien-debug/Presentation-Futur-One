"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import Inspector from "@/components/inspector/Inspector";
import { IconClose } from "@/components/ui/Icon";

interface Props {
  theme: ArtDirection;
}

const KIND_LABELS: Record<string, string> = {
  zone:  "Section",
  image: "Image",
  chart: "Graphique",
  text:  "Texte",
  kpi:   "KPI",
};

/**
 * ContextInspector — fills the right panel when something is selected.
 * Renders inline (not floating). Used as a swap-in replacement for SmartToolbar.
 */
export default function ContextInspector({ theme }: Props) {
  const { selection, clearSelection } = useEditor();
  const accent = theme.colors.accent;
  const label = selection.kind ? (KIND_LABELS[selection.kind] ?? selection.kind) : "";

  return (
    <aside
      className="flex flex-col h-full no-export"
      style={{
        borderLeft: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-panel)",
      }}
    >
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          height: 44,
          padding: "0 16px",
        }}
      >
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            aria-hidden
            style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: accent }}
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
            Inspecteur
          </span>
          <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{label}</span>
        </div>
        <button
          onClick={clearSelection}
          aria-label="Désélectionner"
          title="Fermer (Esc)"
          className="flex items-center justify-center transition-colors"
          style={{
            width: 22,
            height: 22,
            color: "var(--fg-muted)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <IconClose size={10} />
        </button>
      </div>

      <div className="flex-1 min-h-0 scroll-y">
        <Inspector theme={theme} />
      </div>
    </aside>
  );
}
