"use client";

import React, { useState } from "react";
import { ArtDirection, ThemeId, ColorPalette } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { useDrag, DRAG_MIME } from "@/contexts/DragContext";
import { ALL_LAYOUTS, ContentDragKind } from "@/data/types";
import {
  INSTITUTIONAL_TITLES, HERO_TITLES, TEXT_BLOCK_STYLES, CHART_IDEAS,
  IMAGE_TREATMENTS, DIVIDER_STYLES,
} from "@/data/content";
import ColorTokenEditor from "./ColorTokenEditor";

type Tab = "themes" | "pages" | "layouts" | "library" | "colors";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

interface LeftRailProps {
  theme: ArtDirection;
  themes: ArtDirection[];
  activeThemeId: ThemeId;
  colorOverrides: Partial<ColorPalette>;
  onSelectTheme: (id: ThemeId) => void;
  onColorChange: (key: ColorKey, value: string) => void;
  onResetColor: (key: ColorKey) => void;
  onResetAllColors: () => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "themes",  icon: "🎨", label: "Thèmes" },
  { id: "pages",   icon: "📑", label: "Pages" },
  { id: "layouts", icon: "🧩", label: "Layouts" },
  { id: "library", icon: "📚", label: "Library" },
  { id: "colors",  icon: "🌈", label: "Couleurs" },
];

export default function LeftRail(props: LeftRailProps) {
  const [active, setActive] = useState<Tab>("themes");
  const { theme } = props;
  const accent = theme.colors.accent;

  return (
    <div className="flex flex-shrink-0 z-30 no-export" style={{ borderRight: "1px solid #2A2A3A", backgroundColor: "#0A0A10" }}>
      {/* Vertical icon bar */}
      <div className="flex flex-col gap-0.5 p-1.5" style={{ borderRight: "1px solid #1E1E2A", width: 44 }}>
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              title={t.label}
              className="flex flex-col items-center justify-center gap-0.5 transition-all"
              style={{
                width: 32, height: 40,
                backgroundColor: isActive ? `${accent}20` : "transparent",
                border: `1px solid ${isActive ? accent : "transparent"}`,
                color: isActive ? accent : "#777",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span className="text-[5.5px] font-mono uppercase tracking-tight" style={{ letterSpacing: "0.05em" }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="overflow-y-auto" style={{ width: "clamp(180px, 18vw, 230px)" }}>
        {active === "themes"  && <ThemesPanel {...props} />}
        {active === "pages"   && <PagesTabPanel theme={theme} />}
        {active === "layouts" && <LayoutsPanel theme={theme} />}
        {active === "library" && <LibraryPanel theme={theme} />}
        {active === "colors"  && <ColorsPanel {...props} />}
      </div>
    </div>
  );
}

// ─── PANELS ────────────────────────────────────────────────────────────────────

function ThemesPanel({ themes, activeThemeId, colorOverrides, onSelectTheme }: LeftRailProps) {
  return (
    <div className="p-3">
      <PanelTitle>{themes.length} Directions Artistiques</PanelTitle>
      <div className="flex flex-col gap-1">
        {themes.map((t) => (
          <ThemeCard
            key={t.id}
            theme={t}
            active={t.id === activeThemeId}
            hasOverrides={t.id === activeThemeId && Object.keys(colorOverrides).length > 0}
            onClick={() => onSelectTheme(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PagesTabPanel({ theme }: { theme: ArtDirection }) {
  const { pages, currentPageId, switchPage, addPage, duplicatePage, deletePage, renamePage } = useEditor();
  const accent = theme.colors.accent;

  return (
    <div className="p-3">
      <PanelTitle>Pages ({pages.length})</PanelTitle>
      <div className="flex flex-col gap-1.5">
        {pages.map((p, i) => {
          const active = p.id === currentPageId;
          return (
            <div
              key={p.id}
              className="group relative"
              style={{
                border: `1px solid ${active ? accent : "#2A2A3A"}`,
                backgroundColor: active ? `${accent}10` : "transparent",
              }}
            >
              <button
                onClick={() => switchPage(p.id)}
                className="w-full text-left p-2 flex items-center gap-2"
              >
                <div className="text-[8px] font-mono px-1.5 py-0.5" style={{ backgroundColor: active ? accent : "#1E1E2A", color: active ? "#000" : "#888" }}>
                  {i + 1}
                </div>
                <input
                  value={p.name}
                  onChange={(e) => renamePage(p.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent text-[10px] font-mono outline-none border-none p-0"
                  style={{ color: active ? accent : "#CCC" }}
                />
              </button>
              <div className="flex gap-0.5 px-2 pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => duplicatePage(p.id)} className="text-[7px] font-mono px-1.5 py-0.5" style={{ border: "1px solid #333", color: "#888" }}>Dup</button>
                {pages.length > 1 && (
                  <button onClick={() => { if (confirm(`Supprimer "${p.name}" ?`)) deletePage(p.id); }} className="text-[7px] font-mono px-1.5 py-0.5" style={{ border: "1px solid #333", color: "#E07070" }}>Suppr</button>
                )}
              </div>
            </div>
          );
        })}
        <button
          onClick={() => addPage()}
          className="text-[9px] font-mono uppercase py-2 mt-1"
          style={{ border: `1px dashed ${accent}60`, color: accent, backgroundColor: `${accent}05`, letterSpacing: "0.1em" }}
        >+ Nouvelle page</button>
      </div>
    </div>
  );
}

function LayoutsPanel({ theme }: { theme: ArtDirection }) {
  const { startDrag, endDrag } = useDrag();
  const accent = theme.colors.accent;
  return (
    <div className="p-3">
      <PanelTitle>Drag → Zone</PanelTitle>
      <div className="text-[8px] mb-3" style={{ color: "#888" }}>
        Glissez un layout sur une zone pour l&apos;appliquer.
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {ALL_LAYOUTS.map((l) => (
          <div
            key={l.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(DRAG_MIME.LAYOUT, l.id);
              e.dataTransfer.effectAllowed = "copy";
              startDrag({ type: "layout", payload: l.id, source: l.id });
            }}
            onDragEnd={endDrag}
            className="flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing transition-colors"
            style={{
              padding: "6px 3px",
              minHeight: 48,
              border: `1px solid #2A2A3A`,
              backgroundColor: "#16161F",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A3A"; }}
            title={l.label}
          >
            <div style={{ fontSize: 8, lineHeight: 1.2, fontFamily: "monospace", color: "#888", whiteSpace: "pre" }}>
              {l.ascii}
            </div>
            <div style={{ fontSize: 6, fontFamily: "monospace", color: "#666", textTransform: "uppercase" }}>
              {l.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LibraryPanel({ theme }: { theme: ArtDirection }) {
  const { startDrag, endDrag } = useDrag();
  const accent = theme.colors.accent;

  const dragHandlers = (payload: ContentDragKind, source: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData(DRAG_MIME.CONTENT, JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "copy";
      startDrag({ type: "content", payload, source });
    },
    onDragEnd: () => endDrag(),
  });

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="text-[8px]" style={{ color: "#888" }}>
        Glissez un contenu sur une zone pour le remplir.
      </div>

      <Section label={`Titres institutionnels (${INSTITUTIONAL_TITLES.length})`} theme={theme}>
        <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
          {INSTITUTIONAL_TITLES.map((t, i) => (
            <div
              key={i}
              {...dragHandlers({ kind: "institutional-title", text: t }, `inst-${i}`)}
              className="text-[8px] p-1.5 leading-tight cursor-grab active:cursor-grabbing"
              style={{ border: "1px solid #2A2A3A", backgroundColor: "#16161F", color: "#CCC" }}
              title={t}
            >{t.slice(0, 60)}{t.length > 60 ? "…" : ""}</div>
          ))}
        </div>
      </Section>

      <Section label={`Hero titles (${HERO_TITLES.length})`} theme={theme}>
        <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
          {HERO_TITLES.map((h, i) => (
            <div
              key={i}
              {...dragHandlers({ kind: "hero-title", text: h.text }, `hero-${i}`)}
              className="font-black uppercase p-1.5 cursor-grab active:cursor-grabbing whitespace-pre-line leading-tight"
              style={{ fontSize: 9, border: "1px solid #2A2A3A", backgroundColor: "#16161F", color: theme.colors.text, fontFamily: theme.typography.headingFont }}
            >{h.text}</div>
          ))}
        </div>
      </Section>

      <Section label={`Blocs texte (${TEXT_BLOCK_STYLES.length})`} theme={theme}>
        <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
          {TEXT_BLOCK_STYLES.map((b, i) => (
            <div
              key={i}
              {...dragHandlers({ kind: "text-block", name: b.name, content: b.content }, `text-${i}`)}
              className="p-1.5 cursor-grab active:cursor-grabbing"
              style={{ border: "1px solid #2A2A3A", backgroundColor: "#16161F" }}
              title={b.content}
            >
              <div className="text-[7px] font-mono" style={{ color: accent }}>{b.name}</div>
              <div className="text-[8px] mt-0.5 leading-tight" style={{ color: "#888" }}>{b.content.slice(0, 70)}…</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label={`Idées graphiques (${CHART_IDEAS.length})`} theme={theme}>
        <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
          {CHART_IDEAS.map((c, i) => {
            const types = ["bar", "line", "donut", "area", "radar", "gauge", "horizontal-bar"] as const;
            const chartType = types[i % types.length];
            return (
              <div
                key={i}
                {...dragHandlers({
                  kind: "chart-idea", chartType,
                  values: [30, 55, 45, 75, 65, 90, 100],
                  labels: ["A", "B", "C", "D", "E", "F", "G"],
                  label: c.name,
                }, `chart-${i}`)}
                className="p-1.5 cursor-grab active:cursor-grabbing"
                style={{ border: "1px solid #2A2A3A", backgroundColor: "#16161F" }}
              >
                <div className="text-[7px] font-mono" style={{ color: accent }}>{chartType}</div>
                <div className="text-[8px] mt-0.5 leading-tight" style={{ color: "#888" }}>{c.name}</div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function ColorsPanel({ theme, colorOverrides, onColorChange, onResetColor, onResetAllColors }: LeftRailProps) {
  return (
    <div>
      <div className="p-3 pb-0">
        <PanelTitle>Couleurs custom</PanelTitle>
      </div>
      <ColorTokenEditor
        theme={theme}
        overrides={colorOverrides as Partial<ColorPalette>}
        onChange={onColorChange}
        onResetKey={onResetColor}
        onResetAll={onResetAllColors}
      />
    </div>
  );
}

// ─── SHARED ────────────────────────────────────────────────────────────────────

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[7px] font-mono uppercase tracking-widest mb-3" style={{ color: "#666", letterSpacing: "0.15em" }}>
      {children}
    </div>
  );
}

function Section({ label, theme, children }: { label: string; theme: ArtDirection; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[7px] font-mono uppercase tracking-widest mb-1.5" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{label}</div>
      {children}
    </div>
  );
}

function ThemeCard({ theme, active, hasOverrides, onClick }: { theme: ArtDirection; active: boolean; hasOverrides: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all group"
      style={{
        border: `1px solid ${active ? theme.colors.accent : "#2A2A3A"}`,
        backgroundColor: active ? `${theme.colors.accent}10` : "transparent",
        padding: "8px",
      }}
    >
      <div className="flex gap-0.5 mb-2 h-3">
        {[theme.colors.background, theme.colors.surface, theme.colors.accent, theme.colors.text].map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: active ? theme.colors.accent : "#CCC" }}>
          {theme.name}
        </div>
        {hasOverrides && (
          <div className="text-[5px] font-mono px-1 py-0.5" style={{ backgroundColor: `${theme.colors.accent}25`, color: theme.colors.accent, border: `1px solid ${theme.colors.accent}40` }}>
            CUSTOM
          </div>
        )}
      </div>
      <div className="text-[6px] mt-0.5 leading-tight" style={{ color: "#666" }}>{theme.tagline}</div>
    </button>
  );
}
