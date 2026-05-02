"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { F } from "@/utils/cqb";
import { useEditor } from "@/contexts/EditorContext";

interface HeaderProps {
  theme: ArtDirection;
  side: "left" | "right";
  showGrid?: boolean;
  projectName?: string;
  tagline?: string;
  version?: string;
  date?: string;
}

export default function Header({
  theme, side, showGrid = false,
  projectName = "FUTUR ONE",
  tagline = "DataCenter · Qatar 2030",
  version = "v2.0",
  date = "2025",
}: HeaderProps) {
  const isLeft = side === "left";
  const { selectZone, selection } = useEditor();
  const key = `${side}-header`;
  const isSelected = selection.zoneKey === key;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); selectZone(key); }}
      className="w-full h-full flex items-center justify-between relative cursor-pointer"
      style={{
        padding: "0 4cqb",
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        outline: isSelected ? `2px solid ${theme.colors.accent}` : undefined,
        outlineOffset: "-2px",
      }}
    >
      {isLeft ? (
        <>
          <div className="flex items-center" style={{ gap: "4cqb" }}>
            <div
              className="flex items-center justify-center font-black flex-shrink-0"
              style={{
                width: "6cqb", height: "6cqb",
                fontSize: F.xs,
                backgroundColor: theme.colors.accent,
                color: theme.colors.background,
              }}
            >
              F1
            </div>
            <div>
              <div className="font-bold tracking-widest uppercase" style={{ fontSize: F.lead, color: theme.colors.text, fontFamily: theme.typography.headingFont, letterSpacing: "0.12em" }}>
                {projectName}
              </div>
              <div className="tracking-wider uppercase" style={{ fontSize: F.xs, color: theme.colors.textMuted }}>
                {tagline}
              </div>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: "3cqb" }}>
            <Pill theme={theme} label="TIER IV" />
            <Pill theme={theme} label="99.9999%" accent />
            <div className="font-mono" style={{ fontSize: F.micro, color: theme.colors.textMuted }}>
              {version} · {date}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center" style={{ gap: "3cqb" }}>
            <div className="font-mono" style={{ fontSize: F.micro, color: theme.colors.textMuted }}>
              {date} · {version}
            </div>
            <Pill theme={theme} label="CONFIDENTIAL" />
          </div>

          <div className="flex items-center" style={{ gap: "4cqb" }}>
            <div className="text-right">
              <div className="font-bold tracking-widest uppercase" style={{ fontSize: F.lead, color: theme.colors.text, fontFamily: theme.typography.headingFont, letterSpacing: "0.12em" }}>
                {projectName}
              </div>
              <div className="tracking-wider uppercase" style={{ fontSize: F.xs, color: theme.colors.textMuted }}>
                Infrastructure Document
              </div>
            </div>
            <div
              className="flex items-center justify-center font-black flex-shrink-0"
              style={{
                width: "6cqb", height: "6cqb",
                fontSize: F.xs,
                backgroundColor: theme.colors.accent,
                color: theme.colors.background,
              }}
            >
              F1
            </div>
          </div>
        </>
      )}

      {showGrid && (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ paddingBottom: "1cqb", color: `${theme.colors.accent}55`, fontSize: F.micro, fontFamily: "monospace" }}>
          HEADER
        </div>
      )}
    </div>
  );
}

function Pill({ theme, label, accent = false }: { theme: ArtDirection; label: string; accent?: boolean }) {
  return (
    <div
      className="font-mono tracking-wider uppercase"
      style={{
        padding: "1cqb 2cqb",
        fontSize: F.micro,
        border: `1px solid ${accent ? theme.colors.accent : theme.colors.border}`,
        color: accent ? theme.colors.accent : theme.colors.textMuted,
        backgroundColor: accent ? `${theme.colors.accent}15` : "transparent",
      }}
    >
      {label}
    </div>
  );
}
