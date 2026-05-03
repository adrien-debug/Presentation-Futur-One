"use client";

import React, { useRef, useState } from "react";
import { ArtDirection } from "@/design-system";
import { useDrag, DRAG_MIME } from "@/contexts/DragContext";
import { ContentDragKind } from "@/data/types";
import {
  INSTITUTIONAL_TITLES, HERO_TITLES, TEXT_BLOCK_STYLES, CHART_IDEAS,
} from "@/data/content";
import { useAssets } from "@/hooks/useAssets";
import SegmentedControl from "../SegmentedControl";

type Tab = "images" | "titles" | "text" | "charts";

export default function AssetsModePanel({ theme, projectId }: { theme: ArtDirection; projectId?: string }) {
  const accent = theme.colors.accent;
  const [tab, setTab] = useState<Tab>("images");
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
      <div className="flex-shrink-0" style={{ padding: "12px 16px 8px" }}>
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          accent={accent}
          fullWidth
          size="sm"
          options={[
            { value: "images", label: "Images" },
            { value: "titles", label: "Titres" },
            { value: "text",   label: "Texte" },
            { value: "charts", label: "Graphes" },
          ]}
        />
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 8 }}>
          Glisser un élément sur une zone du canevas pour l'appliquer.
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 scroll-y" style={{ padding: "8px 16px 16px" }}>

        {tab === "images" && (
          <ImagesTab projectId={projectId} startDrag={startDrag} endDrag={endDrag} />
        )}

        {tab === "titles" && (
          <div className="flex flex-col" style={{ gap: 12 }}>
            <SubLabel>Institutionnels</SubLabel>
            <div className="flex flex-col" style={{ gap: 4 }}>
              {INSTITUTIONAL_TITLES.slice(0, 12).map((t, i) => (
                <div
                  key={i}
                  {...dragHandlers({ kind: "institutional-title", text: t }, `inst-${i}`)}
                  className="cursor-grab active:cursor-grabbing transition-colors"
                  style={{
                    fontSize: 11,
                    padding: "8px 10px",
                    lineHeight: 1.4,
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "transparent",
                    color: "var(--fg-primary)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            <SubLabel>Hero</SubLabel>
            <div className="flex flex-col" style={{ gap: 4 }}>
              {HERO_TITLES.slice(0, 8).map((h, i) => (
                <div
                  key={i}
                  {...dragHandlers({ kind: "hero-title", text: h.text }, `hero-${i}`)}
                  className="cursor-grab active:cursor-grabbing transition-colors whitespace-pre-line"
                  style={{
                    fontSize: 11,
                    padding: "10px",
                    lineHeight: 1.15,
                    fontWeight: 700,
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "transparent",
                    color: theme.colors.text,
                    fontFamily: theme.typography.headingFont,
                    textTransform: "uppercase",
                  }}
                >
                  {h.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "text" && (
          <div className="flex flex-col" style={{ gap: 4 }}>
            {TEXT_BLOCK_STYLES.map((b, i) => (
              <div
                key={i}
                {...dragHandlers({ kind: "text-block", name: b.name, content: b.content }, `text-${i}`)}
                className="cursor-grab active:cursor-grabbing transition-colors"
                style={{
                  padding: "8px 10px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "transparent",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3, lineHeight: 1.4 }}>
                  {b.content.slice(0, 80)}{b.content.length > 80 ? "…" : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "charts" && (
          <div className="flex flex-col" style={{ gap: 4 }}>
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
                  className="cursor-grab active:cursor-grabbing transition-colors flex items-baseline justify-between"
                  style={{
                    padding: "8px 10px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "transparent",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--fg-primary)", letterSpacing: "-0.005em" }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>{chartType}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
      {children}
    </div>
  );
}

// ─── Images tab ──────────────────────────────────────────────────────────────

interface ImagesTabProps {
  projectId?: string;
  startDrag: (s: { type: "content"; payload: ContentDragKind; source: string }) => void;
  endDrag: () => void;
}

function ImagesTab({ projectId, startDrag, endDrag }: ImagesTabProps) {
  const { assets, loading, error, upload } = useAssets(projectId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    await upload(file);
    setBusy(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
        className="w-full transition-colors disabled:opacity-50"
        style={{
          height: 32,
          border: "1px solid var(--border-subtle)",
          color: "var(--fg-secondary)",
          backgroundColor: "transparent",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {busy ? "Import en cours…" : "Importer une image"}
      </button>

      {error && (
        <div style={{ fontSize: 11, padding: "8px 10px", color: "#E07070", border: "1px solid #5A2A2A" }}>
          {error}
        </div>
      )}

      {loading && assets.length === 0 && (
        <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>Chargement…</div>
      )}

      {!loading && assets.length === 0 && (
        <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>
          Aucune image importée. Formats PNG/JPG, 2 Mo max.
        </div>
      )}

      {assets.length > 0 && (
        <div className="grid grid-cols-3" style={{ gap: 6 }}>
          {assets.map((a) => {
            const src = a.src ?? "";
            if (!src) return null;
            const payload: ContentDragKind = { kind: "image-asset", src };
            return (
              <div
                key={a.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(DRAG_MIME.CONTENT, JSON.stringify(payload));
                  e.dataTransfer.effectAllowed = "copy";
                  startDrag({ type: "content", payload, source: `asset-${a.id}` });
                }}
                onDragEnd={() => endDrag()}
                className="aspect-square cursor-grab active:cursor-grabbing transition-colors"
                style={{
                  border: "1px solid var(--border-subtle)",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                title={a.mimeType ?? ""}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
