"use client";

import React from "react";

// A4 portrait à l'échelle 1:1 millimètres physiques.
// Le navigateur convertit `mm` via les paramètres écran ; pour PRINT-EXACT,
// l'export PDF par puppeteer prend les dimensions telles quelles.

export const PANEL_W_MM = 210;
export const PANEL_H_MM = 297;

interface PanelProps {
  children?: React.ReactNode;
  bg?: string;
  /** Affiche un repère de pli + safe area (12mm) en mode dev. */
  showGuides?: boolean;
  /** Étiquette en bas du panneau (utile en mode multi-panneaux). */
  label?: string;
}

export default function Panel({
  children,
  bg = "#FAF6EE",
  showGuides = false,
  label,
}: PanelProps) {
  return (
    <div style={{ display: "inline-block", verticalAlign: "top" }}>
      <div
        className="panel"
        style={{
          width:  `${PANEL_W_MM}mm`,
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
                inset: "12mm",
                border: "1px dashed rgba(255,200,80,0.25)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "4mm", left: "4mm",
                fontFamily: "Menlo, monospace",
                fontSize: "8px",
                color: "rgba(255,200,80,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              210×297mm · safe 12mm
            </div>
          </>
        )}
      </div>
      {label && (
        <div style={{
          textAlign: "center",
          fontFamily: "Menlo, monospace",
          fontSize: 11,
          color: "#888",
          marginTop: 8,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
