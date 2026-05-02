"use client";

import React from "react";
import { SectionZone, SPREAD_ZONES, ArtDirection } from "@/design-system";
import { ZONE } from "@/design-system/constants";

interface ZoneControlsProps {
  zones: SectionZone[];
  onChange: (zones: SectionZone[]) => void;
  onAddZone?: (afterId: string) => void;
  onRemoveZone?: (id: string) => void;
  onReorderZones?: (fromIdx: number, toIdx: number) => void;
  theme: ArtDirection;
}

const MIN = ZONE.MIN_RATIO;
const MAX = ZONE.MAX_RATIO;

export default function ZoneControls({
  zones,
  onChange,
  onAddZone,
  onRemoveZone,
  onReorderZones,
  theme,
}: ZoneControlsProps) {
  const total = zones.reduce((s, z) => s + z.heightRatio, 0);

  const updateZone = (index: number, newRatio: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, newRatio));
    const delta = clamped - zones[index].heightRatio;

    // Distribute the delta across other zones proportionally
    const others = zones.map((z, i) => i !== index ? z.heightRatio : null).filter(Boolean) as number[];
    const othersTotal = others.reduce((s, r) => s + r, 0);

    const updated = zones.map((z, i) => {
      if (i === index) return { ...z, heightRatio: clamped };
      const share = z.heightRatio / othersTotal;
      return { ...z, heightRatio: Math.max(MIN, z.heightRatio - delta * share) };
    });

    // Re-normalise to exactly 1.0
    const sum = updated.reduce((s, z) => s + z.heightRatio, 0);
    onChange(updated.map((z) => ({ ...z, heightRatio: z.heightRatio / sum })));
  };

  const reset = () => onChange(SPREAD_ZONES.map((z) => ({ ...z })));

  return (
    <div
      className="w-full"
      style={{ backgroundColor: "#0A0A10", borderTop: "1px solid #2A2A3A" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid #1A1A28" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-4"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent }}>
            Zone Heights
          </span>
          <span
            className="text-[7px] font-mono px-1.5 py-0.5"
            style={{
              backgroundColor: Math.abs(total - 1) < 0.001 ? "#1a3a1a" : "#3a1a1a",
              color: Math.abs(total - 1) < 0.001 ? "#4ade80" : "#f87171",
              border: `1px solid ${Math.abs(total - 1) < 0.001 ? "#4ade8040" : "#f8717140"}`,
            }}
          >
            Σ {Math.round(total * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[7px] font-mono" style={{ color: "#555" }}>
            drag les poignées · ou édite ici
          </span>
          <button
            onClick={reset}
            className="px-2 py-1 text-[7px] font-mono uppercase tracking-wider transition-colors"
            style={{
              border: `1px solid #333`,
              color: "#777",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = theme.colors.accent;
              (e.currentTarget as HTMLButtonElement).style.color = theme.colors.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#333";
              (e.currentTarget as HTMLButtonElement).style.color = "#777";
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Zone rows */}
      <div className="flex items-stretch divide-x overflow-x-auto" style={{ borderColor: "#1A1A28" }}>
        {zones.map((zone, i) => {
          const pct = Math.round(zone.heightRatio * 100);
          const isEdge = zone.id === "header" || zone.id === "footer";

          return (
            <div
              key={zone.id}
              className="flex flex-col items-center gap-1.5 px-3 py-2 flex-shrink-0"
              style={{ minWidth: "72px", flex: "1 0 72px", borderColor: "#1A1A28" }}
            >
              {/* Zone name */}
              <div
                className="text-[6px] font-mono uppercase tracking-wider text-center"
                style={{ color: isEdge ? theme.colors.accent : "#666" }}
              >
                {zone.label}
              </div>

              {/* Visual bar */}
              <div
                className="w-full rounded-sm overflow-hidden"
                style={{ height: "3px", backgroundColor: "#1C1C2A" }}
              >
                <div
                  className="h-full rounded-sm transition-all duration-150"
                  style={{
                    width: `${(zone.heightRatio / MAX) * 100}%`,
                    backgroundColor: isEdge ? `${theme.colors.accent}80` : theme.colors.accent,
                  }}
                />
              </div>

              {/* Numeric input */}
              <div className="flex items-center gap-1">
                <button
                  className="w-4 h-4 flex items-center justify-center text-[10px] leading-none"
                  style={{
                    color: "#666",
                    border: "1px solid #2A2A3A",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => updateZone(i, zone.heightRatio - 0.01)}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = theme.colors.accent)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#666")}
                >
                  −
                </button>

                <input
                  type="number"
                  min={Math.round(MIN * 100)}
                  max={Math.round(MAX * 100)}
                  value={pct}
                  onChange={(e) => updateZone(i, parseInt(e.target.value || "0") / 100)}
                  className="text-center font-mono outline-none"
                  style={{
                    width: "32px",
                    fontSize: "9px",
                    backgroundColor: "#141420",
                    border: `1px solid #2A2A3A`,
                    color: theme.colors.text,
                    padding: "1px 0",
                    MozAppearance: "textfield",
                  }}
                />

                <button
                  className="w-4 h-4 flex items-center justify-center text-[10px] leading-none"
                  style={{
                    color: "#666",
                    border: "1px solid #2A2A3A",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => updateZone(i, zone.heightRatio + 0.01)}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = theme.colors.accent)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#666")}
                >
                  +
                </button>
              </div>

              {/* % label */}
              <div className="text-[7px] font-mono" style={{ color: theme.colors.accent }}>
                {pct}%
              </div>

              {/* Add / remove / reorder controls (sections only, not header/footer) */}
              {!isEdge && (
                <div className="flex items-center gap-0.5 mt-1">
                  {onReorderZones && (
                    <>
                      <ZoneIconButton
                        title="Monter"
                        disabled={i <= 1}
                        onClick={() => onReorderZones(i, i - 1)}
                        accent={theme.colors.accent}
                      >
                        ↑
                      </ZoneIconButton>
                      <ZoneIconButton
                        title="Descendre"
                        disabled={i >= zones.length - 2}
                        onClick={() => onReorderZones(i, i + 1)}
                        accent={theme.colors.accent}
                      >
                        ↓
                      </ZoneIconButton>
                    </>
                  )}
                  {onAddZone && (
                    <ZoneIconButton
                      title="Ajouter une section après"
                      onClick={() => onAddZone(zone.id)}
                      accent={theme.colors.accent}
                    >
                      +
                    </ZoneIconButton>
                  )}
                  {onRemoveZone && zones.filter((z) => z.id !== "header" && z.id !== "footer").length > 1 && (
                    <ZoneIconButton
                      title="Supprimer cette section"
                      onClick={() => onRemoveZone(zone.id)}
                      accent="#f87171"
                    >
                      ×
                    </ZoneIconButton>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ZoneIconButton({
  children,
  title,
  onClick,
  disabled = false,
  accent,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  accent: string;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="w-4 h-4 flex items-center justify-center text-[10px] leading-none transition-colors disabled:opacity-30"
      style={{
        color: "#666",
        border: "1px solid #2A2A3A",
        backgroundColor: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.color = accent;
          (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#666";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#2A2A3A";
      }}
    >
      {children}
    </button>
  );
}
