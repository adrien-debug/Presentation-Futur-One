"use client";

import React from "react";
import {
  LEAFLET_MARGIN_MM,
  margin,
  PANEL_H_MM,
  PANEL_W_MM,
} from "./design-tokens";

// A4 portrait à l'échelle 1:1 millimètres physiques.
// Le navigateur convertit `mm` via les paramètres écran ; pour PRINT-EXACT,
// l'export PDF par puppeteer prend les dimensions telles quelles.

export {
  LEAFLET_MARGIN_MM,
  margin,
  PANEL_H_MM,
  PANEL_W_MM,
} from "./design-tokens";

interface PanelProps {
  children?: React.ReactNode;
  bg?: string;
  /** Affiche un repère + zone utile (même marge que le contenu, voir design-tokens). */
  showGuides?: boolean;
  /** Étiquette en bas du panneau (utile en mode multi-panneaux). */
  label?: string;
}

export default function Panel({
  children,
  bg = "#FAFAFA",
  showGuides = false,
  label,
}: PanelProps) {
  return (
    <div style={{ display: "inline-block", verticalAlign: "top" }}>
      <div
        className="panel"
        style={{
          width: `${PANEL_W_MM}mm`,
          height: `${PANEL_H_MM}mm`,
          background: bg,
          position: "relative",
          overflow: "hidden",
          color: "inherit",
        }}
      >
        {children}

        {/* Safe area + repères dev (jamais imprimés via @media print) */}
        {showGuides && (
          <>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: margin,
                border: "1px dashed rgba(255,200,80,0.25)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "4mm",
                left: "4mm",
                fontFamily: "Menlo, monospace",
                fontSize: "8px",
                color: "rgba(255,200,80,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              {PANEL_W_MM}×{PANEL_H_MM}mm · marge {LEAFLET_MARGIN_MM}mm
            </div>
          </>
        )}
      </div>
      {label && (
        <div
          style={{
            textAlign: "center",
            fontFamily: "Menlo, monospace",
            fontSize: 11,
            color: "#888",
            marginTop: 8,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
