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
        className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "var(--border-subtle)", height: 36 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
          />
          <span className="text-[9px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.2em" }}>
            Inspector · {label}
          </span>
        </div>
        <button
          onClick={clearSelection}
          aria-label="Désélectionner"
          title="Fermer (Esc)"
          className="w-5 h-5 flex items-center justify-center transition-colors"
          style={{ color: "var(--fg-secondary)" }}
        >
          <IconClose size={11} />
        </button>
      </div>

      <div className="flex-1 min-h-0 scroll-y">
        <Inspector theme={theme} />
      </div>
    </aside>
  );
}
