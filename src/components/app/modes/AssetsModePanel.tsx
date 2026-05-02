"use client";

import React, { useState } from "react";
import { ArtDirection } from "@/design-system";
import { useDrag, DRAG_MIME } from "@/contexts/DragContext";
import { ContentDragKind } from "@/data/types";
import {
  INSTITUTIONAL_TITLES, HERO_TITLES, TEXT_BLOCK_STYLES, CHART_IDEAS,
} from "@/data/content";
import SegmentedControl from "../SegmentedControl";

type Tab = "titles" | "text" | "charts";

export default function AssetsModePanel({ theme }: { theme: ArtDirection }) {
  const accent = theme.colors.accent;
  const [tab, setTab] = useState<Tab>("titles");
  const { startDrag, endDrag } = useDrag();

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
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          accent={accent}
          fullWidth
          size="sm"
          options={[
            { value: "titles", label: "Titres" },
            { value: "text",   label: "Texte" },
            { value: "charts", label: "Charts" },
          ]}
        />
        <div className="text-[8px] mt-2" style={{ color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
          Glisser sur une zone pour appliquer
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 scroll-y px-3 pb-4">

        {tab === "titles" && (
          <div className="flex flex-col gap-1">
            {INSTITUTIONAL_TITLES.slice(0, 12).map((t, i) => (
              <div
                key={i}
                {...dragHandlers({ kind: "institutional-title", text: t }, `inst-${i}`)}
                className="text-[9px] p-2 leading-snug cursor-grab active:cursor-grabbing transition-colors"
                style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-elevated)", color: "var(--fg-primary)" }}
              >
                {t}
              </div>
            ))}
            <div className="border-t my-2" style={{ borderColor: "var(--border-subtle)" }} />
            <div className="text-[8px] uppercase mb-1" style={{ color: accent, letterSpacing: "0.14em" }}>Hero</div>
            {HERO_TITLES.slice(0, 8).map((h, i) => (
              <div
                key={i}
                {...dragHandlers({ kind: "hero-title", text: h.text }, `hero-${i}`)}
                className="font-black uppercase p-2 cursor-grab active:cursor-grabbing whitespace-pre-line leading-tight transition-colors"
                style={{
                  fontSize: 10, border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-elevated)", color: theme.colors.text,
                  fontFamily: theme.typography.headingFont,
                }}
              >{h.text}</div>
            ))}
          </div>
        )}

        {tab === "text" && (
          <div className="flex flex-col gap-1">
            {TEXT_BLOCK_STYLES.map((b, i) => (
              <div
                key={i}
                {...dragHandlers({ kind: "text-block", name: b.name, content: b.content }, `text-${i}`)}
                className="p-2 cursor-grab active:cursor-grabbing transition-colors"
                style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
              >
                <div className="text-[8px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.12em" }}>{b.name}</div>
                <div className="text-[9px] mt-1 leading-snug" style={{ color: "var(--fg-secondary)" }}>
                  {b.content.slice(0, 80)}{b.content.length > 80 ? "…" : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "charts" && (
          <div className="flex flex-col gap-1">
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
                  className="p-2 cursor-grab active:cursor-grabbing transition-colors"
                  style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
                >
                  <div className="text-[8px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.12em" }}>
                    {chartType}
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: "var(--fg-primary)" }}>{c.name}</div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
