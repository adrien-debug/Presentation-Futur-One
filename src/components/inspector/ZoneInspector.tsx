"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import {
  ALL_LAYOUTS, BoxStyle, BorderStyle, BorderSides, FillStyle,
  ShadowStyle, CornerStyle, RadiusStyle, DEFAULT_BOX_STYLE, LayoutType,
  BOX_STYLE_PRESETS,
} from "@/data/types";
import { ZONE } from "@/design-system/constants";
import {
  IconChevronLeft, IconChevronRight, IconClose, IconRefresh,
} from "@/components/ui/Icon";

interface ZoneInspectorProps {
  theme: ArtDirection;
  zoneKey: string;
}

const BORDER_STYLES: BorderStyle[] = ["none", "solid", "dashed", "dotted", "double"];
const BORDER_WIDTHS: BoxStyle["borderWidth"][] = [1, 2, 3, 4];
const BORDER_SIDES: { v: BorderSides; g: string }[] = [
  { v: "all", g: "▢" }, { v: "top", g: "▔" }, { v: "bottom", g: "▁" },
  { v: "left", g: "▏" }, { v: "right", g: "▕" }, { v: "x", g: "║" }, { v: "y", g: "═" },
];
const FILL_STYLES: FillStyle[] = ["transparent", "surface", "surfaceAlt", "accentTint", "gradient", "glass"];
const SHADOW_STYLES: ShadowStyle[] = ["none", "soft", "hard", "neon", "inset"];
const CORNER_STYLES: CornerStyle[] = ["none", "brackets", "beveled"];
const RADIUS_STYLES: RadiusStyle[] = ["square", "soft", "rounded"];

export default function ZoneInspector({ theme, zoneKey }: ZoneInspectorProps) {
  const {
    layoutOverrides, boxStyles, setLayout, setBoxStyle, resetBoxStyle,
    zones, setZones, reorderZones, removeZone,
    hideHeader, hideFooter, toggleHeaderVisibility, toggleFooterVisibility,
    selectZone,
  } = useEditor();
  const accent = theme.colors.accent;

  // Resolve zone identity
  const [sideRaw, ...rest] = zoneKey.split("-");
  const side: "left" | "right" = sideRaw === "right" ? "right" : "left";
  const zoneId = rest.join("-");
  const sideZones = zones[side];
  const zoneIdx = sideZones.findIndex((z) => z.id === zoneId);
  const zone = sideZones[zoneIdx];
  if (!zone) return null;

  const isHeader = zoneId === "header";
  const isFooter = zoneId === "footer";
  const isHF = isHeader || isFooter;
  const sectionsCount = sideZones.filter((z) => z.id !== "header" && z.id !== "footer").length;
  const lastIdx = sideZones.length - 1;

  const otherSide: "left" | "right" = side === "left" ? "right" : "left";

  const currentLayout: LayoutType = (layoutOverrides[zoneKey] ?? "text-full") as LayoutType;
  const box: BoxStyle = { ...DEFAULT_BOX_STYLE, ...(boxStyles[zoneKey] ?? {}) };
  const updateBox = (patch: Partial<BoxStyle>) => setBoxStyle(zoneKey, patch);

  // Height stepper — clamps + redistributes among others (this side only)
  const setHeight = (newRatio: number) => {
    const clamped = Math.min(ZONE.MAX_RATIO, Math.max(ZONE.MIN_RATIO, newRatio));
    const delta = clamped - zone.heightRatio;
    const others = sideZones.filter((_, i) => i !== zoneIdx);
    const othersTotal = others.reduce((s, z) => s + z.heightRatio, 0);
    if (othersTotal <= 0) return;
    const updated = sideZones.map((z, i) => {
      if (i === zoneIdx) return { ...z, heightRatio: clamped };
      const share = z.heightRatio / othersTotal;
      return { ...z, heightRatio: Math.max(ZONE.MIN_RATIO, z.heightRatio - delta * share) };
    });
    const sum = updated.reduce((s, z) => s + z.heightRatio, 0);
    setZones(side, updated.map((z) => ({ ...z, heightRatio: z.heightRatio / sum })));
  };
  const pct = Math.round(zone.heightRatio * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.18em" }}>
            {isHeader ? "Header" : isFooter ? "Footer" : "Section"}
          </span>
          <span className="text-[7px] font-mono uppercase" style={{ color: "#555", letterSpacing: "0.18em" }}>·</span>
          <span className="text-[7px] font-mono uppercase" style={{ color: "#888", letterSpacing: "0.18em" }}>
            {side}
          </span>
        </div>
        <div className="text-[12px] font-bold mt-0.5" style={{ color: "#E0E0E8" }}>
          {zone.label}
        </div>
        {/* Side switcher */}
        <button
          onClick={() => selectZone(`${otherSide}-${zoneId}`)}
          className="mt-2 flex items-center gap-1 text-[8px] font-mono uppercase px-1.5 py-0.5"
          style={{ border: "1px solid #2A2A3A", color: "#888", letterSpacing: "0.1em" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2A2A3A"; }}
          title={`Passer à la page ${otherSide === "left" ? "gauche" : "droite"}`}
        >
          {side === "left" ? <IconChevronRight size={9} /> : <IconChevronLeft size={9} />}
          page {otherSide === "left" ? "gauche" : "droite"}
        </button>
      </div>

      {/* Visibility (header/footer only) */}
      {isHF && (
        <Section label="Visibilité" theme={theme}>
          <Toggle
            label={`${isHeader ? "Header" : "Footer"} visible`}
            on={!(isHeader ? hideHeader : hideFooter)}
            accent={accent}
            onChange={(v) => (isHeader ? toggleHeaderVisibility(!v) : toggleFooterVisibility(!v))}
          />
        </Section>
      )}

      {/* Height */}
      <Section label="Hauteur" theme={theme}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHeight(zone.heightRatio - 0.01)}
            className="w-7 h-7 flex items-center justify-center text-[12px] font-mono"
            style={{ border: "1px solid #2A2A3A", color: "#888", backgroundColor: "#16161F" }}
            title="−1%"
          >−</button>
          <input
            type="number"
            min={Math.round(ZONE.MIN_RATIO * 100)}
            max={Math.round(ZONE.MAX_RATIO * 100)}
            value={pct}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setHeight(n / 100);
            }}
            className="flex-1 h-7 text-center font-mono text-[11px] outline-none"
            style={{ background: "#16161F", border: "1px solid #2A2A3A", color: "#E5E5EE" }}
          />
          <span className="text-[10px] font-mono" style={{ color: "#666" }}>%</span>
          <button
            onClick={() => setHeight(zone.heightRatio + 0.01)}
            className="w-7 h-7 flex items-center justify-center text-[12px] font-mono"
            style={{ border: "1px solid #2A2A3A", color: "#888", backgroundColor: "#16161F" }}
            title="+1%"
          >+</button>
        </div>
        <input
          type="range"
          min={Math.round(ZONE.MIN_RATIO * 100)}
          max={Math.round(ZONE.MAX_RATIO * 100)}
          value={pct}
          onChange={(e) => setHeight(Number(e.target.value) / 100)}
          style={{ width: "100%", accentColor: accent, marginTop: 4 }}
        />
      </Section>

      {/* Position (sections only) */}
      {!isHF && (
        <Section label="Position" theme={theme}>
          <div className="flex gap-1">
            <PosBtn
              onClick={() => reorderZones(side, zoneIdx, zoneIdx - 1)}
              disabled={zoneIdx <= 1}
              title="Monter"
              accent={accent}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
              <span>Monter</span>
            </PosBtn>
            <PosBtn
              onClick={() => reorderZones(side, zoneIdx, zoneIdx + 1)}
              disabled={zoneIdx >= lastIdx - 1}
              title="Descendre"
              accent={accent}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="M5 12l7 7 7-7" />
              </svg>
              <span>Descendre</span>
            </PosBtn>
          </div>
          {sectionsCount > 1 && (
            <button
              onClick={() => {
                if (confirm(`Supprimer "${zone.label}" ?`)) removeZone(side, zoneId);
              }}
              className="flex items-center justify-center gap-1.5 mt-1 py-1.5 text-[9px] font-mono uppercase transition-colors"
              style={{ border: "1px solid #5A2A2A", color: "#E07070", backgroundColor: "#1A0F12", letterSpacing: "0.1em" }}
            >
              <IconClose size={11} />
              Supprimer la section
            </button>
          )}
        </Section>
      )}

      {/* Layout (sections only) */}
      {!isHF && (
        <Section label="Layout" theme={theme}>
          <div className="grid grid-cols-3 gap-1.5">
            {ALL_LAYOUTS.map((l) => {
              const active = l.id === currentLayout;
              return (
                <button
                  key={l.id}
                  onClick={() => setLayout(zoneKey, l.id)}
                  title={l.label}
                  className="flex flex-col items-center justify-center gap-1 transition-colors"
                  style={{
                    padding: "5px 2px",
                    minHeight: "46px",
                    border: `1px solid ${active ? accent : "#2A2A3A"}`,
                    backgroundColor: active ? `${accent}15` : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "8px", lineHeight: 1.2, fontFamily: "monospace", color: active ? accent : "#666", whiteSpace: "pre" }}>
                    {l.ascii}
                  </div>
                  <div style={{ fontSize: "5.5px", fontFamily: "monospace", color: active ? accent : "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {l.label}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* Box Style */}
      <Section
        label="Box Style"
        theme={theme}
        action={
          <button
            onClick={() => resetBoxStyle(zoneKey)}
            className="flex items-center gap-1 text-[7px] font-mono uppercase px-1.5 py-0.5"
            style={{ border: "1px solid #333", color: "#777", letterSpacing: "0.1em" }}
            title="Réinitialiser le box style"
          >
            <IconRefresh size={9} />
            Reset
          </button>
        }
      >
        <SubSection label="Preset">
          <div className="flex flex-wrap gap-1">
            {BOX_STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setBoxStyle(zoneKey, preset.style)}
                title={preset.name}
                className="flex flex-col items-center justify-center gap-0.5 transition-colors"
                style={{
                  width: 32, height: 30,
                  border: "1px solid #2A2A3A",
                  backgroundColor: "transparent",
                  color: "#999",
                  cursor: "pointer",
                  fontSize: 11,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                  e.currentTarget.style.backgroundColor = `${accent}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2A2A3A";
                  e.currentTarget.style.color = "#999";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ lineHeight: 1 }}>{preset.icon}</span>
                <span style={{ fontSize: 5, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>{preset.name}</span>
              </button>
            ))}
          </div>
        </SubSection>
        <SubSection label="Border">
          <ChipRow>
            {BORDER_STYLES.map((b) => (
              <Chip key={b} active={box.border === b} accent={accent} onClick={() => updateBox({ border: b })} title={b}>
                {b === "none" ? "∅" : <div style={{ width: 14, height: 8, borderTop: `2px ${b} ${box.border === b ? accent : "#666"}` }} />}
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Width">
          <ChipRow>
            {BORDER_WIDTHS.map((w) => (
              <Chip key={w} active={box.borderWidth === w} accent={accent} onClick={() => updateBox({ borderWidth: w })} disabled={box.border === "none"}>
                <span style={{ fontSize: 9, fontFamily: "monospace" }}>{w}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Sides">
          <ChipRow>
            {BORDER_SIDES.map(({ v, g }) => (
              <Chip key={v} active={box.borderSides === v} accent={accent} onClick={() => updateBox({ borderSides: v })} disabled={box.border === "none"} title={v}>
                <span style={{ fontSize: 11, fontFamily: "monospace" }}>{g}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Fill">
          <ChipRow>
            {FILL_STYLES.map((f) => (
              <Chip key={f} active={box.fill === f} accent={accent} onClick={() => updateBox({ fill: f })} title={f}>
                <FillSwatch fill={f} theme={theme} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Radius">
          <ChipRow>
            {RADIUS_STYLES.map((r) => (
              <Chip key={r} active={box.radius === r} accent={accent} onClick={() => updateBox({ radius: r })} title={r}>
                <div style={{ width: 14, height: 10, border: `1.5px solid ${box.radius === r ? accent : "#666"}`, borderRadius: r === "rounded" ? 6 : r === "soft" ? 2 : 0 }} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Shadow">
          <ChipRow>
            {SHADOW_STYLES.map((s) => (
              <Chip key={s} active={box.shadow === s} accent={accent} onClick={() => updateBox({ shadow: s })} title={s}>
                <ShadowSwatch shadow={s} accent={box.shadow === s ? accent : "#666"} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Corners">
          <ChipRow>
            {CORNER_STYLES.map((c) => (
              <Chip key={c} active={box.corners === c} accent={accent} onClick={() => updateBox({ corners: c })} title={c}>
                <span style={{ fontSize: 9, fontFamily: "monospace" }}>{c === "none" ? "∅" : c === "brackets" ? "⌐⌐" : "◢◣"}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
      </Section>
    </div>
  );
}

// ── Primitives ───────────────────────────────────────────────────────────────

function Section({ label, theme, action, children }: { label: string; theme: ArtDirection; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
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

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[6px] font-mono uppercase" style={{ color: "#555", letterSpacing: "0.18em" }}>{label}</div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1">{children}</div>;
}

function Chip({ active, accent, onClick, disabled = false, title, children }: {
  active: boolean; accent: string; onClick: () => void; disabled?: boolean; title?: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center transition-colors flex-shrink-0"
      style={{
        width: 26, height: 24,
        border: `1px solid ${active ? accent : "#2A2A3A"}`,
        backgroundColor: active ? `${accent}15` : "transparent",
        color: active ? accent : "#777",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PosBtn({ onClick, disabled, title, accent, children }: {
  onClick: () => void; disabled?: boolean; title: string; accent: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-mono uppercase transition-colors"
      style={{
        border: "1px solid #2A2A3A",
        backgroundColor: "#16161F",
        color: disabled ? "#444" : "#C5C5D0",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        letterSpacing: "0.1em",
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent; } }}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.color = "#C5C5D0"; e.currentTarget.style.borderColor = "#2A2A3A"; } }}
    >
      {children}
    </button>
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

function FillSwatch({ fill, theme }: { fill: FillStyle; theme: ArtDirection }) {
  const accent = theme.colors.accent;
  if (fill === "transparent") {
    return <div style={{ width: 14, height: 12, backgroundImage: "linear-gradient(45deg,#444 25%,transparent 25%),linear-gradient(-45deg,#444 25%,transparent 25%)", backgroundSize: "5px 5px", border: "1px solid #333" }} />;
  }
  const map: Record<FillStyle, React.CSSProperties> = {
    transparent: {},
    surface:    { backgroundColor: theme.colors.surface },
    surfaceAlt: { backgroundColor: theme.colors.surfaceAlt },
    accentTint: { backgroundColor: `${accent}30` },
    gradient:   { backgroundImage: `linear-gradient(135deg,${accent}40,transparent)` },
    glass:      { backgroundColor: `${accent}10`, boxShadow: `inset 0 0 0 1px ${accent}40` },
  };
  return <div style={{ width: 14, height: 12, border: "1px solid #333", ...map[fill] }} />;
}

function ShadowSwatch({ shadow, accent }: { shadow: ShadowStyle; accent: string }) {
  if (shadow === "none") return <span style={{ fontSize: 9, fontFamily: "monospace" }}>∅</span>;
  const map: Record<ShadowStyle, React.CSSProperties> = {
    none:  {},
    soft:  { boxShadow: "0 2px 4px rgba(0,0,0,0.6)" },
    hard:  { boxShadow: `2px 2px 0 ${accent}` },
    neon:  { boxShadow: `0 0 6px ${accent}` },
    inset: { boxShadow: `inset 0 0 4px ${accent}` },
  };
  return <div style={{ width: 12, height: 9, border: `1px solid ${accent}`, backgroundColor: shadow === "inset" ? "transparent" : `${accent}15`, ...map[shadow] }} />;
}
