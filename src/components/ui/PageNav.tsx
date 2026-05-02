"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { IconChevronLeft, IconChevronRight } from "./Icon";

export default function PageNav({ theme }: { theme: ArtDirection }) {
  const { pages, currentPageId, switchPage } = useEditor();
  if (!pages.length) return null;

  const idx = pages.findIndex((p) => p.id === currentPageId);
  const accent = theme.colors.accent;
  const prev = pages[idx - 1];
  const next = pages[idx + 1];
  const current = pages[idx];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => prev && switchPage(prev.id)}
        disabled={!prev}
        className="h-7 w-7 flex items-center justify-center transition-colors disabled:opacity-25"
        style={{ border: "1px solid #2A2A3A", color: prev ? "#C5C5D0" : "#444", backgroundColor: "#13131C" }}
        title="Page précédente"
        aria-label="Page précédente"
      >
        <IconChevronLeft size={13} />
      </button>

      <div
        className="flex items-center gap-2 h-7 px-3"
        style={{ border: `1px solid ${accent}40`, backgroundColor: `${accent}10` }}
      >
        <span className="text-[9px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.14em" }}>
          {String(idx + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
        </span>
        <span className="w-px h-3" style={{ backgroundColor: `${accent}30` }} />
        <span className="text-[10px] font-mono" style={{ color: "#D5D5DC" }}>{current?.name ?? ""}</span>
      </div>

      <button
        onClick={() => next && switchPage(next.id)}
        disabled={!next}
        className="h-7 w-7 flex items-center justify-center transition-colors disabled:opacity-25"
        style={{ border: "1px solid #2A2A3A", color: next ? "#C5C5D0" : "#444", backgroundColor: "#13131C" }}
        title="Page suivante"
        aria-label="Page suivante"
      >
        <IconChevronRight size={13} />
      </button>
    </div>
  );
}
