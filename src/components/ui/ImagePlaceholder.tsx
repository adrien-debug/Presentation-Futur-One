"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { DEFAULT_IMAGE } from "@/data/types";

interface ImagePlaceholderProps {
  theme: ArtDirection;
  slotId: string;
  zoneKey?: string;
  label?: string;
  fullBleed?: boolean;
  compact?: boolean;
  imageStyle?: string;
}

export default function ImagePlaceholder({
  theme, slotId, zoneKey, label = "IMAGE", compact = false, imageStyle,
}: ImagePlaceholderProps) {
  const { images, selectSlot } = useEditor();
  const image = images[slotId];
  const hasImage = !!image?.src;
  const data = { ...DEFAULT_IMAGE, ...(image ?? {}) };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoneKey) selectSlot(zoneKey, slotId, "image");
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full overflow-hidden cursor-pointer"
      style={{
        backgroundColor: theme.colors.surfaceAlt,
        minHeight: compact ? "auto" : undefined,
      }}
    >
      {hasImage ? (
        <>
          <img
            src={data.src}
            alt=""
            draggable={false}
            style={{
              width: "100%", height: "100%",
              objectFit: data.fit, opacity: data.opacity,
              filter: data.filter && data.filter !== "none" ? data.filter : undefined,
              display: "block", userSelect: "none",
            }}
          />
          {data.overlay && data.overlay !== "none" && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: data.overlay, mixBlendMode: "multiply" }} />
          )}
        </>
      ) : (
        <PlaceholderArt theme={theme} label={label} compact={compact} imageStyle={imageStyle} />
      )}
    </div>
  );
}

function PlaceholderArt({ theme, label, compact, imageStyle }: { theme: ArtDirection; label: string; compact: boolean; imageStyle?: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceAlt} 40%, ${theme.colors.background} 100%)`,
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${theme.colors.border}20 1px, transparent 1px),linear-gradient(90deg, ${theme.colors.border}20 1px, transparent 1px)`,
        backgroundSize: compact ? "8px 8px" : "16px 16px",
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(45deg, ${theme.colors.accent} 0px, ${theme.colors.accent} 1px, transparent 1px, transparent ${compact ? 12 : 20}px)`,
      }} />
      {!compact && (
        <>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: `${theme.colors.accent}60` }} />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: `${theme.colors.accent}60` }} />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: `${theme.colors.accent}60` }} />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: `${theme.colors.accent}60` }} />
        </>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <svg width={compact ? "12" : "20"} height={compact ? "10" : "16"} viewBox="0 0 20 16" fill="none">
          <rect x="1" y="1" width="18" height="14" rx="1" stroke={`${theme.colors.accent}50`} strokeWidth="1" />
          <circle cx="6" cy="6" r="2" fill={`${theme.colors.accent}40`} />
          <path d="M1 11 L6 7 L10 10 L14 6 L19 11" stroke={`${theme.colors.accent}40`} strokeWidth="1" fill="none" />
        </svg>
        <div className="font-mono uppercase tracking-widest" style={{ fontSize: compact ? "8px" : "10px", color: `${theme.colors.accent}60` }}>
          {label}
        </div>
        {imageStyle && !compact && (
          <div className="text-[8px] font-mono text-center max-w-[80%] leading-relaxed" style={{ color: `${theme.colors.textMuted}80` }}>
            {imageStyle}
          </div>
        )}
      </div>
    </>
  );
}
