"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import { themeList, defaultTheme, ArtDirection, SectionZone, SPREAD_ZONES, ColorPalette, ThemeId } from "@/design-system";
import { ZONE } from "@/design-system/constants";
import { LayoutContent, LayoutType, BoxStyle, ImageData, ChartConfig, Page, Template } from "@/data/types";
import { FONT_PRESETS, FontPresetId } from "@/design-system/font-presets";

/**
 * EditorState v3 — multi-page.
 *
 * Theme + colors + grid are global. Everything else lives per Page.
 * Selection state is NOT here (see useSelection.ts) — selection is UI-only,
 * not undoable, not persisted.
 *
 * Key conventions inside a Page:
 *   contentStore     → `${side}-${zoneId}`
 *   layoutOverrides  → `${side}-${zoneId}`
 *   boxStyles        → `${side}-${zoneId}`
 *   images           → `${side}-${zoneId}-${role}`   (e.g. "image-main", "image-grid-0..3")
 *   chartConfigs     → `${side}-${zoneId}-chart-main`
 */
export interface EditorState {
  activeThemeId: ThemeId;
  colorOverrides: Partial<ColorPalette>;
  activeFontPresetId: FontPresetId | null;
  showGrid: boolean;
  currentPageId: string;
  pageOrder: string[];
  pages: Record<string, Page>;
}

export type ColorKey = keyof Omit<ColorPalette, "cmyk">;

type EditorAction =
  // Global
  | { type: "SET_THEME"; themeId: ThemeId }
  | { type: "SET_COLOR"; key: ColorKey; value: string }
  | { type: "RESET_COLOR"; key: ColorKey }
  | { type: "RESET_ALL_COLORS" }
  | { type: "SET_FONT_PRESET"; presetId: FontPresetId | null }
  | { type: "TOGGLE_GRID"; value: boolean }
  // Per-page (act on currentPageId)
  | { type: "SET_ZONES"; zones: SectionZone[] }
  | { type: "ADD_ZONE"; afterId: string }
  | { type: "REMOVE_ZONE"; id: string }
  | { type: "REORDER_ZONES"; fromIdx: number; toIdx: number }
  | { type: "UPDATE_CONTENT"; key: string; field: keyof LayoutContent; value: unknown }
  | { type: "SET_LAYOUT"; key: string; layout: LayoutType }
  | { type: "SET_BOX_STYLE"; styleKey: string; style: Partial<BoxStyle> }
  | { type: "RESET_BOX_STYLE"; styleKey: string }
  | { type: "SET_IMAGE"; slotId: string; image: Partial<ImageData> }
  | { type: "REMOVE_IMAGE"; slotId: string }
  | { type: "SET_CHART_CONFIG"; slotId: string; config: Partial<ChartConfig> }
  | { type: "TOGGLE_HEADER_VISIBILITY"; hidden: boolean }
  | { type: "TOGGLE_FOOTER_VISIBILITY"; hidden: boolean }
  // Multi-page
  | { type: "ADD_PAGE"; afterId?: string; name?: string }
  | { type: "DUPLICATE_PAGE"; pageId: string }
  | { type: "DELETE_PAGE"; pageId: string }
  | { type: "REORDER_PAGES"; fromIdx: number; toIdx: number }
  | { type: "SWITCH_PAGE"; pageId: string }
  | { type: "RENAME_PAGE"; pageId: string; name: string }
  // Bulk
  | { type: "LOAD_TEMPLATE"; template: Template }
  | { type: "RESET_PROJECT" }
  | { type: "REHYDRATE"; state: EditorState }
  | { type: "UNDO" }
  | { type: "REDO" };

interface HistoryState {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

function uid(prefix = "z"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function createBlankPage(name = "Page 1", id?: string): Page {
  return {
    id: id ?? uid("page"),
    name,
    zones: SPREAD_ZONES.map((z) => ({ ...z })),
    contentStore: {},
    layoutOverrides: {},
    boxStyles: {},
    images: {},
    chartConfigs: {},
  };
}

export function createInitialState(): EditorState {
  const firstPage = createBlankPage("Page 1");
  return {
    activeThemeId: defaultTheme.id,
    colorOverrides: {},
    activeFontPresetId: null,
    showGrid: true,
    currentPageId: firstPage.id,
    pageOrder: [firstPage.id],
    pages: { [firstPage.id]: firstPage },
  };
}

export const STORAGE_KEY = "futur-one-editor-v3";
const HISTORY_LIMIT = 50;

function isValidZone(z: unknown): z is SectionZone {
  return typeof z === "object" && z !== null
    && typeof (z as SectionZone).id === "string"
    && typeof (z as SectionZone).label === "string"
    && typeof (z as SectionZone).heightRatio === "number";
}

function isValidPage(p: unknown): p is Page {
  if (typeof p !== "object" || p === null) return false;
  const page = p as Page;
  return typeof page.id === "string"
    && typeof page.name === "string"
    && Array.isArray(page.zones) && page.zones.every(isValidZone)
    && typeof page.contentStore === "object"
    && typeof page.layoutOverrides === "object"
    && typeof page.boxStyles === "object"
    && typeof page.images === "object"
    && typeof page.chartConfigs === "object";
}

function loadFromStorage(): EditorState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EditorState>;
    if (typeof parsed.activeThemeId !== "string") return null;
    if (typeof parsed.currentPageId !== "string") return null;
    if (!Array.isArray(parsed.pageOrder)) return null;
    if (!parsed.pages || typeof parsed.pages !== "object") return null;
    const pages = parsed.pages as Record<string, unknown>;
    if (!Object.values(pages).every(isValidPage)) return null;
    if (!themeList.find((t) => t.id === parsed.activeThemeId)) return null;
    return { ...createInitialState(), ...parsed } as EditorState;
  } catch {
    return null;
  }
}

// ─── Per-page patch helper ────────────────────────────────────────────────────
function patchCurrentPage(state: EditorState, patch: (p: Page) => Page): EditorState {
  const id = state.currentPageId;
  const cur = state.pages[id];
  if (!cur) return state;
  const next = patch(cur);
  if (next === cur) return state;
  return { ...state, pages: { ...state.pages, [id]: next } };
}

function reducePresent(present: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // ─── Global ─────────────────────────────────────────────────────────────
    case "SET_THEME":
      return { ...present, activeThemeId: action.themeId, colorOverrides: {} };
    case "SET_FONT_PRESET":
      return { ...present, activeFontPresetId: action.presetId };
    case "SET_COLOR":
      return { ...present, colorOverrides: { ...present.colorOverrides, [action.key]: action.value } };
    case "RESET_COLOR": {
      const next: Partial<ColorPalette> = { ...present.colorOverrides };
      delete next[action.key];
      return { ...present, colorOverrides: next };
    }
    case "RESET_ALL_COLORS":
      return { ...present, colorOverrides: {} };
    case "TOGGLE_GRID":
      return { ...present, showGrid: action.value };

    // ─── Per-page ───────────────────────────────────────────────────────────
    case "SET_ZONES":
      return patchCurrentPage(present, (p) => ({ ...p, zones: action.zones }));

    case "ADD_ZONE":
      return patchCurrentPage(present, (p) => {
        const idx = p.zones.findIndex((z) => z.id === action.afterId);
        if (idx === -1) return p;
        const sourceZone = p.zones[idx];
        const newRatio = Math.max(ZONE.MIN_RATIO, sourceZone.heightRatio / 2);
        const sourceNew = Math.max(ZONE.MIN_RATIO, sourceZone.heightRatio - newRatio);
        const sectionCount = p.zones.filter((z) => !["header", "footer"].includes(z.id)).length;
        const newZone: SectionZone = {
          id: uid("section"),
          label: `SECTION ${sectionCount + 1}`,
          heightRatio: newRatio,
        };
        const zones = [...p.zones];
        zones[idx] = { ...sourceZone, heightRatio: sourceNew };
        zones.splice(idx + 1, 0, newZone);
        return { ...p, zones };
      });

    case "REMOVE_ZONE":
      return patchCurrentPage(present, (p) => {
        if (action.id === "header" || action.id === "footer") return p;
        const idx = p.zones.findIndex((z) => z.id === action.id);
        if (idx === -1 || p.zones.length <= 3) return p;
        const removed = p.zones[idx];
        const target = idx > 1 ? idx - 1 : idx + 1;
        const zones = p.zones.filter((_, i) => i !== idx);
        const targetIdxAfter = target > idx ? target - 1 : target;
        zones[targetIdxAfter] = {
          ...zones[targetIdxAfter],
          heightRatio: zones[targetIdxAfter].heightRatio + removed.heightRatio,
        };
        const isZoneKey = (k: string) =>
          k === `left-${action.id}` || k === `right-${action.id}` ||
          k.startsWith(`left-${action.id}-`) || k.startsWith(`right-${action.id}-`);
        const filterOut = <T,>(obj: Record<string, T>): Record<string, T> =>
          Object.fromEntries(Object.entries(obj).filter(([k]) => !isZoneKey(k)));
        return {
          ...p,
          zones,
          boxStyles:       filterOut(p.boxStyles),
          contentStore:    filterOut(p.contentStore),
          layoutOverrides: filterOut(p.layoutOverrides),
          images:          filterOut(p.images),
          chartConfigs:    filterOut(p.chartConfigs),
        };
      });

    case "REORDER_ZONES":
      return patchCurrentPage(present, (p) => {
        const { fromIdx, toIdx } = action;
        const zones = [...p.zones];
        const lastIdx = zones.length - 1;
        if (fromIdx === 0 || fromIdx === lastIdx) return p;
        if (toIdx === 0 || toIdx > lastIdx - 1) return p;
        const [moved] = zones.splice(fromIdx, 1);
        zones.splice(toIdx, 0, moved);
        return { ...p, zones };
      });

    case "UPDATE_CONTENT":
      return patchCurrentPage(present, (p) => ({
        ...p,
        contentStore: {
          ...p.contentStore,
          [action.key]: { ...(p.contentStore[action.key] ?? {}), [action.field]: action.value },
        },
      }));

    case "SET_LAYOUT":
      return patchCurrentPage(present, (p) => ({
        ...p,
        layoutOverrides: { ...p.layoutOverrides, [action.key]: action.layout },
      }));

    case "SET_BOX_STYLE":
      return patchCurrentPage(present, (p) => ({
        ...p,
        boxStyles: {
          ...p.boxStyles,
          [action.styleKey]: { ...(p.boxStyles[action.styleKey] ?? {}), ...action.style },
        },
      }));

    case "RESET_BOX_STYLE":
      return patchCurrentPage(present, (p) => {
        const { [action.styleKey]: _, ...rest } = p.boxStyles;
        return { ...p, boxStyles: rest };
      });

    case "SET_IMAGE":
      return patchCurrentPage(present, (p) => ({
        ...p,
        images: { ...p.images, [action.slotId]: { ...(p.images[action.slotId] ?? {}), ...action.image } },
      }));

    case "REMOVE_IMAGE":
      return patchCurrentPage(present, (p) => {
        const { [action.slotId]: _, ...rest } = p.images;
        return { ...p, images: rest };
      });

    case "SET_CHART_CONFIG":
      return patchCurrentPage(present, (p) => ({
        ...p,
        chartConfigs: {
          ...p.chartConfigs,
          [action.slotId]: { ...(p.chartConfigs[action.slotId] ?? {}), ...action.config },
        },
      }));

    case "TOGGLE_HEADER_VISIBILITY":
      return patchCurrentPage(present, (p) => ({ ...p, hideHeader: action.hidden }));

    case "TOGGLE_FOOTER_VISIBILITY":
      return patchCurrentPage(present, (p) => ({ ...p, hideFooter: action.hidden }));

    // ─── Multi-page ─────────────────────────────────────────────────────────
    case "ADD_PAGE": {
      const sectionCount = present.pageOrder.length;
      const newPage = createBlankPage(action.name ?? `Page ${sectionCount + 1}`);
      const order = action.afterId
        ? (() => {
            const idx = present.pageOrder.indexOf(action.afterId);
            if (idx === -1) return [...present.pageOrder, newPage.id];
            return [...present.pageOrder.slice(0, idx + 1), newPage.id, ...present.pageOrder.slice(idx + 1)];
          })()
        : [...present.pageOrder, newPage.id];
      return {
        ...present,
        pages: { ...present.pages, [newPage.id]: newPage },
        pageOrder: order,
        currentPageId: newPage.id,
      };
    }

    case "DUPLICATE_PAGE": {
      const src = present.pages[action.pageId];
      if (!src) return present;
      const clone: Page = {
        ...JSON.parse(JSON.stringify(src)) as Page,
        id: uid("page"),
        name: `${src.name} (copie)`,
      };
      const idx = present.pageOrder.indexOf(action.pageId);
      const order = idx === -1
        ? [...present.pageOrder, clone.id]
        : [...present.pageOrder.slice(0, idx + 1), clone.id, ...present.pageOrder.slice(idx + 1)];
      return {
        ...present,
        pages: { ...present.pages, [clone.id]: clone },
        pageOrder: order,
        currentPageId: clone.id,
      };
    }

    case "DELETE_PAGE": {
      if (present.pageOrder.length <= 1) return present;
      const idx = present.pageOrder.indexOf(action.pageId);
      if (idx === -1) return present;
      const order = present.pageOrder.filter((p) => p !== action.pageId);
      const { [action.pageId]: _, ...pages } = present.pages;
      const currentPageId = present.currentPageId === action.pageId
        ? (order[Math.max(0, idx - 1)] ?? order[0])
        : present.currentPageId;
      return { ...present, pages, pageOrder: order, currentPageId };
    }

    case "REORDER_PAGES": {
      const { fromIdx, toIdx } = action;
      if (fromIdx === toIdx) return present;
      const order = [...present.pageOrder];
      const [moved] = order.splice(fromIdx, 1);
      order.splice(toIdx, 0, moved);
      return { ...present, pageOrder: order };
    }

    case "SWITCH_PAGE": {
      if (!present.pages[action.pageId]) return present;
      return { ...present, currentPageId: action.pageId };
    }

    case "RENAME_PAGE": {
      const page = present.pages[action.pageId];
      if (!page) return present;
      return {
        ...present,
        pages: { ...present.pages, [action.pageId]: { ...page, name: action.name } },
      };
    }

    // ─── Bulk ───────────────────────────────────────────────────────────────
    case "LOAD_TEMPLATE": {
      const t = action.template;
      const pages: Record<string, Page> = {};
      const pageOrder: string[] = [];
      for (const tp of t.pages) {
        // Clone each page with a fresh id to avoid collisions
        const id = uid("page");
        const cloned: Page = { ...JSON.parse(JSON.stringify(tp)) as Page, id };
        pages[id] = cloned;
        pageOrder.push(id);
      }
      return {
        ...createInitialState(),
        activeThemeId: t.themeId,
        pages,
        pageOrder,
        currentPageId: pageOrder[0],
      };
    }

    case "RESET_PROJECT":
      return createInitialState();

    default:
      return present;
  }
}

function editorReducer(history: HistoryState, action: EditorAction): HistoryState {
  const { past, present, future } = history;

  // Non-undoable actions
  if (action.type === "REHYDRATE") {
    return { past: [], present: action.state, future: [] };
  }
  if (action.type === "SWITCH_PAGE") {
    // Switching pages doesn't pollute the undo stack
    return { ...history, present: reducePresent(present, action) };
  }

  if (action.type === "UNDO") {
    if (past.length === 0) return history;
    return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] };
  }

  if (action.type === "REDO") {
    if (future.length === 0) return history;
    return { past: [...past, present].slice(-HISTORY_LIMIT), present: future[0], future: future.slice(1) };
  }

  const newPresent = reducePresent(present, action);
  if (newPresent === present) return history;

  return {
    past: [...past, present].slice(-HISTORY_LIMIT),
    present: newPresent,
    future: [],
  };
}

export function useEditorState() {
  const [history, dispatch] = useReducer(
    editorReducer,
    null,
    () => ({ past: [], present: createInitialState(), future: [] })
  );

  // After mount, silently rehydrate from localStorage
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) dispatch({ type: "REHYDRATE", state: saved });
    // Clean up old v2 key
    try { localStorage.removeItem("futur-one-editor-v2"); } catch { /* */ }
  }, []);

  // Auto-save with debounce
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          // Emit a custom event so the UI can show a toast
          window.dispatchEvent(new CustomEvent("storage-quota-exceeded"));
        }
      }
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [history.present]);

  const { present, past, future } = history;

  const activeTheme = themeList.find((t) => t.id === present.activeThemeId) ?? defaultTheme;
  const fontPreset = present.activeFontPresetId
    ? FONT_PRESETS.find((p) => p.id === present.activeFontPresetId)
    : null;
  const mergedTheme: ArtDirection = {
    ...activeTheme,
    colors: { ...activeTheme.colors, ...present.colorOverrides },
    typography: fontPreset?.headingFont
      ? {
          ...activeTheme.typography,
          headingFont: fontPreset.headingFont,
          bodyFont: fontPreset.bodyFont,
          monoFont: fontPreset.monoFont,
          headingWeight: fontPreset.headingWeight,
          letterSpacing: fontPreset.letterSpacing,
        }
      : activeTheme.typography,
  };

  // ─── Action wrappers ──────────────────────────────────────────────────────
  const undo            = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo            = useCallback(() => dispatch({ type: "REDO" }), []);
  // Global
  const setTheme        = useCallback((themeId: ThemeId) => dispatch({ type: "SET_THEME", themeId }), []);
  const setFontPreset   = useCallback((presetId: FontPresetId | null) => dispatch({ type: "SET_FONT_PRESET", presetId }), []);
  const setColor        = useCallback((key: ColorKey, value: string) => dispatch({ type: "SET_COLOR", key, value }), []);
  const resetColor      = useCallback((key: ColorKey) => dispatch({ type: "RESET_COLOR", key }), []);
  const resetAllColors  = useCallback(() => dispatch({ type: "RESET_ALL_COLORS" }), []);
  const toggleGrid      = useCallback((value: boolean) => dispatch({ type: "TOGGLE_GRID", value }), []);
  // Per-page (act on currentPageId implicitly)
  const setZones        = useCallback((zones: SectionZone[]) => dispatch({ type: "SET_ZONES", zones }), []);
  const addZone         = useCallback((afterId: string) => dispatch({ type: "ADD_ZONE", afterId }), []);
  const removeZone      = useCallback((id: string) => dispatch({ type: "REMOVE_ZONE", id }), []);
  const reorderZones    = useCallback((fromIdx: number, toIdx: number) => dispatch({ type: "REORDER_ZONES", fromIdx, toIdx }), []);
  const updateContent   = useCallback(
    (key: string, field: keyof LayoutContent, value: unknown) => dispatch({ type: "UPDATE_CONTENT", key, field, value }),
    []
  );
  const setLayout       = useCallback((key: string, layout: LayoutType) => dispatch({ type: "SET_LAYOUT", key, layout }), []);
  const setBoxStyle     = useCallback(
    (styleKey: string, style: Partial<BoxStyle>) => dispatch({ type: "SET_BOX_STYLE", styleKey, style }),
    []
  );
  const resetBoxStyle   = useCallback((styleKey: string) => dispatch({ type: "RESET_BOX_STYLE", styleKey }), []);
  const setImage        = useCallback(
    (slotId: string, image: Partial<ImageData>) => dispatch({ type: "SET_IMAGE", slotId, image }),
    []
  );
  const removeImage     = useCallback((slotId: string) => dispatch({ type: "REMOVE_IMAGE", slotId }), []);
  const setChartConfig  = useCallback(
    (slotId: string, config: Partial<ChartConfig>) => dispatch({ type: "SET_CHART_CONFIG", slotId, config }),
    []
  );
  const toggleHeaderVisibility = useCallback((hidden: boolean) => dispatch({ type: "TOGGLE_HEADER_VISIBILITY", hidden }), []);
  const toggleFooterVisibility = useCallback((hidden: boolean) => dispatch({ type: "TOGGLE_FOOTER_VISIBILITY", hidden }), []);
  // Multi-page
  const addPage         = useCallback((afterId?: string, name?: string) => dispatch({ type: "ADD_PAGE", afterId, name }), []);
  const duplicatePage   = useCallback((pageId: string) => dispatch({ type: "DUPLICATE_PAGE", pageId }), []);
  const deletePage      = useCallback((pageId: string) => dispatch({ type: "DELETE_PAGE", pageId }), []);
  const reorderPages    = useCallback((fromIdx: number, toIdx: number) => dispatch({ type: "REORDER_PAGES", fromIdx, toIdx }), []);
  const switchPage      = useCallback((pageId: string) => dispatch({ type: "SWITCH_PAGE", pageId }), []);
  const renamePage      = useCallback((pageId: string, name: string) => dispatch({ type: "RENAME_PAGE", pageId, name }), []);
  // Bulk
  const loadTemplate    = useCallback((template: Template) => dispatch({ type: "LOAD_TEMPLATE", template }), []);
  const resetProject    = useCallback(() => dispatch({ type: "RESET_PROJECT" }), []);

  const flushSave = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present)); } catch { /* */ }
  }, [history.present]);

  // Convenience: resolved current page (memoized via reference equality)
  const currentPage = present.pages[present.currentPageId];
  const orderedPages: Page[] = present.pageOrder.map((id) => present.pages[id]).filter(Boolean);

  return {
    state: present,
    currentPage,
    orderedPages,
    mergedTheme,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo, redo,
    setTheme, setFontPreset, setColor, resetColor, resetAllColors, toggleGrid,
    setZones, addZone, removeZone, reorderZones,
    updateContent, setLayout,
    setBoxStyle, resetBoxStyle,
    setImage, removeImage, setChartConfig,
    toggleHeaderVisibility, toggleFooterVisibility,
    addPage, duplicatePage, deletePage, reorderPages, switchPage, renamePage,
    loadTemplate, resetProject,
    flushSave,
    rehydrate: useCallback((state: EditorState) => dispatch({ type: "REHYDRATE", state }), []),
  };
}
