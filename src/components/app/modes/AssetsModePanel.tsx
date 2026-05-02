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
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
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
            { value: "charts", label: "Charts" },
          ]}
        />
        <div className="text-[8px] mt-2" style={{ color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
          Glisser sur une zone pour appliquer
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 scroll-y px-3 pb-4">

        {tab === "images" && (
          <ImagesTab
            accent={accent}
            projectId={projectId}
            startDrag={startDrag}
            endDrag={endDrag}
          />
        )}

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

// ─── Images tab ──────────────────────────────────────────────────────────────

interface ImagesTabProps {
  accent: string;
  projectId?: string;
  startDrag: (s: { type: "content"; payload: ContentDragKind; source: string }) => void;
  endDrag: () => void;
}

function ImagesTab({ accent, projectId, startDrag, endDrag }: ImagesTabProps) {
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
    <div className="flex flex-col gap-2">
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
        className="w-full py-2 text-[10px] uppercase font-medium transition-all disabled:opacity-50"
        style={{ border: `1px dashed ${accent}50`, color: accent, backgroundColor: `${accent}08`, letterSpacing: "0.1em" }}
      >
        {busy ? "Import…" : "Importer une image"}
      </button>

      {error && (
        <div className="text-[9px] px-2 py-1.5" style={{ color: "#E07070", border: "1px solid #5A2A2A" }}>
          {error}
        </div>
      )}

      {loading && assets.length === 0 && (
        <div className="text-[9px]" style={{ color: "var(--fg-muted)" }}>Chargement…</div>
      )}

      {!loading && assets.length === 0 && (
        <div className="text-[9px] mt-1" style={{ color: "var(--fg-muted)" }}>
          Aucune image. Importer un PNG/JPG ≤ 2 Mo.
        </div>
      )}

      {assets.length > 0 && (
        <>
          <div className="text-[8px] mt-1" style={{ color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
            Glisser sur une zone pour appliquer
          </div>
          <div className="grid grid-cols-3 gap-1.5">
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
                  className="aspect-square cursor-grab active:cursor-grabbing transition-all"
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
        </>
      )}
    </div>
  );
}
