"use client";

import React, { useState, useRef, useCallback } from "react";
import { ArtDirection } from "@/design-system";
import { F } from "@/utils/cqb";
import { LayoutContent, LayoutType, ContentDragKind } from "@/data/types";
import { LAYOUT_DEFAULTS, DEFAULT_CONTENT } from "@/data/defaultContent";
import { useEditor } from "@/contexts/EditorContext";
import { useDrag, DRAG_MIME } from "@/contexts/DragContext";
import { applyContentToZone } from "@/utils/dragMapping";
import EditableText from "@/components/ui/EditableText";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ChartPlaceholder from "@/components/ui/ChartPlaceholder";
import KPICard from "@/components/ui/KPICard";
import TextBlock from "@/components/ui/TextBlock";

const DEFAULT_ZONE_LAYOUTS: Record<string, Record<string, LayoutType>> = {
  left: {
    "section-1": "hero", "section-2": "kpi-row", "section-3": "image-text",
    "section-4": "two-col", "section-5": "chart", "section-6": "text-full",
  },
  right: {
    "section-1": "image-full", "section-2": "three-kpi", "section-3": "chart-text",
    "section-4": "quote", "section-5": "image-grid", "section-6": "timeline",
  },
};

interface SectionBlockProps {
  theme: ArtDirection;
  zoneId: string;
  label: string;
  side: "left" | "right";
  showGrid?: boolean;
}

export default function SectionBlock({ theme, zoneId, label, side, showGrid = false }: SectionBlockProps) {
  const ed = useEditor();
  const { contentStore, layoutOverrides, updateContent, setLayout, setChartConfig, selection, selectZone } = ed;
  const { session: dragSession } = useDrag();
  const [dragOver, setDragOver] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);

  const key = `${side}-${zoneId}`;
  const isSelected = selection.zoneKey === key;
  const layoutType: LayoutType =
    layoutOverrides[key] ?? DEFAULT_ZONE_LAYOUTS[side]?.[zoneId] ?? "text-full";

  const content: LayoutContent = {
    ...LAYOUT_DEFAULTS[layoutType],
    ...(DEFAULT_CONTENT[key] ?? {}),
    ...(contentStore[key] ?? {}),
  };

  const onUpdate = useCallback(
    (field: keyof LayoutContent, value: unknown) => updateContent(key, field, value),
    [updateContent, key]
  );

  const accent = theme.colors.accent;

  // ─── Drag & drop handlers ───
  const onDragOver = (e: React.DragEvent) => {
    if (!dragSession) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!dragSession) return;
    if (dragSession.type === "layout") {
      const layout = e.dataTransfer.getData(DRAG_MIME.LAYOUT) as LayoutType;
      if (layout) setLayout(key, layout);
    } else {
      try {
        const raw = e.dataTransfer.getData(DRAG_MIME.CONTENT);
        if (!raw) return;
        const payload = JSON.parse(raw) as ContentDragKind;
        applyContentToZone(payload, {
          zoneKey: key,
          currentLayout: layoutType,
          setLayout,
          updateContent,
          setChartConfig: (sid, cfg) => setChartConfig(sid, cfg as Parameters<typeof setChartConfig>[1]),
        });
      } catch { /* ignore malformed payload */ }
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectZone(key);
  };

  return (
    <div
      ref={zoneRef}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="relative w-full h-full overflow-hidden group/zone cursor-pointer"
      style={{
        borderBottom: `1px solid ${theme.colors.border}20`,
        outline: isSelected ? `2px solid ${accent}` : dragOver ? `2px dashed ${accent}` : "none",
        outlineOffset: -2,
      }}
    >
      <SectionContent
        theme={theme}
        layout={layoutType}
        content={content}
        onUpdate={onUpdate}
        accentColor={accent}
        side={side}
        zoneId={zoneId}
        zoneKey={key}
      />

      {/* Drop hint overlay */}
      {dragOver && dragSession && (
        <div
          className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center no-export"
          style={{ backgroundColor: `${accent}15` }}
        >
          <div className="px-3 py-1.5 text-[9px] font-mono uppercase" style={{ backgroundColor: accent, color: theme.colors.background, letterSpacing: "0.2em" }}>
            {dragSession.type === "layout" ? "Appliquer ce layout" : "Remplir avec ce contenu"}
          </div>
        </div>
      )}

      {/* Grid label */}
      {showGrid && (
        <>
          <div className="absolute inset-0 border border-dashed pointer-events-none z-20 no-export" style={{ borderColor: `${accent}25` }} />
          <div className="absolute top-0 left-[2cqb] font-mono pointer-events-none z-20 uppercase no-export"
            style={{ fontSize: F.micro, color: `${accent}70`, paddingTop: "1cqb" }}>
            {label}
          </div>
        </>
      )}
    </div>
  );
}

// ── DISPATCHER ───────────────────────────────────────────────────────────────

interface ContentProps {
  theme: ArtDirection;
  layout: LayoutType;
  content: LayoutContent;
  onUpdate: (field: keyof LayoutContent, value: unknown) => void;
  accentColor: string;
  side: "left" | "right";
  zoneId: string;
  zoneKey: string;
}

function SectionContent(p: ContentProps) {
  switch (p.layout) {
    case "hero":        return <HeroLayout {...p} />;
    case "kpi-row":     return <KpiRowLayout {...p} />;
    case "image-text":  return <ImageTextLayout {...p} />;
    case "two-col":     return <TwoColLayout {...p} />;
    case "chart":       return <ChartLayout {...p} />;
    case "text-full":   return <TextFullLayout {...p} />;
    case "image-full":  return <ImageFullLayout {...p} />;
    case "three-kpi":   return <ThreeKpiLayout {...p} />;
    case "chart-text":  return <ChartTextLayout {...p} />;
    case "quote":       return <QuoteLayout {...p} />;
    case "image-grid":  return <ImageGridLayout {...p} />;
    case "timeline":    return <TimelineLayout {...p} />;
    case "blank":       return <BlankLayout theme={p.theme} />;
    default: {
      const _exhaustive: never = p.layout;
      void _exhaustive;
      return <BlankLayout theme={p.theme} />;
    }
  }
}

function BlankLayout({ theme }: { theme: ArtDirection }) {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div className="font-mono uppercase tracking-widest" style={{ fontSize: F.xs, color: `${theme.colors.textMuted}50`, letterSpacing: "0.2em" }}>
        Zone vide
      </div>
    </div>
  );
}

type LP = Omit<ContentProps, "layout">;

// Helper: text with selection-on-edit
function ETText({ field, value, onUpdate, zoneKey, ...props }: {
  field: keyof LayoutContent; value: string; onUpdate: LP["onUpdate"]; zoneKey: string;
} & Omit<React.ComponentProps<typeof EditableText>, "value" | "onSave">) {
  const { selectSlot } = useEditor();
  return (
    <EditableText
      {...props}
      value={value}
      onSave={(v) => onUpdate(field, v)}
      editMode
      onEnterEdit={() => selectSlot(zoneKey, `${zoneKey}-text-${String(field)}`, "text")}
    />
  );
}

// ── LAYOUTS ──────────────────────────────────────────────────────────────────

function HeroLayout({ theme, content, onUpdate, accentColor, zoneKey }: LP) {
  return (
    <div className="w-full h-full flex items-center" style={{ padding: "5cqb 8cqb" }}>
      <div>
        <ETText field="eyebrow" value={content.eyebrow ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2cqb" }} />
        <div style={{ fontFamily: theme.typography.headingFont, fontSize: F.display, letterSpacing: "-0.02em", lineHeight: "0.92", marginBottom: "3cqb" }}>
          <ETText field="heroTitle" value={content.heroTitle ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
            style={{ fontWeight: 900, color: theme.colors.text }} />
          <ETText field="heroAccent" value={content.heroAccent ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
            style={{ fontWeight: 900, color: accentColor }} />
        </div>
        <ETText field="heroSubtitle" value={content.heroSubtitle ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontSize: F.small, color: theme.colors.textMuted }} />
      </div>
    </div>
  );
}

function KpiRowLayout({ theme, content }: LP) {
  const kpis = content.kpis ?? [];
  return (
    <div className="w-full h-full grid grid-cols-4 divide-x" style={{ borderColor: theme.colors.border }}>
      {kpis.map((k) => <KPICard key={k.label} theme={theme} value={k.value} label={k.label} compact />)}
    </div>
  );
}

function ImageTextLayout({ theme, content, onUpdate, accentColor, side, zoneId, zoneKey }: LP) {
  const slotId = `${side}-${zoneId}-image-main`;
  return (
    <div className="w-full h-full grid grid-cols-5">
      <div className="col-span-2 h-full">
        <ImagePlaceholder theme={theme} slotId={slotId} label={content.imageLabel ?? "Image"} zoneKey={zoneKey} />
      </div>
      <div className="col-span-3 flex flex-col justify-center" style={{ padding: "5cqb 6cqb", gap: "2cqb" }}>
        <ETText field="imageEyebrow" value={content.imageEyebrow ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }} />
        <ETText field="imageBodyText" value={content.imageBodyText ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor} multiline richText
          style={{ fontSize: F.small, color: theme.colors.text, lineHeight: "1.5" }} />
      </div>
    </div>
  );
}

function TwoColLayout({ theme, content }: LP) {
  const left = content.twoCol?.left ?? {};
  const right = content.twoCol?.right ?? {};
  return (
    <div className="w-full h-full grid grid-cols-2 divide-x" style={{ borderColor: theme.colors.border }}>
      <div className="flex flex-col justify-center" style={{ padding: "5cqb 6cqb", gap: "2cqb" }}>
        <div className="font-mono uppercase" style={{ fontSize: F.xs, color: theme.colors.accent }}>{left.label}</div>
        <TextBlock theme={theme} size="small" text={left.text ?? ""} />
      </div>
      <div className="flex flex-col justify-center" style={{ padding: "5cqb 6cqb", gap: "2cqb" }}>
        <div className="font-mono uppercase" style={{ fontSize: F.xs, color: theme.colors.accent }}>{right.label}</div>
        <div className="flex flex-col" style={{ gap: "1.5cqb" }}>
          {(right.items ?? []).map((item) => (
            <div key={item} className="flex items-center" style={{ gap: "2cqb" }}>
              <div style={{ width: "1cqb", height: "1cqb", borderRadius: "50%", backgroundColor: theme.colors.accent, flexShrink: 0 }} />
              <span style={{ fontSize: F.small, color: theme.colors.textMuted }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartLayout({ theme, content, onUpdate, accentColor, side, zoneId, zoneKey }: LP) {
  const slotId = `${side}-${zoneId}-chart-main`;
  return (
    <div className="w-full h-full flex items-center" style={{ padding: "5cqb 6cqb", gap: "4cqb" }}>
      <div className="flex-1 h-full">
        <ChartPlaceholder theme={theme} slotId={slotId} type={content.chartType ?? "bar"} label={content.chartLabel ?? ""} zoneKey={zoneKey} />
      </div>
      <div style={{ width: "30%", flexShrink: 0 }}>
        <ETText field="chartStatLabel" value={content.chartStatLabel ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor, textTransform: "uppercase", marginBottom: "1cqb" }} />
        <ETText field="chartStatValue" value={content.chartStatValue ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontWeight: 900, fontSize: F.title, color: theme.colors.text, fontFamily: theme.typography.headingFont, letterSpacing: "-0.02em" }} />
        <ETText field="chartStatSub" value={content.chartStatSub ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontSize: F.small, color: theme.colors.textMuted }} />
      </div>
    </div>
  );
}

function TextFullLayout({ theme, content, onUpdate, accentColor, zoneKey }: LP) {
  const tags = content.tags ?? [];
  return (
    <div className="w-full h-full flex flex-col justify-center" style={{ padding: "5cqb 8cqb", gap: "2cqb" }}>
      <ETText field="textEyebrow" value={content.textEyebrow ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
        style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }} />
      <ETText field="bodyText" value={content.bodyText ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor} multiline richText
        style={{ fontSize: F.body, color: theme.colors.text, lineHeight: "1.5" }} />
      <div className="flex" style={{ gap: "2cqb", marginTop: "1cqb" }}>
        {tags.map((tag) => (
          <div key={tag} className="font-mono uppercase tracking-wider"
            style={{ padding: "1cqb 2cqb", fontSize: F.micro, border: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted }}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageFullLayout({ theme, content, onUpdate, accentColor, side, zoneId, zoneKey }: LP) {
  const slotId = `${side}-${zoneId}-image-main`;
  return (
    <div className="w-full h-full relative">
      <ImagePlaceholder theme={theme} slotId={slotId} label={content.imageLabel ?? ""} fullBleed zoneKey={zoneKey} />
      <div className="absolute bottom-0 left-0 right-0"
        style={{ padding: "6cqb 6cqb 3cqb", background: `linear-gradient(transparent, ${theme.colors.background}CC)` }}>
        <ETText field="imageCaption" value={content.imageCaption ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: theme.colors.textMuted }} />
      </div>
    </div>
  );
}

function ThreeKpiLayout({ theme, content }: LP) {
  const kpis = content.kpis ?? [];
  return (
    <div className="w-full h-full grid grid-cols-3 divide-x" style={{ borderColor: theme.colors.border }}>
      {kpis.map((k) => <KPICard key={k.label} theme={theme} value={k.value} label={k.label} sub={k.sub} compact />)}
    </div>
  );
}

function ChartTextLayout({ theme, content, onUpdate, accentColor, side, zoneId, zoneKey }: LP) {
  const slotId = `${side}-${zoneId}-chart-main`;
  return (
    <div className="w-full h-full grid grid-cols-5">
      <div className="col-span-3 h-full">
        <ChartPlaceholder theme={theme} slotId={slotId} type={content.chartType ?? "donut"} label={content.chartLabel ?? ""} zoneKey={zoneKey} />
      </div>
      <div className="col-span-2 flex flex-col justify-center" style={{ padding: "5cqb 4cqb", gap: "1.5cqb" }}>
        <ETText field="chartStatLabel" value={content.chartStatLabel ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor, textTransform: "uppercase" }} />
        <ETText field="chartStatValue" value={content.chartStatValue ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontWeight: 900, fontSize: F.lead, color: theme.colors.text, fontFamily: theme.typography.headingFont, letterSpacing: "-0.02em" }} />
        <ETText field="chartStatSub" value={content.chartStatSub ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontSize: F.small, color: theme.colors.textMuted }} />
      </div>
    </div>
  );
}

function QuoteLayout({ theme, content, onUpdate, accentColor, zoneKey }: LP) {
  return (
    <div className="w-full h-full flex items-center" style={{ padding: "5cqb 6cqb", gap: "3cqb" }}>
      <div className="font-black flex-shrink-0"
        style={{ fontSize: "40cqb", color: accentColor, fontFamily: theme.typography.headingFont, opacity: 0.35, lineHeight: "0.7", marginTop: "-3cqb" }}>
        &ldquo;
      </div>
      <div>
        <ETText field="quoteText" value={content.quoteText ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor} multiline richText
          style={{ fontStyle: "italic", lineHeight: "1.4", fontSize: F.body, color: theme.colors.text, marginBottom: "2cqb" }} />
        <ETText field="quoteAttribution" value={content.quoteAttribution ?? ""} onUpdate={onUpdate} zoneKey={zoneKey} tag="div" accentColor={accentColor}
          style={{ fontFamily: "monospace", fontSize: F.xs, color: accentColor }} />
      </div>
    </div>
  );
}

function ImageGridLayout({ theme, content, side, zoneId, zoneKey }: LP) {
  const labels = content.gridLabels ?? [];
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2" style={{ gap: "0.5px" }}>
      {labels.map((lbl, i) => (
        <ImagePlaceholder key={lbl} theme={theme} slotId={`${side}-${zoneId}-image-grid-${i}`} label={lbl} compact zoneKey={zoneKey} />
      ))}
    </div>
  );
}

function TimelineLayout({ theme, content }: LP) {
  const steps = content.timelineSteps ?? [];
  const doneCount = steps.filter((s) => s.done).length;
  return (
    <div className="relative w-full h-full flex items-center" style={{ padding: "4cqb 6cqb" }}>
      <div className="absolute font-mono uppercase pointer-events-none"
        style={{ top: "2cqb", left: "2cqb", fontSize: F.micro, color: theme.colors.accent, letterSpacing: "0.2em" }}>
        TIMELINE
      </div>
      <div className="flex flex-1 items-center">
        {steps.map((step, i) => (
          <React.Fragment key={step.date}>
            <div className="flex flex-col items-center" style={{ gap: "1.5cqb" }}>
              <div className="font-mono" style={{ fontSize: F.micro, color: theme.colors.textMuted }}>{step.date}</div>
              <div className="flex-shrink-0 flex items-center justify-center"
                style={{ width: "4cqb", height: "4cqb", borderRadius: "50%",
                  backgroundColor: step.done ? theme.colors.accent : "transparent",
                  border: `2px solid ${step.done ? theme.colors.accent : theme.colors.border}` }}>
                {step.done && <div style={{ width: "1.5cqb", height: "1.5cqb", borderRadius: "50%", backgroundColor: theme.colors.background }} />}
              </div>
              <div className="text-center leading-tight"
                style={{ fontSize: F.micro, color: step.done ? theme.colors.text : theme.colors.textMuted, maxWidth: "12cqb" }}>
                {step.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1" style={{ height: "1px", backgroundColor: i < doneCount ? theme.colors.accent : theme.colors.border }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
