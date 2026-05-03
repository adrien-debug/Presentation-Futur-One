"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";

export default function TextInspector({ theme: _theme, zoneKey, slotId }: { theme: ArtDirection; zoneKey: string; slotId: string }) {
  const { contentStore } = useEditor();
  const content = contentStore[zoneKey] ?? {};

  // slotId convention for text: `${zoneKey}-text-${field}`
  const field = slotId.startsWith(`${zoneKey}-text-`) ? slotId.replace(`${zoneKey}-text-`, "") : "";
  const value = field ? (content as Record<string, unknown>)[field] : undefined;
  const preview = typeof value === "string" ? value : "";

  return (
    <div className="flex flex-col" style={{ gap: 18 }}>
      <Section title="Texte en édition" meta={field || "—"} />

      <div className="flex flex-col" style={{ gap: 8 }}>
        <SectionLabel>Aperçu</SectionLabel>
        <div
          style={{
            fontSize: 12,
            padding: "10px 12px",
            lineHeight: 1.5,
            maxHeight: 140,
            overflowY: "auto",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-primary)",
            letterSpacing: "-0.005em",
          }}
        >
          {preview.slice(0, 240)}{preview.length > 240 ? "…" : ""}
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: 8 }}>
        <SectionLabel>Mise en forme</SectionLabel>
        <div style={{ fontSize: 11, lineHeight: 1.5, color: "var(--fg-muted)" }}>
          La barre flottante apparaît pendant l'édition. Sélectionner du texte pour appliquer un style.
        </div>
        <div className="flex flex-col" style={{ gap: 6, marginTop: 4 }}>
          <Shortcut keys="⌘ B" label="Gras" />
          <Shortcut keys="⌘ I" label="Italique" />
          <Shortcut keys="⌘ Enter" label="Valider (multiline)" />
          <Shortcut keys="Esc" label="Annuler l'édition" />
        </div>
      </div>
    </div>
  );
}

function Section({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline" style={{ gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
        {title}
      </span>
      {meta && <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{meta}</span>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
      {children}
    </div>
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
