"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { IconDownload } from "@/components/ui/Icon";

interface Props {
  theme: ArtDirection;
  onExport: () => void;
}

export default function PrintPreviewModePanel({ theme, onExport }: Props) {
  const accent = theme.colors.accent;

  return (
    <div className="flex flex-col gap-5 p-4 scroll-y h-full">

      <Section title="Format" accent={accent}>
        <Row label="Format"  value="A3 paysage" />
        <Row label="Largeur" value="420 mm" />
        <Row label="Hauteur" value="297 mm" />
        <Row label="Ratio"   value="1.414 : 1" />
      </Section>

      <Section title="Marges & sécurité" accent={accent}>
        <Row label="Fond perdu"     value="3 mm" />
        <Row label="Zone sûre"      value="10 mm" />
        <Row label="Marge centrale" value="2,5 %" />
      </Section>

      <Section title="Résolution" accent={accent}>
        <Row label="Impression" value="300 DPI" />
        <Row label="Aperçu"     value="150 DPI" />
        <Row label="Couleur"    value="RGB → CMYK auto" />
      </Section>

      <button
        onClick={onExport}
        className="flex items-center justify-center gap-2 mt-2 py-2.5 text-[11px] uppercase font-semibold transition-all"
        style={{
          backgroundColor: accent,
          color: "#05080F",
          letterSpacing: "0.1em",
        }}
      >
        <IconDownload size={13} />
        Exporter en PDF
      </button>

      <button
        onClick={() => window.print()}
        className="flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase font-medium transition-all"
        style={{
          border: "1px solid var(--border-subtle)",
          color: "var(--fg-secondary)",
          backgroundColor: "var(--bg-elevated)",
          letterSpacing: "0.08em",
        }}
      >
        Imprimer (⌘P)
      </button>

    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[8px] font-mono uppercase mb-2" style={{ color: accent, letterSpacing: "0.18em" }}>
        {title}
      </div>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5"
      style={{ backgroundColor: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <span className="text-[10px]" style={{ color: "var(--fg-secondary)" }}>{label}</span>
      <span className="text-[10px] font-mono" style={{ color: "var(--fg-primary)" }}>{value}</span>
    </div>
  );
}
