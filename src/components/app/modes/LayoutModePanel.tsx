"use client";

import React from "react";
import { useEditor } from "@/contexts/EditorContext";
import SegmentedControl from "../SegmentedControl";
import { IconPlus, IconCopy, IconClose } from "@/components/ui/Icon";

interface LayoutModePanelProps {
  accent: string;
  pageSide: "left" | "right";
  onPageSideChange: (s: "left" | "right") => void;
  showLabels:   boolean; onToggleLabels:   (v: boolean) => void;
  showSafeArea: boolean; onToggleSafeArea: (v: boolean) => void;
  showBleed:    boolean; onToggleBleed:    (v: boolean) => void;
}

export default function LayoutModePanel({
  accent, pageSide, onPageSideChange,
  showLabels, onToggleLabels,
  showSafeArea, onToggleSafeArea,
  showBleed, onToggleBleed,
}: LayoutModePanelProps) {
  const {
    pages, currentPageId, switchPage, addPage, duplicatePage, deletePage, renamePage,
    zones, selection, selectZone, clearSelection, addZone,
  } = useEditor();

  return (
    <div className="flex flex-col gap-5 p-4 scroll-y h-full">

      {/* PAGES */}
      <Section title="Pages" accent={accent}>
        <div className="flex flex-col gap-1">
          {pages.map((p, i) => {
            const active = p.id === currentPageId;
            return (
              <div
                key={p.id}
                className="group relative flex items-stretch"
                style={{
                  border: `1px solid ${active ? `${accent}60` : "var(--border-subtle)"}`,
                  backgroundColor: active ? `${accent}10` : "transparent",
                }}
              >
                <button
                  onClick={() => switchPage(p.id)}
                  className="flex-1 flex items-center gap-2 px-2 py-1.5 text-left min-w-0"
                >
                  <span
                    className="text-[8px] font-mono px-1.5 py-0.5 flex-shrink-0"
                    style={{
                      backgroundColor: active ? accent : "var(--border-subtle)",
                      color: active ? "#05080F" : "var(--fg-secondary)",
                    }}
                  >{String(i + 1).padStart(2, "0")}</span>
                  <input
                    value={p.name}
                    onChange={(e) => renamePage(p.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent text-[10px] outline-none border-none p-0 truncate"
                    style={{ color: active ? accent : "var(--fg-primary)" }}
                  />
                </button>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <MicroBtn onClick={() => duplicatePage(p.id)} title="Dupliquer"><IconCopy size={10} /></MicroBtn>
                  {pages.length > 1 && (
                    <MicroBtn onClick={() => { if (confirm(`Supprimer "${p.name}" ?`)) deletePage(p.id); }} title="Supprimer" color="#E07070">
                      <IconClose size={10} />
                    </MicroBtn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => addPage(currentPageId)}
          className="flex items-center justify-center gap-1.5 mt-2 py-1.5 text-[9px] uppercase font-medium transition-all"
          style={{ border: `1px dashed ${accent}50`, color: accent, backgroundColor: `${accent}05`, letterSpacing: "0.1em" }}
        >
          <IconPlus size={11} /> Ajouter une page
        </button>
      </Section>

      {/* PAGE SIDE */}
      <Section title="Côté de page" accent={accent}>
        <SegmentedControl
          value={pageSide}
          onChange={(v: "left" | "right") => onPageSideChange(v)}
          accent={accent}
          fullWidth
          size="sm"
          options={[
            { value: "left",  label: "Gauche" },
            { value: "right", label: "Droite" },
          ]}
        />
      </Section>

      {/* ZONES */}
      <Section title={`Zones · ${pageSide}`} accent={accent}>
        <div className="grid grid-cols-1 gap-1">
          {zones[pageSide].map((z) => {
            const key = `${pageSide}-${z.id}`;
            const active = selection.zoneKey === key;
            return (
              <button
                key={z.id}
                onClick={() => active ? clearSelection() : selectZone(key)}
                className="text-left px-2 py-1.5 text-[10px] uppercase font-medium transition-all flex items-center justify-between"
                style={{
                  border: `1px solid ${active ? `${accent}80` : "var(--border-subtle)"}`,
                  backgroundColor: active ? `${accent}15` : "var(--bg-elevated)",
                  color: active ? accent : "var(--fg-secondary)",
                  letterSpacing: "0.08em",
                }}
              >
                <span>{z.label}</span>
                <span className="text-[8px] font-mono opacity-60">{Math.round(z.heightRatio * 100)}%</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            const sideZones = zones[pageSide];
            const sectionIds = sideZones.filter((z) => z.id !== "header" && z.id !== "footer").map((z) => z.id);
            const afterId = sectionIds[sectionIds.length - 1] ?? "header";
            addZone(pageSide, afterId);
          }}
          className="flex items-center justify-center gap-1.5 mt-2 py-1.5 text-[9px] uppercase font-medium transition-all w-full"
          style={{ border: `1px dashed ${accent}50`, color: accent, backgroundColor: `${accent}05`, letterSpacing: "0.1em" }}
          title={`Ajouter une section sur la page ${pageSide === "left" ? "gauche" : "droite"}`}
        >
          <IconPlus size={11} /> Ajouter une section
        </button>
      </Section>

      {/* TOGGLES */}
      <Section title="Affichage" accent={accent}>
        <div className="flex flex-col gap-1">
          <Toggle label="Labels"     active={showLabels}   onChange={onToggleLabels}   accent={accent} />
          <Toggle label="Safe area"  active={showSafeArea} onChange={onToggleSafeArea} accent={accent} />
          <Toggle label="Bleed"      active={showBleed}    onChange={onToggleBleed}    accent={accent} />
        </div>
      </Section>

    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[8px] font-mono uppercase mb-2" style={{ color: accent, letterSpacing: "0.18em" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function MicroBtn({ children, onClick, title, color }: { children: React.ReactNode; onClick: () => void; title: string; color?: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className="w-7 h-full flex items-center justify-center transition-colors"
      style={{ color: color ?? "var(--fg-secondary)", borderLeft: "1px solid var(--border-subtle)" }}
    >
      {children}
    </button>
  );
}

function Toggle({ label, active, onChange, accent }: { label: string; active: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <button
      onClick={() => onChange(!active)}
      className="flex items-center justify-between px-2 py-1.5 text-[10px] uppercase transition-all"
      style={{
        border: `1px solid ${active ? `${accent}50` : "var(--border-subtle)"}`,
        backgroundColor: active ? `${accent}10` : "var(--bg-elevated)",
        color: active ? accent : "var(--fg-secondary)",
        letterSpacing: "0.08em",
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 9, fontFamily: "monospace" }}>{active ? "●" : "○"}</span>
    </button>
  );
}
