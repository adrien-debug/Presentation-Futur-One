"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

interface ImagePlaceholderProps {
  theme: ArtDirection;
  label?: string;
  fullBleed?: boolean;
  compact?: boolean;
  imageStyle?: string;
  aspectRatio?: string;
}

export default function ImagePlaceholder({
  theme,
  label = "IMAGE",
  fullBleed = false,
  compact = false,
  imageStyle,
}: ImagePlaceholderProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: `${theme.colors.surfaceAlt}`,
        minHeight: compact ? "auto" : undefined,
      }}
    >
      {/* Simulated photo texture */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              ${theme.colors.surface} 0%,
              ${theme.colors.surfaceAlt} 40%,
              ${theme.colors.background} 100%
            )
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${theme.colors.border}20 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.border}20 1px, transparent 1px)
          `,
          backgroundSize: compact ? "8px 8px" : "16px 16px",
        }}
      />

      {/* Diagonal lines for texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${theme.colors.accent} 0px,
            ${theme.colors.accent} 1px,
            transparent 1px,
            transparent ${compact ? 12 : 20}px
          )`,
        }}
      />

      {/* Corner brackets */}
      {!compact && (
        <>
          <div
            className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2"
            style={{ borderColor: `${theme.colors.accent}60` }}
          />
          <div
            className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2"
            style={{ borderColor: `${theme.colors.accent}60` }}
          />
          <div
            className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2"
            style={{ borderColor: `${theme.colors.accent}60` }}
          />
          <div
            className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2"
            style={{ borderColor: `${theme.colors.accent}60` }}
          />
        </>
      )}

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <svg
          width={compact ? "12" : "20"}
          height={compact ? "10" : "16"}
          viewBox="0 0 20 16"
          fill="none"
        >
          <rect
            x="1" y="1" width="18" height="14" rx="1"
            stroke={`${theme.colors.accent}50`}
            strokeWidth="1"
          />
          <circle cx="6" cy="6" r="2" fill={`${theme.colors.accent}40`} />
          <path
            d="M1 11 L6 7 L10 10 L14 6 L19 11"
            stroke={`${theme.colors.accent}40`}
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div
          className="font-mono uppercase tracking-widest"
          style={{
            fontSize: compact ? "5px" : "7px",
            color: `${theme.colors.accent}60`,
          }}
        >
          {label}
        </div>
        {imageStyle && !compact && (
          <div
            className="text-[5px] font-mono text-center max-w-[80%] leading-relaxed"
            style={{ color: `${theme.colors.textMuted}80` }}
          >
            {imageStyle}
          </div>
        )}
      </div>
    </div>
  );
}
