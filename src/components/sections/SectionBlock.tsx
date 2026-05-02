"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ChartPlaceholder from "@/components/ui/ChartPlaceholder";
import KPICard from "@/components/ui/KPICard";
import TextBlock from "@/components/ui/TextBlock";

type ZoneId =
  | "section-1"
  | "section-2"
  | "section-3"
  | "section-4"
  | "section-5"
  | "section-6";

interface SectionBlockProps {
  theme: ArtDirection;
  zoneId: string;
  label: string;
  side: "left" | "right";
  showGrid?: boolean;
  children?: React.ReactNode;
}

// Default content per zone and side — showcases different layout patterns
const ZONE_LAYOUTS: Record<string, Record<string, "hero" | "kpi-row" | "two-col" | "image-text" | "chart" | "text-full" | "three-kpi" | "image-full" | "quote" | "timeline" | "chart-text" | "image-grid">> = {
  left: {
    "section-1": "hero",
    "section-2": "kpi-row",
    "section-3": "image-text",
    "section-4": "two-col",
    "section-5": "chart",
    "section-6": "text-full",
  },
  right: {
    "section-1": "image-full",
    "section-2": "three-kpi",
    "section-3": "chart-text",
    "section-4": "quote",
    "section-5": "image-grid",
    "section-6": "timeline",
  },
};

export default function SectionBlock({
  theme,
  zoneId,
  label,
  side,
  showGrid = false,
  children,
}: SectionBlockProps) {
  const layoutType = ZONE_LAYOUTS[side]?.[zoneId] || "text-full";

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ borderBottom: `1px solid ${theme.colors.border}20` }}
      data-section={zoneId}
    >
      {children || <SectionContent theme={theme} layout={layoutType} label={label} />}

      {/* Grid overlay — zone label + outline */}
      {showGrid && (
        <>
          <div
            className="absolute inset-0 border border-dashed pointer-events-none z-20"
            style={{ borderColor: `${theme.colors.accent}25` }}
          />
          <div
            className="absolute top-0.5 left-1 text-[6px] font-mono pointer-events-none z-20 uppercase tracking-widest"
            style={{ color: `${theme.colors.accent}70` }}
          >
            {label}
          </div>
        </>
      )}
    </div>
  );
}

// ─── SECTION CONTENT VARIANTS ─────────────────────────────────────────────────

function SectionContent({
  theme,
  layout,
  label,
}: {
  theme: ArtDirection;
  layout: string;
  label: string;
}) {
  switch (layout) {
    case "hero":
      return <HeroLayout theme={theme} />;
    case "kpi-row":
      return <KpiRowLayout theme={theme} />;
    case "image-text":
      return <ImageTextLayout theme={theme} />;
    case "two-col":
      return <TwoColLayout theme={theme} />;
    case "chart":
      return <ChartLayout theme={theme} />;
    case "text-full":
      return <TextFullLayout theme={theme} />;
    case "image-full":
      return <ImageFullLayout theme={theme} />;
    case "three-kpi":
      return <ThreeKpiLayout theme={theme} />;
    case "chart-text":
      return <ChartTextLayout theme={theme} />;
    case "quote":
      return <QuoteLayout theme={theme} />;
    case "image-grid":
      return <ImageGridLayout theme={theme} />;
    case "timeline":
      return <TimelineLayout theme={theme} />;
    default:
      return <PlaceholderLayout theme={theme} label={label} />;
  }
}

// ─── LAYOUT VARIANTS ──────────────────────────────────────────────────────────

function HeroLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full flex items-center px-4 py-2">
      <div>
        <div
          className="text-[8px] font-mono uppercase tracking-widest mb-1"
          style={{ color: theme.colors.accent, letterSpacing: "0.2em" }}
        >
          01 — VISION STRATÉGIQUE
        </div>
        <div
          className="font-black leading-none mb-2"
          style={{
            fontFamily: theme.typography.headingFont,
            fontSize: "clamp(18px, 2.8vw, 38px)",
            color: theme.colors.text,
            letterSpacing: theme.typography.letterSpacing,
            lineHeight: "0.92",
          }}
        >
          FUTUR ONE
          <br />
          <span style={{ color: theme.colors.accent }}>DATACENTER</span>
        </div>
        <div
          className="text-[8px] max-w-xs leading-relaxed"
          style={{ color: theme.colors.textMuted }}
        >
          Infrastructure critique Tier IV · 48MW Phase 1 · Qatar 2030
        </div>
      </div>
    </div>
  );
}

function KpiRowLayout({ theme }: { theme: ArtDirection }) {
  const kpis = [
    { value: "48MW", label: "Puissance Phase 1" },
    { value: "200MW", label: "Capacité totale" },
    { value: "99.9999%", label: "SLA Uptime" },
    { value: "1.3", label: "PUE Target" },
  ];
  return (
    <div className="w-full h-full grid grid-cols-4 divide-x" style={{ borderColor: theme.colors.border }}>
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} theme={theme} value={kpi.value} label={kpi.label} compact />
      ))}
    </div>
  );
}

function ImageTextLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full grid grid-cols-5">
      <div className="col-span-2 h-full">
        <ImagePlaceholder theme={theme} label="Site aérien" />
      </div>
      <div className="col-span-3 flex flex-col justify-center px-4 py-2 gap-2">
        <div
          className="text-[7px] font-mono uppercase tracking-wider"
          style={{ color: theme.colors.accent }}
        >
          CONTEXTE RÉGIONAL
        </div>
        <TextBlock
          theme={theme}
          size="small"
          text="Le marché MENA affiche une croissance de 34% annuelle en capacité data center. Futur One positionne le Qatar comme hub régional incontournable d'ici 2030."
        />
      </div>
    </div>
  );
}

function TwoColLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full grid grid-cols-2 divide-x" style={{ borderColor: theme.colors.border }}>
      <div className="flex flex-col justify-center px-4 py-2 gap-2">
        <div
          className="text-[7px] font-mono uppercase"
          style={{ color: theme.colors.accent }}
        >
          INFRASTRUCTURE
        </div>
        <TextBlock
          theme={theme}
          size="small"
          text="Architecture 2N fully redundant. Cooling adiabatique haute efficacité. Fibre multi-carrier Tier 1."
        />
      </div>
      <div className="flex flex-col justify-center px-4 py-2 gap-2">
        <div
          className="text-[7px] font-mono uppercase"
          style={{ color: theme.colors.accent }}
        >
          CERTIFICATIONS
        </div>
        <div className="flex flex-col gap-1">
          {["Tier IV Uptime Institute", "ISO 27001", "SOC 2 Type II", "PCI-DSS Compliant"].map((cert) => (
            <div key={cert} className="flex items-center gap-2">
              <div
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="text-[7px]" style={{ color: theme.colors.textMuted }}>
                {cert}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full flex gap-3 px-4 py-2 items-center">
      <div className="flex-1 h-full">
        <ChartPlaceholder theme={theme} type="bar" label="Capacity Growth 2024→2030" />
      </div>
      <div className="w-1/3">
        <div
          className="text-[7px] font-mono uppercase mb-1"
          style={{ color: theme.colors.accent }}
        >
          CROISSANCE
        </div>
        <div
          className="text-[16px] font-black"
          style={{ color: theme.colors.text, fontFamily: theme.typography.headingFont }}
        >
          ×4.2
        </div>
        <div className="text-[7px]" style={{ color: theme.colors.textMuted }}>
          capacité entre 2024 et 2030
        </div>
      </div>
    </div>
  );
}

function TextFullLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-4 py-2 gap-2">
      <div
        className="text-[7px] font-mono uppercase tracking-wider"
        style={{ color: theme.colors.accent }}
      >
        06 — PARTENARIATS
      </div>
      <TextBlock
        theme={theme}
        size="body"
        text="Futur One s'appuie sur un réseau de partenaires stratégiques tier 1 : opérateurs télécom régionaux, fournisseurs hyperscale et institutions financières qataries, garantissant une base commerciale solide dès l'ouverture."
      />
      <div className="flex gap-3 mt-1">
        {["Hyperscale", "Carrier Neutral", "AI-Ready"].map((tag) => (
          <div
            key={tag}
            className="px-2 py-0.5 text-[6px] font-mono uppercase tracking-wider"
            style={{
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.textMuted,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageFullLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full relative">
      <ImagePlaceholder theme={theme} label="Vue perspective datacenter" fullBleed />
      <div
        className="absolute bottom-2 left-3 right-3"
        style={{
          background: `linear-gradient(transparent, ${theme.colors.background}CC)`,
          paddingTop: "20px",
        }}
      >
        <div
          className="text-[7px] font-mono"
          style={{ color: theme.colors.textMuted }}
        >
          Simulation architecturale Phase 1 — 48 000 m² · Doha, Qatar
        </div>
      </div>
    </div>
  );
}

function ThreeKpiLayout({ theme }: { theme: ArtDirection }) {
  const kpis = [
    { value: "400M$", label: "CAPEX Phase 1", sub: "Investissement total" },
    { value: "34%", label: "Croissance MENA", sub: "Demande annuelle" },
    { value: "2026", label: "Go-Live Phase 1", sub: "Mise en service" },
  ];
  return (
    <div className="w-full h-full grid grid-cols-3 divide-x" style={{ borderColor: theme.colors.border }}>
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} theme={theme} value={kpi.value} label={kpi.label} sub={kpi.sub} compact />
      ))}
    </div>
  );
}

function ChartTextLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full grid grid-cols-5">
      <div className="col-span-3 h-full">
        <ChartPlaceholder theme={theme} type="donut" label="Market Share MENA" />
      </div>
      <div className="col-span-2 flex flex-col justify-center px-3 py-2 gap-2">
        <div
          className="text-[7px] font-mono uppercase"
          style={{ color: theme.colors.accent }}
        >
          MARCHÉ TOTAL
        </div>
        <div
          className="text-[14px] font-black"
          style={{ color: theme.colors.text, fontFamily: theme.typography.headingFont }}
        >
          $4.8B
        </div>
        <div className="text-[7px]" style={{ color: theme.colors.textMuted }}>
          Valeur marché MENA DC 2030
        </div>
      </div>
    </div>
  );
}

function QuoteLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full flex items-center px-4 py-2 gap-3">
      <div
        className="text-[40px] font-black leading-none flex-shrink-0 -mt-2"
        style={{
          color: theme.colors.accent,
          fontFamily: theme.typography.headingFont,
          opacity: 0.4,
          lineHeight: "0.7",
        }}
      >
        "
      </div>
      <div>
        <div
          className="text-[9px] leading-relaxed italic mb-1"
          style={{ color: theme.colors.text }}
        >
          L'infrastructure numérique est la nouvelle infrastructure pétrolière — celui qui la contrôle, contrôle l'économie.
        </div>
        <div className="text-[7px] font-mono" style={{ color: theme.colors.accent }}>
          — Vision Qatar 2030, Axe Diversification Économique
        </div>
      </div>
    </div>
  );
}

function ImageGridLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
      {["Cooling", "Power", "Network", "Security"].map((label) => (
        <ImagePlaceholder key={label} theme={theme} label={label} compact />
      ))}
    </div>
  );
}

function TimelineLayout({ theme }: { theme: ArtDirection }) {
  const steps = [
    { date: "2024", label: "Études & permis", done: true },
    { date: "2025", label: "Groundbreaking", done: true },
    { date: "2026", label: "Phase 1 Go-Live", done: false },
    { date: "2030", label: "200MW Complet", done: false },
  ];
  return (
    <div className="w-full h-full flex items-center px-4 py-2 gap-2">
      <div
        className="text-[7px] font-mono uppercase tracking-wider writing-mode-vertical flex-shrink-0"
        style={{ color: theme.colors.accent, writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}
      >
        TIMELINE
      </div>
      <div className="flex flex-1 items-center gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={step.date}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="text-[6px] font-mono"
                style={{ color: theme.colors.textMuted }}
              >
                {step.date}
              </div>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: step.done ? theme.colors.accent : "transparent",
                  border: `2px solid ${step.done ? theme.colors.accent : theme.colors.border}`,
                }}
              >
                {step.done && (
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.colors.background }} />
                )}
              </div>
              <div
                className="text-[6px] text-center max-w-[50px] leading-tight"
                style={{ color: step.done ? theme.colors.text : theme.colors.textMuted }}
              >
                {step.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px"
                style={{
                  background: i < steps.filter((s) => s.done).length
                    ? theme.colors.accent
                    : theme.colors.border,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PlaceholderLayout({ theme, label }: { theme: ArtDirection; label: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: `${theme.colors.surface}80` }}
    >
      <div
        className="text-[8px] font-mono uppercase tracking-widest"
        style={{ color: `${theme.colors.accent}50` }}
      >
        {label} — PLACEHOLDER
      </div>
    </div>
  );
}
