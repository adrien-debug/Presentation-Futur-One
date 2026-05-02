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

  // Setup guide: track which steps the user has touched (locally — not persisted).
  const [done, setDone] = useState<Record<Step, boolean>>({ themes: false, fonts: false, colors: false });
  const allDone = done.themes && done.fonts && done.colors;

  // Visiting a tab during setup counts as engaging with that step (defaults are valid choices).
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
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          accent={accent}
          fullWidth
          size="sm"
          options={[
            { value: "themes", label: "Chartes" },
            { value: "fonts",  label: "Typo" },
            { value: "colors", label: "Couleurs" },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 scroll-y px-3 pb-4">

        {tab === "themes" && (
          <div className="flex flex-col gap-1.5">
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
                  className="text-left transition-all"
                  style={{
                    border: `1px solid ${active ? t.colors.accent : "var(--border-subtle)"}`,
                    backgroundColor: active ? `${t.colors.accent}10` : "var(--bg-elevated)",
                    padding: 8,
                  }}
                >
                  <div className="flex h-2 mb-2">
                    {[t.colors.background, t.colors.surface, t.colors.accent, t.colors.text].map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase" style={{ color: active ? t.colors.accent : "var(--fg-primary)", letterSpacing: "0.1em" }}>
                      {t.name}
                    </span>
                    {active && (
                      <span className="text-[7px] font-mono" style={{ color: t.colors.accent, letterSpacing: "0.16em" }}>
                        ACTIF
                      </span>
                    )}
                  </div>
                  <div className="text-[8px] mt-1" style={{ color: "var(--fg-muted)" }}>
                    {t.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {tab === "fonts" && (
          <div className="flex flex-col gap-1">
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
                  className="text-left px-2 py-2 transition-all"
                  style={{
                    border: `1px solid ${active ? `${accent}80` : "var(--border-subtle)"}`,
                    backgroundColor: active ? `${accent}10` : "var(--bg-elevated)",
                  }}
                >
                  <div className="text-[10px] font-semibold" style={{ color: active ? accent : "var(--fg-primary)" }}>
                    {fp.name}
                  </div>
                  <div className="text-[8px] mt-0.5" style={{ color: "var(--fg-muted)" }}>{fp.description}</div>
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

// ─── Compact color overrides ───────────────────────────────────────────────────

const COLOR_KEYS: { key: ColorKey; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "surface",    label: "Surface" },
  { key: "surfaceAlt", label: "Surface Alt" },
  { key: "primary",    label: "Primary" },
  { key: "secondary",  label: "Secondary" },
  { key: "accent",     label: "Accent" },
  { key: "highlight",  label: "Highlight" },
  { key: "text",       label: "Text" },
  { key: "textMuted",  label: "Text Muted" },
  { key: "border",     label: "Border" },
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
    <div className="flex flex-col gap-1.5">
      {COLOR_KEYS.map(({ key, label }) => {
        const current = overrides[key] ?? theme.colors[key];
        const overridden = overrides[key] !== undefined;
        return (
          <div key={key} className="flex items-center gap-2 px-2 py-1.5"
            style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            <input
              type="color"
              value={current}
              onChange={(e) => onChange(key, e.target.value)}
              className="cursor-pointer flex-shrink-0"
              style={{ width: 24, height: 22, background: "transparent", border: "1px solid var(--border-subtle)", padding: 0 }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[10px]" style={{ color: overridden ? accent : "var(--fg-primary)" }}>{label}</div>
              <div className="text-[8px] font-mono" style={{ color: "var(--fg-muted)" }}>{current.toUpperCase()}</div>
            </div>
          </div>
        );
      })}
      {hasOverrides && (
        <button
          onClick={onResetAll}
          className="mt-2 py-1.5 text-[9px] uppercase font-medium transition-all"
          style={{ border: "1px solid #5A2A2A", color: "#E07070", letterSpacing: "0.1em", backgroundColor: "transparent" }}
        >
          Réinitialiser toutes les couleurs
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
      className="px-3 pt-3 pb-3 flex-shrink-0 border-b"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: `${accent}08` }}
    >
      <div className="text-[8px] font-mono uppercase mb-2" style={{ color: accent, letterSpacing: "0.18em" }}>
        Configurer ton projet
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        {STEPS.map((s, i) => {
          const isActive = activeStep === s.id;
          const isDone = done[s.id];
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => onJump(s.id)}
                className="flex items-center gap-1.5 px-2 py-1 transition-all flex-1 min-w-0"
                style={{
                  border: `1px solid ${isActive ? accent : isDone ? `${accent}40` : "var(--border-subtle)"}`,
                  backgroundColor: isActive ? `${accent}15` : "var(--bg-elevated)",
                }}
              >
                <span
                  className="w-3.5 h-3.5 flex items-center justify-center text-[8px] font-mono flex-shrink-0"
                  style={{
                    backgroundColor: isDone ? accent : "transparent",
                    border: `1px solid ${isDone ? accent : "var(--border-subtle)"}`,
                    color: isDone ? "var(--bg-app)" : "var(--fg-muted)",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span
                  className="text-[9px] font-semibold uppercase truncate"
                  style={{ color: isActive ? accent : "var(--fg-primary)", letterSpacing: "0.08em" }}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span style={{ color: "var(--fg-muted)", fontSize: 10 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {allDone ? (
        <button
          onClick={onFinish}
          className="w-full py-2 text-[10px] font-bold uppercase transition-all"
          style={{ backgroundColor: accent, color: "var(--bg-app)", letterSpacing: "0.12em" }}
        >
          Commencer à éditer →
        </button>
      ) : (
        <button
          onClick={onFinish}
          className="w-full py-1.5 text-[9px] uppercase transition-all"
          style={{ color: "var(--fg-muted)", border: "1px dashed var(--border-subtle)", letterSpacing: "0.1em" }}
        >
          Passer cette étape
        </button>
      )}
    </div>
  );
}
