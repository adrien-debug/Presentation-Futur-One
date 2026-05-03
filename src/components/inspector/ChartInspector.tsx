"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { ChartType, ChartConfig, DEFAULT_CHART_CONFIG } from "@/data/types";

const TYPES: { id: ChartType; label: string }[] = [
  { id: "bar", label: "Barres" },
  { id: "line", label: "Ligne" },
  { id: "area", label: "Aire" },
  { id: "donut", label: "Donut" },
  { id: "gauge", label: "Jauge" },
  { id: "radar", label: "Radar" },
  { id: "horizontal-bar", label: "H-Barres" },
];

export default function ChartInspector({ theme, slotId }: { theme: ArtDirection; slotId: string }) {
  const { chartConfigs, setChartConfig } = useEditor();
  const stored = chartConfigs[slotId] ?? {};
  const cfg: ChartConfig = {
    type: stored.type ?? DEFAULT_CHART_CONFIG.type,
    values: stored.values ?? [...DEFAULT_CHART_CONFIG.values],
    labels: stored.labels ?? [...DEFAULT_CHART_CONFIG.labels],
  };
  const accent = theme.colors.accent;

  const updateRow = (idx: number, label: string, value: number) => {
    const labels = [...cfg.labels]; const values = [...cfg.values];
    labels[idx] = label; values[idx] = value;
    setChartConfig(slotId, { labels, values });
  };
  const addRow = () => {
    setChartConfig(slotId, { labels: [...cfg.labels, `Élément ${cfg.labels.length + 1}`], values: [...cfg.values, 0] });
  };
  const removeRow = (idx: number) => {
    setChartConfig(slotId, { labels: cfg.labels.filter((_, i) => i !== idx), values: cfg.values.filter((_, i) => i !== idx) });
  };
  const reset = () => setChartConfig(slotId, { ...DEFAULT_CHART_CONFIG, type: cfg.type });

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    color: "var(--fg-primary)",
    outline: "none",
    padding: "5px 8px",
    fontSize: 11,
    fontFamily: "monospace",
  };

  return (
    <div className="flex flex-col" style={{ gap: 22 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          Graphique
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3, fontFamily: "monospace" }}>
          {slotId}
        </div>
      </div>

      <Section label="Type">
        <div className="grid grid-cols-4" style={{ gap: 4 }}>
          {TYPES.map((t) => {
            const active = cfg.type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setChartConfig(slotId, { type: t.id })}
                className="transition-colors"
                style={{
                  height: 28,
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                  color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
                  boxShadow: active ? `inset 0 -1px 0 ${accent}` : "none",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        label="Données"
        action={
          <button
            onClick={reset}
            className="transition-colors"
            style={{
              padding: "3px 8px",
              border: "1px solid var(--border-subtle)",
              color: "var(--fg-muted)",
              backgroundColor: "transparent",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            Réinitialiser
          </button>
        }
      >
        <div className="flex flex-col" style={{ gap: 4, maxHeight: 280, overflowY: "auto" }}>
          {cfg.labels.map((lbl, i) => (
            <div key={i} className="flex items-center" style={{ gap: 4 }}>
              <input
                type="text"
                value={lbl}
                onChange={(e) => updateRow(i, e.target.value, cfg.values[i])}
                placeholder="Étiquette"
                className="flex-1"
                style={inputStyle}
              />
              <input
                type="number"
                value={cfg.values[i] ?? 0}
                onChange={(e) => updateRow(i, lbl, Number(e.target.value))}
                style={{ ...inputStyle, width: 64 }}
              />
              <button
                onClick={() => removeRow(i)}
                disabled={cfg.labels.length <= 1}
                className="flex items-center justify-center transition-colors"
                style={{
                  width: 24,
                  height: 24,
                  border: "1px solid var(--border-subtle)",
                  color: "var(--fg-muted)",
                  backgroundColor: "transparent",
                  fontSize: 12,
                }}
                title="Supprimer la ligne"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="transition-colors"
          style={{
            marginTop: 6,
            height: 28,
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-secondary)",
            backgroundColor: "transparent",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          + Ajouter une ligne
        </button>
      </Section>
    </div>
  );
}

function Section({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          {label}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
