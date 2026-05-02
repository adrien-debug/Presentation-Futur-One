export type LayoutType =
  | "hero"
  | "kpi-row"
  | "image-text"
  | "two-col"
  | "chart"
  | "text-full"
  | "image-full"
  | "three-kpi"
  | "chart-text"
  | "quote"
  | "image-grid"
  | "timeline"
  | "blank";

export interface LayoutMeta {
  id: LayoutType;
  label: string;
  ascii: string; // multi-line ASCII preview
}

export const ALL_LAYOUTS: LayoutMeta[] = [
  { id: "hero",       label: "Hero Title",    ascii: "█▀▀▀▀▀\n█  ███\n█  ___" },
  { id: "kpi-row",    label: "4 KPIs",        ascii: "▣ ▣ ▣ ▣" },
  { id: "three-kpi",  label: "3 KPIs",        ascii: "▣  ▣  ▣" },
  { id: "image-text", label: "Image + Text",  ascii: "▣ │ ___\n▣ │ ___" },
  { id: "two-col",    label: "Two Columns",   ascii: "___│___\n___│___" },
  { id: "chart",      label: "Chart",         ascii: "▁▃▅▆▇" },
  { id: "chart-text", label: "Chart + Text",  ascii: "◐ │ ___\n◐ │ ___" },
  { id: "text-full",  label: "Full Text",     ascii: "_______\n_______\n_______" },
  { id: "image-full", label: "Full Image",    ascii: "███████\n███████" },
  { id: "image-grid", label: "Image Grid",    ascii: "▣ ▣\n▣ ▣" },
  { id: "quote",      label: "Quote",         ascii: '" ___\n  ___' },
  { id: "timeline",   label: "Timeline",      ascii: "● ─ ○ ─ ○" },
  { id: "blank",      label: "Blank (vide)",  ascii: "·     ·\n       \n·     ·" },
];

// ─── BOX STYLE ────────────────────────────────────────────────────────────────
export type BorderStyle  = "none" | "solid" | "dashed" | "dotted" | "double";
export type BorderSides  = "all" | "top" | "bottom" | "left" | "right" | "x" | "y";
export type FillStyle    = "transparent" | "surface" | "surfaceAlt" | "accentTint" | "gradient" | "glass";
export type ShadowStyle  = "none" | "soft" | "hard" | "neon" | "inset";
export type CornerStyle  = "none" | "brackets" | "beveled";
export type RadiusStyle  = "square" | "soft" | "rounded";

export interface BoxStyle {
  border:      BorderStyle;
  borderWidth: 1 | 2 | 3 | 4;
  borderSides: BorderSides;
  fill:        FillStyle;
  shadow:      ShadowStyle;
  corners:     CornerStyle;
  radius:      RadiusStyle;
}

export const DEFAULT_BOX_STYLE: BoxStyle = {
  border:      "none",
  borderWidth: 1,
  borderSides: "all",
  fill:        "transparent",
  shadow:      "none",
  corners:     "none",
  radius:      "square",
};

// ─── IMAGES ───────────────────────────────────────────────────────────────────
export type ImageFit = "cover" | "contain" | "fill";

export interface ImageData {
  src:    string;          // base64 data URI or external URL
  filter: string;          // CSS filter string (e.g. "grayscale(1) contrast(1.2)")
  fit:    ImageFit;
  opacity:number;          // 0–1
  overlay:string;          // CSS color or "none"
}

export const DEFAULT_IMAGE: ImageData = {
  src:     "",
  filter:  "none",
  fit:     "cover",
  opacity: 1,
  overlay: "none",
};

// ─── CHART CONFIG ─────────────────────────────────────────────────────────────
export type ChartType = "bar" | "line" | "donut" | "area" | "radar" | "gauge" | "horizontal-bar";

export interface ChartConfig {
  type:   ChartType;
  values: number[];
  labels: string[];
}

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  type:   "bar",
  values: [30, 55, 45, 75, 65, 90, 100],
  labels: ["2024", "2025", "2026", "2027", "2028", "2029", "2030"],
};

export interface KpiItem {
  value: string;
  label: string;
  sub?: string;
}

export interface TimelineStep {
  date: string;
  label: string;
  done: boolean;
}

export interface ContentColumn {
  label?: string;
  text?: string;
  items?: string[];
}

export interface LayoutContent {
  // hero
  eyebrow?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroSubtitle?: string;
  // kpi-row + three-kpi
  kpis?: KpiItem[];
  // image-text + image-full + image-grid
  imageLabel?: string;
  imageEyebrow?: string;
  imageBodyText?: string;
  imageCaption?: string;
  gridLabels?: string[];
  // two-col
  twoCol?: { left: ContentColumn; right: ContentColumn };
  // chart + chart-text
  chartType?: ChartType;
  chartLabel?: string;
  chartStatLabel?: string;
  chartStatValue?: string;
  chartStatSub?: string;
  // text-full
  textEyebrow?: string;
  bodyText?: string;
  tags?: string[];
  // quote
  quoteText?: string;
  quoteAttribution?: string;
  // timeline
  timelineSteps?: TimelineStep[];
}

// ─── PAGE (multi-page support) ────────────────────────────────────────────────
import type { SectionZone } from "@/design-system";

export interface Page {
  id: string;
  name: string;
  zones: SectionZone[];
  contentStore:    Record<string, LayoutContent>;
  layoutOverrides: Record<string, LayoutType>;
  boxStyles:       Record<string, Partial<BoxStyle>>;
  images:          Record<string, Partial<ImageData>>;
  chartConfigs:    Record<string, Partial<ChartConfig>>;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

// ─── UI SELECTION (not undoable, not persisted) ───────────────────────────────
export type SlotKind = "zone" | "image" | "chart" | "kpi" | "text";

export interface UISelection {
  zoneKey:  string | null;   // `${side}-${zoneId}`
  slotId:   string | null;   // `${side}-${zoneId}-${role}` for image/chart, or text field id
  kind:     SlotKind | null;
}

// ─── DRAG & DROP ──────────────────────────────────────────────────────────────
export type ContentDragKind =
  | { kind: "institutional-title"; text: string }
  | { kind: "hero-title"; text: string }
  | { kind: "text-block"; name: string; content: string }
  | { kind: "kpi-set"; kpis: KpiItem[] }
  | { kind: "chart-idea"; chartType: ChartType; values: number[]; labels: string[]; label: string }
  | { kind: "quote"; text: string; attribution: string };

export interface DragSession {
  type: "layout" | "content";
  payload: LayoutType | ContentDragKind;
  source: string;
}

// ─── BOX STYLE PRESETS ────────────────────────────────────────────────────────

export type BoxStylePresetId =
  | "glassmorphism"
  | "neon-frame"
  | "carbon-fiber"
  | "blueprint"
  | "hologram"
  | "hard-edge"
  | "gold-inlay"
  | "ghost-card"
  | "terminal-box"
  | "frosted-pill"
  | "heat-bar"
  | "scan-line";

export interface BoxStylePreset {
  id: BoxStylePresetId;
  name: string;
  icon: string;
  style: BoxStyle;
}

export const BOX_STYLE_PRESETS: BoxStylePreset[] = [
  {
    id: "glassmorphism",
    name: "Glass",
    icon: "◫",
    style: { fill: "glass", border: "solid", borderWidth: 1, borderSides: "all", radius: "rounded", shadow: "soft", corners: "none" },
  },
  {
    id: "neon-frame",
    name: "Neon",
    icon: "▣",
    style: { fill: "transparent", border: "solid", borderWidth: 2, borderSides: "all", radius: "square", shadow: "neon", corners: "none" },
  },
  {
    id: "carbon-fiber",
    name: "Carbon",
    icon: "◼",
    style: { fill: "surfaceAlt", border: "solid", borderWidth: 1, borderSides: "all", radius: "square", shadow: "hard", corners: "none" },
  },
  {
    id: "blueprint",
    name: "Blueprint",
    icon: "⊞",
    style: { fill: "accentTint", border: "dashed", borderWidth: 1, borderSides: "all", radius: "square", shadow: "none", corners: "brackets" },
  },
  {
    id: "hologram",
    name: "Hologram",
    icon: "◈",
    style: { fill: "glass", border: "dotted", borderWidth: 1, borderSides: "all", radius: "soft", shadow: "neon", corners: "beveled" },
  },
  {
    id: "hard-edge",
    name: "Brutal",
    icon: "▪",
    style: { fill: "surface", border: "solid", borderWidth: 4, borderSides: "all", radius: "square", shadow: "hard", corners: "none" },
  },
  {
    id: "gold-inlay",
    name: "Gold",
    icon: "◇",
    style: { fill: "gradient", border: "double", borderWidth: 2, borderSides: "all", radius: "square", shadow: "soft", corners: "brackets" },
  },
  {
    id: "ghost-card",
    name: "Ghost",
    icon: "□",
    style: { fill: "transparent", border: "dashed", borderWidth: 1, borderSides: "all", radius: "soft", shadow: "none", corners: "none" },
  },
  {
    id: "terminal-box",
    name: "Terminal",
    icon: "▦",
    style: { fill: "surfaceAlt", border: "solid", borderWidth: 1, borderSides: "all", radius: "square", shadow: "inset", corners: "none" },
  },
  {
    id: "frosted-pill",
    name: "Frosted",
    icon: "⬭",
    style: { fill: "glass", border: "none", borderWidth: 1, borderSides: "all", radius: "rounded", shadow: "soft", corners: "none" },
  },
  {
    id: "heat-bar",
    name: "Heat",
    icon: "▬",
    style: { fill: "accentTint", border: "solid", borderWidth: 4, borderSides: "bottom", radius: "soft", shadow: "none", corners: "none" },
  },
  {
    id: "scan-line",
    name: "Scan",
    icon: "≡",
    style: { fill: "transparent", border: "dashed", borderWidth: 1, borderSides: "y", radius: "square", shadow: "none", corners: "none" },
  },
];

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
import type { ThemeId } from "@/design-system";

export interface Template {
  id: string;
  name: string;
  description: string;
  themeId: ThemeId;
  pages: Page[];
  tags: ("tech" | "investor" | "corporate" | "event" | "product")[];
}
