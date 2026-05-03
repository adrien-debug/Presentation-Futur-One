"use client";

import React from "react";
import Panel from "../Panel";
import {
  BACK_CONTACT_BODY_PT,
  BACK_CONTACT_TITLE_BODY_GAP_MM,
  BACK_FOOTNOTE_LETTER_SPACING,
  BACK_FOOTNOTE_PT,
  BACK_FOOTNOTE_RIGHT_MM,
  BACK_HAIRLINE_LENGTH_MM,
  BACK_HAIRLINE_THICKNESS_MM,
  BACK_HLOGO_BOTTOM_MM,
  BACK_HLOGO_RIGHT_MM,
  BACK_HLOGO_SIZE_MM,
  BACK_OVERLAY_GRADIENT,
  BACK_PHOTO_ZONE_MM,
  BACK_QUOTE_PT,
  BACK_QUOTE_TOP_MM,
  BACK_SPACER_AFTER_HAIRLINE_MM,
  BACK_SPACER_AFTER_QUOTE_MM,
  BACK_TAGLINE_PT,
  EYEBROW_PT_SECONDARY,
  TYPO_LINE_HEIGHT_DISPLAY_QUOTE,
  TYPO_LINE_HEIGHT_FOOTNOTE,
  TYPO_LINE_HEIGHT_LEAD,
  TYPO_LS_QUOTE,
  TYPO_LS_UPPER_WIDE,
  margin,
  mm,
} from "../design-tokens";
import { Eyebrow, FONT, HLogo, Hairline, PALETTE } from "./shared";

export function BackPanel({ showGuides = false }: { showGuides?: boolean }) {
  const backImg = "/leaflet-qatar/back-cover.png";
  return (
    <Panel bg={PALETTE.paper} showGuides={showGuides} label="Dos">
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: `${BACK_PHOTO_ZONE_MM}mm`,
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: `${BACK_PHOTO_ZONE_MM}mm`,
        background: BACK_OVERLAY_GRADIENT,
      }} />

      <HLogo
        size={mm(BACK_HLOGO_SIZE_MM)}
        color={PALETTE.maroon}
        opacity={0.06}
        style={{
          position: "absolute",
          bottom: mm(BACK_HLOGO_BOTTOM_MM),
          right: mm(BACK_HLOGO_RIGHT_MM),
        }}
      />

      <div style={{ position: "absolute", top: margin, left: margin }}>
        <Eyebrow color={PALETTE.maroon}>04</Eyebrow>
      </div>

      <div style={{ position: "absolute", top: margin, right: margin }}>
        <Eyebrow color={PALETTE.textMuted}>End</Eyebrow>
      </div>

      <div style={{
        position: "absolute",
        top: mm(BACK_QUOTE_TOP_MM),
        left: margin,
        right: margin,
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: BACK_QUOTE_PT,
          lineHeight: TYPO_LINE_HEIGHT_DISPLAY_QUOTE,
          letterSpacing: TYPO_LS_QUOTE,
          color: PALETTE.textInk,
        }}>
          AI<br />
          is the<br />
          <span style={{ color: PALETTE.maroon, fontStyle: "normal", fontWeight: 900 }}>new gas.</span>
        </div>
        <div style={{ height: mm(BACK_SPACER_AFTER_QUOTE_MM) }} />
        <Hairline length={mm(BACK_HAIRLINE_LENGTH_MM)} thickness={mm(BACK_HAIRLINE_THICKNESS_MM)} />
        <div style={{ height: mm(BACK_SPACER_AFTER_HAIRLINE_MM) }} />
        <div style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: BACK_TAGLINE_PT,
          color: PALETTE.maroon,
          letterSpacing: TYPO_LS_UPPER_WIDE,
          textTransform: "uppercase",
        }}>
          Compute is the infrastructure of nations.
        </div>
      </div>

      <div style={{
        position: "absolute",
        bottom: margin,
        right: margin,
        textAlign: "right",
      }}>
        <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_SECONDARY}>Contact</Eyebrow>
        <div style={{ height: mm(BACK_CONTACT_TITLE_BODY_GAP_MM) }} />
        <div style={{
          fontFamily: FONT,
          fontSize: BACK_CONTACT_BODY_PT,
          fontWeight: 500,
          color: PALETTE.textInk,
          lineHeight: TYPO_LINE_HEIGHT_LEAD,
        }}>
          Doha · Qatar<br />
          contact@futurone.qa<br />
          futurone.qa
        </div>
      </div>

      <div style={{
        position: "absolute",
        bottom: margin,
        left: margin,
        right: mm(BACK_FOOTNOTE_RIGHT_MM),
        fontFamily: FONT,
        fontSize: BACK_FOOTNOTE_PT,
        fontWeight: 400,
        letterSpacing: BACK_FOOTNOTE_LETTER_SPACING,
        color: PALETTE.textMuted,
        textTransform: "uppercase",
        lineHeight: TYPO_LINE_HEIGHT_FOOTNOTE,
      }}>
        Issued under QFC Authority oversight · PDPPL Law 13/2016 compliant<br />
        © 2030 Futur One Datacenter LLC · Confidential
      </div>
    </Panel>
  );
}
