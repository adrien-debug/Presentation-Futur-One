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

  const kindLabel = isHeader ? "En-tête" : isFooter ? "Pied de page" : "Section";
  const sideLabel = side === "left" ? "Page gauche" : "Page droite";

  return (
    <div className="flex flex-col" style={{ gap: 22 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          {kindLabel} <span style={{ color: "var(--fg-muted)" }}>· {sideLabel}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-primary)", marginTop: 4, letterSpacing: "-0.01em" }}>
          {zone.label}
        </div>
        <button
          onClick={() => selectZone(`${otherSide}-${zoneId}`)}
          className="flex items-center transition-colors"
          style={{
            marginTop: 8,
            gap: 6,
            padding: "4px 8px",
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
          title={`Passer à la page ${otherSide === "left" ? "gauche" : "droite"}`}
        >
          {side === "left" ? <IconChevronRight size={10} /> : <IconChevronLeft size={10} />}
          Page {otherSide === "left" ? "gauche" : "droite"}
        </button>
      </div>

      {isHF && (
        <Section label="Visibilité">
          <Toggle
            label={`${kindLabel} visible`}
            on={!(isHeader ? hideHeader : hideFooter)}
            accent={accent}
            onChange={(v) => (isHeader ? toggleHeaderVisibility(!v) : toggleFooterVisibility(!v))}
          />
        </Section>
      )}

      <Section label="Hauteur">
        <div className="flex items-center" style={{ gap: 6 }}>
          <Stepper sign="−" onClick={() => setHeight(zone.heightRatio - 0.01)} title="−1%" />
          <input
            type="number"
            min={Math.round(ZONE.MIN_RATIO * 100)}
            max={Math.round(ZONE.MAX_RATIO * 100)}
            value={pct}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setHeight(n / 100);
            }}
            className="flex-1 text-center outline-none"
            style={{
              height: 28,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--fg-primary)",
              fontFamily: "monospace",
              fontSize: 12,
              fontVariantNumeric: "tabular-nums",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--fg-muted)", fontFamily: "monospace", paddingLeft: 2, paddingRight: 4 }}>%</span>
          <Stepper sign="+" onClick={() => setHeight(zone.heightRatio + 0.01)} title="+1%" />
        </div>
        <input
          type="range"
          min={Math.round(ZONE.MIN_RATIO * 100)}
          max={Math.round(ZONE.MAX_RATIO * 100)}
          value={pct}
          onChange={(e) => setHeight(Number(e.target.value) / 100)}
          style={{ width: "100%", accentColor: accent, marginTop: 8 }}
        />
      </Section>

      {!isHF && (
        <Section label="Position">
          <div className="flex" style={{ gap: 4 }}>
            <PosBtn
              onClick={() => reorderZones(side, zoneIdx, zoneIdx - 1)}
              disabled={zoneIdx <= 1}
              title="Monter"
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
              className="flex items-center justify-center transition-colors"
              style={{
                marginTop: 6,
                height: 30,
                gap: 6,
                border: "1px solid var(--border-subtle)",
                color: "#E07070",
                backgroundColor: "transparent",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              <IconClose size={11} />
              Supprimer la section
            </button>
          )}
        </Section>
      )}

      {!isHF && (
        <Section label="Disposition">
          <div className="grid grid-cols-3" style={{ gap: 4 }}>
            {ALL_LAYOUTS.map((l) => {
              const active = l.id === currentLayout;
              return (
                <button
                  key={l.id}
                  onClick={() => setLayout(zoneKey, l.id)}
                  title={l.label}
                  className="flex flex-col items-center justify-center transition-colors"
                  style={{
                    gap: 4,
                    padding: "6px 2px",
                    minHeight: 50,
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                    boxShadow: active ? `inset 0 -1px 0 ${accent}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      lineHeight: 1.2,
                      fontFamily: "monospace",
                      color: active ? "var(--fg-primary)" : "var(--fg-muted)",
                      whiteSpace: "pre",
                    }}
                  >
                    {l.ascii}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: active ? "var(--fg-secondary)" : "var(--fg-muted)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {l.label}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section
        label="Boîte"
        action={
          <button
            onClick={() => resetBoxStyle(zoneKey)}
            className="flex items-center transition-colors"
            style={{
              gap: 4,
              padding: "3px 8px",
              border: "1px solid var(--border-subtle)",
              color: "var(--fg-muted)",
              backgroundColor: "transparent",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
            title="Réinitialiser"
          >
            <IconRefresh size={10} />
            Réinitialiser
          </button>
        }
      >
        <SubSection label="Préréglage">
          <div className="flex flex-wrap" style={{ gap: 4 }}>
            {BOX_STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setBoxStyle(zoneKey, preset.style)}
                title={preset.name}
                className="flex flex-col items-center justify-center transition-colors"
                style={{
                  width: 36,
                  height: 32,
                  gap: 1,
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "transparent",
                  color: "var(--fg-secondary)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
                  e.currentTarget.style.color = "var(--fg-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--fg-secondary)";
                }}
              >
                <span style={{ lineHeight: 1 }}>{preset.icon}</span>
                <span style={{ fontSize: 8, letterSpacing: "-0.005em" }}>{preset.name}</span>
              </button>
            ))}
          </div>
        </SubSection>
        <SubSection label="Bordure">
          <ChipRow>
            {BORDER_STYLES.map((b) => (
              <Chip key={b} active={box.border === b} accent={accent} onClick={() => updateBox({ border: b })} title={b}>
                {b === "none" ? <span style={{ fontSize: 10, color: "inherit" }}>∅</span> : <div style={{ width: 14, height: 8, borderTop: `2px ${b} currentColor` }} />}
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Épaisseur">
          <ChipRow>
            {BORDER_WIDTHS.map((w) => (
              <Chip key={w} active={box.borderWidth === w} accent={accent} onClick={() => updateBox({ borderWidth: w })} disabled={box.border === "none"}>
                <span style={{ fontSize: 10, fontFamily: "monospace" }}>{w}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Côtés">
          <ChipRow>
            {BORDER_SIDES.map(({ v, g }) => (
              <Chip key={v} active={box.borderSides === v} accent={accent} onClick={() => updateBox({ borderSides: v })} disabled={box.border === "none"} title={v}>
                <span style={{ fontSize: 11, fontFamily: "monospace" }}>{g}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Remplissage">
          <ChipRow>
            {FILL_STYLES.map((f) => (
              <Chip key={f} active={box.fill === f} accent={accent} onClick={() => updateBox({ fill: f })} title={f}>
                <FillSwatch fill={f} theme={theme} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Rayon">
          <ChipRow>
            {RADIUS_STYLES.map((r) => (
              <Chip key={r} active={box.radius === r} accent={accent} onClick={() => updateBox({ radius: r })} title={r}>
                <div style={{ width: 14, height: 10, border: "1.5px solid currentColor", borderRadius: r === "rounded" ? 6 : r === "soft" ? 2 : 0 }} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Ombre">
          <ChipRow>
            {SHADOW_STYLES.map((s) => (
              <Chip key={s} active={box.shadow === s} accent={accent} onClick={() => updateBox({ shadow: s })} title={s}>
                <ShadowSwatch shadow={s} accent={accent} active={box.shadow === s} />
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
        <SubSection label="Coins">
          <ChipRow>
            {CORNER_STYLES.map((c) => (
              <Chip key={c} active={box.corners === c} accent={accent} onClick={() => updateBox({ corners: c })} title={c}>
                <span style={{ fontSize: 10, fontFamily: "monospace" }}>{c === "none" ? "∅" : c === "brackets" ? "⌐⌐" : "◢◣"}</span>
              </Chip>
            ))}
          </ChipRow>
        </SubSection>
      </Section>
    </div>
  );
}

// ── Primitives ───────────────────────────────────────────────────────────────

function Section({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
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

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <div style={{ fontSize: 11, color: "var(--fg-muted)", letterSpacing: "-0.005em" }}>{label}</div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap" style={{ gap: 4 }}>{children}</div>;
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
        width: 28,
        height: 26,
        border: "1px solid var(--border-subtle)",
        backgroundColor: active ? "var(--bg-elevated)" : "transparent",
        color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
        boxShadow: active ? `inset 0 -1px 0 ${accent}` : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PosBtn({ onClick, disabled, title, children }: {
  onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className="flex-1 flex items-center justify-center transition-colors"
      style={{
        height: 30,
        gap: 6,
        border: "1px solid var(--border-subtle)",
        backgroundColor: "transparent",
        color: disabled ? "var(--fg-deep)" : "var(--fg-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </button>
  );
}

function Stepper({ sign, onClick, title }: { sign: string; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center transition-colors"
      style={{
        width: 28,
        height: 28,
        border: "1px solid var(--border-subtle)",
        color: "var(--fg-secondary)",
        backgroundColor: "transparent",
        fontFamily: "monospace",
        fontSize: 12,
      }}
    >
      {sign}
    </button>
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

function FillSwatch({ fill, theme }: { fill: FillStyle; theme: ArtDirection }) {
  const accent = theme.colors.accent;
  if (fill === "transparent") {
    return (
      <div
        style={{
          width: 14,
          height: 12,
          backgroundImage:
            "linear-gradient(45deg, var(--border-strong) 25%, transparent 25%), linear-gradient(-45deg, var(--border-strong) 25%, transparent 25%)",
          backgroundSize: "5px 5px",
          border: "1px solid var(--border-subtle)",
        }}
      />
    );
  }
  const map: Record<FillStyle, React.CSSProperties> = {
    transparent: {},
    surface:    { backgroundColor: theme.colors.surface },
    surfaceAlt: { backgroundColor: theme.colors.surfaceAlt },
    accentTint: { backgroundColor: `${accent}30` },
    gradient:   { backgroundImage: `linear-gradient(135deg,${accent}40,transparent)` },
    glass:      { backgroundColor: `${accent}10`, boxShadow: `inset 0 0 0 1px ${accent}40` },
  };
  return <div style={{ width: 14, height: 12, border: "1px solid var(--border-subtle)", ...map[fill] }} />;
}

function ShadowSwatch({ shadow, accent, active }: { shadow: ShadowStyle; accent: string; active: boolean }) {
  if (shadow === "none") return <span style={{ fontSize: 10, fontFamily: "monospace" }}>∅</span>;
  const map: Record<ShadowStyle, React.CSSProperties> = {
    none:  {},
    soft:  { boxShadow: "0 2px 4px rgba(0,0,0,0.6)" },
    hard:  { boxShadow: `2px 2px 0 ${accent}` },
    neon:  { boxShadow: `0 0 6px ${accent}` },
    inset: { boxShadow: `inset 0 0 4px ${accent}` },
  };
  const stroke = active ? accent : "var(--border-strong)";
  return <div style={{ width: 12, height: 9, border: `1px solid ${stroke}`, backgroundColor: shadow === "inset" ? "transparent" : `${accent}15`, ...map[shadow] }} />;
}
