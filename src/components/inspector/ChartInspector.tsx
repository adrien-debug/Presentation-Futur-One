"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { ChartType, ChartConfig, DEFAULT_CHART_CONFIG } from "@/data/types";

const TYPES: { id: ChartType; label: string }[] = [
  { id: "bar", label: "Bar" }, { id: "line", label: "Line" },
  { id: "area", label: "Area" }, { id: "donut", label: "Donut" },
  { id: "gauge", label: "Gauge" }, { id: "radar", label: "Radar" },
  { id: "horizontal-bar", label: "H-Bar" },
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
    setChartConfig(slotId, { labels: [...cfg.labels, `Item ${cfg.labels.length + 1}`], values: [...cfg.values, 0] });
  };
  const removeRow = (idx: number) => {
    setChartConfig(slotId, { labels: cfg.labels.filter((_, i) => i !== idx), values: cfg.values.filter((_, i) => i !== idx) });
  };
  const reset = () => setChartConfig(slotId, { ...DEFAULT_CHART_CONFIG, type: cfg.type });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>CHART</div>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: "#666" }}>{slotId}</div>
      </div>

      <Section label="Type" theme={theme}>
        <div className="grid grid-cols-4 gap-1">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setChartConfig(slotId, { type: t.id })}
              className="text-[8px] font-mono uppercase py-1.5"
              style={{
                border: `1px solid ${cfg.type === t.id ? accent : "#2A2A3A"}`,
                backgroundColor: cfg.type === t.id ? `${accent}22` : "#16161F",
                color: cfg.type === t.id ? accent : "#C5C5D0",
              }}
            >{t.label}</button>
          ))}
        </div>
      </Section>

      <Section label="Données" theme={theme} action={
        <button onClick={reset} className="text-[7px] font-mono uppercase px-1.5 py-0.5" style={{ border: "1px solid #333", color: "#777" }}>Reset</button>
      }>
        <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto">
          {cfg.labels.map((lbl, i) => (
            <div key={i} className="flex gap-1 items-center">
              <input
                type="text"
                value={lbl}
                onChange={(e) => updateRow(i, e.target.value, cfg.values[i])}
                placeholder="Label"
                className="flex-1 text-[10px] font-mono px-1.5 py-1"
                style={{ background: "#16161F", border: "1px solid #2A2A3A", color: "#E5E5EE", outline: "none" }}
              />
              <input
                type="number"
                value={cfg.values[i] ?? 0}
                onChange={(e) => updateRow(i, lbl, Number(e.target.value))}
                className="w-14 text-[10px] font-mono px-1.5 py-1"
                style={{ background: "#16161F", border: "1px solid #2A2A3A", color: "#E5E5EE", outline: "none" }}
              />
              <button
                onClick={() => removeRow(i)}
                disabled={cfg.labels.length <= 1}
                className="w-5 h-5 flex items-center justify-center text-[10px] font-mono"
                style={{ border: "1px solid #333", color: "#888", backgroundColor: "transparent" }}
              >×</button>
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="text-[8px] font-mono uppercase py-1 mt-1"
          style={{ border: `1px solid ${accent}40`, color: accent, backgroundColor: `${accent}10` }}
        >+ Ajouter une ligne</button>
      </Section>
    </div>
  );
}

function Section({ label, theme, action, children }: { label: string; theme: ArtDirection; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
      <div className="flex items-center justify-between">
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{label}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
