"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { F } from "@/utils/cqb";
import { useEditor } from "@/contexts/EditorContext";

interface FooterProps {
  theme: ArtDirection;
  side: "left" | "right";
  showGrid?: boolean;
  pageNumber?: number;
  totalPages?: number;
  classification?: string;
  website?: string;
}

export default function Footer({
  theme, side, showGrid = false,
  pageNumber = 1, totalPages = 2,
  classification = "CONFIDENTIEL — USAGE INTERNE",
  website = "www.futuroone.qa",
}: FooterProps) {
  const isLeft = side === "left";
  const currentPage = isLeft ? pageNumber : pageNumber + 1;
  const { selectZone, selection } = useEditor();
  const key = `${side}-footer`;
  const isSelected = selection.zoneKey === key;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); selectZone(key); }}
      className="w-full h-full flex items-center justify-between relative cursor-pointer"
      style={{
        padding: "0 4cqb",
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        outline: isSelected ? `2px solid ${theme.colors.accent}` : undefined,
        outlineOffset: "-2px",
      }}
    >
      {isLeft ? (
        <>
          <div className="font-mono uppercase tracking-wider" style={{ fontSize: F.small, color: theme.colors.textMuted }}>
            {classification}
          </div>
          <div className="flex items-center" style={{ gap: "4cqb" }}>
            <div className="font-mono" style={{ fontSize: F.small, color: theme.colors.textMuted }}>{website}</div>
            <PageDots current={currentPage} total={totalPages * 2} theme={theme} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center" style={{ gap: "4cqb" }}>
            <PageDots current={currentPage} total={totalPages * 2} theme={theme} />
            <div className="font-mono" style={{ fontSize: F.small, color: theme.colors.textMuted }}>{website}</div>
          </div>
          <div className="flex items-center" style={{ gap: "2cqb" }}>
            <div className="font-mono uppercase tracking-wider" style={{ fontSize: F.small, color: theme.colors.textMuted }}>
              © 2025 Futur One DataCenter LLC
            </div>
            <div style={{ width: "3cqb", height: "3cqb", backgroundColor: theme.colors.accent, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", opacity: 0.7 }} />
          </div>
        </>
      )}

      {/* CMYK print metadata */}
      <div
        className="absolute bottom-0 font-mono"
        style={{
          [isLeft ? "left" : "right"]: "2cqb",
          fontSize: F.micro,
          opacity: 0.3,
          color: theme.colors.textMuted,
        }}
      >
        {isLeft ? `PRIMARY ${theme.colors.cmyk.primary}` : `ACCENT ${theme.colors.cmyk.accent}`}
      </div>

      {showGrid && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none" style={{ paddingTop: "1cqb", color: `${theme.colors.accent}55`, fontSize: F.micro, fontFamily: "monospace" }}>
          FOOTER
        </div>
      )}
    </div>
  );
}

function PageDots({ current, total, theme }: { current: number; total: number; theme: ArtDirection }) {
  return (
    <div className="flex items-center" style={{ gap: "1.5cqb" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === current ? "4cqb" : "1.5cqb",
            height: "1.5cqb",
            borderRadius: "999px",
            backgroundColor: i + 1 === current ? theme.colors.accent : theme.colors.border,
          }}
        />
      ))}
      <span className="font-mono" style={{ fontSize: F.xs, color: theme.colors.textMuted, marginLeft: "1cqb" }}>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
