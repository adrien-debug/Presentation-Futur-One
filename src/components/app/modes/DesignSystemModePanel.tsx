"use client";

import React, { useEffect, useState } from "react";
import { ArtDirection, ThemeId, themeList, ColorPalette } from "@/design-system";
import { FONT_PRESETS } from "@/design-system/font-presets";
import { useEditor } from "@/contexts/EditorContext";
import SegmentedControl from "../SegmentedControl";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;
type Tab = "themes" | "fonts" | "colors";
type Step = "themes" | "fonts" | "colors";

interface Props {
  theme:           ArtDirection;
  activeThemeId:   ThemeId;
  colorOverrides:  Partial<ColorPalette>;
  onSelectTheme:   (id: ThemeId) => void;
  onColorChange:   (k: ColorKey, v: string) => void;
  onResetAllColors: () => void;
  setupGuideActive?: boolean;
  onExitSetup?:    () => void;
}

export default function DesignSystemModePanel({
  theme, activeThemeId, colorOverrides,
  onSelectTheme, onColorChange, onResetAllColors,
  setupGuideActive = false,
  onExitSetup,
}: Props) {
  const accent = theme.colors.accent;
  const [tab, setTab] = useState<Tab>("themes");
  const { activeFontPresetId, setFontPreset } = useEditor();

  const [done, setDone] = useState<Record<Step, boolean>>({ themes: false, fonts: false, colors: false });
  const allDone = done.themes && done.fonts && done.colors;

  useEffect(() => {
    if (!setupGuideActive) return;
    if (!done[tab as Step]) {
      const t = setTimeout(() => setDone((d) => ({ ...d, [tab]: true })), 1200);
      return () => clearTimeout(t);
    }
  }, [tab, setupGuideActive, done]);

  return (
    <div className="flex flex-col h-full">
      {setupGuideActive && (
        <SetupGuide
          accent={accent}
          done={done}
          activeStep={tab as Step}
          onJump={(s) => setTab(s)}
          allDone={allDone}
          onFinish={() => onExitSetup?.()}
        />
      )}

      {/* Tabs */}
      <div className="flex-shrink-0" style={{ padding: "12px 16px 8px" }}>
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          accent={accent}
          fullWidth
          size="sm"
          options={[
            { value: "themes", label: "Chartes" },
            { value: "fonts",  label: "Typographie" },
            { value: "colors", label: "Couleurs" },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 scroll-y" style={{ padding: "8px 16px 16px" }}>

        {tab === "themes" && (
          <div className="flex flex-col" style={{ gap: 6 }}>
            {themeList.map((t) => {
              const active = t.id === activeThemeId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t.id);
                    if (setupGuideActive) {
                      setDone((d) => ({ ...d, themes: true }));
                      if (!done.fonts) setTab("fonts");
                    }
                  }}
                  className="text-left transition-colors"
                  style={{
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                    boxShadow: active ? `inset 2px 0 0 ${t.colors.accent}` : "none",
                    padding: 10,
                  }}
                >
                  <div className="flex" style={{ height: 6, marginBottom: 8, gap: 1 }}>
                    {[t.colors.background, t.colors.surface, t.colors.accent, t.colors.text].map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
                      {t.name}
                    </span>
                    {active && (
                      <span style={{ fontSize: 10, color: t.colors.accent, fontWeight: 500 }}>
                        Actif
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3 }}>
                    {t.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {tab === "fonts" && (
          <div className="flex flex-col" style={{ gap: 4 }}>
            {FONT_PRESETS.map((fp) => {
              const active = (activeFontPresetId ?? "theme-default") === fp.id;
              return (
                <button
                  key={fp.id}
                  onClick={() => {
                    setFontPreset(fp.id === "theme-default" ? null : fp.id);
                    if (setupGuideActive) {
                      setDone((d) => ({ ...d, fonts: true }));
                      if (!done.colors) setTab("colors");
                    }
                  }}
                  className="text-left transition-colors"
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                    boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
                    {fp.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3 }}>{fp.description}</div>
                </button>
              );
            })}
          </div>
        )}

        {tab === "colors" && (
          <ColorOverrides
            theme={theme}
            overrides={colorOverrides}
            onChange={(k, v) => {
              onColorChange(k, v);
              if (setupGuideActive) setDone((d) => ({ ...d, colors: true }));
            }}
            onResetAll={onResetAllColors}
            accent={accent}
          />
        )}
      </div>
    </div>
  );
}

// ─── Color overrides ─────────────────────────────────────────────────────────

const COLOR_KEYS: { key: ColorKey; label: string }[] = [
  { key: "background", label: "Fond" },
  { key: "surface",    label: "Surface" },
  { key: "surfaceAlt", label: "Surface alt." },
  { key: "primary",    label: "Primaire" },
  { key: "secondary",  label: "Secondaire" },
  { key: "accent",     label: "Accent" },
  { key: "highlight",  label: "Surlignage" },
  { key: "text",       label: "Texte" },
  { key: "textMuted",  label: "Texte atténué" },
  { key: "border",     label: "Bordure" },
];

function ColorOverrides({
  theme, overrides, onChange, onResetAll, accent,
}: {
  theme: ArtDirection;
  overrides: Partial<ColorPalette>;
  onChange: (k: ColorKey, v: string) => void;
  onResetAll: () => void;
  accent: string;
}) {
  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      {COLOR_KEYS.map(({ key, label }) => {
        const current = overrides[key] ?? theme.colors[key];
        const overridden = overrides[key] !== undefined;
        return (
          <div
            key={key}
            className="flex items-center"
            style={{
              gap: 10,
              padding: "6px 10px",
              border: "1px solid var(--border-subtle)",
              boxShadow: overridden ? `inset 2px 0 0 ${accent}` : "none",
            }}
          >
            <input
              type="color"
              value={current}
              onChange={(e) => onChange(key, e.target.value)}
              className="cursor-pointer flex-shrink-0"
              style={{ width: 24, height: 22, background: "transparent", border: "1px solid var(--border-subtle)", padding: 0 }}
            />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 12, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>{label}</div>
              <div style={{ fontSize: 11, color: "var(--fg-muted)", fontVariantNumeric: "tabular-nums" }}>
                {current.toUpperCase()}
              </div>
            </div>
          </div>
        );
      })}
      {hasOverrides && (
        <button
          onClick={onResetAll}
          className="transition-colors"
          style={{
            marginTop: 6,
            height: 30,
            border: "1px solid var(--border-subtle)",
            color: "#E07070",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          Réinitialiser les couleurs
        </button>
      )}
    </div>
  );
}

// ─── Setup guide banner ──────────────────────────────────────────────────────

const STEPS: { id: Step; label: string }[] = [
  { id: "themes", label: "Charte" },
  { id: "fonts",  label: "Typo" },
  { id: "colors", label: "Couleurs" },
];

function SetupGuide({
  accent, done, activeStep, onJump, allDone, onFinish,
}: {
  accent: string;
  done: Record<Step, boolean>;
  activeStep: Step;
  onJump: (s: Step) => void;
  allDone: boolean;
  onFinish: () => void;
}) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-elevated)",
        padding: "12px 16px",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-primary)", marginBottom: 2, letterSpacing: "-0.005em" }}>
        Configurer le projet
      </div>
      <div style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 10 }}>
        Trois étapes pour définir l'identité visuelle.
      </div>
      <div className="flex items-center" style={{ gap: 6, marginBottom: 10 }}>
        {STEPS.map((s, i) => {
          const isActive = activeStep === s.id;
          const isDone = done[s.id];
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => onJump(s.id)}
                className="flex items-center transition-colors flex-1 min-w-0"
                style={{
                  gap: 8,
                  padding: "6px 8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: isActive ? "var(--bg-panel)" : "transparent",
                  boxShadow: isActive ? `inset 2px 0 0 ${accent}` : "none",
                }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 14,
                    height: 14,
                    fontSize: 9,
                    fontVariantNumeric: "tabular-nums",
                    backgroundColor: isDone ? accent : "transparent",
                    border: `1px solid ${isDone ? accent : "var(--border-strong)"}`,
                    color: isDone ? "var(--bg-app)" : "var(--fg-muted)",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span
                  className="truncate"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: isActive ? "var(--fg-primary)" : "var(--fg-secondary)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span aria-hidden style={{ color: "var(--border-strong)", fontSize: 10 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {allDone ? (
        <button
          onClick={onFinish}
          className="w-full transition-colors"
          style={{
            height: 32,
            backgroundColor: accent,
            color: "var(--bg-app)",
            border: `1px solid ${accent}`,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          Commencer à éditer
        </button>
      ) : (
        <button
          onClick={onFinish}
          className="w-full transition-colors"
          style={{
            height: 28,
            color: "var(--fg-muted)",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          Passer cette étape
        </button>
      )}
    </div>
  );
}
