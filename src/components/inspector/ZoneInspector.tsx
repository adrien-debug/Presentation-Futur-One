"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import {
  ALL_LAYOUTS, BoxStyle, BorderStyle, BorderSides, FillStyle,
  ShadowStyle, CornerStyle, RadiusStyle, DEFAULT_BOX_STYLE, LayoutType,
} from "@/data/types";

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
  const { layoutOverrides, boxStyles, setLayout, setBoxStyle, resetBoxStyle, zones } = useEditor();
  const accent = theme.colors.accent;

  // Resolve current layout
  const [side, ...rest] = zoneKey.split("-");
  const zoneId = rest.join("-");
  const zone = zones.find((z) => z.id === zoneId);
  const isHeaderFooter = zoneId === "header" || zoneId === "footer";
  const currentLayout: LayoutType = (layoutOverrides[zoneKey] ?? "text-full") as LayoutType;
  const box: BoxStyle = { ...DEFAULT_BOX_STYLE, ...(boxStyles[zoneKey] ?? {}) };

  const updateBox = (patch: Partial<BoxStyle>) => setBoxStyle(zoneKey, patch);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>
          ZONE · {side.toUpperCase()}
        </div>
        <div className="text-[12px] font-bold mt-0.5" style={{ color: "#E0E0E8" }}>
          {zone?.label ?? zoneId}
        </div>
      </div>

      {/* LAYOUT */}
      {!isHeaderFooter && (
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

      {/* BOX STYLE */}
      <Section label="Box Style" theme={theme} action={
        <button
          onClick={() => resetBoxStyle(zoneKey)}
          className="text-[7px] font-mono uppercase px-1.5 py-0.5"
          style={{ border: "1px solid #333", color: "#777", letterSpacing: "0.1em" }}
        >Reset</button>
      }>
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
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>
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
      <div className="text-[6px] font-mono uppercase" style={{ color: "#555", letterSpacing: "0.15em" }}>{label}</div>
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
