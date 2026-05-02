"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { IconPlus } from "@/components/ui/Icon";

export default function EmptyInspector({ theme }: { theme: ArtDirection }) {
  const {
    pages, currentPageId, zones,
    hideHeader, hideFooter,
    toggleHeaderVisibility, toggleFooterVisibility,
    addZone, selectZone,
  } = useEditor();
  const accent = theme.colors.accent;
  const currentPage = pages.find((p) => p.id === currentPageId);

  // Compute the last section id (for "+ Add" insertion point)
  const sectionIds = zones.filter((z) => z.id !== "header" && z.id !== "footer").map((z) => z.id);
  const lastSectionId = sectionIds[sectionIds.length - 1] ?? "header";

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div>
        <div className="text-[7px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.18em" }}>
          Page
        </div>
        <div className="text-[12px] font-bold mt-0.5" style={{ color: "#E0E0E8" }}>
          {currentPage?.name ?? ""}
        </div>
      </div>

      {/* Visibility */}
      <Section label="Visibilité" theme={theme}>
        <Toggle
          label="Header"
          on={!hideHeader}
          accent={accent}
          onChange={(v) => toggleHeaderVisibility(!v)}
        />
        <Toggle
          label="Footer"
          on={!hideFooter}
          accent={accent}
          onChange={(v) => toggleFooterVisibility(!v)}
        />
      </Section>

      {/* Zones list */}
      <Section
        label={`Zones (${zones.length})`}
        theme={theme}
        action={
          <button
            onClick={() => addZone(lastSectionId)}
            className="flex items-center gap-1 text-[7px] font-mono uppercase px-1.5 py-0.5"
            style={{ border: `1px solid ${accent}40`, color: accent, backgroundColor: `${accent}10`, letterSpacing: "0.1em" }}
            title="Ajouter une section"
          >
            <IconPlus size={9} />
            Section
          </button>
        }
      >
        <div className="flex flex-col gap-px">
          {zones.map((z, i) => {
            const isHF = z.id === "header" || z.id === "footer";
            const hidden = (z.id === "header" && hideHeader) || (z.id === "footer" && hideFooter);
            const pct = Math.round(z.heightRatio * 100);
            const num = isHF ? (z.id === "header" ? "H" : "F") : String(i).padStart(2, "0");
            return (
              <div
                key={z.id}
                className="flex items-stretch group"
                style={{ border: "1px solid #1E1E2A", backgroundColor: "#0F0F18" }}
              >
                {/* Side selector — left half / right half */}
                <button
                  onClick={() => selectZone(`left-${z.id}`)}
                  className="flex items-center gap-2 flex-1 px-2 py-1.5 text-left transition-colors"
                  style={{
                    color: hidden ? "#444" : "#C5C5D0",
                    opacity: hidden ? 0.4 : 1,
                    borderRight: "1px solid #1E1E2A",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accent}08`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  title={`Sélectionner ${z.label} (gauche)`}
                >
                  <span
                    className="text-[8px] font-mono px-1 py-px"
                    style={{ backgroundColor: isHF ? "#1A1A28" : `${accent}25`, color: isHF ? "#888" : accent, minWidth: 18, textAlign: "center" }}
                  >{num}</span>
                  <span className="text-[9px] font-mono uppercase flex-1 truncate" style={{ letterSpacing: "0.08em" }}>
                    {z.label}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: "#666" }}>L</span>
                </button>
                <button
                  onClick={() => selectZone(`right-${z.id}`)}
                  className="px-2 py-1.5 transition-colors text-[8px] font-mono"
                  style={{ color: "#666", borderRight: "1px solid #1E1E2A" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accent}08`; e.currentTarget.style.color = accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#666"; }}
                  title={`Sélectionner ${z.label} (droite)`}
                >R</button>
                {/* % */}
                <div
                  className="flex items-center justify-center px-2 text-[9px] font-mono"
                  style={{ color: hidden ? "#444" : "#888", minWidth: 36 }}
                >
                  {hidden ? "—" : `${pct}%`}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Hint */}
      <div className="pt-1">
        <div className="text-[9px] leading-relaxed" style={{ color: "#888" }}>
          Cliquez sur une zone du canvas pour éditer son contenu et son style.
          Double-cliquez sur un texte pour l&apos;éditer.
        </div>
      </div>

      {/* Shortcuts (collapsed at bottom) */}
      <details className="pt-2 border-t" style={{ borderColor: "#1E1E2A" }}>
        <summary className="cursor-pointer text-[7px] font-mono uppercase mb-2 select-none" style={{ color: "#555", letterSpacing: "0.18em" }}>
          Raccourcis
        </summary>
        <div className="flex flex-col gap-1.5 text-[9px] mt-1" style={{ color: "#888" }}>
          <div><kbd style={kbdStyle}>⌘ Z</kbd> Annuler</div>
          <div><kbd style={kbdStyle}>⌘ ⇧ Z</kbd> Rétablir</div>
          <div><kbd style={kbdStyle}>⌘ S</kbd> Sauvegarder</div>
          <div><kbd style={kbdStyle}>⌘ E</kbd> Exporter</div>
          <div><kbd style={kbdStyle}>G</kbd> Toggle grille</div>
          <div><kbd style={kbdStyle}>?</kbd> Aide</div>
          <div><kbd style={kbdStyle}>Esc</kbd> Désélectionner</div>
        </div>
      </details>
    </div>
  );
}

function Section({ label, theme, action, children }: {
  label: string; theme: ArtDirection; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
      <div className="flex items-center justify-between">
        <div className="text-[7px] font-mono uppercase" style={{ color: theme.colors.accent, letterSpacing: "0.18em" }}>
          {label}
        </div>
        {action}
      </div>
      {children}
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
      <span className="text-[10px] font-mono uppercase" style={{ color: on ? accent : "#888", letterSpacing: "0.1em" }}>
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
