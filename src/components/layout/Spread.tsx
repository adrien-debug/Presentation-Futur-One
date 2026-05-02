"use client";

import React, { useRef, useCallback, useEffect, useState, useMemo } from "react";
import { ArtDirection, SectionZone } from "@/design-system";
import { SPREAD, ZONE } from "@/design-system/constants";
import { useEditor } from "@/contexts/EditorContext";
import PageContext from "./PageContext";

interface SpreadProps {
  theme: ArtDirection;
  /** Independent vertical grids per side. */
  zonesLeft:  SectionZone[];
  zonesRight: SectionZone[];
  onZonesChange: (side: "left" | "right", zones: SectionZone[]) => void;
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
  zonesLeft,
  zonesRight,
  onZonesChange,
  leftPage,
  rightPage,
  showGrid = false,
}: SpreadProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { hideHeader, hideFooter } = useEditor();

  const filterVisible = useCallback(
    (zones: SectionZone[]) =>
      zones.filter((z) =>
        !(z.id === "header" && hideHeader) &&
        !(z.id === "footer" && hideFooter)
      ),
    [hideHeader, hideFooter]
  );

  const visibleLeft  = useMemo(() => filterVisible(zonesLeft),  [filterVisible, zonesLeft]);
  const visibleRight = useMemo(() => filterVisible(zonesRight), [filterVisible, zonesRight]);

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

  // Build cumulative boundaries for one side (visible-space, 0→1)
  const computeBoundaries = useCallback((visibleZones: SectionZone[]) => {
    const total = visibleZones.reduce((s, z) => s + z.heightRatio, 0) || 1;
    return visibleZones.slice(0, -1).reduce<number[]>((acc, zone) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      return [...acc, prev + zone.heightRatio / total];
    }, []);
  }, []);

  const boundariesLeft  = useMemo(() => computeBoundaries(visibleLeft),  [computeBoundaries, visibleLeft]);
  const boundariesRight = useMemo(() => computeBoundaries(visibleRight), [computeBoundaries, visibleRight]);

  const makeDragHandler = useCallback(
    (side: "left" | "right") => (e: React.MouseEvent, boundaryIndex: number) => {
      e.preventDefault();
      const el = wrapperRef.current;
      if (!el) return;

      const zones = side === "left" ? zonesLeft : zonesRight;
      const visibleZones = side === "left" ? visibleLeft : visibleRight;
      const visibleTotal = visibleZones.reduce((s, z) => s + z.heightRatio, 0) || 1;

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
        const deltaVisual = (mv.clientY - startY) / safeH;
        const deltaRatio = deltaVisual * visibleTotal;
        const newA = clampRatio(startA + deltaRatio);
        const newB = clampRatio(startB - deltaRatio);

        const newZones = zones.map((z, i) => {
          if (i === idxA) return { ...z, heightRatio: newA };
          if (i === idxB) return { ...z, heightRatio: newB };
          return z;
        });
        const total = newZones.reduce((s, z) => s + z.heightRatio, 0);
        onZonesChange(side, newZones.map((z) => ({ ...z, heightRatio: z.heightRatio / total })));
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
    [zonesLeft, zonesRight, visibleLeft, visibleRight, onZonesChange]
  );

  const handleDragLeft  = useMemo(() => makeDragHandler("left"),  [makeDragHandler]);
  const handleDragRight = useMemo(() => makeDragHandler("right"), [makeDragHandler]);

  return (
    <div
      ref={wrapperRef}
      className="spread-wrapper relative overflow-hidden"
      style={{ width: "100%", height: "100%", backgroundColor: theme.colors.background }}
    >
      <div
        style={{
          position: "absolute", top: 0, left: 0,
          width: NATURAL_W, height: NATURAL_H,
          transform: `scale(${scale})`, transformOrigin: "top left",
          display: "flex", fontFamily: theme.typography.bodyFont,
        }}
      >
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-50"
            style={{ boxShadow: "inset 0 0 0 2px rgba(255,0,0,0.12)" }} />
        )}
        {showGrid && (
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/20 z-40 pointer-events-none" />
        )}

        {/* LEFT PAGE — independent grid */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100%" }}>
          <PageContext theme={theme} side="left" zones={zonesLeft} showGrid={showGrid}>
            {leftPage}
          </PageContext>

          {/* drag handles for left side only */}
          {boundariesLeft.map((cumRatio, i) => {
            const topPct = (INSET + cumRatio * (1 - 2 * INSET)) * 100;
            return (
              <div
                key={`L-${i}`}
                className="absolute z-50 group"
                style={{
                  left: 0, right: 0, top: `${topPct}%`,
                  height: "12px", transform: "translateY(-50%)", cursor: "row-resize",
                }}
                onMouseDown={(e) => handleDragLeft(e, i)}
              >
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-100"
                  style={{ height: "1px", backgroundColor: `${theme.colors.accent}35` }} />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ height: "2px", backgroundColor: theme.colors.accent }} />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
                  opacity-0 group-hover:opacity-100 transition-opacity
                  px-2 py-1 pointer-events-none whitespace-nowrap"
                  style={{
                    fontSize: "11px", fontFamily: "monospace",
                    backgroundColor: theme.colors.accent, color: theme.colors.background,
                  }}
                >
                  L · {visibleLeft[i].label} {Math.round(visibleLeft[i].heightRatio * 100)}% · {visibleLeft[i + 1].label} {Math.round(visibleLeft[i + 1].heightRatio * 100)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PAGE — independent grid */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100%" }}>
          <PageContext theme={theme} side="right" zones={zonesRight} showGrid={showGrid}>
            {rightPage}
          </PageContext>

          {/* drag handles for right side only */}
          {boundariesRight.map((cumRatio, i) => {
            const topPct = (INSET + cumRatio * (1 - 2 * INSET)) * 100;
            return (
              <div
                key={`R-${i}`}
                className="absolute z-50 group"
                style={{
                  left: 0, right: 0, top: `${topPct}%`,
                  height: "12px", transform: "translateY(-50%)", cursor: "row-resize",
                }}
                onMouseDown={(e) => handleDragRight(e, i)}
              >
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-100"
                  style={{ height: "1px", backgroundColor: `${theme.colors.accent}35` }} />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ height: "2px", backgroundColor: theme.colors.accent }} />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
                  opacity-0 group-hover:opacity-100 transition-opacity
                  px-2 py-1 pointer-events-none whitespace-nowrap"
                  style={{
                    fontSize: "11px", fontFamily: "monospace",
                    backgroundColor: theme.colors.accent, color: theme.colors.background,
                  }}
                >
                  R · {visibleRight[i].label} {Math.round(visibleRight[i].heightRatio * 100)}% · {visibleRight[i + 1].label} {Math.round(visibleRight[i + 1].heightRatio * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
