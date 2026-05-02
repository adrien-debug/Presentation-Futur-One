"use client";

import React from "react";
import { ArtDirection, themeList } from "@/design-system";
import { Template } from "@/data/types";
import { TEMPLATES } from "@/data/templates";

export default function NewProjectModal({
  theme, onClose, onSelect, onBlank,
}: {
  theme: ArtDirection;
  onClose: () => void;
  onSelect: (template: Template) => void;
  onBlank: () => void;
}) {
  const accent = theme.colors.accent;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-[min(900px,90vw)] max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#0D0D14", border: `1px solid ${accent}40`, boxShadow: `0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px ${accent}15` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1E1E2A" }}>
          <div>
            <div className="text-[8px] font-mono uppercase tracking-widest mb-1" style={{ color: accent, letterSpacing: "0.2em" }}>
              FUTUR ONE · DESIGN TOOL
            </div>
            <div className="text-[18px] font-bold" style={{ color: "#E8E8EE" }}>
              Choisir un point de départ
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[14px] font-mono w-8 h-8 flex items-center justify-center"
            style={{ border: "1px solid #2A2A3A", color: "#888" }}
          >×</button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((t) => {
              const themeForTemplate = themeList.find((th) => th.id === t.themeId) ?? theme;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelect(t)}
                  className="text-left transition-all group flex flex-col"
                  style={{
                    border: "1px solid #2A2A3A",
                    backgroundColor: "#16161F",
                    minHeight: 220,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = themeForTemplate.colors.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A3A"; }}
                >
                  {/* Color preview */}
                  <div className="flex h-2">
                    <div className="flex-1" style={{ backgroundColor: themeForTemplate.colors.background }} />
                    <div className="flex-1" style={{ backgroundColor: themeForTemplate.colors.surface }} />
                    <div className="flex-1" style={{ backgroundColor: themeForTemplate.colors.accent }} />
                    <div className="flex-1" style={{ backgroundColor: themeForTemplate.colors.text }} />
                  </div>
                  {/* Mock preview */}
                  <div
                    className="aspect-[420/297] flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: themeForTemplate.colors.background }}
                  >
                    <div className="text-center px-4">
                      <div className="text-[6px] font-mono uppercase tracking-widest mb-1" style={{ color: themeForTemplate.colors.accent, letterSpacing: "0.2em" }}>
                        {t.tags[0]}
                      </div>
                      <div className="text-[16px] font-black uppercase leading-none" style={{ fontFamily: themeForTemplate.typography.headingFont, color: themeForTemplate.colors.text }}>
                        {t.name.split(" ")[0]}
                      </div>
                      <div className="text-[12px] font-black uppercase leading-none mt-1" style={{ fontFamily: themeForTemplate.typography.headingFont, color: themeForTemplate.colors.accent }}>
                        {t.name.split(" ").slice(1).join(" ")}
                      </div>
                    </div>
                    <div className="absolute bottom-1 left-2 text-[5px] font-mono uppercase" style={{ color: themeForTemplate.colors.textMuted, letterSpacing: "0.15em" }}>
                      {t.pages.length} page{t.pages.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  {/* Meta */}
                  <div className="p-3 flex-1">
                    <div className="text-[11px] font-bold mb-1" style={{ color: "#E8E8EE" }}>{t.name}</div>
                    <div className="text-[9px] leading-relaxed" style={{ color: "#888" }}>{t.description}</div>
                    <div className="text-[6px] font-mono mt-2" style={{ color: themeForTemplate.colors.accent, letterSpacing: "0.15em" }}>
                      {themeForTemplate.name.toUpperCase()}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Blank card */}
            <button
              onClick={onBlank}
              className="text-left transition-all flex flex-col items-center justify-center"
              style={{
                border: `1px dashed #444`,
                backgroundColor: "transparent",
                minHeight: 220,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#444"; }}
            >
              <div className="text-[40px] mb-2" style={{ color: "#555" }}>+</div>
              <div className="text-[12px] font-bold mb-1" style={{ color: "#CCC" }}>Vide</div>
              <div className="text-[9px]" style={{ color: "#666" }}>Démarrer de zéro</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
