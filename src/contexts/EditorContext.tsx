"use client";

import React, { createContext, useContext } from "react";
import {
  LayoutContent, LayoutType, BoxStyle, ImageData, ChartConfig,
  Page, UISelection, SlotKind, Template,
} from "@/data/types";
import { SectionZone } from "@/design-system";

/**
 * EditorContext — exposes:
 *   • current-page resolved stores (back-compat shape for SectionBlock/PageContext/etc)
 *   • current page meta + ordered pages list (for Pages panel + page navigator)
 *   • UI selection + setters
 *   • all mutations (per-page act on current page implicitly)
 *   • multi-page actions
 *   • template/reset
 */
export interface EditorContextValue {
  // ─── Resolved current-page stores ───
  contentStore:    Record<string, LayoutContent>;
  layoutOverrides: Record<string, LayoutType>;
  boxStyles:       Record<string, Partial<BoxStyle>>;
  images:          Record<string, Partial<ImageData>>;
  chartConfigs:    Record<string, Partial<ChartConfig>>;
  zones:           SectionZone[];

  // ─── Page meta ───
  currentPageId: string;
  pages: Page[]; // ordered
  hideHeader: boolean;
  hideFooter: boolean;

  // ─── Selection ───
  selection: UISelection;
  selectZone:     (zoneKey: string) => void;
  selectSlot:     (zoneKey: string, slotId: string, kind: SlotKind) => void;
  clearSelection: () => void;

  // ─── Per-page mutations ───
  updateContent:  (key: string, field: keyof LayoutContent, value: unknown) => void;
  setLayout:      (key: string, layout: LayoutType) => void;
  setBoxStyle:    (styleKey: string, style: Partial<BoxStyle>) => void;
  resetBoxStyle:  (styleKey: string) => void;
  setImage:       (slotId: string, image: Partial<ImageData>) => void;
  removeImage:    (slotId: string) => void;
  setChartConfig: (slotId: string, config: Partial<ChartConfig>) => void;
  toggleHeaderVisibility: (hidden: boolean) => void;
  toggleFooterVisibility: (hidden: boolean) => void;

  // ─── Multi-page actions ───
  addPage:       (afterId?: string, name?: string) => void;
  duplicatePage: (pageId: string) => void;
  deletePage:    (pageId: string) => void;
  reorderPages:  (fromIdx: number, toIdx: number) => void;
  switchPage:    (pageId: string) => void;
  renamePage:    (pageId: string, name: string) => void;

  // ─── Bulk ───
  loadTemplate: (template: Template) => void;
  resetProject: () => void;
}

const noop = () => {};

const EditorContext = createContext<EditorContextValue>({
  contentStore: {}, layoutOverrides: {}, boxStyles: {}, images: {}, chartConfigs: {},
  zones: [],
  currentPageId: "",
  pages: [],
  hideHeader: false,
  hideFooter: false,
  selection: { zoneKey: null, slotId: null, kind: null },
  selectZone: noop, selectSlot: noop, clearSelection: noop,
  updateContent: noop, setLayout: noop,
  setBoxStyle: noop, resetBoxStyle: noop,
  setImage: noop, removeImage: noop, setChartConfig: noop,
  toggleHeaderVisibility: noop, toggleFooterVisibility: noop,
  addPage: noop, duplicatePage: noop, deletePage: noop,
  reorderPages: noop, switchPage: noop, renamePage: noop,
  loadTemplate: noop, resetProject: noop,
});

export const useEditor = () => useContext(EditorContext);
export const EditorProvider = EditorContext.Provider;

// Convenience
export const useSelectionContext = () => {
  const { selection, selectZone, selectSlot, clearSelection } = useEditor();
  return { selection, selectZone, selectSlot, clearSelection };
};
