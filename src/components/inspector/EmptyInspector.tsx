"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";

export default function EmptyInspector({ theme }: { theme: ArtDirection }) {
  const { hideHeader, hideFooter, toggleHeaderVisibility, toggleFooterVisibility, pages, currentPageId } = useEditor();
  const accent = theme.colors.accent;
  const currentPage = pages.find((p) => p.id === currentPageId);

  return (
    <div className="flex flex-col gap-4">
      {/* Page settings */}
      <div className="flex flex-col gap-2 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>
          Page · {currentPage?.name ?? ""}
        </div>

        <Toggle
          label="Header visible"
          on={!hideHeader}
          accent={accent}
          onChange={(v) => toggleHeaderVisibility(!v)}
        />
        <Toggle
          label="Footer visible"
          on={!hideFooter}
          accent={accent}
          onChange={(v) => toggleFooterVisibility(!v)}
        />
      </div>

      {/* Hint */}
      <div>
        <div className="text-[7px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "#555", letterSpacing: "0.15em" }}>
          Aucune sélection
        </div>
        <div className="text-[10px] leading-relaxed" style={{ color: "#888" }}>
          Cliquez sur une zone, une image ou un graphique. Double-cliquez sur un texte pour l&apos;éditer.
        </div>
      </div>

      {/* Shortcuts */}
      <div className="pt-2 border-t" style={{ borderColor: "#1E1E2A" }}>
        <div className="text-[7px] font-mono uppercase tracking-widest mb-2" style={{ color: "#555", letterSpacing: "0.15em" }}>
          Raccourcis
        </div>
        <div className="flex flex-col gap-1.5 text-[9px]" style={{ color: "#888" }}>
          <div><kbd style={kbdStyle}>⌘ Z</kbd> Annuler</div>
          <div><kbd style={kbdStyle}>⌘ ⇧ Z</kbd> Rétablir</div>
          <div><kbd style={kbdStyle}>⌘ S</kbd> Sauvegarder</div>
          <div><kbd style={kbdStyle}>⌘ E</kbd> Exporter</div>
          <div><kbd style={kbdStyle}>G</kbd> Toggle grille</div>
          <div><kbd style={kbdStyle}>?</kbd> Aide</div>
          <div><kbd style={kbdStyle}>Esc</kbd> Désélectionner</div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, on, accent, onChange }: {
  label: string; on: boolean; accent: string; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex items-center justify-between py-1.5 px-2 transition-colors"
      style={{
        border: `1px solid ${on ? accent : "#2A2A3A"}`,
        backgroundColor: on ? `${accent}15` : "#16161F",
      }}
    >
      <span className="text-[10px] font-mono" style={{ color: on ? accent : "#888" }}>
        {label}
      </span>
      <span
        className="relative inline-block"
        style={{
          width: 26, height: 14,
          backgroundColor: on ? accent : "#333",
          borderRadius: 7,
          transition: "background-color 150ms",
        }}
      >
        <span
          className="absolute top-0.5"
          style={{
            width: 10, height: 10,
            backgroundColor: on ? "#000" : "#888",
            borderRadius: 5,
            left: on ? 14 : 2,
            transition: "left 150ms",
          }}
        />
      </span>
    </button>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: "1px 5px", border: "1px solid #2A2A3A", fontFamily: "monospace", fontSize: "8px",
  marginRight: "6px", display: "inline-block", minWidth: "20px", textAlign: "center",
  color: "#AAA", backgroundColor: "#15151E",
};
