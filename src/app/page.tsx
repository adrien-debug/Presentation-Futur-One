"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { themeList, ColorPalette } from "@/design-system";
import { useEditorState } from "@/hooks/useEditorState";
import { useSelection } from "@/hooks/useSelection";
import { EditorProvider } from "@/contexts/EditorContext";
import { DragProvider } from "@/contexts/DragContext";
import Spread from "@/components/layout/Spread";
import ZoneControls from "@/components/ui/ZoneControls";
import FloatingFormatToolbar from "@/components/ui/FloatingFormatToolbar";
import LeftRail from "@/components/ui/LeftRail";
import Inspector from "@/components/inspector/Inspector";
import PageNav from "@/components/ui/PageNav";
import BrandMenu from "@/components/ui/BrandMenu";
import NewProjectModal from "@/components/ui/NewProjectModal";
import ExportDialog from "@/components/ui/ExportDialog";
import HelpDialog from "@/components/ui/HelpDialog";
import DesignSystemDrawer from "@/components/ui/DesignSystemDrawer";
import {
  IconUndo, IconRedo, IconDownload, IconHelp,
  IconPanelLeft, IconPanelRight, IconCheck,
} from "@/components/ui/Icon";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

function Divider() {
  return <div className="w-px h-5" style={{ backgroundColor: "#1F1F2C" }} />;
}

export default function Home() {
  const editor = useEditorState();
  const { selection, selectZone, selectSlot, clearSelection } = useSelection();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [savedToast, setSavedToast] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dsOpen, setDsOpen] = useState(false);

  const flushRef = useRef(editor.flushSave);
  useEffect(() => { flushRef.current = editor.flushSave; }, [editor.flushSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA");

      const meta = e.metaKey || e.ctrlKey;

      // Cmd combos always work
      if (meta) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); editor.undo(); return; }
        if (e.key === "z" && e.shiftKey)  { e.preventDefault(); editor.redo(); return; }
        if (e.key === "y")                { e.preventDefault(); editor.redo(); return; }
        if (e.key === "s") {
          e.preventDefault();
          flushRef.current();
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 1500);
          return;
        }
        if (e.key === "e") { e.preventDefault(); setExportOpen(true); return; }
      }

      if (isEditing) return;

      // Single-key shortcuts (only when not editing text)
      if (e.key === "Escape") { clearSelection(); return; }
      if (e.key === "?")      { e.preventDefault(); setHelpOpen(true); return; }
      if (e.key === "g")      { editor.toggleGrid(!editor.state.showGrid); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor, clearSelection]);

  // Clear selection on page switch
  useEffect(() => { clearSelection(); }, [editor.state.currentPageId, clearSelection]);

  // Auto-open New Project modal on first visit (state empty)
  useEffect(() => {
    const isFirstPage = editor.state.pageOrder.length === 1;
    const cur = editor.currentPage;
    const isEmpty = cur && Object.keys(cur.contentStore).length === 0
      && Object.keys(cur.layoutOverrides).length === 0
      && Object.keys(cur.images).length === 0;
    const seenWelcome = typeof window !== "undefined" && localStorage.getItem("futur-one-welcome-seen");
    if (isFirstPage && isEmpty && !seenWelcome) {
      setNewProjectOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseNewProject = useCallback(() => {
    setNewProjectOpen(false);
    try { localStorage.setItem("futur-one-welcome-seen", "1"); } catch { /* */ }
  }, []);

  // Build context value
  const cur = editor.currentPage;
  const editorContextValue = useMemo(() => ({
    contentStore:    cur?.contentStore    ?? {},
    layoutOverrides: cur?.layoutOverrides ?? {},
    boxStyles:       cur?.boxStyles       ?? {},
    images:          cur?.images          ?? {},
    chartConfigs:    cur?.chartConfigs    ?? {},
    zones:           cur?.zones           ?? [],
    currentPageId: editor.state.currentPageId,
    pages: editor.orderedPages,
    hideHeader: cur?.hideHeader ?? false,
    hideFooter: cur?.hideFooter ?? false,
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
    addPage: editor.addPage,
    duplicatePage: editor.duplicatePage,
    deletePage: editor.deletePage,
    reorderPages: editor.reorderPages,
    switchPage: editor.switchPage,
    renamePage: editor.renamePage,
    loadTemplate: editor.loadTemplate,
    resetProject: editor.resetProject,
  }), [cur, editor, selection, selectZone, selectSlot, clearSelection]);

  const isTextEditing = selection.kind === "text";

  return (
    <EditorProvider value={editorContextValue}>
      <DragProvider>
        <FloatingFormatToolbar accentColor={editor.mergedTheme.colors.accent} active={isTextEditing} />

        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A10", color: "#E0E0E8" }}>

          {/* ── TOPBAR ────────────────────────────────────────────────────── */}
          <header
            className="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-2.5 border-b flex-wrap no-export"
            style={{ borderColor: "#1F1F2C", backgroundColor: "#0D0D14" }}
          >
            {/* Brand menu */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <BrandMenu
                accent={editor.mergedTheme.colors.accent}
                background={editor.mergedTheme.colors.background}
                onNewProject={() => setNewProjectOpen(true)}
                onResetProject={editor.resetProject}
                onOpenDesignSystem={() => setDsOpen(true)}
              />
            </div>

            {/* Page navigator */}
            <PageNav theme={editor.mergedTheme} />

            {/* Right cluster */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Undo / Redo */}
              <div className="flex gap-px">
                <button
                  onClick={editor.undo}
                  disabled={!editor.canUndo}
                  title="Annuler (⌘Z)"
                  className="h-7 w-8 flex items-center justify-center transition-colors disabled:opacity-25"
                  style={{ border: "1px solid #2A2A3A", borderRight: "none", color: editor.canUndo ? "#C5C5D0" : "#444", backgroundColor: "#13131C" }}
                >
                  <IconUndo size={13} />
                </button>
                <button
                  onClick={editor.redo}
                  disabled={!editor.canRedo}
                  title="Rétablir (⌘⇧Z)"
                  className="h-7 w-8 flex items-center justify-center transition-colors disabled:opacity-25"
                  style={{ border: "1px solid #2A2A3A", color: editor.canRedo ? "#C5C5D0" : "#444", backgroundColor: "#13131C" }}
                >
                  <IconRedo size={13} />
                </button>
              </div>

              <Divider />

              {/* Grid toggle (shortcut G) */}
              <label
                className="flex items-center gap-1.5 cursor-pointer h-7 px-2"
                title="Afficher la grille (G)"
                style={{ border: "1px solid #2A2A3A", backgroundColor: "#13131C" }}
              >
                <input
                  type="checkbox"
                  checked={editor.state.showGrid}
                  onChange={(e) => editor.toggleGrid(e.target.checked)}
                  className="w-3 h-3"
                  style={{ accentColor: editor.mergedTheme.colors.accent }}
                />
                <span
                  className="text-[9px] font-mono uppercase hidden sm:inline"
                  style={{ color: editor.state.showGrid ? editor.mergedTheme.colors.accent : "#888", letterSpacing: "0.12em" }}
                >Grille</span>
              </label>

              <Divider />

              {/* Export */}
              <button
                onClick={() => setExportOpen(true)}
                title="Exporter (⌘E)"
                className="h-7 px-3 flex items-center gap-1.5 text-[10px] font-mono uppercase transition-colors"
                style={{
                  border: `1px solid ${editor.mergedTheme.colors.accent}80`,
                  color: editor.mergedTheme.colors.accent,
                  backgroundColor: `${editor.mergedTheme.colors.accent}12`,
                  letterSpacing: "0.12em",
                }}
              >
                <IconDownload size={12} />
                Export
              </button>

              {/* Help */}
              <button
                onClick={() => setHelpOpen(true)}
                title="Raccourcis (?)"
                className="h-7 w-8 flex items-center justify-center transition-colors"
                style={{ border: "1px solid #2A2A3A", color: "#888", backgroundColor: "#13131C" }}
              >
                <IconHelp size={13} />
              </button>

              {/* Sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-7 w-8 flex items-center justify-center transition-colors"
                style={{
                  border: `1px solid ${sidebarOpen ? editor.mergedTheme.colors.accent + "60" : "#2A2A3A"}`,
                  color: sidebarOpen ? editor.mergedTheme.colors.accent : "#888",
                  backgroundColor: sidebarOpen ? `${editor.mergedTheme.colors.accent}12` : "#13131C",
                }}
                title={sidebarOpen ? "Masquer le panneau latéral" : "Afficher le panneau latéral"}
              >
                {sidebarOpen ? <IconPanelLeft size={13} /> : <IconPanelRight size={13} />}
              </button>

              {/* Saved toast */}
              {savedToast && (
                <div
                  className="h-7 px-2.5 flex items-center gap-1.5 text-[9px] font-mono uppercase"
                  style={{
                    backgroundColor: `${editor.mergedTheme.colors.accent}18`,
                    color: editor.mergedTheme.colors.accent,
                    border: `1px solid ${editor.mergedTheme.colors.accent}40`,
                    letterSpacing: "0.12em",
                  }}
                >
                  <IconCheck size={11} />
                  Sauvegardé
                </div>
              )}
            </div>
          </header>

          {/* ── MAIN ─────────────────────────────────────────────────────── */}
          <div className="flex flex-1 overflow-hidden">

            {/* LEFT RAIL */}
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

            {/* CENTER CANVAS */}
            <main
              className="flex-1 overflow-auto"
              onClick={(e) => {
                // Click on the canvas background clears selection
                if (e.target === e.currentTarget) clearSelection();
              }}
            >
              <div className="min-h-full flex flex-col">
                <div className="flex-1">
                  <Spread
                    theme={editor.mergedTheme}
                    zones={cur?.zones ?? []}
                    onZonesChange={editor.setZones}
                    showGrid={editor.state.showGrid}
                  />
                </div>
                <ZoneControls
                  zones={cur?.zones ?? []}
                  onChange={editor.setZones}
                  onAddZone={editor.addZone}
                  onRemoveZone={editor.removeZone}
                  onReorderZones={editor.reorderZones}
                  theme={editor.mergedTheme}
                />
              </div>
            </main>

            {/* RIGHT INSPECTOR */}
            {inspectorOpen && (
              <Inspector theme={editor.mergedTheme} onClose={() => setInspectorOpen(false)} />
            )}

            {/* Floating button to reopen inspector */}
            {!inspectorOpen && (
              <button
                onClick={() => setInspectorOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 px-1.5 py-3 text-[9px] font-mono uppercase z-30"
                style={{
                  border: `1px solid ${editor.mergedTheme.colors.accent}60`,
                  backgroundColor: "#0D0D14",
                  color: editor.mergedTheme.colors.accent,
                  letterSpacing: "0.18em",
                }}
                title="Ouvrir l'inspector"
              >
                <IconPanelRight size={13} />
                <span style={{ writingMode: "vertical-rl" as const }}>Inspector</span>
              </button>
            )}
          </div>
        </div>

        {/* Modals */}
        {newProjectOpen && (
          <NewProjectModal
            theme={editor.mergedTheme}
            onClose={handleCloseNewProject}
            onSelect={(template) => {
              editor.loadTemplate(template);
              handleCloseNewProject();
            }}
            onBlank={() => {
              editor.resetProject();
              handleCloseNewProject();
            }}
          />
        )}
        {exportOpen && (
          <ExportDialog
            theme={editor.mergedTheme}
            pages={editor.orderedPages}
            currentPageId={editor.state.currentPageId}
            onClose={() => setExportOpen(false)}
          />
        )}
        {helpOpen && <HelpDialog theme={editor.mergedTheme} onClose={() => setHelpOpen(false)} />}
        {dsOpen && <DesignSystemDrawer theme={editor.mergedTheme} onClose={() => setDsOpen(false)} />}
      </DragProvider>
    </EditorProvider>
  );
}
