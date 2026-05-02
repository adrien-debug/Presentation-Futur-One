"use client";

import React, { useRef, useCallback, useEffect, useState, useMemo } from "react";
import { ArtDirection, SectionZone } from "@/design-system";
import { SPREAD, ZONE } from "@/design-system/constants";
import { useEditor } from "@/contexts/EditorContext";
import PageContext from "./PageContext";

interface SpreadProps {
  theme: ArtDirection;
  zones: SectionZone[];
  onZonesChange: (zones: SectionZone[]) => void;
  leftPage?: React.ReactNode;
  rightPage?: React.ReactNode;
  showGrid?: boolean;
}

const NATURAL_W = SPREAD.NATURAL_W;
const NATURAL_H = SPREAD.NATURAL_H;
const INSET = SPREAD.INSET;
const MIN_RATIO = ZONE.MIN_RATIO;
const MAX_RATIO = ZONE.MAX_RATIO;

function clampRatio(r: number) {
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, r));
}

export default function Spread({
  theme,
  zones,
  onZonesChange,
  leftPage,
  rightPage,
  showGrid = false,
}: SpreadProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { hideHeader, hideFooter } = useEditor();

  // Filter out hidden zones (header/footer when toggled off)
  const visibleZones = useMemo(
    () => zones.filter((z) =>
      !(z.id === "header" && hideHeader) &&
      !(z.id === "footer" && hideFooter)
    ),
    [zones, hideHeader, hideFooter]
  );
  const visibleTotal = visibleZones.reduce((s, z) => s + z.heightRatio, 0) || 1;

  // Measure wrapper and compute scale factor
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / NATURAL_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Boundaries (cumulative fraction in *visible* space, 0→1)
  const boundaries = visibleZones.slice(0, -1).reduce<number[]>((acc, zone) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
    return [...acc, prev + zone.heightRatio / visibleTotal];
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent, boundaryIndex: number) => {
      e.preventDefault();
      const el = wrapperRef.current;
      if (!el) return;

      // Drag adjusts the two adjacent VISIBLE zones; hidden zones keep their ratios
      const idA = visibleZones[boundaryIndex]?.id;
      const idB = visibleZones[boundaryIndex + 1]?.id;
      const idxA = zones.findIndex((z) => z.id === idA);
      const idxB = zones.findIndex((z) => z.id === idB);
      if (idxA === -1 || idxB === -1) return;

      const visualH = el.getBoundingClientRect().height;
      const safeH = visualH * (1 - 2 * INSET);
      const startY = e.clientY;
      const startA = zones[idxA].heightRatio;
      const startB = zones[idxB].heightRatio;

      const onMouseMove = (mv: MouseEvent) => {
        // Delta in visual space (visible canvas) → convert to absolute heightRatio delta
        const deltaVisual = (mv.clientY - startY) / safeH;
        const deltaRatio = deltaVisual * visibleTotal;
        const newA = clampRatio(startA + deltaRatio);
        const newB = clampRatio(startB - deltaRatio);

        const newZones = zones.map((z, i) => {
          if (i === idxA) return { ...z, heightRatio: newA };
          if (i === idxB) return { ...z, heightRatio: newB };
          return z;
        });
        // Renormalize all (preserves relative weights)
        const total = newZones.reduce((s, z) => s + z.heightRatio, 0);
        onZonesChange(newZones.map((z) => ({ ...z, heightRatio: z.heightRatio / total })));
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [zones, visibleZones, visibleTotal, onZonesChange]
  );

  return (
    <div
      ref={wrapperRef}
      className="spread-wrapper relative overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
        {/* ── SCALED CONTENT ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: NATURAL_W,
            height: NATURAL_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "flex",
            fontFamily: theme.typography.bodyFont,
          }}
        >
          {/* Bleed outline */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-50"
              style={{ boxShadow: "inset 0 0 0 2px rgba(255,0,0,0.12)" }}
            />
          )}

          {/* Center gutter */}
          {showGrid && (
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/20 z-40 pointer-events-none" />
          )}

          {/* LEFT PAGE */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100%" }}>
            <PageContext theme={theme} side="left" zones={zones} showGrid={showGrid}>
              {leftPage}
            </PageContext>
          </div>

          {/* RIGHT PAGE */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100%" }}>
            <PageContext theme={theme} side="right" zones={zones} showGrid={showGrid}>
              {rightPage}
            </PageContext>
          </div>

          {/* ── DRAG HANDLES (inside scaled div — coords stay correct) ─── */}
          {boundaries.map((cumRatio, i) => {
            const topPct = (INSET + cumRatio * (1 - 2 * INSET)) * 100;
            return (
              <div
                key={i}
                className="absolute z-50 group"
                style={{
                  left: 0, right: 0,
                  top: `${topPct}%`,
                  height: "12px",
                  transform: "translateY(-50%)",
                  cursor: "row-resize",
                }}
                onMouseDown={(e) => handleDragStart(e, i)}
              >
                <div
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-100"
                  style={{ height: "1px", backgroundColor: `${theme.colors.accent}35` }}
                />
                <div
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ height: "2px", backgroundColor: theme.colors.accent }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
                             opacity-0 group-hover:opacity-100 transition-opacity
                             px-2 py-1 pointer-events-none whitespace-nowrap"
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.background,
                  }}
                >
                  {visibleZones[i].label} {Math.round(visibleZones[i].heightRatio * 100)}% · {visibleZones[i + 1].label} {Math.round(visibleZones[i + 1].heightRatio * 100)}%
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}
