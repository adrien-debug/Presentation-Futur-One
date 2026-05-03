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
    <div className="flex flex-col p-4 scroll-y h-full" style={{ gap: 24 }}>

      <Section title="Format">
        <Row label="Format"  value="A3 paysage" />
        <Row label="Largeur" value="420 mm" />
        <Row label="Hauteur" value="297 mm" />
        <Row label="Ratio"   value="1.414 : 1" />
      </Section>

      <Section title="Marges & sécurité">
        <Row label="Fond perdu"     value="3 mm" />
        <Row label="Zone sûre"      value="10 mm" />
        <Row label="Marge centrale" value="2,5 %" />
      </Section>

      <Section title="Résolution">
        <Row label="Impression" value="300 DPI" />
        <Row label="Aperçu"     value="150 DPI" />
        <Row label="Couleur"    value="RGB → CMYK auto" />
      </Section>

      <div className="flex flex-col" style={{ gap: 8, marginTop: 4 }}>
        <button
          onClick={onExport}
          className="flex items-center justify-center transition-colors"
          style={{
            height: 36,
            gap: 8,
            backgroundColor: accent,
            color: "#05080F",
            border: `1px solid ${accent}`,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          <IconDownload size={13} />
          Exporter en PDF
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center transition-colors"
          style={{
            height: 32,
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          Imprimer (⌘P)
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--fg-secondary)",
          letterSpacing: "-0.005em",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        className="flex flex-col"
        style={{
          border: "1px solid var(--border-subtle)",
          gap: 1,
          backgroundColor: "var(--border-subtle)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "8px 10px",
        backgroundColor: "var(--bg-panel)",
      }}
    >
      <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{label}</span>
      <span style={{ fontSize: 11, color: "var(--fg-primary)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
