"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";

export default function PageNav({ theme }: { theme: ArtDirection }) {
  const { pages, currentPageId, switchPage, addPage, duplicatePage, deletePage } = useEditor();
  if (!pages.length) return null;

  const idx = pages.findIndex((p) => p.id === currentPageId);
  const accent = theme.colors.accent;
  const prev = pages[idx - 1];
  const next = pages[idx + 1];
  const current = pages[idx];

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => prev && switchPage(prev.id)}
        disabled={!prev}
        className="px-2 py-1 text-[10px] font-mono disabled:opacity-30"
        style={{ border: "1px solid #2A2A3A", color: prev ? "#CCC" : "#444" }}
        title="Page précédente"
      >‹</button>

      <div className="flex items-center gap-1.5 px-3 py-1" style={{ border: `1px solid ${accent}40`, backgroundColor: `${accent}10` }}>
        <span className="text-[8px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.1em" }}>
          {idx + 1} / {pages.length}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "#CCC" }}>· {current?.name ?? ""}</span>
      </div>

      <button
        onClick={() => next && switchPage(next.id)}
        disabled={!next}
        className="px-2 py-1 text-[10px] font-mono disabled:opacity-30"
        style={{ border: "1px solid #2A2A3A", color: next ? "#CCC" : "#444" }}
        title="Page suivante"
      >›</button>

      <button
        onClick={() => addPage(currentPageId)}
        className="px-2 py-1 text-[10px] font-mono"
        style={{ border: `1px solid ${accent}40`, color: accent }}
        title="Ajouter une page"
      >+</button>

      <button
        onClick={() => duplicatePage(currentPageId)}
        className="px-2 py-1 text-[10px] font-mono"
        style={{ border: "1px solid #2A2A3A", color: "#888" }}
        title="Dupliquer la page"
      >⎘</button>

      <button
        onClick={() => {
          if (pages.length <= 1) return;
          if (confirm(`Supprimer "${current?.name}" ?`)) deletePage(currentPageId);
        }}
        disabled={pages.length <= 1}
        className="px-2 py-1 text-[10px] font-mono disabled:opacity-30"
        style={{ border: "1px solid #2A2A3A", color: pages.length > 1 ? "#888" : "#444" }}
        title="Supprimer la page"
      >×</button>
    </div>
  );
}
