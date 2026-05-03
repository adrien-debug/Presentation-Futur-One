"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ColorPalette, SPREAD_ZONES, defaultTheme,
} from "@/design-system";
import type { ThemeId, SectionZone } from "@/design-system";
import { useEditorState, EditorState } from "@/hooks/useEditorState";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useSelection } from "@/hooks/useSelection";
import { EditorProvider } from "@/contexts/EditorContext";
import { DragProvider } from "@/contexts/DragContext";
import Spread from "@/components/layout/Spread";
import FloatingFormatToolbar from "@/components/ui/FloatingFormatToolbar";
import ExportDialog from "@/components/ui/ExportDialog";
import HelpDialog from "@/components/ui/HelpDialog";
import AppShell from "@/components/app/AppShell";
import TopBar from "@/components/app/TopBar";
import CanvasStage from "@/components/app/CanvasStage";
import SmartToolbar from "@/components/app/SmartToolbar";
import ContextInspector from "@/components/app/ContextInspector";
import { AppMode } from "@/components/app/ModeSwitcher";
import type {
  LayoutContent, LayoutType, BoxStyle, ImageData, ChartConfig, Page, PageZones,
} from "@/data/types";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

// ─── DB → EditorState conversion ──────────────────────────────────────────────

function dbToEditorState(
  project: { activeThemeId: string; colorOverrides: unknown; showGrid: boolean },
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

  // Migrate zones from possible legacy shape (SectionZone[]) to { left, right }.
  const hydrateZones = (raw: unknown): PageZones => {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const obj = raw as { left?: unknown; right?: unknown };
      const left  = Array.isArray(obj.left)  && obj.left.length  > 0 ? obj.left  as SectionZone[] : SPREAD_ZONES.map((z) => ({ ...z }));
      const right = Array.isArray(obj.right) && obj.right.length > 0 ? obj.right as SectionZone[] : SPREAD_ZONES.map((z) => ({ ...z }));
      return { left, right };
    }
    if (Array.isArray(raw) && raw.length > 0) {
      // Legacy: single shared array → clone to both sides
      const clone = (raw as SectionZone[]).map((z) => ({ ...z }));
      return { left: clone, right: clone.map((z) => ({ ...z })) };
    }
    return {
      left:  SPREAD_ZONES.map((z) => ({ ...z })),
      right: SPREAD_ZONES.map((z) => ({ ...z })),
    };
  };

  for (const p of sorted) {
    pages[p.id] = {
      id:              p.id,
      name:            p.name,
      zones:           hydrateZones(p.zones),
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

function LoadingScreen() {
  return (
    <div
      className="w-screen flex items-center justify-center"
      style={{ height: "100dvh", backgroundColor: "var(--bg-app)" }}
    >
      <div className="flex flex-col items-center" style={{ gap: 20 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            border: "1px solid var(--border-strong)",
            color: "var(--fg-primary)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          F1
        </div>
        <div
          aria-hidden
          style={{
            position: "relative",
            width: 96,
            height: 1,
            backgroundColor: "var(--border-subtle)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "40%",
              backgroundColor: "var(--fg-secondary)",
              animation: "futur-loading-slide 1.4s ease-in-out infinite",
            }}
          />
        </div>
        <div
          className="text-[10px]"
          style={{
            color: "var(--fg-muted)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Chargement
        </div>
      </div>
    </div>
  );
}

// ─── Editor page ───────────────────────────────────────────────────────────────

export default function EditorPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const editor = useEditorState();
  const { selection, selectZone, selectSlot, clearSelection } = useSelection();

  // DB load — source of truth
  const [projectLoaded, setProjectLoaded] = useState(false);
  const [projectName, setProjectName] = useState("");
  // Setup guide: only shown the first time we open a fresh project (computed once at load).
  const [setupGuideActive, setSetupGuideActive] = useState(false);
  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(({ project, pages }) => {
        const next = dbToEditorState(project, pages);
        editor.rehydrate(next);
        setProjectName(project.name ?? "");
        const fresh =
          next.activeThemeId === defaultTheme.id &&
          next.activeFontPresetId === null &&
          Object.keys(next.colorOverrides).length === 0 &&
          Object.values(next.pages).every((p) => Object.keys(p.contentStore).length === 0);
        if (fresh) {
          setMode("design-system");
          setSetupGuideActive(true);
        }
        setProjectLoaded(true);
      })
      .catch(() => setProjectLoaded(true));
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoggedIn = !!session?.user?.id;

  const { flushSync, status: cloudStatus } = useCloudSync({
    projectId,
    state:      editor.state,
    enabled:    isLoggedIn && projectLoaded,
    debounceMs: 1500,
  });

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [mode, setMode]               = useState<AppMode>("layout");
  const [pageSide, setPageSide]       = useState<"left" | "right">("left");
  const [showLabels, setShowLabels]   = useState(false);
  const [showSafeArea, setSafeArea]   = useState(false);
  const [showBleed, setShowBleed]     = useState(false);
  const [localSavedAt, setLocalSavedAt] = useState(0);
  const [exportOpen, setExportOpen]   = useState(false);
  const [helpOpen, setHelpOpen]       = useState(false);

  const flushRef = useRef({ local: editor.flushSave, cloud: flushSync });
  useEffect(() => { flushRef.current = { local: editor.flushSave, cloud: flushSync }; }, [editor.flushSave, flushSync]);

  const handleSave = useCallback(() => {
    flushRef.current.local();
    if (isLoggedIn && projectLoaded) void flushRef.current.cloud();
    setLocalSavedAt(Date.now());
  }, [isLoggedIn, projectLoaded]);

  // Auto-revert offline "saved" badge after 2s.
  const [offlineRevertTick, setOfflineRevertTick] = useState(0);
  useEffect(() => {
    if (!localSavedAt) return;
    const t = setTimeout(() => setOfflineRevertTick((v) => v + 1), 2100);
    return () => clearTimeout(t);
  }, [localSavedAt]);

  // Combine cloud status with offline manual-save toast.
  const syncStatus = useMemo(() => {
    if (isLoggedIn && projectLoaded) return cloudStatus;
    // Offline / not authenticated: show "saved" briefly after a manual save.
    if (localSavedAt && Date.now() - localSavedAt < 2000) return "saved" as const;
    return "idle" as const;
  }, [isLoggedIn, projectLoaded, cloudStatus, localSavedAt, offlineRevertTick]);

  // Keyboard
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

  useEffect(() => { clearSelection(); }, [editor.state.currentPageId, clearSelection]);

  // ─── Auto-switch mode when user clicks a zone (selection → layout mode) ───
  useEffect(() => {
    if (selection.kind && mode !== "layout") setMode("layout");
  }, [selection.kind]); // eslint-disable-line react-hooks/exhaustive-deps

  // Setup guide ends as soon as the user leaves the design-system mode for any reason.
  useEffect(() => {
    if (setupGuideActive && mode !== "design-system") setSetupGuideActive(false);
  }, [mode, setupGuideActive]);

  // ─── Editor context value ─────────────────────────────────────────────────
  const cur = editor.currentPage;
  const spreadIndex = Math.max(0, editor.state.pageOrder.indexOf(editor.state.currentPageId));
  const editorContextValue = useMemo(() => ({
    contentStore:    cur?.contentStore    ?? {},
    layoutOverrides: cur?.layoutOverrides ?? {},
    boxStyles:       cur?.boxStyles       ?? {},
    images:          cur?.images          ?? {},
    chartConfigs:    cur?.chartConfigs    ?? {},
    zones:           cur?.zones           ?? { left: [], right: [] },
    currentPageId:   editor.state.currentPageId,
    pages:           editor.orderedPages,
    hideHeader:      cur?.hideHeader ?? false,
    hideFooter:      cur?.hideFooter ?? false,
    projectName:     projectName,
    spreadIndex,
    totalSpreads:    Math.max(1, editor.orderedPages.length),
    printMode:       mode === "print-preview",
    selection,
    selectZone, selectSlot, clearSelection,
    updateContent: editor.updateContent,
    setLayout: editor.setLayout,
    setBoxStyle: editor.setBoxStyle,
    resetBoxStyle: editor.resetBoxStyle,
    setImage: editor.setImage,
    removeImage: editor.removeImage,
    setChartConfig: editor.setChartConfig,
    toggleHeaderVisibility: editor.toggleHeaderVisibility,
    toggleFooterVisibility: editor.toggleFooterVisibility,
    setZones:    editor.setZones,
    addZone:     editor.addZone,
    removeZone:  editor.removeZone,
    reorderZones: editor.reorderZones,
    addPage: editor.addPage,
    duplicatePage: editor.duplicatePage,
    deletePage: editor.deletePage,
    reorderPages: editor.reorderPages,
    switchPage: editor.switchPage,
    renamePage: editor.renamePage,
    activeFontPresetId: editor.state.activeFontPresetId,
    setFontPreset: editor.setFontPreset,
    resetProject: editor.resetProject,
  }), [cur, editor, selection, selectZone, selectSlot, clearSelection, projectName, spreadIndex, mode]);

  const isTextEditing = selection.kind === "text";
  const currentPage   = editor.currentPage;
  const pageIdx       = editor.state.pageOrder.indexOf(editor.state.currentPageId);
  const accent        = editor.mergedTheme.colors.accent;

  if (!projectLoaded) return <LoadingScreen />;

  return (
    <EditorProvider value={editorContextValue}>
      <DragProvider>
        <FloatingFormatToolbar accentColor={accent} active={isTextEditing} />

        <AppShell
          topbar={
            <TopBar
              projectName={projectName || "Sans titre"}
              pageName={currentPage?.name ?? ""}
              pageIndex={pageIdx >= 0 ? pageIdx : 0}
              totalPages={editor.orderedPages.length}
              mode={mode}
              onModeChange={setMode}
              canUndo={editor.canUndo}
              canRedo={editor.canRedo}
              onUndo={editor.undo}
              onRedo={editor.redo}
              showGrid={editor.state.showGrid}
              onToggleGrid={editor.toggleGrid}
              onSave={handleSave}
              onExport={() => setExportOpen(true)}
              onHelp={() => setHelpOpen(true)}
              syncStatus={syncStatus}
              accent={accent}
            />
          }
          canvas={
            <CanvasStage
              accent={accent}
              showSafeArea={showSafeArea}
              showBleed={showBleed}
            >
              <Spread
                theme={editor.mergedTheme}
                zonesLeft={cur?.zones.left   ?? []}
                zonesRight={cur?.zones.right ?? []}
                onZonesChange={editor.setZones}
                showGrid={editor.state.showGrid || showLabels}
              />
            </CanvasStage>
          }
          panel={
            selection.kind && mode !== "print-preview" ? (
              <ContextInspector theme={editor.mergedTheme} />
            ) : (
              <SmartToolbar
                mode={mode}
                theme={editor.mergedTheme}
                activeThemeId={editor.state.activeThemeId}
                colorOverrides={editor.state.colorOverrides}
                onSelectTheme={editor.setTheme}
                onColorChange={(k: ColorKey, v: string) => editor.setColor(k, v)}
                onResetAllColors={editor.resetAllColors}
                pageSide={pageSide}
                onPageSideChange={setPageSide}
                showLabels={showLabels}     onToggleLabels={setShowLabels}
                showSafeArea={showSafeArea} onToggleSafeArea={setSafeArea}
                showBleed={showBleed}       onToggleBleed={setShowBleed}
                onExport={() => setExportOpen(true)}
                projectId={projectId}
                setupGuideActive={setupGuideActive}
                onExitSetup={() => { setSetupGuideActive(false); setMode("layout"); }}
              />
            )
          }
        />

        {exportOpen && (
          <ExportDialog
            theme={editor.mergedTheme}
            pages={editor.orderedPages}
            currentPageId={editor.state.currentPageId}
            onClose={() => setExportOpen(false)}
          />
        )}
        {helpOpen && <HelpDialog theme={editor.mergedTheme} onClose={() => setHelpOpen(false)} />}
      </DragProvider>
    </EditorProvider>
  );
}
