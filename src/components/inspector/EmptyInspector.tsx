"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { IconPlus } from "@/components/ui/Icon";
import { FONT_PRESETS, FontPresetId } from "@/design-system/font-presets";

export default function EmptyInspector({ theme }: { theme: ArtDirection }) {
  const {
    pages, currentPageId, zones,
    hideHeader, hideFooter,
    toggleHeaderVisibility, toggleFooterVisibility,
    addZone, selectZone,
    activeFontPresetId, setFontPreset,
  } = useEditor();
  const accent = theme.colors.accent;
  const currentPage = pages.find((p) => p.id === currentPageId);

  const lastSectionIdOf = (sideZones: typeof zones.left) => {
    const ids = sideZones.filter((z) => z.id !== "header" && z.id !== "footer").map((z) => z.id);
    return ids[ids.length - 1] ?? "header";
  };
  const lastLeft  = lastSectionIdOf(zones.left);
  const lastRight = lastSectionIdOf(zones.right);
  const totalCount = zones.left.length + zones.right.length;

  return (
    <div className="flex flex-col" style={{ gap: 22 }}>
      {/* Page header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          Page courante
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-primary)", marginTop: 4, letterSpacing: "-0.01em" }}>
          {currentPage?.name ?? "—"}
        </div>
      </div>

      {/* Visibility */}
      <Section label="Visibilité">
        <div className="flex flex-col" style={{ gap: 4 }}>
          <Toggle label="En-tête" on={!hideHeader} accent={accent} onChange={(v) => toggleHeaderVisibility(!v)} />
          <Toggle label="Pied de page" on={!hideFooter} accent={accent} onChange={(v) => toggleFooterVisibility(!v)} />
        </div>
      </Section>

      {/* Zones list — independent grids per side */}
      <Section label={`Zones (${totalCount})`}>
        <ZoneList
          title="Page gauche"
          side="left"
          sideZones={zones.left}
          onAdd={() => addZone("left", lastLeft)}
          onSelect={(id) => selectZone(`left-${id}`)}
          accent={accent}
          hideHeader={hideHeader}
          hideFooter={hideFooter}
        />
        <div style={{ height: 12 }} />
        <ZoneList
          title="Page droite"
          side="right"
          sideZones={zones.right}
          onAdd={() => addZone("right", lastRight)}
          onSelect={(id) => selectZone(`right-${id}`)}
          accent={accent}
          hideHeader={hideHeader}
          hideFooter={hideFooter}
        />
      </Section>

      {/* Font Presets */}
      <Section label="Typographie">
        <div className="flex flex-col" style={{ gap: 4 }}>
          {FONT_PRESETS.map((preset) => {
            const active = (preset.id === "theme-default" && !activeFontPresetId) || preset.id === activeFontPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setFontPreset(preset.id === "theme-default" ? null : preset.id as FontPresetId)}
                className="text-left transition-colors"
                style={{
                  padding: "8px 10px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                  boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3 }}>
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Hint */}
      <div style={{ fontSize: 11, lineHeight: 1.5, color: "var(--fg-muted)" }}>
        Cliquer sur une zone du canevas pour éditer son contenu et son style. Double-cliquer sur un texte pour l'éditer.
      </div>

      {/* Shortcuts (collapsed at bottom) */}
      <details style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
        <summary
          className="cursor-pointer select-none"
          style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em", marginBottom: 8 }}
        >
          Raccourcis clavier
        </summary>
        <div className="flex flex-col" style={{ gap: 6, marginTop: 6 }}>
          <Shortcut keys="⌘ Z"   label="Annuler" />
          <Shortcut keys="⌘ ⇧ Z" label="Rétablir" />
          <Shortcut keys="⌘ S"   label="Sauvegarder" />
          <Shortcut keys="⌘ E"   label="Exporter" />
          <Shortcut keys="G"     label="Afficher la grille" />
          <Shortcut keys="?"     label="Aide" />
          <Shortcut keys="Esc"   label="Désélectionner" />
        </div>
      </details>
    </div>
  );
}

function ZoneList({
  title, side, sideZones, onAdd, onSelect, accent, hideHeader, hideFooter,
}: {
  title: string;
  side: "left" | "right";
  sideZones: { id: string; label: string; heightRatio: number }[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  accent: string;
  hideHeader: boolean;
  hideFooter: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          {title} <span style={{ color: "var(--fg-muted)" }}>· {sideZones.length}</span>
        </span>
        <button
          onClick={onAdd}
          className="flex items-center transition-colors"
          style={{
            gap: 4,
            padding: "3px 8px",
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
          title={`Ajouter une section (${title})`}
        >
          <IconPlus size={10} />
          Section
        </button>
      </div>
      <div className="flex flex-col" style={{ gap: 2 }}>
        {sideZones.map((z, i) => {
          const isHF = z.id === "header" || z.id === "footer";
          const hidden = (z.id === "header" && hideHeader) || (z.id === "footer" && hideFooter);
          const pct = Math.round(z.heightRatio * 100);
          const num = isHF ? (z.id === "header" ? "H" : "F") : String(i).padStart(2, "0");
          return (
            <button
              key={z.id}
              onClick={() => onSelect(z.id)}
              className="flex items-stretch text-left transition-colors"
              style={{
                border: "1px solid var(--border-subtle)",
                backgroundColor: "transparent",
                color: hidden ? "var(--fg-deep)" : "var(--fg-primary)",
                opacity: hidden ? 0.5 : 1,
              }}
              title={`Sélectionner ${z.label} (${side})`}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <span className="flex items-center flex-1" style={{ gap: 10, padding: "7px 10px" }}>
                <span
                  style={{
                    fontSize: 10,
                    color: isHF ? "var(--fg-muted)" : "var(--fg-secondary)",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 16,
                    textAlign: "center",
                  }}
                >
                  {num}
                </span>
                <span
                  className="flex-1 truncate"
                  style={{ fontSize: 12, color: "inherit", letterSpacing: "-0.005em" }}
                >
                  {z.label}
                </span>
              </span>
              <span
                className="flex items-center justify-center"
                style={{
                  padding: "0 10px",
                  fontSize: 11,
                  color: "var(--fg-muted)",
                  minWidth: 44,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {hidden ? "—" : `${pct}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Section({ label, action, children }: {
  label: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
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
      className="flex items-center justify-between transition-colors"
      style={{
        padding: "8px 10px",
        border: "1px solid var(--border-subtle)",
        backgroundColor: on ? "var(--bg-elevated)" : "transparent",
        color: on ? "var(--fg-primary)" : "var(--fg-secondary)",
        boxShadow: on ? `inset 2px 0 0 ${accent}` : "none",
      }}
    >
      <span style={{ fontSize: 12, letterSpacing: "-0.005em" }}>{label}</span>
      <span
        aria-hidden
        className="relative inline-block"
        style={{
          width: 28,
          height: 16,
          backgroundColor: on ? accent : "var(--border-strong)",
          transition: "background-color 150ms",
        }}
      >
        <span
          className="absolute"
          style={{
            top: 2,
            width: 12,
            height: 12,
            backgroundColor: on ? "var(--bg-app)" : "var(--fg-muted)",
            left: on ? 14 : 2,
            transition: "left 150ms",
          }}
        />
      </span>
    </button>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center" style={{ gap: 8, fontSize: 11, color: "var(--fg-secondary)" }}>
      <kbd style={kbdStyle}>{keys}</kbd>
      <span>{label}</span>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: "2px 6px",
  border: "1px solid var(--border-subtle)",
  fontFamily: "monospace",
  fontSize: 10,
  display: "inline-block",
  minWidth: 32,
  textAlign: "center",
  color: "var(--fg-secondary)",
  backgroundColor: "var(--bg-elevated)",
  letterSpacing: 0,
};
