import { ContentDragKind, LayoutType, LayoutContent, KpiItem, ImageData } from "@/data/types";

interface ApplyContext {
  zoneKey: string;
  currentLayout: LayoutType;
  setLayout: (key: string, layout: LayoutType) => void;
  updateContent: (key: string, field: keyof LayoutContent, value: unknown) => void;
  setChartConfig: (slotId: string, cfg: { type?: string; values?: number[]; labels?: string[] }) => void;
  setImage?: (slotId: string, image: Partial<ImageData>) => void;
}

/**
 * Apply a content drag payload to a zone.
 * Auto-switches layout when needed (silently, undoable).
 */
export function applyContentToZone(payload: ContentDragKind, ctx: ApplyContext): void {
  const { zoneKey, currentLayout, setLayout, updateContent, setChartConfig, setImage } = ctx;

  switch (payload.kind) {
    case "institutional-title": {
      // Force hero layout if not already there
      if (currentLayout !== "hero") setLayout(zoneKey, "hero");
      updateContent(zoneKey, "heroTitle", payload.text);
      break;
    }
    case "hero-title": {
      if (currentLayout !== "hero") setLayout(zoneKey, "hero");
      const lines = payload.text.split("\n");
      updateContent(zoneKey, "heroTitle", lines[0] ?? payload.text);
      if (lines[1]) updateContent(zoneKey, "heroAccent", lines[1]);
      break;
    }
    case "text-block": {
      // text-full is the canonical receiver
      if (!["text-full", "image-text", "two-col", "quote"].includes(currentLayout)) {
        setLayout(zoneKey, "text-full");
      }
      updateContent(zoneKey, "bodyText", payload.content);
      break;
    }
    case "kpi-set": {
      if (!["kpi-row", "three-kpi"].includes(currentLayout)) {
        setLayout(zoneKey, payload.kpis.length === 3 ? "three-kpi" : "kpi-row");
      }
      updateContent(zoneKey, "kpis", payload.kpis as KpiItem[]);
      break;
    }
    case "chart-idea": {
      if (!["chart", "chart-text"].includes(currentLayout)) {
        setLayout(zoneKey, "chart");
      }
      updateContent(zoneKey, "chartType", payload.chartType);
      updateContent(zoneKey, "chartLabel", payload.label);
      // Update chart slot config too
      const slotId = `${zoneKey}-chart-main`;
      setChartConfig(slotId, { type: payload.chartType, values: payload.values, labels: payload.labels });
      break;
    }
    case "quote": {
      if (currentLayout !== "quote") setLayout(zoneKey, "quote");
      updateContent(zoneKey, "quoteText", payload.text);
      updateContent(zoneKey, "quoteAttribution", payload.attribution);
      break;
    }
    case "image-asset": {
      // Pick the canonical image slot for the active layout, or force image-full.
      const layoutsWithImage: LayoutType[] = ["image-full", "image-text", "image-grid"];
      const layout = layoutsWithImage.includes(currentLayout) ? currentLayout : "image-full";
      if (layout !== currentLayout) setLayout(zoneKey, layout);
      const slotId = layout === "image-grid" ? `${zoneKey}-image-grid-0` : `${zoneKey}-image-main`;
      setImage?.(slotId, { src: payload.src });
      break;
    }
  }
}
