"use client";

import React from "react";
import Panel from "../Panel";
import {
  COVER_DISPLAY_LINE_HEIGHT,
  COVER_F1_BOX_MM,
  COVER_F1_FONT_PT,
  COVER_FUTUR_LETTER_SPACING,
  COVER_FUTUR_PT,
  COVER_FUTUR_TOP_MM,
  COVER_HLOGO_BOTTOM_MM,
  COVER_HLOGO_RIGHT_MM,
  COVER_HLOGO_SIZE_MM,
  COVER_ONE_LETTER_SPACING,
  COVER_ONE_PT,
  COVER_ONE_TOP_MM,
  COVER_OVERLAY_BOTTOM_GRADIENT,
  COVER_OVERLAY_BOTTOM_HEIGHT_PCT,
  COVER_OVERLAY_MAIN_GRADIENT,
  COVER_SPECS_BORDER_MM,
  COVER_SPECS_PADDING_TOP_MM,
  COVER_SPECS_VALUE_PT,
  EYEBROW_PT_SECONDARY,
  margin,
  mm,
} from "../design-tokens";
import { Eyebrow, FONT, HLogo, PALETTE } from "./shared";

export function CoverPanel({ showGuides = false }: { showGuides?: boolean }) {
  // PNG raw, servi par Next sans compression (cf. next.config.ts unoptimized:true).
  const facadeImg = "/leaflet-qatar/cover-facade.png";
  return (
    <Panel bg={PALETTE.black} showGuides={showGuides} label="Couverture">
      {/* ── PHOTO FULL BLEED (sans compression, via backgroundImage CSS) ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${facadeImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* ── Overlay : fond plus lumineux en bas (lisibilité specs sans tout noircir) ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: COVER_OVERLAY_MAIN_GRADIENT,
      }} />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: COVER_OVERLAY_BOTTOM_HEIGHT_PCT,
          background: COVER_OVERLAY_BOTTOM_GRADIENT,
          pointerEvents: "none",
        }}
      />

      {/* ── Filigrane H Hearst ── */}
      <HLogo
        size={mm(COVER_HLOGO_SIZE_MM)}
        color={PALETTE.white}
        opacity={0.03}
        style={{
          position: "absolute",
          bottom: mm(COVER_HLOGO_BOTTOM_MM),
          right: mm(COVER_HLOGO_RIGHT_MM),
        }}
      />

      {/* ── Mark F1 top-left ── */}
      <div style={{
        position: "absolute",
        top: margin, left: margin,
        width: mm(COVER_F1_BOX_MM), height: mm(COVER_F1_BOX_MM),
        backgroundColor: PALETTE.maroon,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: COVER_F1_FONT_PT,
        color: PALETTE.white,
      }}>
        F1
      </div>

      {/* ── « FUTUR » massif (ajusté pour ne pas déborder bizarrement) ── */}
      <div style={{
        position: "absolute",
        top: mm(COVER_FUTUR_TOP_MM),
        left: margin,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: COVER_FUTUR_PT,
        lineHeight: COVER_DISPLAY_LINE_HEIGHT,
        letterSpacing: COVER_FUTUR_LETTER_SPACING,
        color: PALETTE.white,
        whiteSpace: "nowrap",
      }}>
        FUTUR
      </div>

      {/* ── « ONE. » en maroon ── */}
      <div style={{
        position: "absolute",
        top: mm(COVER_ONE_TOP_MM),
        left: margin,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: COVER_ONE_PT,
        lineHeight: COVER_DISPLAY_LINE_HEIGHT,
        letterSpacing: COVER_ONE_LETTER_SPACING,
        color: PALETTE.maroon,
      }}>
        ONE.
      </div>

      {/* ── Bandeau bas : trio de specs ── */}
      <div style={{
        position: "absolute",
        bottom: margin,
        left: margin,
        right: margin,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: `${mm(COVER_SPECS_BORDER_MM)} solid ${PALETTE.maroon}`,
        paddingTop: mm(COVER_SPECS_PADDING_TOP_MM),
      }}>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: COVER_SPECS_VALUE_PT, color: PALETTE.maroon }}>Tier IV</div>
          <Eyebrow color={PALETTE.silver} size={EYEBROW_PT_SECONDARY}>Reliability</Eyebrow>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: COVER_SPECS_VALUE_PT, color: PALETTE.maroon }}>48 MW</div>
          <Eyebrow color={PALETTE.silver} size={EYEBROW_PT_SECONDARY}>Phase 1</Eyebrow>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: COVER_SPECS_VALUE_PT, color: PALETTE.maroon }}>17 HA</div>
          <Eyebrow color={PALETTE.silver} size={EYEBROW_PT_SECONDARY}>Campus</Eyebrow>
        </div>
      </div>
    </Panel>
  );
}
