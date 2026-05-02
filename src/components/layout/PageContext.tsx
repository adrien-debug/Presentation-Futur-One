"use client";

import React from "react";
import { ArtDirection, SPREAD_ZONES } from "@/design-system";
import SectionBlock from "@/components/sections/SectionBlock";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

interface PageContextProps {
  theme: ArtDirection;
  side: "left" | "right";
  children?: React.ReactNode;
  showGrid?: boolean;
  overrides?: Partial<Record<string, React.ReactNode>>;
}

export default function PageContext({
  theme,
  side,
  children,
  showGrid = false,
  overrides = {},
}: PageContextProps) {
  const isLeft = side === "left";

  const zones = SPREAD_ZONES;

  return (
    <div
      className="page-context relative w-full h-full flex flex-col"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      data-side={side}
    >
      {/* Safe margin inset */}
      <div className="absolute inset-[2.5%] flex flex-col" style={{ gap: 0 }}>
        {zones.map((zone) => {
          const override = overrides[zone.id];
          const hasOverride = Boolean(override) || Boolean(children);

          if (zone.id === "header") {
            return (
              <div
                key={zone.id}
                style={{ flex: `0 0 ${zone.heightRatio * 100}%` }}
                data-zone={zone.id}
              >
                {override || <Header theme={theme} side={side} showGrid={showGrid} />}
              </div>
            );
          }

          if (zone.id === "footer") {
            return (
              <div
                key={zone.id}
                style={{ flex: `0 0 ${zone.heightRatio * 100}%` }}
                data-zone={zone.id}
              >
                {override || <Footer theme={theme} side={side} showGrid={showGrid} />}
              </div>
            );
          }

          return (
            <div
              key={zone.id}
              style={{ flex: `0 0 ${zone.heightRatio * 100}%` }}
              data-zone={zone.id}
              className="relative"
            >
              {override || (
                <SectionBlock
                  theme={theme}
                  zoneId={zone.id}
                  label={zone.label}
                  side={side}
                  showGrid={showGrid}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute inset-[2.5%] border border-dashed border-yellow-500/20" />
        </div>
      )}

      {/* Page side indicator */}
      {showGrid && (
        <div
          className="absolute top-1 text-[8px] font-mono opacity-40 z-40"
          style={{
            [isLeft ? "left" : "right"]: "4px",
            color: theme.colors.accent,
          }}
        >
          PAGE {isLeft ? "GAUCHE" : "DROITE"}
        </div>
      )}
    </div>
  );
}
