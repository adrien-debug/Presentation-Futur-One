"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

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
  theme,
  side,
  showGrid = false,
  projectName = "FUTUR ONE",
  tagline = "DataCenter · Qatar 2030",
  version = "v2.0",
  date = "2025",
}: HeaderProps) {
  const isLeft = side === "left";

  return (
    <div
      className="w-full h-full flex items-center justify-between px-3 relative"
      style={{
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      {/* LEFT SIDE */}
      {isLeft ? (
        <>
          {/* Logo / Project name */}
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.background,
              }}
            >
              F1
            </div>
            <div>
              <div
                className="text-[11px] font-bold tracking-widest uppercase"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.headingFont,
                  letterSpacing: "0.15em",
                }}
              >
                {projectName}
              </div>
              <div
                className="text-[7px] tracking-wider uppercase"
                style={{ color: theme.colors.textMuted, letterSpacing: "0.1em" }}
              >
                {tagline}
              </div>
            </div>
          </div>

          {/* Right side of header — left page */}
          <div className="flex items-center gap-4">
            <HeaderPill theme={theme} label="TIER IV" />
            <HeaderPill theme={theme} label="99.9999%" accent />
            <div
              className="text-[7px] font-mono"
              style={{ color: theme.colors.textMuted }}
            >
              {version} · {date}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Right page header — mirror */}
          <div className="flex items-center gap-4">
            <div
              className="text-[7px] font-mono"
              style={{ color: theme.colors.textMuted }}
            >
              {date} · {version}
            </div>
            <HeaderPill theme={theme} label="CONFIDENTIAL" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div
                className="text-[11px] font-bold tracking-widest uppercase"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.headingFont,
                  letterSpacing: "0.15em",
                }}
              >
                {projectName}
              </div>
              <div
                className="text-[7px] tracking-wider uppercase"
                style={{ color: theme.colors.textMuted }}
              >
                Infrastructure Document
              </div>
            </div>
            <div
              className="w-6 h-6 flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.background,
              }}
            >
              F1
            </div>
          </div>
        </>
      )}

      {/* Zone debug label */}
      {showGrid && (
        <div
          className="absolute inset-0 flex items-end justify-center pb-0.5 pointer-events-none"
          style={{ color: `${theme.colors.accent}55`, fontSize: "7px", fontFamily: "monospace" }}
        >
          HEADER
        </div>
      )}
    </div>
  );
}

function HeaderPill({ theme, label, accent = false }: {
  theme: ArtDirection;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="px-2 py-0.5 text-[7px] font-mono tracking-wider uppercase"
      style={{
        border: `1px solid ${accent ? theme.colors.accent : theme.colors.border}`,
        color: accent ? theme.colors.accent : theme.colors.textMuted,
        backgroundColor: accent ? `${theme.colors.accent}15` : "transparent",
      }}
    >
      {label}
    </div>
  );
}
