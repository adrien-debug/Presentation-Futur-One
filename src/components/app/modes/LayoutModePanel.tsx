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
    <div className="flex flex-col p-4 scroll-y h-full" style={{ gap: 22 }}>

      {/* PAGES */}
      <Section title="Pages">
        <div className="flex flex-col" style={{ gap: 4 }}>
          {pages.map((p, i) => {
            const active = p.id === currentPageId;
            return (
              <div
                key={p.id}
                className="group relative flex items-stretch transition-colors"
                style={{
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                  boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
                }}
              >
                <button
                  onClick={() => switchPage(p.id)}
                  className="flex-1 flex items-center text-left min-w-0"
                  style={{ gap: 10, padding: "8px 10px" }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: active ? "var(--fg-primary)" : "var(--fg-muted)",
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                      width: 18,
                    }}
                  >{String(i + 1).padStart(2, "0")}</span>
                  <input
                    value={p.name}
                    onChange={(e) => renamePage(p.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent outline-none border-none p-0 truncate"
                    style={{
                      fontSize: 12,
                      color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
                      letterSpacing: "-0.005em",
                    }}
                  />
                </button>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity touch-show">
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
        <AddButton onClick={() => addPage(currentPageId)} label="Ajouter une page" />
      </Section>

      {/* PAGE SIDE */}
      <Section title="Côté de page">
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
      <Section title={`Zones · ${pageSide === "left" ? "gauche" : "droite"}`}>
        <div className="flex flex-col" style={{ gap: 4 }}>
          {zones[pageSide].map((z) => {
            const key = `${pageSide}-${z.id}`;
            const active = selection.zoneKey === key;
            return (
              <button
                key={z.id}
                onClick={() => active ? clearSelection() : selectZone(key)}
                className="text-left transition-colors flex items-center justify-between"
                style={{
                  padding: "8px 10px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                  color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
                  boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
                  fontSize: 12,
                  letterSpacing: "-0.005em",
                }}
              >
                <span>{z.label}</span>
                <span style={{ fontSize: 11, color: "var(--fg-muted)", fontVariantNumeric: "tabular-nums" }}>
                  {Math.round(z.heightRatio * 100)}%
                </span>
              </button>
            );
          })}
        </div>
        <AddButton
          onClick={() => {
            const sideZones = zones[pageSide];
            const sectionIds = sideZones.filter((z) => z.id !== "header" && z.id !== "footer").map((z) => z.id);
            const afterId = sectionIds[sectionIds.length - 1] ?? "header";
            addZone(pageSide, afterId);
          }}
          label="Ajouter une section"
        />
      </Section>

      {/* TOGGLES */}
      <Section title="Affichage">
        <div className="flex flex-col" style={{ gap: 4 }}>
          <Toggle label="Repères de zone" active={showLabels}   onChange={onToggleLabels}   accent={accent} />
          <Toggle label="Zone sûre"       active={showSafeArea} onChange={onToggleSafeArea} accent={accent} />
          <Toggle label="Fond perdu"      active={showBleed}    onChange={onToggleBleed}    accent={accent} />
        </div>
      </Section>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--fg-secondary)",
          letterSpacing: "-0.005em",
          marginBottom: 8,
        }}
      >
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
      className="flex items-center justify-center transition-colors"
      style={{
        width: 28,
        color: color ?? "var(--fg-muted)",
        borderLeft: "1px solid var(--border-subtle)",
      }}
    >
      {children}
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center transition-colors w-full"
      style={{
        marginTop: 6,
        height: 30,
        gap: 6,
        border: "1px solid var(--border-subtle)",
        color: "var(--fg-secondary)",
        backgroundColor: "transparent",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "-0.005em",
      }}
    >
      <IconPlus size={11} /> {label}
    </button>
  );
}

function Toggle({ label, active, onChange, accent }: { label: string; active: boolean; onChange: (v: boolean) => void; accent: string }) {
  return (
    <button
      onClick={() => onChange(!active)}
      className="flex items-center justify-between transition-colors"
      style={{
        padding: "8px 10px",
        border: "1px solid var(--border-subtle)",
        backgroundColor: active ? "var(--bg-elevated)" : "transparent",
        color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
        fontSize: 12,
        letterSpacing: "-0.005em",
        boxShadow: active ? `inset 2px 0 0 ${accent}` : "none",
      }}
    >
      <span>{label}</span>
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: active ? accent : "transparent",
          border: active ? "none" : "1px solid var(--border-strong)",
        }}
      />
    </button>
  );
}
