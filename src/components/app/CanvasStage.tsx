"use client";

import React, { useEffect, useRef, useState } from "react";
import { SPREAD } from "@/design-system/constants";

interface CanvasStageProps {
  children: React.ReactNode;
  showSafeArea?: boolean;
  showBleed?: boolean;
  accent?: string;
}

const NATURAL_W = SPREAD.NATURAL_W;
const NATURAL_H = SPREAD.NATURAL_H;
const RATIO     = NATURAL_W / NATURAL_H;

/**
 * CanvasStage — fullscreen-safe wrapper that fits the spread inside
 * its container while preserving aspect ratio. No scroll, no crop.
 *
 * Computes spread dimensions via ResizeObserver, then renders a
 * fixed-size frame that the inner Spread component scales to.
 */
export default function CanvasStage({ children, showSafeArea = false, showBleed = false, accent = "#00D4FF" }: CanvasStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute spread frame: fit inside box while keeping NATURAL ratio
  let frameW = 0, frameH = 0;
  if (box.w > 0 && box.h > 0) {
    const containerRatio = box.w / box.h;
    if (containerRatio > RATIO) {
      // Container wider than spread → height-bound
      frameH = box.h;
      frameW = box.h * RATIO;
    } else {
      // Container narrower → width-bound
      frameW = box.w;
      frameH = box.w / RATIO;
    }
  }

  return (
    <div ref={stageRef} className="canvas-stage">
      {frameW > 0 && (
        <div
          className="relative"
          style={{
            width:  frameW,
            height: frameH,
            backgroundColor: "transparent",
          }}
        >
          {/* The Spread component fills this frame and self-scales internally */}
          <div className="absolute inset-0">
            {children}
          </div>

          {/* Bleed overlay (red border) */}
          {showBleed && (
            <div
              className="absolute pointer-events-none"
              style={{
                inset: `${-(frameW * 0.007)}px`,
                border: "1px solid rgba(255, 60, 60, 0.5)",
                boxShadow: "0 0 0 1px rgba(255, 60, 60, 0.15)",
              }}
            />
          )}

          {/* Safe area overlay (accent dashed) */}
          {showSafeArea && (
            <div
              className="absolute pointer-events-none"
              style={{
                inset: `${frameW * 0.025}px`,
                border: `1px dashed ${accent}40`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
