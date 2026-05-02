"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import Inspector from "@/components/inspector/Inspector";
import { IconClose } from "@/components/ui/Icon";

interface Props {
  theme: ArtDirection;
}

/**
 * ContextInspector — only renders when the user has selected something on the canvas.
 * Wraps the existing Inspector component but in a more compact, contextual frame.
 * Lives at the bottom of the right panel, above SmartToolbar fades or replaces it.
 */
export default function ContextInspector({ theme }: Props) {
  const { selection, clearSelection } = useEditor();
  const accent = theme.colors.accent;

  if (!selection.kind) return null;

  return (
    <div
      className="flex flex-col absolute right-0 bottom-0 no-export"
      style={{
        width: "min(360px, 28vw)",
        maxHeight: "60dvh",
        backgroundColor: "var(--bg-panel)",
        borderTop:  "1px solid var(--border-strong)",
        borderLeft: "1px solid var(--border-strong)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
        zIndex: 40,
      }}
    >
      {/* Header */}
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
            Inspector · {selection.kind}
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

      {/* Content */}
      <div className="flex-1 scroll-y">
        <Inspector theme={theme} onClose={clearSelection} />
      </div>
    </div>
  );
}
