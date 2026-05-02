"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

const SHORTCUTS: { keys: string[]; label: string; section: string }[] = [
  // Édition
  { keys: ["Double-clic"], label: "Éditer un texte", section: "Édition" },
  { keys: ["Click"], label: "Sélectionner une zone / image / chart", section: "Édition" },
  { keys: ["Esc"], label: "Désélectionner / quitter l'édition", section: "Édition" },
  { keys: ["Enter"], label: "Valider l'édition (mono-ligne)", section: "Édition" },
  { keys: ["⌘", "Enter"], label: "Valider l'édition (multi-ligne)", section: "Édition" },

  // Historique
  { keys: ["⌘", "Z"], label: "Annuler", section: "Historique" },
  { keys: ["⌘", "⇧", "Z"], label: "Rétablir", section: "Historique" },

  // Fichier
  { keys: ["⌘", "S"], label: "Sauvegarder (auto-save activé)", section: "Fichier" },
  { keys: ["⌘", "E"], label: "Exporter (PDF / PNG)", section: "Fichier" },

  // Vue
  { keys: ["G"], label: "Toggle grille", section: "Vue" },
  { keys: ["?"], label: "Afficher cette aide", section: "Vue" },

  // Drag & drop
  { keys: ["Drag"], label: "Layout du panel → Zone du canvas", section: "Drag & drop" },
  { keys: ["Drag"], label: "Contenu Library → Zone du canvas", section: "Drag & drop" },
];

export default function HelpDialog({ theme, onClose }: { theme: ArtDirection; onClose: () => void }) {
  const accent = theme.colors.accent;

  // Group by section
  const sections: Record<string, typeof SHORTCUTS> = {};
  for (const s of SHORTCUTS) {
    if (!sections[s.section]) sections[s.section] = [];
    sections[s.section].push(s);
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-[min(540px,90vw)] max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#0D0D14", border: `1px solid ${accent}40`, boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#1E1E2A" }}>
          <div>
            <div className="text-[8px] font-mono uppercase tracking-widest mb-0.5" style={{ color: accent, letterSpacing: "0.2em" }}>
              AIDE · RACCOURCIS
            </div>
            <div className="text-[14px] font-bold" style={{ color: "#E8E8EE" }}>Comment ça marche</div>
          </div>
          <button
            onClick={onClose}
            className="text-[14px] font-mono w-7 h-7 flex items-center justify-center"
            style={{ border: "1px solid #2A2A3A", color: "#888" }}
          >×</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-1">
              <div className="text-[7px] font-mono uppercase tracking-widest mb-1" style={{ color: accent, letterSpacing: "0.15em" }}>
                {section}
              </div>
              <div className="flex flex-col gap-0.5">
                {items.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <div className="flex gap-1 flex-shrink-0" style={{ minWidth: 100 }}>
                      {s.keys.map((k, j) => (
                        <kbd
                          key={j}
                          style={{
                            padding: "2px 6px",
                            border: "1px solid #2A2A3A",
                            fontFamily: "monospace",
                            fontSize: 9,
                            color: "#AAA",
                            backgroundColor: "#15151E",
                          }}
                        >{k}</kbd>
                      ))}
                    </div>
                    <div className="text-[10px]" style={{ color: "#CCC" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-[9px] mt-2 pt-3 border-t leading-relaxed" style={{ borderColor: "#1E1E2A", color: "#666" }}>
            Sur Windows / Linux, remplacez ⌘ par Ctrl. L&apos;auto-save est actif en permanence (debounce 500ms).
          </div>
        </div>
      </div>
    </div>
  );
}
