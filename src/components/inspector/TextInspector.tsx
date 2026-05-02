"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";

export default function TextInspector({ theme, zoneKey, slotId }: { theme: ArtDirection; zoneKey: string; slotId: string }) {
  const { contentStore } = useEditor();
  const content = contentStore[zoneKey] ?? {};
  const accent = theme.colors.accent;

  // slotId convention for text: `${zoneKey}-text-${field}`
  const field = slotId.startsWith(`${zoneKey}-text-`) ? slotId.replace(`${zoneKey}-text-`, "") : "";
  const value = field ? (content as Record<string, unknown>)[field] : undefined;
  const preview = typeof value === "string" ? value : "";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>TEXTE EN ÉDITION</div>
        <div className="text-[10px] font-mono mt-1" style={{ color: "#888" }}>{field || "—"}</div>
      </div>

      <div className="flex flex-col gap-2 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>Aperçu</div>
        <div className="text-[10px] p-2 leading-relaxed max-h-[120px] overflow-y-auto" style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#CCC" }}>
          {preview.slice(0, 240)}{preview.length > 240 ? "…" : ""}
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>Mise en forme</div>
        <div className="text-[10px] leading-relaxed" style={{ color: "#888" }}>
          La barre flottante apparaît pendant que vous éditez. Sélectionnez du texte pour appliquer un style.
        </div>
        <div className="flex flex-col gap-1.5 mt-1 text-[9px]" style={{ color: "#888" }}>
          <div><kbd style={kbdStyle}>⌘ B</kbd> Gras</div>
          <div><kbd style={kbdStyle}>⌘ I</kbd> Italique</div>
          <div><kbd style={kbdStyle}>⌘ Enter</kbd> Valider (multiline)</div>
          <div><kbd style={kbdStyle}>Esc</kbd> Annuler l&apos;édition</div>
        </div>
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: "1px 5px", border: "1px solid #2A2A3A", fontFamily: "monospace", fontSize: 8,
  marginRight: 6, display: "inline-block", minWidth: 24, textAlign: "center",
  color: "#AAA", backgroundColor: "#15151E",
};
