"use client";

import React from "react";
import {
  EYEBROW_LETTER_SPACING,
  EYEBROW_PT_DEFAULT,
  HAIRLINE_DEFAULT_LENGTH_MM,
  HAIRLINE_DEFAULT_THICKNESS_MM,
  HLOGO_DEFAULT_SIZE_MM,
  INSIDE_LEFT_HERO_BAR_ICON_PX,
  mm,
} from "../design-tokens";

/**
 * Direction artistique : INSTITUTIONNEL CLAIR (Qatar / premium)
 * — Fond majoritairement blanc / gris froid ; maroon = seul accent.
 * — Typo Satoshi ; hiérarchie par taille et gris, pas par aplats noirs.
 *
 * PALETTE : maroon Qatar + neutres (éviter #000 en grandes surfaces).
 */
export const PALETTE = {
  // L'unique couleur — le maroon Qatar (Pantone 1955 C)
  maroon: "#8A1538",

  black:    "#000000",
  ink:      "#0A0A0A",
  charcoal: "#1A1A1A",
  graphite: "#222222",
  ash:      "#444444",
  silver:   "#777777",
  smoke:    "#EEEEEE",
  fog:      "#F8F8F8",
  white:    "#FFFFFF",

  /** Pages intérieures et surfaces « papier » */
  paper: "#FAFAFA",
  mist: "#F5F5F7",
  bandSurface: "#ECECF0",
  /** Texte sur fond clair (évite noir pur) */
  textInk: "#1C1C1E",
  textMuted: "#636366",
  dividerSubtle: "#D1D1D6",
};

export const FONT = "'Satoshi', system-ui, sans-serif";

// Petits helpers (pas de "boxes", juste du texte stylé inline) ──────────
export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number; weight?: number }> = ({
  children, color = PALETTE.maroon, size = EYEBROW_PT_DEFAULT, weight = 700,
}) => (
  <span style={{
    fontFamily: FONT,
    fontSize: `${size}pt`,
    fontWeight: weight,
    letterSpacing: EYEBROW_LETTER_SPACING,
    textTransform: "uppercase",
    color,
  }}>{children}</span>
);

export const Hairline = ({
  length = mm(HAIRLINE_DEFAULT_LENGTH_MM),
  thickness = mm(HAIRLINE_DEFAULT_THICKNESS_MM),
}: { length?: string; thickness?: string }) => (
  <div style={{ width: length, height: thickness, backgroundColor: PALETTE.maroon }} />
);

/**
 * HLogo — filigrane Hearst (le H pixel-art).
 *
 * Le SVG `/leaflet-qatar/logo-hearst-h.svg` est utilisé comme mask-image,
 * ce qui permet de re-colorer la silhouette via `backgroundColor`.
 * Aspect ratio source = 268 / 295.
 *
 * Usage :
 *   <HLogo size={mm(HLOGO_DEFAULT_SIZE_MM)} color={PALETTE.maroon} opacity={0.08}
 *          style={{ position:"absolute", top:"...", right:"..." }} />
 */
export const HLogo: React.FC<{
  size?: string;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size = mm(HLOGO_DEFAULT_SIZE_MM), color = PALETTE.maroon, opacity = 0.08, style }) => (
  <div
    aria-hidden
    style={{
      width: size,
      aspectRatio: "268 / 295",
      backgroundColor: color,
      WebkitMaskImage: "url(/leaflet-qatar/logo-hearst-h.svg)",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskSize: "contain",
      WebkitMaskPosition: "center",
      maskImage: "url(/leaflet-qatar/logo-hearst-h.svg)",
      maskRepeat: "no-repeat",
      maskSize: "contain",
      maskPosition: "center",
      opacity,
      pointerEvents: "none",
      ...style,
    }}
  />
);

/** Icônes barre hero — trait renforcé, pour présence bas de page. */
export function HeroBarIconCompute() {
  return (
    <svg width={INSIDE_LEFT_HERO_BAR_ICON_PX} height={INSIDE_LEFT_HERO_BAR_ICON_PX} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block" }}>
      <rect x="4" y="3" width="16" height="5" rx="0.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="10" width="16" height="5" rx="0.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="17" width="16" height="5" rx="0.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
export function HeroBarIconEnergy() {
  return (
    <svg width={INSIDE_LEFT_HERO_BAR_ICON_PX} height={INSIDE_LEFT_HERO_BAR_ICON_PX} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block" }}>
      <path
        d="M13 2L4 14h6l-2 8 10-12h-6l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
export function HeroBarIconSovereignty() {
  return (
    <svg width={INSIDE_LEFT_HERO_BAR_ICON_PX} height={INSIDE_LEFT_HERO_BAR_ICON_PX} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block" }}>
      <path
        d="M12 3l8 4v6c0 4.5-3 8.5-8 9.5-5-1-8-5-8-9.5V7l8-4z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
