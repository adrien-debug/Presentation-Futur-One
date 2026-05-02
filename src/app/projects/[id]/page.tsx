"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { themeList, ColorPalette, SPREAD_ZONES, defaultTheme } from "@/design-system";
import type { ThemeId, SectionZone } from "@/design-system";
import { useEditorState, EditorState } from "@/hooks/useEditorState";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useSelection } from "@/hooks/useSelection";
import { EditorProvider } from "@/contexts/EditorContext";
import { DragProvider } from "@/contexts/DragContext";
import Spread from "@/components/layout/Spread";
import FloatingFormatToolbar from "@/components/ui/FloatingFormatToolbar";
import LeftRail from "@/components/ui/LeftRail";
import Inspector from "@/components/inspector/Inspector";
import PageNav from "@/components/ui/PageNav";
import BrandMenu from "@/components/ui/BrandMenu";
import ExportDialog from "@/components/ui/ExportDialog";
import HelpDialog from "@/components/ui/HelpDialog";
import DesignSystemDrawer from "@/components/ui/DesignSystemDrawer";
import Link from "next/link";
import {
  IconUndo, IconRedo, IconDownload, IconHelp,
  IconPanelLeft, IconPanelRight, IconCheck, IconChevronLeft,
} from "@/components/ui/Icon";
import type {
  LayoutContent, LayoutType, BoxStyle, ImageData, ChartConfig, Page,
} from "@/data/types";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

// ─── Convert DB rows → EditorState ────────────────────────────────────────────

function dbToEditorState(
  project: {
    activeThemeId: string;
    colorOverrides: unknown;
    showGrid: boolean;
  },
  dbPages: Array<{
    id: string; name: string; orderIndex: number;
    zones: unknown; contentStore: unknown; layoutOverrides: unknown;
    boxStyles: unknown; images: unknown; chartConfigs: unknown;
    hideHeader: boolean; hideFooter: boolean;
  }>
): EditorState {
  const sorted = [...dbPages].sort((a, b) => a.orderIndex - b.orderIndex);
  const pageOrder = sorted.map((p) => p.id);
  const pages: Record<string, Page> = {};

  for (const p of sorted) {
    pages[p.id] = {
      id:              p.id,
      name:            p.name,
      zones:           (Array.isArray(p.zones) && (p.zones as unknown[]).length > 0)
                         ? (p.zones as SectionZone[])
                         : SPREAD_ZONES.map((z) => ({ ...z })),
      contentStore:    ((p.contentStore as Record<string, LayoutContent>) ?? {}),
      layoutOverrides: ((p.layoutOverrides as Record<string, LayoutType>) ?? {}),
      boxStyles:       ((p.boxStyles as Record<string, Partial<BoxStyle>>) ?? {}),
      images:          ((p.images as Record<string, Partial<ImageData>>) ?? {}),
      chartConfigs:    ((p.chartConfigs as Record<string, Partial<ChartConfig>>) ?? {}),
      hideHeader:      p.hideHeader,
      hideFooter:      p.hideFooter,
    };
  }

  return {
    activeThemeId:      (project.activeThemeId as ThemeId) || defaultTheme.id,
    colorOverrides:     ((project.colorOverrides as Partial<ColorPalette>) ?? {}),
    activeFontPresetId: null,
    showGrid:           project.showGrid ?? true,
    currentPageId:      pageOrder[0] ?? "",
    pageOrder,
    pages,
  };
}

// ─── Loading screen ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#05080F" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 flex items-center justify-center text-[12px] font-black"
          style={{ backgroundColor: "#00D4FF", color: "#05080F" }}
        >F1</div>
        <div className="text-[10px] font-mono uppercase" style={{ color: "#3D6080", letterSpacing: "0.18em" }}>
          Chargement…
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-5" style={{ backgroundColor: "#1F1F2C" }} />;
}

// ─── Editor page ───────────────────────────────────────────────────────────────

export default function EditorPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: session }  = useSession();
  const editor             = useEditorState();
  const { selection, selectZone, selectSlot, clearSelection } = useSelection();

  // DB load state — blocks cloud sync until correct project is loaded
  const [projectLoaded, setProjectLoaded] = useState(false);

  // Load project from DB on mount — always takes priority over localStorage
  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ project, pages }) => {
        const state = dbToEditorState(project, pages);
        editor.rehydrate(state);
        setProjectLoaded(true);
      })
      .catch(() => {
        // Network offline or error — fall through to localStorage
        setProjectLoaded(true);
      });
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoggedIn = !!session?.user?.id;

  // Cloud sync only starts AFTER DB load to prevent corrupting the project
  const { flushSync } = useCloudSync({
    projectId,
    state:     editor.state,
    enabled:   isLoggedIn && projectLoaded,
    debounceMs: 1500,
  });

  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [savedToast,    setSavedToast]    = useState(false);
  const [exportOpen,    setExportOpen]    = useState(false);
  const [helpOpen,      setHelpOpen]      = useState(false);
  const [dsOpen,        setDsOpen]        = useState(false);

  const flushRef = useRef({ local: editor.flushSave, cloud: flushSync });
  useEffect(() => {
    flushRef.current = { local: editor.flushSave, cloud: flushSync };
  }, [editor.flushSave, flushSync]);

  const handleSave = useCallback(() => {
    flushRef.current.local();
    if (isLoggedIn && projectLoaded) void flushRef.current.cloud();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  }, [isLoggedIn, projectLoaded]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing = target && (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      );
      const meta = e.metaKey || e.ctrlKey;

      if (meta) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); editor.undo(); return; }
        if (e.key === "z" && e.shiftKey)  { e.preventDefault(); editor.redo(); return; }
        if (e.key === "y")                { e.preventDefault(); editor.redo(); return; }
        if (e.key === "s")                { e.preventDefault(); handleSave(); return; }
        if (e.key === "e")                { e.preventDefault(); setExportOpen(true); return; }
      }

      if (isEditing) return;
      if (e.key === "Escape") { clearSelection(); return; }
      if (e.key === "?")      { e.preventDefault(); setHelpOpen(true); return; }
      if (e.key === "g")      { editor.toggleGrid(!editor.state.showGrid); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor, clearSelection, handleSave]);

  // Clear selection when switching pages
  useEffect(() => { clearSelection(); }, [editor.state.currentPageId, clearSelection]);

  // Build context value
  const cur = editor.currentPage;
  const editorContextValue = useMemo(() => ({
    contentStore:    cur?.contentStore    ?? {},
    layoutOverrides: cur?.layoutOverrides ?? {},
    boxStyles:       cur?.boxStyles       ?? {},
    images:          cur?.images          ?? {},
    chartConfigs:    cur?.chartConfigs    ?? {},
    zones:           cur?.zones           ?? [],
    currentPageId:   editor.state.currentPageId,
    pages:           editor.orderedPages,
    hideHeader:      cur?.hideHeader ?? false,
    hideFooter:      cur?.hideFooter ?? false,
    selection,
    selectZone, selectSlot, clearSelection,
    updateContent:           editor.updateContent,
    setLayout:               editor.setLayout,
    setBoxStyle:             editor.setBoxStyle,
    resetBoxStyle:           editor.resetBoxStyle,
    setImage:                editor.setImage,
    removeImage:             editor.removeImage,
    setChartConfig:          editor.setChartConfig,
    toggleHeaderVisibility:  editor.toggleHeaderVisibility,
    toggleFooterVisibility:  editor.toggleFooterVisibility,
    setZones:                editor.setZones,
    addZone:                 editor.addZone,
    removeZone:              editor.removeZone,
    reorderZones:            editor.reorderZones,
    addPage:                 editor.addPage,
    duplicatePage:           editor.duplicatePage,
    deletePage:              editor.deletePage,
    reorderPages:            editor.reorderPages,
    switchPage:              editor.switchPage,
    renamePage:              editor.renamePage,
    activeFontPresetId:      editor.state.activeFontPresetId,
    setFontPreset:           editor.setFontPreset,
    loadTemplate:            editor.loadTemplate,
    resetProject:            editor.resetProject,
  }), [cur, editor, selection, selectZone, selectSlot, clearSelection]);

  const isTextEditing = selection.kind === "text";

  // Show loading screen until DB project is loaded
  if (!projectLoaded) return <LoadingScreen />;

  return (
    <EditorProvider value={editorContextValue}>
      <DragProvider>
        <FloatingFormatToolbar accentColor={editor.mergedTheme.colors.accent} active={isTextEditing} />

        <div
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: "#0A0A10", color: "#E0E0E8", fontFamily: "'Satoshi', 'Inter', sans-serif" }}
        >
          {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
          <header
            className="flex-shrink-0 flex items-center justify-between gap-3 px-3 py-2 border-b flex-wrap no-export"
            style={{ borderColor: "#1F1F2C", backgroundColor: "#0D0D14" }}
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/projects"
                className="h-7 w-7 flex items-center justify-center transition-colors"
                style={{ border: "1px solid #2A2A3A", color: "#888", backgroundColor: "#13131C" }}
                title="Retour aux projets"
              >
                <IconChevronLeft size={13} />
              </Link>
              <BrandMenu
                accent={editor.mergedTheme.colors.accent}
                background={editor.mergedTheme.colors.background}
                onNewProject={() => window.location.href = "/projects/new"}
                onResetProject={editor.resetProject}
                onOpenDesignSystem={() => setDsOpen(true)}
              />
            </div>

            {/* CENTER */}
            <PageNav theme={editor.mergedTheme} />

            {/* RIGHT */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex gap-px">
                <button
                  onClick={editor.undo} disabled={!editor.canUndo} title="Annuler (⌘Z)"
                  className="h-7 w-7 flex items-center justify-center transition-colors disabled:opacity-25"
                  style={{ border: "1px solid #2A2A3A", borderRight: "none", color: editor.canUndo ? "#C5C5D0" : "#555", backgroundColor: "#13131C" }}
                ><IconUndo size={12} /></button>
                <button
                  onClick={editor.redo} disabled={!editor.canRedo} title="Rétablir (⌘⇧Z)"
                  className="h-7 w-7 flex items-center justify-center transition-colors disabled:opacity-25"
                  style={{ border: "1px solid #2A2A3A", color: editor.canRedo ? "#C5C5D0" : "#555", backgroundColor: "#13131C" }}
                ><IconRedo size={12} /></button>
              </div>

              <Divider />

              <label
                className="flex items-center gap-1.5 cursor-pointer h-7 px-2" title="Grille (G)"
                style={{ border: "1px solid #2A2A3A", backgroundColor: "#13131C" }}
              >
                <input
                  type="checkbox" checked={editor.state.showGrid}
                  onChange={(e) => editor.toggleGrid(e.target.checked)}
                  className="w-3 h-3" style={{ accentColor: editor.mergedTheme.colors.accent }}
                />
                <span className="text-[9px] uppercase hidden sm:inline" style={{ color: editor.state.showGrid ? editor.mergedTheme.colors.accent : "#777", letterSpacing: "0.08em", fontWeight: 500 }}>
                  Grille
                </span>
              </label>

              <Divider />

              <button
                onClick={handleSave} title="Sauvegarder (⌘S)"
                className="h-7 px-3 flex items-center gap-1.5 text-[10px] uppercase font-semibold transition-all"
                style={{
                  border: `1px solid ${savedToast ? editor.mergedTheme.colors.accent + "80" : "#2A2A3A"}`,
                  color: savedToast ? editor.mergedTheme.colors.accent : "#C5C5D0",
                  backgroundColor: savedToast ? `${editor.mergedTheme.colors.accent}12` : "#13131C",
                  letterSpacing: "0.08em", minWidth: 90,
                }}
              >
                {savedToast ? <><IconCheck size={11} /> Sauvegardé</> : "Sauvegarder"}
              </button>

              <button
                onClick={() => setExportOpen(true)} title="Exporter (⌘E)"
                className="h-7 px-3 flex items-center gap-1.5 text-[10px] uppercase font-semibold transition-colors"
                style={{ border: `1px solid ${editor.mergedTheme.colors.accent}80`, color: editor.mergedTheme.colors.accent, backgroundColor: `${editor.mergedTheme.colors.accent}12`, letterSpacing: "0.08em" }}
              ><IconDownload size={12} /> Export</button>

              <button
                onClick={() => setHelpOpen(true)} title="Raccourcis (?)"
                className="h-7 w-7 flex items-center justify-center transition-colors"
                style={{ border: "1px solid #2A2A3A", color: "#888", backgroundColor: "#13131C" }}
              ><IconHelp size={12} /></button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-7 w-7 flex items-center justify-center transition-colors"
                style={{ border: `1px solid ${sidebarOpen ? editor.mergedTheme.colors.accent + "50" : "#2A2A3A"}`, color: sidebarOpen ? editor.mergedTheme.colors.accent : "#888", backgroundColor: sidebarOpen ? `${editor.mergedTheme.colors.accent}10` : "#13131C" }}
                title={sidebarOpen ? "Masquer le panneau" : "Afficher le panneau"}
              >{sidebarOpen ? <IconPanelLeft size={12} /> : <IconPanelRight size={12} />}</button>
            </div>
          </header>

          {/* ── MAIN ────────────────────────────────────────────────────────── */}
          <div className="flex flex-1 overflow-hidden">

            {sidebarOpen && (
              <LeftRail
                theme={editor.mergedTheme}
                themes={themeList}
                activeThemeId={editor.state.activeThemeId}
                colorOverrides={editor.state.colorOverrides}
                onSelectTheme={editor.setTheme}
                onColorChange={(k: ColorKey, v: string) => editor.setColor(k, v)}
                onResetColor={editor.resetColor}
                onResetAllColors={editor.resetAllColors}
              />
            )}

            <main
              className="flex-1 overflow-auto flex flex-col"
              onClick={(e) => { if (e.target === e.currentTarget) clearSelection(); }}
            >
              <div className="flex-1">
                <Spread
                  theme={editor.mergedTheme}
                  zones={cur?.zones ?? []}
                  onZonesChange={editor.setZones}
                  showGrid={editor.state.showGrid}
                />
              </div>
            </main>

            {inspectorOpen && (
              <Inspector theme={editor.mergedTheme} onClose={() => setInspectorOpen(false)} />
            )}

            {!inspectorOpen && (
              <button
                onClick={() => setInspectorOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 px-1.5 py-3 text-[9px] font-mono uppercase z-30"
                style={{ border: `1px solid ${editor.mergedTheme.colors.accent}60`, backgroundColor: "#0D0D14", color: editor.mergedTheme.colors.accent, letterSpacing: "0.18em" }}
              >
                <IconPanelRight size={13} />
                <span style={{ writingMode: "vertical-rl" as const }}>Inspector</span>
              </button>
            )}
          </div>
        </div>

        {exportOpen && (
          <ExportDialog
            theme={editor.mergedTheme}
            pages={editor.orderedPages}
            currentPageId={editor.state.currentPageId}
            onClose={() => setExportOpen(false)}
          />
        )}
        {helpOpen  && <HelpDialog theme={editor.mergedTheme} onClose={() => setHelpOpen(false)} />}
        {dsOpen    && <DesignSystemDrawer theme={editor.mergedTheme} onClose={() => setDsOpen(false)} />}
      </DragProvider>
    </EditorProvider>
  );
}
