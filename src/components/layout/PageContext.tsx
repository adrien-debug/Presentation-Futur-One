"use client";

import React from "react";
import { ArtDirection, SectionZone } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { resolveBoxStyle } from "@/utils/boxStyle";
import SectionBlock from "@/components/sections/SectionBlock";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

interface PageContextProps {
  theme: ArtDirection;
  side: "left" | "right";
  zones: SectionZone[];
  children?: React.ReactNode;
  showGrid?: boolean;
  overrides?: Partial<Record<string, React.ReactNode>>;
}

export default function PageContext({
  theme,
  side,
  zones,
  children,
  showGrid = false,
  overrides = {},
}: PageContextProps) {
  const isLeft = side === "left";
  const { boxStyles, hideHeader, hideFooter } = useEditor();

  // Filter hidden zones; renormalize heightRatios so visible zones fill 100%
  const visibleZones = zones.filter((z) =>
    !(z.id === "header" && hideHeader) &&
    !(z.id === "footer" && hideFooter)
  );
  const total = visibleZones.reduce((s, z) => s + z.heightRatio, 0) || 1;
  const gridRows = visibleZones.map((z) => `${(z.heightRatio / total) * 100}%`).join(" ");

  return (
    <div
      className="page-context relative w-full h-full"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      data-side={side}
    >
      <div
        className="absolute"
        style={{
          inset: "2.5%",
          display: "grid",
          gridTemplateRows: gridRows,
          gridTemplateColumns: "1fr",
        }}
      >
        {visibleZones.map((zone) => {
          const override = overrides[zone.id];

          // Per-side box style key — same convention as contentStore/layoutOverrides.
          const styleKey = `${side}-${zone.id}`;
          const resolved = resolveBoxStyle(boxStyles[styleKey], theme);

          let content: React.ReactNode;
          if (zone.id === "header") {
            content = override || <Header theme={theme} side={side} showGrid={showGrid} />;
          } else if (zone.id === "footer") {
            content = override || <Footer theme={theme} side={side} showGrid={showGrid} />;
          } else {
            content = override || (
              <SectionBlock
                theme={theme}
                zoneId={zone.id}
                label={zone.label}
                side={side}
                showGrid={showGrid}
              />
            );
          }

          return (
            <div
              key={zone.id}
              data-zone={zone.id}
              style={{
                overflow: "hidden",
                position: "relative",
                minHeight: 0,
                containerType: "size" as React.CSSProperties["containerType"],
                ...resolved.containerStyle,
              }}
            >
              {content}
              {/* Corner brackets overlay */}
              {resolved.showBrackets && <CornerBrackets accent={theme.colors.accent} />}
              {resolved.showBeveled && <BeveledCorners theme={theme} />}
            </div>
          );
        })}
      </div>

      {showGrid && (
        <div
          className="absolute pointer-events-none z-30"
          style={{ inset: "2.5%", border: "1px dashed rgba(255,220,0,0.12)" }}
        />
      )}

      {showGrid && (
        <div
          className="absolute top-1 text-[8px] font-mono opacity-40 z-40"
          style={{ [isLeft ? "left" : "right"]: "4px", color: theme.colors.accent }}
        >
          PAGE {isLeft ? "GAUCHE" : "DROITE"}
        </div>
      )}
    </div>
  );
}

function CornerBrackets({ accent }: { accent: string }) {
  const sz = "12px";
  const w = "2px";
  const positions: React.CSSProperties[] = [
    { top: 4, left: 4,  borderTop: `${w} solid ${accent}`, borderLeft: `${w} solid ${accent}` },
    { top: 4, right: 4, borderTop: `${w} solid ${accent}`, borderRight: `${w} solid ${accent}` },
    { bottom: 4, left: 4,  borderBottom: `${w} solid ${accent}`, borderLeft: `${w} solid ${accent}` },
    { bottom: 4, right: 4, borderBottom: `${w} solid ${accent}`, borderRight: `${w} solid ${accent}` },
  ];
  return (
    <>
      {positions.map((style, i) => (
        <div key={i} className="absolute pointer-events-none z-10" style={{ width: sz, height: sz, ...style }} />
      ))}
    </>
  );
}

function BeveledCorners({ theme }: { theme: ArtDirection }) {
  const size = "10px";
  return (
    <>
      <div className="absolute pointer-events-none z-10" style={{ top: 0, left: 0, width: 0, height: 0, borderTop: `${size} solid ${theme.colors.accent}`, borderRight: `${size} solid transparent` }} />
      <div className="absolute pointer-events-none z-10" style={{ bottom: 0, right: 0, width: 0, height: 0, borderBottom: `${size} solid ${theme.colors.accent}`, borderLeft: `${size} solid transparent` }} />
    </>
  );
}
