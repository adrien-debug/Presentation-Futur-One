"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArtDirection, ThemeId } from "@/design-system";

export default function ThemeDropdown({
  themes, activeThemeId, hasOverrides, onSelect,
}: {
  themes: ArtDirection[];
  activeThemeId: ThemeId;
  hasOverrides: boolean;
  onSelect: (id: ThemeId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = themes.find((t) => t.id === activeThemeId);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!active) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 text-[8px] font-mono uppercase"
        style={{ border: `1px solid ${active.colors.accent}60`, backgroundColor: `${active.colors.accent}15`, color: active.colors.accent }}
        title="Changer de thème"
      >
        <div className="flex gap-0.5">
          <div className="w-1.5 h-3" style={{ backgroundColor: active.colors.background }} />
          <div className="w-1.5 h-3" style={{ backgroundColor: active.colors.surface }} />
          <div className="w-1.5 h-3" style={{ backgroundColor: active.colors.accent }} />
        </div>
        <span>{active.name}</span>
        {hasOverrides && <span className="text-[6px]" style={{ color: active.colors.accent }}>●</span>}
        <span style={{ fontSize: "8px" }}>▾</span>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 w-[260px] z-50 max-h-[420px] overflow-y-auto"
          style={{ backgroundColor: "#0D0D14", border: "1px solid #2A2A3A", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
        >
          {themes.map((t) => {
            const isActive = t.id === activeThemeId;
            return (
              <button
                key={t.id}
                onClick={() => { onSelect(t.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-2 transition-colors text-left"
                style={{ backgroundColor: isActive ? `${t.colors.accent}10` : "transparent", borderLeft: `2px solid ${isActive ? t.colors.accent : "transparent"}` }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "#15151E"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <div className="flex gap-0.5 flex-shrink-0">
                  <div className="w-2 h-4" style={{ backgroundColor: t.colors.background }} />
                  <div className="w-2 h-4" style={{ backgroundColor: t.colors.surface }} />
                  <div className="w-2 h-4" style={{ backgroundColor: t.colors.accent }} />
                  <div className="w-2 h-4" style={{ backgroundColor: t.colors.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isActive ? t.colors.accent : "#CCC" }}>{t.name}</div>
                  <div className="text-[6px] leading-tight truncate" style={{ color: "#666" }}>{t.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
