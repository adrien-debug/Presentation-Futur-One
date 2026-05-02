"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { ChartType, DEFAULT_CHART_CONFIG } from "@/data/types";

interface ChartPlaceholderProps {
  theme: ArtDirection;
  type?: ChartType;
  label?: string;
  compact?: boolean;
  slotId?: string;
  zoneKey?: string;
}

export default function ChartPlaceholder({
  theme,
  type = "bar",
  label = "CHART",
  compact = false,
  slotId,
  zoneKey,
}: ChartPlaceholderProps) {
  const { chartConfigs, selectSlot } = useEditor();

  // Resolve config: store override > props/defaults
  const stored = slotId ? chartConfigs[slotId] : undefined;
  const resolvedType: ChartType = stored?.type ?? type;
  const resolvedValues: number[] = stored?.values ?? DEFAULT_CHART_CONFIG.values;
  const resolvedLabels: string[] = stored?.labels ?? DEFAULT_CHART_CONFIG.labels;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoneKey && slotId) selectSlot(zoneKey, slotId, "chart");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: compact ? "4px" : "8px",
        minHeight: 0,
        overflow: "hidden",
        position: "relative",
        cursor: zoneKey ? "pointer" : "default",
      }}
    >
      {/* Label */}
      <div
        style={{
          flexShrink: 0,
          marginBottom: "4px",
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: compact ? "5px" : "6px",
          color: theme.colors.accent,
        }}
      >
        {label}
      </div>

      {/*
        Chart area — key trick:
        flex: 1 + minHeight: 0 gives a definite computed height,
        position: relative lets children use position: absolute to fill it.
      */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {resolvedType === "bar"            && <BarChart theme={theme} compact={compact} values={resolvedValues} labels={resolvedLabels} />}
        {resolvedType === "line"           && <LineChart theme={theme} compact={compact} values={resolvedValues} />}
        {resolvedType === "area"           && <AreaChart theme={theme} compact={compact} values={resolvedValues} />}
        {resolvedType === "donut"          && <DonutChart theme={theme} compact={compact} values={resolvedValues} labels={resolvedLabels} />}
        {resolvedType === "radar"          && <RadarChart theme={theme} compact={compact} />}
        {resolvedType === "gauge"          && <GaugeChart theme={theme} compact={compact} />}
        {resolvedType === "horizontal-bar" && <HorizontalBarChart theme={theme} compact={compact} values={resolvedValues} labels={resolvedLabels} />}
      </div>

    </div>
  );
}

// ─── Shared: SVG that fills its absolute parent ───────────────────────────────
// All SVG charts use position:absolute inset:0 — works regardless of parent height source.

function AbsSvg({
  viewBox,
  preserveAspectRatio = "xMidYMid meet",
  children,
}: {
  viewBox: string;
  preserveAspectRatio?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "visible",
      }}
    >
      {children}
    </svg>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function BarChart({
  theme,
  compact,
  values,
  labels,
}: {
  theme: ArtDirection;
  compact: boolean;
  values: number[];
  labels: string[];
}) {
  const maxV = Math.max(...values, 1);
  const bars = values.map((v) => v / maxV);
  const W = 140;
  const H = 80;
  const barW = W / Math.max(bars.length, 1);
  const gap = 2;
  const padB = compact ? 4 : 12;

  return (
    <AbsSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={0} y1={(H - padB) * (1 - g)}
          x2={W} y2={(H - padB) * (1 - g)}
          stroke={`${theme.colors.border}40`}
          strokeWidth="0.5"
        />
      ))}
      {/* Bars */}
      {bars.map((h, i) => {
        const bH = h * (H - padB);
        const x = i * barW + gap / 2;
        const w = barW - gap;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors.accent} />
                <stop offset="100%" stopColor={`${theme.colors.accent}88`} />
              </linearGradient>
            </defs>
            <rect x={x} y={H - padB - bH} width={w} height={bH} fill={`url(#bg${i})`} />
            {!compact && labels[i] && (
              <text
                x={x + w / 2} y={H - 1}
                textAnchor="middle"
                fontSize="4"
                fill={theme.colors.textMuted}
                fontFamily="monospace"
              >
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </AbsSvg>
  );
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────
function LineChart({
  theme,
  values,
}: {
  theme: ArtDirection;
  compact: boolean;
  values: number[];
}) {
  const maxV = Math.max(...values, 1);
  const points = values.map((v) => (v / maxV) * 100);
  const W = 200;
  const H = 80;
  const pts = points.map((p, i) => [
    (i / Math.max(points.length - 1, 1)) * W,
    H - (p / 100) * H,
  ]);
  const pathD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  return (
    <AbsSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} y1={H * g} x2={W} y2={H * g}
          stroke={`${theme.colors.border}40`} strokeWidth="0.5" />
      ))}
      <path d={pathD} stroke={theme.colors.accent} strokeWidth="1.5" fill="none" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2"
          fill={theme.colors.accent} stroke={theme.colors.background} strokeWidth="0.5" />
      ))}
    </AbsSvg>
  );
}

// ─── AREA CHART ───────────────────────────────────────────────────────────────
function AreaChart({
  theme,
  values,
}: {
  theme: ArtDirection;
  compact: boolean;
  values: number[];
}) {
  const maxV = Math.max(...values, 1);
  const points = values.map((v) => (v / maxV) * 100);
  const W = 200;
  const H = 80;
  const pts = points.map((p, i) => [
    (i / Math.max(points.length - 1, 1)) * W,
    H - (p / 100) * H,
  ]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <AbsSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.colors.accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaG)" />
      <path d={linePath} stroke={theme.colors.accent} strokeWidth="1.5" fill="none" />
    </AbsSvg>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChart({
  theme,
  values,
  labels,
}: {
  theme: ArtDirection;
  compact: boolean;
  values: number[];
  labels: string[];
}) {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  const segments = values.map((v, i) => ({
    pct: (v / total) * 100,
    label: labels[i] ?? "",
  }));
  const palette = [
    theme.colors.accent,
    `${theme.colors.accent}AA`,
    `${theme.colors.accent}66`,
    `${theme.colors.border}CC`,
  ];
  const cx = 50;
  const cy = 50;
  const r = 40;
  const innerR = 24;

  let cumulative = 0;
  const paths = segments.map((seg, i) => {
    const startRad = ((cumulative / 100) * 360 - 90) * (Math.PI / 180);
    cumulative += seg.pct;
    const endRad = ((cumulative / 100) * 360 - 90) * (Math.PI / 180);
    const largeArc = seg.pct > 50 ? 1 : 0;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const ix1 = cx + innerR * Math.cos(startRad);
    const iy1 = cy + innerR * Math.sin(startRad);
    const ix2 = cx + innerR * Math.cos(endRad);
    const iy2 = cy + innerR * Math.sin(endRad);

    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`,
      color: palette[i % palette.length],
    };
  });

  const centerLabel = labels[0] ?? "MENA";

  return (
    // preserveAspectRatio="xMidYMid meet" keeps the donut circular at any aspect ratio
    <AbsSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color}
          stroke={theme.colors.background} strokeWidth="0.8" />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle"
        fontSize="8" fontWeight="bold"
        fill={theme.colors.text} fontFamily="monospace">
        {centerLabel}
      </text>
      <text x={cx} y={cy + 5} textAnchor="middle"
        fontSize="5" fill={theme.colors.textMuted}>
        2030
      </text>
    </AbsSvg>
  );
}

// ─── RADAR CHART ──────────────────────────────────────────────────────────────
function RadarChart({ theme }: { theme: ArtDirection; compact: boolean }) {
  const values = [0.9, 1.0, 0.85, 0.75, 0.8, 0.95];
  const n = values.length;
  const cx = 50;
  const cy = 50;
  const r = 40;

  const pt = (v: number, i: number) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)] as [number, number];
  };

  const path = values.map((v, i) => {
    const [x, y] = pt(v, i);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ") + " Z";

  return (
    <AbsSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75, 1].map((level) => {
        const gPath = values.map((_, i) => {
          const [x, y] = pt(level, i);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ") + " Z";
        return <path key={level} d={gPath} fill="none"
          stroke={`${theme.colors.border}50`} strokeWidth="0.5" />;
      })}
      <path d={path} fill={`${theme.colors.accent}30`}
        stroke={theme.colors.accent} strokeWidth="1" />
    </AbsSvg>
  );
}

// ─── GAUGE CHART ──────────────────────────────────────────────────────────────
function GaugeChart({ theme }: { theme: ArtDirection; compact: boolean }) {
  const value = 0.82;
  const cx = 50;
  const cy = 58;
  const r = 38;
  const startA = -Math.PI * 0.75;
  const endA = Math.PI * 0.75;
  const valA = startA + (endA - startA) * value;

  const arc = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from);
    const y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy + r * Math.sin(to);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${Math.abs(to - from) > Math.PI ? 1 : 0} 1 ${x2} ${y2}`;
  };

  return (
    <AbsSvg viewBox="0 0 100 90" preserveAspectRatio="xMidYMid meet">
      <path d={arc(startA, endA)} fill="none"
        stroke={`${theme.colors.border}60`} strokeWidth="6" strokeLinecap="round" />
      <path d={arc(startA, valA)} fill="none"
        stroke={theme.colors.accent} strokeWidth="6" strokeLinecap="round" />
      <text x={cx} y={cy - 6} textAnchor="middle"
        fontSize="12" fontWeight="bold"
        fill={theme.colors.text} fontFamily="monospace">
        {Math.round(value * 100)}%
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle"
        fontSize="5" fill={theme.colors.textMuted}>
        EFFICIENCY
      </text>
      <line
        x1={cx} y1={cy}
        x2={cx + (r - 8) * Math.cos(valA)}
        y2={cy + (r - 8) * Math.sin(valA)}
        stroke={theme.colors.accent} strokeWidth="1.5" strokeLinecap="round" />
    </AbsSvg>
  );
}

// ─── HORIZONTAL BAR ───────────────────────────────────────────────────────────
function HorizontalBarChart({
  theme,
  values,
  labels,
}: {
  theme: ArtDirection;
  compact: boolean;
  values: number[];
  labels: string[];
}) {
  const maxV = Math.max(...values, 1);
  const data = values.map((v, i) => ({ label: labels[i] ?? `Item ${i + 1}`, value: v }));
  const W = 200;
  const H = 80;
  const rowH = H / Math.max(data.length, 1);

  return (
    <AbsSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {data.map((item, i) => {
        const y = i * rowH;
        const barW = (item.value / maxV) * (W - 50);
        const isFirst = i === 0;
        return (
          <g key={`${item.label}-${i}`}>
            {/* Label */}
            <text x={0} y={y + rowH * 0.65}
              fontSize="5" fontFamily="monospace"
              fill={isFirst ? theme.colors.accent : theme.colors.textMuted}>
              {item.label}
            </text>
            {/* Track */}
            <rect x={42} y={y + rowH * 0.3}
              width={W - 50} height={rowH * 0.4}
              rx="1" fill={`${theme.colors.border}40`} />
            {/* Bar */}
            <rect x={42} y={y + rowH * 0.3}
              width={barW} height={rowH * 0.4}
              rx="1"
              fill={isFirst ? theme.colors.accent : `${theme.colors.accent}66`} />
            {/* Value */}
            <text x={W - 1} y={y + rowH * 0.65}
              textAnchor="end" fontSize="4" fontFamily="monospace"
              fill={isFirst ? theme.colors.accent : theme.colors.textMuted}>
              {item.value}
            </text>
          </g>
        );
      })}
    </AbsSvg>
  );
}
