"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

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
  theme,
  side,
  showGrid = false,
  pageNumber = 1,
  totalPages = 2,
  classification = "CONFIDENTIEL — USAGE INTERNE",
  website = "www.futuroone.qa",
}: FooterProps) {
  const isLeft = side === "left";
  const currentPage = isLeft ? pageNumber : pageNumber + 1;

  return (
    <div
      className="w-full h-full flex items-center justify-between px-3 relative"
      style={{
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      {isLeft ? (
        <>
          {/* Left page footer */}
          <div
            className="text-[7px] font-mono uppercase tracking-wider"
            style={{ color: theme.colors.textMuted }}
          >
            {classification}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="text-[7px] font-mono"
              style={{ color: theme.colors.textMuted }}
            >
              {website}
            </div>
            <PageIndicator
              current={currentPage}
              total={totalPages * 2}
              theme={theme}
            />
          </div>
        </>
      ) : (
        <>
          {/* Right page footer — mirrored */}
          <div className="flex items-center gap-3">
            <PageIndicator
              current={currentPage}
              total={totalPages * 2}
              theme={theme}
            />
            <div
              className="text-[7px] font-mono"
              style={{ color: theme.colors.textMuted }}
            >
              {website}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="text-[7px] font-mono uppercase tracking-wider"
              style={{ color: theme.colors.textMuted }}
            >
              © 2025 Futur One DataCenter LLC
            </div>
            <div
              className="w-3 h-3"
              style={{
                backgroundColor: theme.colors.accent,
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                opacity: 0.7,
              }}
            />
          </div>
        </>
      )}

      {/* CMYK info — print metadata */}
      <div
        className="absolute bottom-0 text-[5px] font-mono opacity-30"
        style={{
          [isLeft ? "left" : "right"]: "4px",
          color: theme.colors.textMuted,
        }}
      >
        {isLeft
          ? `PRIMARY ${theme.colors.cmyk.primary}`
          : `ACCENT ${theme.colors.cmyk.accent}`}
      </div>

      {/* Zone debug label */}
      {showGrid && (
        <div
          className="absolute inset-0 flex items-start justify-center pt-0.5 pointer-events-none"
          style={{ color: `${theme.colors.accent}55`, fontSize: "7px", fontFamily: "monospace" }}
        >
          FOOTER
        </div>
      )}
    </div>
  );
}

function PageIndicator({ current, total, theme }: {
  current: number;
  total: number;
  theme: ArtDirection;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: i + 1 === current ? "14px" : "4px",
            height: "4px",
            backgroundColor: i + 1 === current ? theme.colors.accent : theme.colors.border,
            transition: "all 0.2s",
          }}
        />
      ))}
      <span
        className="text-[7px] font-mono ml-1"
        style={{ color: theme.colors.textMuted }}
      >
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
