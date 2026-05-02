"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { F } from "@/utils/cqb";

interface KPICardProps {
  theme: ArtDirection;
  value: string;
  label: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  compact?: boolean;
  accent?: boolean;
}

export default function KPICard({
  theme, value, label, sub, trend, trendValue, compact = false, accent = false,
}: KPICardProps) {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-center items-center gap-[1cqb]"
      style={{
        padding: "3cqb 4cqb",
        backgroundColor: accent ? `${theme.colors.accent}15` : "transparent",
      }}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0" style={{ height: "1cqb", backgroundColor: theme.colors.accent }} />
      )}

      {/* Value */}
      <div
        className="font-black leading-none text-center"
        style={{
          fontFamily: theme.typography.headingFont,
          fontSize: compact ? F.lead : F.title,
          color: accent ? theme.colors.accent : theme.colors.text,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        className="font-mono uppercase text-center leading-tight"
        style={{
          fontSize: F.xs,
          color: theme.colors.textMuted,
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>

      {sub && (
        <div className="text-center leading-tight" style={{ fontSize: F.micro, color: `${theme.colors.textMuted}80` }}>
          {sub}
        </div>
      )}

      {trend && trendValue && (
        <div
          className="flex items-center gap-[0.5cqb]"
          style={{
            fontSize: F.xs,
            color: trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : theme.colors.textMuted,
          }}
        >
          <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
          <span className="font-mono">{trendValue}</span>
        </div>
      )}
    </div>
  );
}
