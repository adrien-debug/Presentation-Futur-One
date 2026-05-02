"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import PageContext from "./PageContext";

interface SpreadProps {
  theme: ArtDirection;
  leftPage?: React.ReactNode;
  rightPage?: React.ReactNode;
  showGrid?: boolean;
}

export default function Spread({ theme, leftPage, rightPage, showGrid = false }: SpreadProps) {
  return (
    <div className="spread-wrapper w-full flex justify-center items-start py-8 px-4">
      {/* A3 Landscape container — 420mm × 297mm ratio */}
      <div
        className="spread relative flex shadow-2xl"
        style={{
          width: "min(100%, 1400px)",
          aspectRatio: "420 / 297",
          fontFamily: theme.typography.bodyFont,
        }}
      >
        {/* Bleed indicator (print simulation) */}
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            boxShadow: showGrid ? `inset 0 0 0 2px rgba(255,0,0,0.15)` : "none",
          }}
        />

        {/* Center gutter line */}
        {showGrid && (
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/20 z-40 pointer-events-none" />
        )}

        {/* LEFT PAGE */}
        <div className="flex-1 relative overflow-hidden">
          <PageContext
            theme={theme}
            side="left"
            showGrid={showGrid}
          >
            {leftPage}
          </PageContext>
        </div>

        {/* RIGHT PAGE */}
        <div className="flex-1 relative overflow-hidden">
          <PageContext
            theme={theme}
            side="right"
            showGrid={showGrid}
          >
            {rightPage}
          </PageContext>
        </div>
      </div>
    </div>
  );
}
