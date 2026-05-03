"use client";

import React from "react";
import Panel from "../Panel";
import {
  CSS_WIDTH_FULL,
  HAIRLINE_THIN_THICKNESS_MM,
  INSIDE_LEFT_OPPORTUNITY_FILIGREE_LH,
  INSIDE_RIGHT_BAND_CONTENT_COLUMN_GAP_MM,
  INSIDE_RIGHT_BAND_CONTENT_ABSOLUTE_TOP_MM,
  INSIDE_RIGHT_BAND_CONTENT_INSET_BOTTOM_MM,
  INSIDE_RIGHT_BAND_CONTENT_TOP_OFFSET_MM,
  INSIDE_RIGHT_BAND_FILIGREE_OPACITY,
  INSIDE_RIGHT_BAND_FILIGREE_PT,
  INSIDE_RIGHT_BAND_FILIGREE_RIGHT_MM,
  INSIDE_RIGHT_BAND_FILIGREE_TOP_MM,
  INSIDE_RIGHT_BAND_HLOGO_RIGHT_MM,
  INSIDE_RIGHT_BAND_HLOGO_SIZE_MM,
  INSIDE_RIGHT_BAND_HLOGO_TOP_MM,
  INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM,
  INSIDE_RIGHT_BAND_INTRO_BODY_PT,
  INSIDE_RIGHT_BAND_INTRO_GRID_GAP_MM,
  INSIDE_RIGHT_BAND_INTRO_GRID_TEMPLATE,
  INSIDE_RIGHT_BAND_KPI_AFTER_VALUE_MM,
  INSIDE_RIGHT_BAND_KPI_CELL_PADDING_LEFT_MM,
  INSIDE_RIGHT_BAND_KPI_GRID_GAP_COL_MM,
  INSIDE_RIGHT_BAND_KPI_GRID_GAP_ROW_MM,
  INSIDE_RIGHT_BAND_KPI_GRID_TEMPLATE,
  INSIDE_RIGHT_BAND_KPI_LABEL_PT,
  INSIDE_RIGHT_BAND_KPI_VALUE_PT,
  INSIDE_RIGHT_BAND_PHOTO_STRIP_MM,
  INSIDE_RIGHT_BAND_PUNCHLINE_PT,
  INSIDE_RIGHT_BAND_SIDEBAR_MAX_WIDTH_PCT,
  INSIDE_RIGHT_BAND_SIDEBAR_NOTE_PT,
  INSIDE_RIGHT_BAND_UNDER_PHOTO_RULE_MM,
  INSIDE_RIGHT_BOTTOM_BAND_MM,
  INSIDE_RIGHT_DATA_AFTER_HIGHLIGHT_NOTE_MM,
  INSIDE_RIGHT_DATA_BAR_GRID_TEMPLATE,
  INSIDE_RIGHT_DATA_BLOCK_GRID_GAP_MM,
  INSIDE_RIGHT_DATA_BLOCK_TOP_MM,
  INSIDE_RIGHT_DATA_BODY_SMALL_PT,
  INSIDE_RIGHT_DATA_CAPTION_PT,
  INSIDE_RIGHT_DATA_CELL_NOTE_MARGIN_TOP_MM,
  INSIDE_RIGHT_DATA_CELL_NOTE_PT,
  INSIDE_RIGHT_DATA_DENSITY_NOTE_PT,
  INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM,
  INSIDE_RIGHT_DATA_GRID_GAP_MM,
  INSIDE_RIGHT_DATA_HIGHLIGHT_PT,
  INSIDE_RIGHT_DATA_MATRIX_CELL_MM,
  INSIDE_RIGHT_DATA_MATRIX_COL_GAP_MM,
  INSIDE_RIGHT_DATA_MATRIX_FOOTER_MARGIN_TOP_MM,
  INSIDE_RIGHT_DATA_MATRIX_GAP_MM,
  INSIDE_RIGHT_DATA_MATRIX_ROW_GAP_MM,
  INSIDE_RIGHT_DATA_QUOTE_COLUMN_PAD_LEFT_MM,
  INSIDE_RIGHT_DATA_QUOTE_ITALIC_PT,
  INSIDE_RIGHT_DATA_SECTION_GAP_MM,
  INSIDE_RIGHT_DATA_SUMMARY_BAR_HEIGHT_MM,
  INSIDE_RIGHT_DATA_SUMMARY_BAR_RADIUS_MM,
  INSIDE_RIGHT_DATA_SUMMARY_MARGIN_TOP_MM,
  INSIDE_RIGHT_DATA_SUMMARY_PROGRAM_WIDTH_PCT,
  INSIDE_RIGHT_DATA_SUMMARY_REGION_WIDTH_PCT,
  INSIDE_RIGHT_DATA_SUMMARY_TEXT_PT,
  INSIDE_RIGHT_DATA_TABLE_BORDER_MM,
  INSIDE_RIGHT_DATA_TABLE_CELL_PT,
  INSIDE_RIGHT_DATA_TABLE_GRID_TEMPLATE,
  INSIDE_RIGHT_DATA_TABLE_HEADER_PAD_Y_MM,
  INSIDE_RIGHT_DATA_TABLE_ID_PT,
  INSIDE_RIGHT_DATA_TABLE_ROW_BORDER_MM,
  INSIDE_RIGHT_DATA_TABLE_ROW_PAD_Y_MM,
  INSIDE_RIGHT_DATA_TWO_COL_GRID_TEMPLATE,
  INSIDE_RIGHT_HEADER_BORDER_MM,
  INSIDE_RIGHT_HEADER_PADDING_BOTTOM_MM,
  INSIDE_RIGHT_HEADER_TITLE_LH,
  INSIDE_RIGHT_HEADER_TITLE_PT,
  INSIDE_RIGHT_LEDE_PT,
  INSIDE_RIGHT_LEDE_TOP_MM,
  INSIDE_RIGHT_RESERVED_BOTTOM_MM,
  INSIDE_RIGHT_SPINE_WIDTH_MM,
  EYEBROW_PT_BAND,
  EYEBROW_PT_BLOCK,
  EYEBROW_PT_MATRIX,
  TYPO_LINE_HEIGHT_COMPACT,
  TYPO_LINE_HEIGHT_LEAD,
  TYPO_LINE_HEIGHT_RELAXED,
  TYPO_LINE_HEIGHT_TIGHTER,
  TYPO_LS_CAPTION,
  TYPO_LS_DISPLAY_TIGHT,
  TYPO_LS_QUOTE,
  TYPO_LS_UPPER_WIDE,
  margin,
  mm,
} from "../design-tokens";
import { Eyebrow, FONT, HLogo, Hairline, PALETTE } from "./shared";

export function InsideRightPanel({ showGuides = false }: { showGuides?: boolean }) {
  const bgImg = "/leaflet-qatar/cover-facade.png";

  const stages = [
    { n: "01", name: "INCUBATE",   stage: "Pre-seed → Seed",   duration: "3-6 mo",  batch: "20-30 / batch" },
    { n: "02", name: "ACCELERATE", stage: "Seed → Series A",   duration: "6-9 mo",  batch: "20-30 / cohort" },
    { n: "03", name: "SCALE",      stage: "Series A → B+",     duration: "Rolling", batch: "20-30 companies" },
    { n: "04", name: "ANCHOR",     stage: "Big Tech Bridge",   duration: "Rolling", batch: "POCs · M&A" },
  ];

  const kpis = [
    { v: "150",   l: "STARTUPS MAX CAPACITY" },
    { v: "100 K", l: "SQM TOTAL CAMPUS" },
    { v: "4 K",   l: "RESIDENTS (FOUNDERS & TEAMS)" },
    { v: "€400M", l: "PHASE 1 CAPEX" },
  ];

  return (
    <Panel bg={PALETTE.paper} showGuides={showGuides} label="Intérieur droit">

      {/* ── Filet maroon vertical au pli central (côté gauche) ── */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: mm(INSIDE_RIGHT_SPINE_WIDTH_MM), backgroundColor: PALETTE.maroon, zIndex: 10,
      }} />

      {/* ═══ BANDEAU BOTTOM — rendu en premier (sous le bloc données) pour ne plus masquer les graphiques ═══ */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: `${INSIDE_RIGHT_BOTTOM_BAND_MM}mm`,
        /* Un seul fond — pas de calque gradient dupliqué sur tout le bandeau */
        background: `linear-gradient(180deg, ${PALETTE.mist} 0%, ${PALETTE.bandSurface} 100%)`,
        overflow: "hidden",
      }}>
        {/* Titre de section MASSIF — tout au fond (sous photos / verres) */}
        <div style={{
          position: "absolute", top: mm(INSIDE_RIGHT_BAND_FILIGREE_TOP_MM), right: mm(INSIDE_RIGHT_BAND_FILIGREE_RIGHT_MM),
          fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_RIGHT_BAND_FILIGREE_PT,
          color: PALETTE.textInk, opacity: INSIDE_RIGHT_BAND_FILIGREE_OPACITY, letterSpacing: "-0.05em",
          whiteSpace: "nowrap", pointerEvents: "none", textAlign: "right",
          zIndex: 0,
        }}>
          CAMPUS
        </div>

        {/* Bande bas : fond unique + bande photo en UN calque (image + voile maroon → bandSurface, sans multiply ni 3 divs). */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${INSIDE_RIGHT_BAND_PHOTO_STRIP_MM}mm`,
            backgroundImage:
              `linear-gradient(180deg, rgba(138, 21, 56, 0.32) 0%, ${PALETTE.bandSurface} 100%), url(${bgImg})`,
            backgroundSize: "cover, cover",
            backgroundPosition: "center 35%, center 35%",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: `${INSIDE_RIGHT_BAND_PHOTO_STRIP_MM}mm`,
            left: 0,
            right: 0,
            height: mm(INSIDE_RIGHT_BAND_UNDER_PHOTO_RULE_MM),
            backgroundColor: PALETTE.maroon,
            zIndex: 2,
          }}
        />

        <HLogo
          size={mm(INSIDE_RIGHT_BAND_HLOGO_SIZE_MM)}
          color={PALETTE.maroon}
          opacity={0.03}
          style={{ position: "absolute", top: mm(INSIDE_RIGHT_BAND_HLOGO_TOP_MM), right: mm(INSIDE_RIGHT_BAND_HLOGO_RIGHT_MM), zIndex: 3 }}
        />

        {/* Contenu : colonne flex ; zone KPI en flex:1 pour équilibre ; punchline en bas sans space-between capricieux */}
        <div style={{
          position: "absolute",
          top: mm(INSIDE_RIGHT_BAND_CONTENT_ABSOLUTE_TOP_MM),
          left: margin,
          right: margin,
          bottom: mm(INSIDE_RIGHT_BAND_CONTENT_INSET_BOTTOM_MM),
          display: "flex",
          flexDirection: "column",
          gap: mm(INSIDE_RIGHT_BAND_CONTENT_COLUMN_GAP_MM),
          zIndex: 5,
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_BAND_INTRO_GRID_TEMPLATE, gap: mm(INSIDE_RIGHT_BAND_INTRO_GRID_GAP_MM) }}>
              <div>
                <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_BAND}>Built by</Eyebrow>
                <div style={{ height: mm(INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM) }} />
                <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_BAND_INTRO_BODY_PT, fontWeight: 500, color: PALETTE.textInk, lineHeight: TYPO_LINE_HEIGHT_RELAXED }}>
                  <span style={{ fontWeight: 700 }}>Hearst Qatar</span> — Sovereign Project Initiator &amp; Strategic Operator<br/>
                  Designed by Pritzker Prize architect <span style={{ fontWeight: 700 }}>Lord Norman Foster</span><br/>
                  Engineering &amp; Construction by <span style={{ fontWeight: 700 }}>JB Pastor &amp; Fils, Monaco</span>
                </div>
              </div>
              <div>
                <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_BAND}>Technology stack</Eyebrow>
                <div style={{ height: mm(INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM) }} />
                <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_BAND_INTRO_BODY_PT, fontWeight: 500, color: PALETTE.textMuted, lineHeight: TYPO_LINE_HEIGHT_RELAXED }}>
                  In discussion with Tier-1 hyperscalers and silicon partners.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            flex: "1 1 auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <Hairline length={CSS_WIDTH_FULL} thickness={mm(HAIRLINE_THIN_THICKNESS_MM)} />
            <div style={{ height: mm(INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM) }} />
            <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_BAND_KPI_GRID_TEMPLATE, gap: `${mm(INSIDE_RIGHT_BAND_KPI_GRID_GAP_ROW_MM)} ${mm(INSIDE_RIGHT_BAND_KPI_GRID_GAP_COL_MM)}` }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ borderLeft: `1px solid ${PALETTE.dividerSubtle}`, paddingLeft: mm(INSIDE_RIGHT_BAND_KPI_CELL_PADDING_LEFT_MM) }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_RIGHT_BAND_KPI_VALUE_PT, color: PALETTE.textInk, lineHeight: TYPO_LINE_HEIGHT_TIGHTER, letterSpacing: TYPO_LS_DISPLAY_TIGHT }}>{k.v}</div>
                  <div style={{ height: mm(INSIDE_RIGHT_BAND_KPI_AFTER_VALUE_MM) }} />
                  <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_BAND_KPI_LABEL_PT, fontWeight: 700, color: PALETTE.maroon, textTransform: "uppercase", letterSpacing: TYPO_LS_UPPER_WIDE }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <Hairline length={CSS_WIDTH_FULL} thickness={mm(HAIRLINE_THIN_THICKNESS_MM)} />
            <div style={{ height: mm(INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM) }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: mm(INSIDE_RIGHT_BAND_CONTENT_COLUMN_GAP_MM) }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: INSIDE_RIGHT_BAND_PUNCHLINE_PT, lineHeight: 1.08, color: PALETTE.textInk, letterSpacing: TYPO_LS_QUOTE }}>
                Sovereign by design.<br />
                <span style={{ color: PALETTE.maroon, fontWeight: 900 }}>Global by intent.</span>
              </div>
              <div style={{ textAlign: "right", maxWidth: INSIDE_RIGHT_BAND_SIDEBAR_MAX_WIDTH_PCT, flex: "1 1 auto" }}>
                <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_BAND_SIDEBAR_NOTE_PT, fontWeight: 500, color: PALETTE.textMuted, letterSpacing: "0.1em", lineHeight: TYPO_LINE_HEIGHT_RELAXED }}>
                  <span style={{ color: PALETTE.graphite, fontWeight: 700 }}>QATAR LABEL PROGRAM</span> · Official certification for high-potential companies.<br/>
                  • 0% tax environment • Fast company setup &amp; full ownership<br/>
                  • Housing, education, healthcare packages
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ HEADER COMPRESSÉ ═══ */}
      <div style={{
        position: "absolute", top: margin, left: margin, right: margin,
        zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderBottom: `${mm(INSIDE_RIGHT_HEADER_BORDER_MM)} solid ${PALETTE.maroon}`,
        paddingBottom: mm(INSIDE_RIGHT_HEADER_PADDING_BOTTOM_MM),
        backgroundColor: `${PALETTE.maroon}05`, // subtle maroon bg
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_RIGHT_HEADER_TITLE_PT,
          lineHeight: INSIDE_RIGHT_HEADER_TITLE_LH, letterSpacing: "-0.04em", color: PALETTE.textInk,
        }}>
          THE <span style={{ color: PALETTE.maroon }}>METHOD.</span>
        </div>
        <Eyebrow color={PALETTE.textMuted}>02 / 04</Eyebrow>
      </div>

      {/* ── PHRASE 3 ── */}
      <div style={{
        position: "absolute", top: mm(INSIDE_RIGHT_LEDE_TOP_MM), left: margin, right: margin,
        fontFamily: FONT, fontSize: INSIDE_RIGHT_LEDE_PT, fontWeight: 400,
        lineHeight: TYPO_LINE_HEIGHT_LEAD, color: PALETTE.graphite,
      }}>
        <span style={{ color: PALETTE.textInk, fontWeight: 700 }}>Hearst Qatar</span>
        {" "}is developing one of the largest data centers in the region to provide dedicated energy and{" "}
        <span style={{ color: PALETTE.textInk, fontWeight: 700 }}>HPC capacity</span>
        {" "}to startups, established enterprises, and major private-sector players establishing operations locally, with sovereign wealth funds as anchor stakeholders.
        <br /><br />
        <span style={{ color: PALETTE.maroon, fontWeight: 700 }}>This ensures priority access to compute, long-term cost control and strategic independence.</span>
      </div>

      {/* ═══ DATA MATRIX & TABLEAU TECHNIQUE — clip + au-dessus du bandeau bas (DOM + z-index) ═══ */}
      <div style={{
        position: "absolute",
        top: mm(INSIDE_RIGHT_DATA_BLOCK_TOP_MM),
        left: margin,
        right: margin,
        bottom: `${INSIDE_RIGHT_RESERVED_BOTTOM_MM}mm`,
        overflow: "hidden",
        zIndex: 4,
        isolation: "isolate",
        backgroundColor: PALETTE.paper,
        contain: "paint",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Eyebrow color={PALETTE.maroon}>Follow-on funding rate at 18 months</Eyebrow>
          <span style={{
            fontFamily: FONT,
            fontSize: INSIDE_RIGHT_DATA_CAPTION_PT,
            fontWeight: 600,
            color: PALETTE.graphite,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Indexed comparison · same cell grid for both scenarios
          </span>
        </div>
        <div style={{ height: mm(INSIDE_RIGHT_DATA_SECTION_GAP_MM) }} />

        {/* Matrices : grille 2×2 (alignement) + 70% ancré au-dessus de la colonne Futur One + strip synthèse */}
        <div style={{ display: "flex", gap: mm(INSIDE_RIGHT_DATA_MATRIX_GAP_MM), alignItems: "flex-start" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${mm(INSIDE_RIGHT_DATA_MATRIX_CELL_MM)} ${mm(INSIDE_RIGHT_DATA_MATRIX_CELL_MM)}`,
              columnGap: mm(INSIDE_RIGHT_DATA_MATRIX_COL_GAP_MM),
              rowGap: mm(INSIDE_RIGHT_DATA_MATRIX_ROW_GAP_MM),
              flexShrink: 0,
            }}
          >
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>MENA (~30%)</Eyebrow>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_RIGHT_DATA_HIGHLIGHT_PT, color: PALETTE.maroon, lineHeight: INSIDE_LEFT_OPPORTUNITY_FILIGREE_LH }}>
                70%
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: INSIDE_RIGHT_DATA_CELL_NOTE_PT,
                fontWeight: 500,
                color: PALETTE.textMuted,
                letterSpacing: TYPO_LS_CAPTION,
                lineHeight: TYPO_LINE_HEIGHT_COMPACT,
                marginTop: mm(INSIDE_RIGHT_DATA_CELL_NOTE_MARGIN_TOP_MM),
              }}>
                Programme target (≈70% follow-on design intent)
              </div>
              <div style={{ height: mm(INSIDE_RIGHT_DATA_AFTER_HIGHLIGHT_NOTE_MM) }} />
              <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_MATRIX}>FUTUR ONE (70%)</Eyebrow>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_BAR_GRID_TEMPLATE, gap: mm(INSIDE_RIGHT_DATA_GRID_GAP_MM) }}>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={`m-${i}`} style={{ aspectRatio: "1", backgroundColor: i < 30 ? PALETTE.silver : PALETTE.smoke }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_BAR_GRID_TEMPLATE, gap: mm(INSIDE_RIGHT_DATA_GRID_GAP_MM) }}>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={`f-${i}`} style={{ aspectRatio: "1", backgroundColor: i < 70 ? PALETTE.maroon : PALETTE.smoke }} />
              ))}
            </div>
            <div style={{ gridColumn: "1 / -1", marginTop: mm(INSIDE_RIGHT_DATA_MATRIX_FOOTER_MARGIN_TOP_MM) }}>
              <div style={{ display: "flex", height: mm(INSIDE_RIGHT_DATA_SUMMARY_BAR_HEIGHT_MM), borderRadius: mm(INSIDE_RIGHT_DATA_SUMMARY_BAR_RADIUS_MM), overflow: "hidden" }}>
                <div style={{ width: INSIDE_RIGHT_DATA_SUMMARY_REGION_WIDTH_PCT, backgroundColor: PALETTE.silver }} aria-hidden />
                <div style={{ width: INSIDE_RIGHT_DATA_SUMMARY_PROGRAM_WIDTH_PCT, backgroundColor: PALETTE.maroon }} aria-hidden />
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: INSIDE_RIGHT_DATA_SUMMARY_TEXT_PT,
                fontWeight: 500,
                color: PALETTE.textMuted,
                letterSpacing: TYPO_LS_CAPTION,
                lineHeight: TYPO_LINE_HEIGHT_RELAXED,
                marginTop: mm(INSIDE_RIGHT_DATA_SUMMARY_MARGIN_TOP_MM),
              }}>
                Proportion of shaded cells above: ≈30% regional benchmark vs ≈70% programme target.
              </div>
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: mm(INSIDE_RIGHT_DATA_QUOTE_COLUMN_PAD_LEFT_MM), borderLeft: `${mm(INSIDE_RIGHT_HEADER_BORDER_MM)} solid ${PALETTE.dividerSubtle}`, display: "flex", alignItems: "center", minWidth: 0 }}>
            <div style={{
              fontFamily: FONT, fontStyle: "italic", fontWeight: 300,
              fontSize: INSIDE_RIGHT_DATA_QUOTE_ITALIC_PT, lineHeight: 1.2, color: PALETTE.maroon,
            }}>
              “We will be the world’s first fully AI-managed campus, orchestrating every dimension from sports and health to energy optimization and beyond.”
            </div>
          </div>
        </div>

        <div style={{ height: mm(INSIDE_RIGHT_DATA_SECTION_GAP_MM) }} />
        <div style={{
          fontFamily: FONT, fontSize: INSIDE_RIGHT_DATA_DENSITY_NOTE_PT, fontWeight: 500,
          color: PALETTE.textMuted, letterSpacing: TYPO_LS_CAPTION, lineHeight: TYPO_LINE_HEIGHT_RELAXED,
        }}>
          <span style={{ color: PALETTE.textInk, fontWeight: 700 }}>Density benchmarks</span>
          {" "}— selection and cohort design informed by global best practice (YC-class deal flow, Antler-style residency, MISK-aligned regional pipeline).
        </div>

        <div style={{ height: mm(INSIDE_RIGHT_DATA_SECTION_GAP_MM) }} />

        {/* Phases d’incubation */}
        <div style={{ borderTop: `${mm(INSIDE_RIGHT_DATA_TABLE_BORDER_MM)} solid ${PALETTE.textInk}`, borderBottom: `${mm(INSIDE_RIGHT_DATA_TABLE_BORDER_MM)} solid ${PALETTE.textInk}` }}>
          <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_TABLE_GRID_TEMPLATE, padding: `${mm(INSIDE_RIGHT_DATA_TABLE_HEADER_PAD_Y_MM)} 0`, borderBottom: `${mm(INSIDE_RIGHT_DATA_TABLE_ROW_BORDER_MM)} solid ${PALETTE.dividerSubtle}` }}>
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>ID</Eyebrow>
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>PHASE</Eyebrow>
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>STAGE</Eyebrow>
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>DURATION</Eyebrow>
            <Eyebrow color={PALETTE.textMuted} size={EYEBROW_PT_MATRIX}>CAPACITY</Eyebrow>
          </div>
          {stages.map((s, i) => (
            <div key={s.n} style={{ 
              display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_TABLE_GRID_TEMPLATE, padding: `${mm(INSIDE_RIGHT_DATA_TABLE_ROW_PAD_Y_MM)} 0`,
              borderBottom: i < stages.length - 1 ? `${mm(INSIDE_RIGHT_DATA_TABLE_ROW_BORDER_MM)} solid ${PALETTE.dividerSubtle}` : "none",
              alignItems: "center"
            }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_RIGHT_DATA_TABLE_ID_PT, color: PALETTE.maroon }}>{s.n}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: INSIDE_RIGHT_DATA_TABLE_CELL_PT, color: PALETTE.textInk, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: INSIDE_RIGHT_DATA_TABLE_CELL_PT, color: PALETTE.graphite }}>{s.stage}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: INSIDE_RIGHT_DATA_TABLE_CELL_PT, color: PALETTE.graphite }}>{s.duration}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: INSIDE_RIGHT_DATA_TABLE_CELL_PT, color: PALETTE.graphite }}>{s.batch}</div>
            </div>
          ))}
        </div>

        <div style={{ height: mm(INSIDE_RIGHT_DATA_SECTION_GAP_MM) }} />
        
        {/* Selection, Doctrine, Timeline, Risk */}
        <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_TWO_COL_GRID_TEMPLATE, gap: mm(INSIDE_RIGHT_DATA_BLOCK_GRID_GAP_MM) }}>
          <div>
            <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_BLOCK}>Selection</Eyebrow>
            <div style={{ height: mm(INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM) }} />
            <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_DATA_BODY_SMALL_PT, color: PALETTE.graphite, lineHeight: TYPO_LINE_HEIGHT_COMPACT }}>
              Capacity is intentionally capped at 150 startups<br/>
              to maximize performance, capital efficiency and ecosystem quality.<br/>
              <span style={{ fontWeight: 700 }}>Selection ratio: ~1/200 applicants.</span>
            </div>
          </div>
          <div>
            <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_BLOCK}>Doctrine</Eyebrow>
            <div style={{ height: mm(INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM) }} />
            <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_DATA_BODY_SMALL_PT, color: PALETTE.ink, textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: TYPO_LINE_HEIGHT_COMPACT, fontWeight: 700 }}>
              Performance<br/>
              Wellbeing<br/>
              Social Integration
            </div>
          </div>
        </div>

        <div style={{ height: mm(INSIDE_RIGHT_DATA_SECTION_GAP_MM) }} />
        
        <div style={{ display: "grid", gridTemplateColumns: INSIDE_RIGHT_DATA_TWO_COL_GRID_TEMPLATE, gap: mm(INSIDE_RIGHT_DATA_BLOCK_GRID_GAP_MM) }}>
          <div>
            <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_BLOCK}>Timeline</Eyebrow>
            <div style={{ height: mm(INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM) }} />
            <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_DATA_BODY_SMALL_PT, color: PALETTE.graphite, lineHeight: TYPO_LINE_HEIGHT_COMPACT }}>
              <span style={{ fontWeight: 700 }}>Phase 1</span> — Core Campus &amp; AI Systems: 2027<br/>
              <span style={{ fontWeight: 700 }}>Phase 2</span> — Full Campus Expansion: 2030
            </div>
          </div>
          <div>
            <Eyebrow color={PALETTE.maroon} size={EYEBROW_PT_BLOCK}>Risk Management</Eyebrow>
            <div style={{ height: mm(INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM) }} />
            <div style={{ fontFamily: FONT, fontSize: INSIDE_RIGHT_DATA_BODY_SMALL_PT, color: PALETTE.graphite, lineHeight: TYPO_LINE_HEIGHT_COMPACT }}>
              <span style={{ fontWeight: 700 }}>Construction risk</span> managed by Hearst Qatar and Tier-1 partners.<br/>
              <span style={{ fontWeight: 700 }}>Technology risk</span> mitigated through hyperscaler collaboration.<br/>
              <span style={{ fontWeight: 700 }}>Market risk</span> reduced through sovereign-backed pipeline.
            </div>
          </div>
        </div>

      </div>

    </Panel>
  );
}
