"use client";

import React, { useState } from "react";
import { ArtDirection } from "@/design-system";
import {
  INSTITUTIONAL_TITLES, HERO_TITLES, TEXT_BLOCK_STYLES,
  CARD_STYLES, CHART_IDEAS, IMAGE_TREATMENTS, DIVIDER_STYLES,
} from "@/data/content";
import { ALL_LAYOUTS } from "@/data/types";
import { hexToCmyk, hexToRgb } from "@/utils/color";
import KPICard from "./KPICard";
import Card from "./Card";
import ChartPlaceholder from "./ChartPlaceholder";
import ImagePlaceholder from "./ImagePlaceholder";
import Divider from "./Divider";

type Section =
  | "overview"
  | "typography"
  | "palette"
  | "layouts"
  | "components"
  | "charts"
  | "images"
  | "dividers"
  | "content";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "overview",    label: "Vue d'ensemble" },
  { id: "typography",  label: "Typographies" },
  { id: "palette",     label: "Palette CMYK" },
  { id: "layouts",     label: "13 layouts" },
  { id: "components",  label: "Composants" },
  { id: "charts",      label: "7 graphiques" },
  { id: "images",      label: "20 traitements image" },
  { id: "dividers",    label: "8 séparateurs" },
  { id: "content",     label: "Bibliothèque (160 contenus)" },
];

export default function DesignSystemDrawer({ theme, onClose }: { theme: ArtDirection; onClose: () => void }) {
  const [active, setActive] = useState<Section>("overview");
  const accent = theme.colors.accent;

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ backgroundColor: "rgba(0,0,0,0.92)" }} onClick={onClose}>
      <div
        className="m-auto w-[min(1400px,95vw)] h-[90vh] flex flex-col"
        style={{ backgroundColor: "#0A0A10", border: `1px solid ${accent}40`, boxShadow: "0 32px 100px rgba(0,0,0,0.9)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: "#1E1E2A" }}>
          <div>
            <div className="text-[8px] font-mono uppercase tracking-widest mb-0.5" style={{ color: accent, letterSpacing: "0.2em" }}>
              DESIGN SYSTEM · {theme.name.toUpperCase()}
            </div>
            <div className="text-[14px] font-bold" style={{ color: "#E8E8EE" }}>{theme.tagline}</div>
          </div>
          <button onClick={onClose} className="text-[14px] font-mono w-8 h-8 flex items-center justify-center" style={{ border: "1px solid #2A2A3A", color: "#888" }}>×</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Side nav */}
          <div className="flex-shrink-0 overflow-y-auto py-3 border-r" style={{ width: 200, borderColor: "#1E1E2A" }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full text-left px-4 py-2 text-[10px] font-mono uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: active === s.id ? `${accent}15` : "transparent",
                  color: active === s.id ? accent : "#888",
                  borderLeft: `2px solid ${active === s.id ? accent : "transparent"}`,
                  letterSpacing: "0.1em",
                }}
              >{s.label}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {active === "overview"   && <Overview theme={theme} />}
            {active === "typography" && <Typography theme={theme} />}
            {active === "palette"    && <Palette theme={theme} />}
            {active === "layouts"    && <Layouts theme={theme} />}
            {active === "components" && <Components theme={theme} />}
            {active === "charts"     && <Charts theme={theme} />}
            {active === "images"     && <Images theme={theme} />}
            {active === "dividers"   && <Dividers theme={theme} />}
            {active === "content"    && <ContentLib theme={theme} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function Overview({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-6">
      <Title theme={theme}>Direction artistique</Title>
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "Photo", v: theme.photoStyle },
          { k: "Graphique", v: theme.graphicStyle },
          { k: "Iconographie", v: theme.iconography },
          { k: "Boxes", v: theme.boxStyle },
          { k: "Titres", v: theme.titleStyle },
          { k: "Séparateurs", v: theme.dividerStyle },
          { k: "Data viz", v: theme.dataVizStyle },
          { k: "Tone global", v: theme.globalTone },
        ].map((o) => (
          <div key={o.k} className="p-3" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="text-[7px] font-mono uppercase tracking-widest mb-1" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{o.k}</div>
            <div className="text-[10px] leading-relaxed" style={{ color: theme.colors.textMuted }}>{o.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Typography({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-4">
      <Title theme={theme}>Typographies du thème</Title>
      <div className="grid grid-cols-3 gap-4">
        <div style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, padding: "16px" }}>
          <div className="text-[6px] font-mono mb-2" style={{ color: theme.colors.accent }}>HEADING — {theme.typography.headingFont.split("'")[1]}</div>
          <div style={{ fontFamily: theme.typography.headingFont, fontSize: 28, fontWeight: theme.typography.headingWeight, color: theme.colors.text, letterSpacing: theme.typography.letterSpacing, lineHeight: "1.05" }}>
            DataCenter<br />2030
          </div>
        </div>
        <div style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, padding: "16px" }}>
          <div className="text-[6px] font-mono mb-2" style={{ color: theme.colors.accent }}>BODY — {theme.typography.bodyFont.split("'")[1]}</div>
          <div style={{ fontFamily: theme.typography.bodyFont, fontSize: 11, color: theme.colors.textMuted, lineHeight: "1.6" }}>
            Infrastructure critique Tier IV, 48MW Phase 1. Disponibilité garantie 99.9999% SLA. Certifié Uptime Institute.
          </div>
        </div>
        <div style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, padding: "16px" }}>
          <div className="text-[6px] font-mono mb-2" style={{ color: theme.colors.accent }}>MONO — {theme.typography.monoFont.split("'")[1]}</div>
          <div style={{ fontFamily: theme.typography.monoFont, fontSize: 10, color: theme.colors.textMuted, lineHeight: "1.5" }}>
            PUE: 1.30<br />UPTIME: 99.9999%<br />CAPACITY: 48MW → 200MW<br />CERT: TIER-IV-2025
          </div>
        </div>
      </div>
      <div className="text-[9px]" style={{ color: "#888" }}>
        Sizes responsives via clamp() : hero {theme.typography.heroSize} · title {theme.typography.titleSize} · body {theme.typography.bodySize}
      </div>
    </div>
  );
}

function Palette({ theme }: { theme: ArtDirection }) {
  // All 10 color tokens of ColorPalette + role hint
  const groups: { label: string; tokens: { name: string; hex: string; role: string }[] }[] = [
    {
      label: "Brand",
      tokens: [
        { name: "Primary",   hex: theme.colors.primary,    role: "Identité principale (rare en surface)" },
        { name: "Secondary", hex: theme.colors.secondary,  role: "Identité secondaire" },
        { name: "Accent ★",  hex: theme.colors.accent,     role: "CTA · highlights · headers" },
        { name: "Highlight", hex: theme.colors.highlight,  role: "Tints subtils · liserés" },
      ],
    },
    {
      label: "Surfaces",
      tokens: [
        { name: "Background",  hex: theme.colors.background, role: "Fond du spread / page" },
        { name: "Surface",     hex: theme.colors.surface,    role: "Cards · zones internes" },
        { name: "Surface Alt", hex: theme.colors.surfaceAlt, role: "Zones secondaires · contraste" },
      ],
    },
    {
      label: "Texte & structure",
      tokens: [
        { name: "Text",       hex: theme.colors.text,      role: "Corps texte principal" },
        { name: "Text Muted", hex: theme.colors.textMuted, role: "Texte secondaire · captions" },
        { name: "Border",     hex: theme.colors.border,    role: "Bordures · séparateurs" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Title theme={theme}>Palette complète · 10 tokens · CMYK calculés</Title>
      <div className="text-[9px]" style={{ color: "#888" }}>
        Toutes les valeurs CMYK sont calculées dynamiquement depuis le hex via <code style={{ color: theme.colors.accent }}>hexToCmyk()</code>. Hex et RGB également affichés.
      </div>

      {groups.map((g) => (
        <div key={g.label}>
          <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>
            {g.label}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {g.tokens.map((t) => (
              <div key={t.name} style={{ border: `1px solid ${theme.colors.border}` }}>
                <div className="h-16 relative" style={{ backgroundColor: t.hex }}>
                  {/* Tiny visibility hint at bottom-right */}
                  <div className="absolute bottom-1 right-1 text-[6px] font-mono" style={{ color: t.hex.toLowerCase() < "#888888" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                    {t.hex}
                  </div>
                </div>
                <div className="p-2" style={{ backgroundColor: theme.colors.surface }}>
                  <div className="text-[10px] font-bold" style={{ color: theme.colors.text }}>{t.name}</div>
                  <div className="text-[7px] mt-0.5 leading-tight" style={{ color: theme.colors.textMuted }}>{t.role}</div>
                  <div className="mt-1.5 pt-1.5 border-t flex flex-col gap-0.5" style={{ borderColor: theme.colors.border }}>
                    <div className="text-[7px] font-mono" style={{ color: theme.colors.textMuted }}>HEX: <span style={{ color: theme.colors.text }}>{t.hex}</span></div>
                    <div className="text-[7px] font-mono" style={{ color: theme.colors.textMuted }}>RGB: <span style={{ color: theme.colors.text }}>{hexToRgb(t.hex)}</span></div>
                    <div className="text-[7px] font-mono" style={{ color: theme.colors.accent }}>{hexToCmyk(t.hex)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CMYK references (from theme metadata) */}
      <div className="pt-4 border-t" style={{ borderColor: "#1E1E2A" }}>
        <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>
          CMYK référence (thème)
        </div>
        <div className="text-[9px] mb-2" style={{ color: "#888" }}>
          Valeurs CMYK déclarées dans le thème pour validation imprimeur (peuvent légèrement différer du calcul depuis hex).
        </div>
        <div className="grid grid-cols-3 gap-2">
          <RefCmyk label="Primary"   value={theme.colors.cmyk.primary}   accent={theme.colors.accent} bg={theme.colors.surface} />
          <RefCmyk label="Secondary" value={theme.colors.cmyk.secondary} accent={theme.colors.accent} bg={theme.colors.surface} />
          <RefCmyk label="Accent"    value={theme.colors.cmyk.accent}    accent={theme.colors.accent} bg={theme.colors.surface} />
        </div>
      </div>
    </div>
  );
}

function RefCmyk({ label, value, accent, bg }: { label: string; value: string; accent: string; bg: string }) {
  return (
    <div className="p-3" style={{ backgroundColor: bg, border: `1px solid #2A2A3A` }}>
      <div className="text-[7px] font-mono uppercase tracking-widest mb-1" style={{ color: accent, letterSpacing: "0.15em" }}>{label}</div>
      <div className="text-[10px] font-mono" style={{ color: "#E8E8EE" }}>{value}</div>
    </div>
  );
}

function Layouts({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-4">
      <Title theme={theme}>13 layouts disponibles</Title>
      <div className="text-[9px]" style={{ color: "#888" }}>Cliquez sur une zone du canvas et sélectionnez un layout, ou glissez depuis le panel Layouts.</div>
      <div className="grid grid-cols-4 gap-2">
        {ALL_LAYOUTS.map((l) => (
          <div key={l.id} className="p-3 flex flex-col items-center gap-2" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, minHeight: 110 }}>
            <div style={{ fontSize: 12, lineHeight: 1.2, fontFamily: "monospace", color: theme.colors.accent, whiteSpace: "pre" }}>{l.ascii}</div>
            <div className="text-[9px] font-mono uppercase mt-auto" style={{ color: theme.colors.text, letterSpacing: "0.1em" }}>{l.label}</div>
            <div className="text-[7px] font-mono" style={{ color: theme.colors.textMuted }}>{l.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Components({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-6">
      <Title theme={theme}>KPI Cards (4 styles)</Title>
      <div className="grid grid-cols-4 gap-2">
        {[
          { value: "48MW",     label: "Puissance", trend: "up" as const, trendValue: "+12%" },
          { value: "200MW",    label: "Capacité",  accent: true },
          { value: "99.9999%", label: "SLA",       sub: "Tier IV" },
          { value: "1.3",      label: "PUE",       trend: "down" as const, trendValue: "-0.28" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ height: 80, border: `1px solid ${theme.colors.border}`, containerType: "size" as React.CSSProperties["containerType"] }}>
            <KPICard theme={theme} {...kpi} compact />
          </div>
        ))}
      </div>

      <Title theme={theme}>{CARD_STYLES.length} variantes de cartes</Title>
      <div className="grid grid-cols-3 gap-3">
        <Card theme={theme} variant="default"      label="Default Card"      value="400M$"     title="CAPEX Phase 1" description="Investissement total infra critique" />
        <Card theme={theme} variant="glass"        label="Glassmorphism"     value="48 000 m²" title="Surface datacenter" />
        <Card theme={theme} variant="accent"       label="Accent Card"       value="×4.2"      description="Facteur de croissance 2024→2030" />
        <Card theme={theme} variant="highlight-bar" label="TIER IV CERTIFIÉ" value="99.9999%" />
        <Card theme={theme} variant="certificate"   title="UPTIME INSTITUTE" label="Certified — 2025" />
        <Card theme={theme} variant="dual-col"      title="Puissance Phase 1" value="48 MW" />
      </div>
      <div className="text-[8px] mt-2" style={{ color: "#888" }}>+ {CARD_STYLES.length - 6} idées de cartes documentées dans la bibliothèque</div>
    </div>
  );
}

function Charts({ theme }: { theme: ArtDirection }) {
  const types = ["bar", "line", "area", "donut", "gauge", "horizontal-bar", "radar"] as const;
  return (
    <div className="flex flex-col gap-4">
      <Title theme={theme}>7 types de graphiques</Title>
      <div className="grid grid-cols-4 gap-3">
        {types.map((type) => (
          <div key={type} style={{ height: 140, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, containerType: "size" as React.CSSProperties["containerType"] }}>
            <ChartPlaceholder theme={theme} type={type} label={type.toUpperCase()} />
          </div>
        ))}
      </div>
      <Title theme={theme}>{CHART_IDEAS.length} idées de graphiques (bibliothèque)</Title>
      <div className="grid grid-cols-2 gap-2">
        {CHART_IDEAS.map((c, i) => (
          <div key={i} className="p-3 flex gap-3" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[8px] font-mono" style={{ backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent }}>{String(i+1).padStart(2,"0")}</div>
            <div>
              <div className="text-[9px] font-bold" style={{ color: theme.colors.text }}>{c.name}</div>
              <div className="text-[8px] mt-0.5" style={{ color: theme.colors.textMuted }}>{c.description}</div>
              <div className="text-[7px] font-mono mt-0.5" style={{ color: `${theme.colors.textMuted}80` }}>{c.data}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Images({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-4">
      <Title theme={theme}>Image placeholders</Title>
      <div className="grid grid-cols-4 gap-3">
        {["Site aérien", "Cooling System", "Server Racks", "Control Room"].map((label) => (
          <div key={label} style={{ height: 100 }}>
            <ImagePlaceholder theme={theme} slotId={`ds-${label}`} label={label} />
          </div>
        ))}
      </div>
      <Title theme={theme}>{IMAGE_TREATMENTS.length} traitements CSS</Title>
      <div className="grid grid-cols-4 gap-2">
        {IMAGE_TREATMENTS.map((t, i) => (
          <div key={i} className="p-2" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="w-full h-16 mb-2" style={{ background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.surfaceAlt}, ${theme.colors.background})`, filter: t.css }} />
            <div className="text-[8px] font-bold" style={{ color: theme.colors.accent }}>{t.name}</div>
            <div className="text-[7px] leading-tight mt-0.5" style={{ color: theme.colors.textMuted }}>{t.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dividers({ theme }: { theme: ArtDirection }) {
  const styles = ["simple", "double", "dotted", "gradient", "ornament", "with-label", "thick-short", "dashes"] as const;
  return (
    <div className="flex flex-col gap-4">
      <Title theme={theme}>8 séparateurs visuels</Title>
      <div className="flex flex-col gap-4 p-4" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
        {styles.map((s) => (
          <div key={s}>
            <div className="text-[7px] font-mono uppercase mb-1" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{s}</div>
            <Divider theme={theme} style={s} label="SECTION" />
          </div>
        ))}
      </div>
      <Title theme={theme}>{DIVIDER_STYLES.length} idées de séparateurs (bibliothèque)</Title>
      <div className="grid grid-cols-2 gap-2">
        {DIVIDER_STYLES.map((d, i) => (
          <div key={i} className="p-3" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="text-[8px] font-bold" style={{ color: theme.colors.accent }}>{d.name}</div>
            <div className="w-full h-px my-1.5" style={{ backgroundColor: theme.colors.border }} />
            <div className="text-[7px]" style={{ color: theme.colors.textMuted }}>{d.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentLib({ theme }: { theme: ArtDirection }) {
  return (
    <div className="flex flex-col gap-6">
      <Title theme={theme}>{INSTITUTIONAL_TITLES.length} titres institutionnels</Title>
      <div className="grid grid-cols-2 gap-2">
        {INSTITUTIONAL_TITLES.map((t, i) => (
          <div key={i} className="p-3 text-[10px]" style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.text, backgroundColor: theme.colors.surface }}>
            <span className="font-mono mr-2" style={{ color: theme.colors.accent }}>{String(i+1).padStart(2,"0")}</span>{t}
          </div>
        ))}
      </div>

      <Title theme={theme}>{HERO_TITLES.length} hero titles</Title>
      <div className="grid grid-cols-4 gap-2">
        {HERO_TITLES.map((h, i) => (
          <div key={i} className="p-3" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="font-black mb-2 leading-none whitespace-pre-line" style={{ fontSize: 16, color: theme.colors.text, fontFamily: theme.typography.headingFont }}>{h.text}</div>
            <div className="text-[7px]" style={{ color: theme.colors.textMuted }}>{h.style}</div>
          </div>
        ))}
      </div>

      <Title theme={theme}>{TEXT_BLOCK_STYLES.length} blocs texte</Title>
      <div className="grid grid-cols-2 gap-2">
        {TEXT_BLOCK_STYLES.map((b, i) => (
          <div key={i} className="p-3" style={{ border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface }}>
            <div className="text-[8px] font-mono mb-1" style={{ color: theme.colors.accent }}>{b.name}</div>
            <div className="text-[9px] mb-1 whitespace-pre-line leading-relaxed" style={{ color: theme.colors.text }}>{b.content}</div>
            <div className="text-[7px]" style={{ color: theme.colors.textMuted }}>{b.style}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Title({ theme, children }: { theme: ArtDirection; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-1.5 h-5" style={{ backgroundColor: theme.colors.accent }} />
      <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{children}</div>
      <div className="flex-1 h-px" style={{ backgroundColor: "#2A2A3A" }} />
    </div>
  );
}
