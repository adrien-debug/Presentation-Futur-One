"use client";

import React from "react";
import Panel from "../Panel";
import {
  INSIDE_LEFT_HERO_BAR_BOTTOM_MM,
  INSIDE_LEFT_HERO_BAR_COLUMN_GAP_MM,
  INSIDE_LEFT_HERO_BAR_DESC_PT,
  INSIDE_LEFT_HERO_BAR_GAP_MM,
  INSIDE_LEFT_HERO_BAR_LABEL_PT,
  INSIDE_LEFT_HERO_BAR_PADDING_Y_MM,
  INSIDE_LEFT_HERO_BODY_MARGIN_BOTTOM_MM,
  INSIDE_LEFT_HERO_BODY_PT,
  INSIDE_LEFT_HERO_EYEBROW_MAX_WIDTH_PCT,
  INSIDE_LEFT_HERO_EYEBROW_ROW_PT,
  INSIDE_LEFT_HERO_INDEX_MARGIN_LEFT_MM,
  INSIDE_LEFT_HERO_KICKER_MARGIN_BOTTOM_MM,
  INSIDE_LEFT_HERO_KICKER_PT,
  INSIDE_LEFT_HERO_LEAD_MARGIN_BOTTOM_MM,
  INSIDE_LEFT_HERO_LEAD_PT,
  INSIDE_LEFT_HERO_OVERLAY_BACKGROUNDS,
  INSIDE_LEFT_HERO_QUOTE_PT,
  INSIDE_LEFT_HERO_STACK_MAX_WIDTH_MM,
  INSIDE_LEFT_HERO_STACK_TOP_MM,
  INSIDE_LEFT_HERO_STACK_WIDTH_PCT,
  INSIDE_LEFT_HERO_TITLE_LH,
  INSIDE_LEFT_HERO_TITLE_LINE1_PT,
  INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_LEFT_MM,
  INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_TOP_MM,
  INSIDE_LEFT_HERO_TITLE_LINE2_PT,
  INSIDE_LEFT_HERO_TITLE_MAX_WIDTH_MM,
  INSIDE_LEFT_HERO_TITLE_TOP_MM,
  INSIDE_LEFT_HERO_TITLE_WIDTH_PCT,
  INSIDE_LEFT_NARRATIVE_BODY_PT,
  INSIDE_LEFT_NARRATIVE_CLOSING_MARGIN_TOP_MM,
  INSIDE_LEFT_NARRATIVE_CLOSING_PT,
  INSIDE_LEFT_NARRATIVE_KEY_MARGIN_BOTTOM_MM,
  INSIDE_LEFT_NARRATIVE_KEY_MARGIN_TOP_MM,
  INSIDE_LEFT_NARRATIVE_KEY_PT,
  INSIDE_LEFT_NARRATIVE_SECTION_TITLE_MARGIN_BOTTOM_MM,
  INSIDE_LEFT_NARRATIVE_STAT_MARGIN_TOP_MM,
  INSIDE_LEFT_NARRATIVE_STAT_PT,
  INSIDE_LEFT_OPPORTUNITY_BAND_MM,
  INSIDE_LEFT_OPPORTUNITY_BEFORE_GRID_GAP_MM,
  INSIDE_LEFT_OPPORTUNITY_BODY_GAP_AFTER_MM,
  INSIDE_LEFT_OPPORTUNITY_CAPTION_BEFORE_MM,
  INSIDE_LEFT_OPPORTUNITY_CAPTION_PT,
  INSIDE_LEFT_OPPORTUNITY_CONTENT_TOP_MM,
  INSIDE_LEFT_OPPORTUNITY_FILIGREE_LH,
  INSIDE_LEFT_OPPORTUNITY_FILIGREE_OPACITY,
  INSIDE_LEFT_OPPORTUNITY_FILIGREE_PT,
  INSIDE_LEFT_OPPORTUNITY_GRID_GAP_MM,
  INSIDE_LEFT_OPPORTUNITY_GRID_PADDING_Y_MM,
  INSIDE_LEFT_OPPORTUNITY_HEAD_GAP_AFTER_MM,
  INSIDE_LEFT_OPPORTUNITY_HLOGO_RIGHT_MM,
  INSIDE_LEFT_OPPORTUNITY_HLOGO_SIZE_MM,
  INSIDE_LEFT_OPPORTUNITY_HLOGO_TOP_MM,
  INSIDE_LEFT_OPPORTUNITY_ITALIC_LH,
  INSIDE_LEFT_OPPORTUNITY_ITALIC_PT,
  INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_BAR_MM,
  INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_NUMBER_MM,
  INSIDE_LEFT_OPPORTUNITY_KPI_BAR_HEIGHT_MM,
  INSIDE_LEFT_OPPORTUNITY_KPI_BAR_WIDTH_PCT,
  INSIDE_LEFT_OPPORTUNITY_KPI_PT,
  INSIDE_LEFT_OPPORTUNITY_LEAD_PT,
  INSIDE_LEFT_OPPORTUNITY_RULE_HEIGHT_MM,
  INSIDE_LEFT_OPPORTUNITY_RULE_TOP_MM,
  INSIDE_LEFT_OPPORTUNITY_SECTOR_GRID_TEMPLATE,
  INSIDE_LEFT_OPPORTUNITY_SECTOR_LABEL_PT,
  INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM,
  INSIDE_LEFT_WHY_CAPITAL_GAP_MM,
  INSIDE_LEFT_WHY_NOW_TOP_MM,
  TYPO_LINE_HEIGHT_DISPLAY_HERO,
  TYPO_LINE_HEIGHT_FOOTNOTE,
  TYPO_LINE_HEIGHT_LEAD,
  TYPO_LINE_HEIGHT_NARRATIVE,
  TYPO_LINE_HEIGHT_RELAXED,
  TYPO_LINE_HEIGHT_TIGHT,
  TYPO_LS_CAPTION,
  TYPO_LS_DISPLAY,
  TYPO_LS_DISPLAY_TIGHT,
  TYPO_LS_NARRATIVE,
  TYPO_LS_QUOTE,
  TYPO_LS_UPPER_KICKER,
  TYPO_LS_UPPER_NORMAL,
  TYPO_LS_UPPER_TIGHT,
  TYPO_LS_UPPER_WIDE,
  TYPO_OPACITY_TEXT_HIGH,
  TYPO_OPACITY_TEXT_LOW,
  TYPO_OPACITY_TEXT_MED,
  margin,
  marginNegative,
  mm,
} from "../design-tokens";
import {
  Eyebrow,
  FONT,
  HLogo,
  HeroBarIconCompute,
  HeroBarIconEnergy,
  HeroBarIconSovereignty,
  PALETTE,
} from "./shared";

export function InsideLeftPanel({ showGuides = false }: { showGuides?: boolean }) {
  const heroImg = "/leaflet-qatar/inside-left.png";
  return (
    <Panel bg={PALETTE.paper} showGuides={showGuides} label="Intérieur gauche">

      {/* Fond photo — inchangé (z-index 0) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM}mm`,
          zIndex: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      {/* Overlay au-dessus de l’image uniquement */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM}mm`,
          zIndex: 1,
          background: INSIDE_LEFT_HERO_OVERLAY_BACKGROUNDS,
          pointerEvents: "none",
        }}
      />

      {/* En-tête : colonne gauche dense — index seul à droite */}
      <div style={{
        position: "absolute", top: margin, left: margin, right: margin,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: FONT,
          fontSize: INSIDE_LEFT_HERO_EYEBROW_ROW_PT,
          fontWeight: 700,
          letterSpacing: TYPO_LS_UPPER_NORMAL,
          lineHeight: TYPO_LINE_HEIGHT_RELAXED,
          maxWidth: INSIDE_LEFT_HERO_EYEBROW_MAX_WIDTH_PCT,
          color: PALETTE.silver,
          textAlign: "left",
        }}>
          ALIGNED WITH QATAR NATIONAL VISION 2030{" "}
          <span style={{ color: PALETTE.silver, opacity: 0.9 }}>·</span>{" "}
          <span style={{ color: PALETTE.white, fontWeight: 900, letterSpacing: TYPO_LS_UPPER_TIGHT }}>FUTUR ONE</span>
        </div>
        <div style={{ flexShrink: 0, marginLeft: mm(INSIDE_LEFT_HERO_INDEX_MARGIN_LEFT_MM) }}>
          <Eyebrow color={PALETTE.silver}>01 / 04</Eyebrow>
        </div>
      </div>

      {/* Titre : masse à gauche, 2e ligne décalée (asymétrie) */}
      <div style={{
        position: "absolute",
        top: mm(INSIDE_LEFT_HERO_TITLE_TOP_MM),
        left: margin,
        width: INSIDE_LEFT_HERO_TITLE_WIDTH_PCT,
        maxWidth: mm(INSIDE_LEFT_HERO_TITLE_MAX_WIDTH_MM),
        zIndex: 2,
        textAlign: "left",
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: INSIDE_LEFT_HERO_TITLE_LINE1_PT,
          lineHeight: INSIDE_LEFT_HERO_TITLE_LH,
          letterSpacing: TYPO_LS_DISPLAY,
          color: PALETTE.white,
          textRendering: "geometricPrecision",
        }}>
          FUTUR ONE
        </div>
        <div style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: INSIDE_LEFT_HERO_TITLE_LINE2_PT,
          lineHeight: TYPO_LINE_HEIGHT_DISPLAY_HERO,
          letterSpacing: TYPO_LS_DISPLAY_TIGHT,
          color: PALETTE.maroon,
          marginLeft: mm(INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_LEFT_MM),
          marginTop: mm(INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_TOP_MM),
          whiteSpace: "nowrap",
          textRendering: "geometricPrecision",
        }}>
          NO LIMITS, BY AI.
        </div>
      </div>

      {/* Colonne gauche : stack éditorial — plus d’air sous le titre */}
      <div style={{
        position: "absolute",
        top: mm(INSIDE_LEFT_HERO_STACK_TOP_MM),
        left: margin,
        width: INSIDE_LEFT_HERO_STACK_WIDTH_PCT,
        maxWidth: mm(INSIDE_LEFT_HERO_STACK_MAX_WIDTH_MM),
        zIndex: 2,
        textAlign: "left",
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 900,
          letterSpacing: TYPO_LS_UPPER_KICKER,
          textTransform: "uppercase",
          fontSize: INSIDE_LEFT_HERO_KICKER_PT,
          marginBottom: mm(INSIDE_LEFT_HERO_KICKER_MARGIN_BOTTOM_MM),
          color: PALETTE.white,
        }}>
          SOVEREIGN AI INFRASTRUCTURE PLATFORM
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: INSIDE_LEFT_HERO_LEAD_PT,
          fontWeight: 800,
          lineHeight: TYPO_LINE_HEIGHT_LEAD,
          color: PALETTE.white,
          marginBottom: mm(INSIDE_LEFT_HERO_LEAD_MARGIN_BOTTOM_MM),
        }}>
          Operated by Hearst Qatar with global partners — one sovereign envelope for compute, energy and infrastructure.
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: INSIDE_LEFT_HERO_BODY_PT,
          fontWeight: 600,
          lineHeight: TYPO_LINE_HEIGHT_RELAXED,
          color: `rgba(255,255,255,${TYPO_OPACITY_TEXT_MED})`,
          marginBottom: mm(INSIDE_LEFT_HERO_BODY_MARGIN_BOTTOM_MM),
        }}>
          A sovereign system designed to capture the AI economy at national scale.
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: INSIDE_LEFT_HERO_QUOTE_PT,
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: TYPO_LINE_HEIGHT_RELAXED,
          color: `rgba(255,255,255,${TYPO_OPACITY_TEXT_HIGH})`,
        }}>
          “We allocate compute, energy and HPC infrastructure to empower the next generation of founders and future industry leaders.”
        </div>
      </div>

      {/* Barre système pleine largeur — colonnes : icône + label + légende centrés */}
      <div style={{
        position: "absolute",
        left: margin,
        right: margin,
        bottom: `${INSIDE_LEFT_HERO_BAR_BOTTOM_MM}mm`,
        zIndex: 2,
      }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            width: "100%",
            paddingTop: mm(INSIDE_LEFT_HERO_BAR_PADDING_Y_MM),
            paddingBottom: mm(INSIDE_LEFT_HERO_BAR_PADDING_Y_MM),
            gap: mm(INSIDE_LEFT_HERO_BAR_GAP_MM),
          }}
        >
          {[
            { Icon: HeroBarIconCompute, label: "COMPUTE", desc: "High-density HPC infrastructure", lab: PALETTE.white },
            { Icon: HeroBarIconEnergy, label: "ENERGY", desc: "Sovereign energy infrastructure", lab: PALETTE.white },
            { Icon: HeroBarIconSovereignty, label: "SOVEREIGNTY", desc: "Qatar-controlled ecosystem", lab: PALETTE.white },
          ].map(({ Icon, label, desc, lab }) => (
            <div
              key={label}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                gap: mm(INSIDE_LEFT_HERO_BAR_COLUMN_GAP_MM),
              }}
            >
              <span style={{ color: PALETTE.white, lineHeight: 0, display: "flex", justifyContent: "center" }}>
                <Icon />
              </span>
              <div style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: INSIDE_LEFT_HERO_BAR_LABEL_PT,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: lab,
                lineHeight: TYPO_LINE_HEIGHT_TIGHT,
                width: "100%",
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: INSIDE_LEFT_HERO_BAR_DESC_PT,
                fontWeight: 600,
                lineHeight: TYPO_LINE_HEIGHT_DISPLAY_HERO,
                color: `rgba(255,255,255,${TYPO_OPACITY_TEXT_LOW})`,
                whiteSpace: "nowrap",
                width: "100%",
              }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why now + Capital Discipline — colonne ; rythme vertical : pas de padding horizontal parasite */}
      <div style={{
        position: "absolute",
        top: `${INSIDE_LEFT_WHY_NOW_TOP_MM}mm`,
        left: margin,
        right: margin,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: `${INSIDE_LEFT_WHY_CAPITAL_GAP_MM}mm`,
        padding: 0,
        margin: 0,
      }}>
        <section style={{ margin: 0, padding: 0 }}>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_BODY_PT,
            fontWeight: 900,
            letterSpacing: TYPO_LS_NARRATIVE,
            textTransform: "uppercase",
            color: PALETTE.maroon,
            margin: `0 0 ${mm(INSIDE_LEFT_NARRATIVE_SECTION_TITLE_MARGIN_BOTTOM_MM)} 0`,
          }}>
            Why now
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_BODY_PT,
            fontWeight: 500,
            lineHeight: TYPO_LINE_HEIGHT_NARRATIVE,
            color: PALETTE.textInk,
            margin: 0,
          }}>
            AI infrastructure is entering structural scarcity.
            <br />
            Capital is concentrating. Talent is relocating.
            <br /><br />
            Nations that fail to build integrated ecosystems will lose long-term strategic positioning.
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_STAT_PT,
            fontWeight: 800,
            lineHeight: TYPO_LINE_HEIGHT_RELAXED,
            color: PALETTE.maroon,
            margin: `${mm(INSIDE_LEFT_NARRATIVE_STAT_MARGIN_TOP_MM)} 0 0 0`,
          }}>
            Global AI compute demand is expected to increase ×4.2 by 2030.
          </div>
        </section>

        <section style={{ margin: 0, padding: 0 }}>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_BODY_PT,
            fontWeight: 900,
            letterSpacing: TYPO_LS_NARRATIVE,
            textTransform: "uppercase",
            color: PALETTE.maroon,
            margin: `0 0 ${mm(INSIDE_LEFT_NARRATIVE_SECTION_TITLE_MARGIN_BOTTOM_MM)} 0`,
          }}>
            Capital Discipline
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_BODY_PT,
            fontWeight: 600,
            lineHeight: TYPO_LINE_HEIGHT_NARRATIVE,
            color: PALETTE.textInk,
            margin: 0,
          }}>
            VC capital is no longer abundant.
            <br />
            It is selective, disciplined, and infrastructure-driven.
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_KEY_PT,
            fontWeight: 900,
            lineHeight: TYPO_LINE_HEIGHT_NARRATIVE,
            color: PALETTE.maroon,
            margin: `${mm(INSIDE_LEFT_NARRATIVE_KEY_MARGIN_TOP_MM)} 0 ${mm(INSIDE_LEFT_NARRATIVE_KEY_MARGIN_BOTTOM_MM)} 0`,
          }}>
            Access to capital now depends on infrastructure, execution and sovereign alignment.
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: INSIDE_LEFT_NARRATIVE_CLOSING_PT,
            fontWeight: 500,
            lineHeight: TYPO_LINE_HEIGHT_FOOTNOTE,
            color: PALETTE.silver,
            margin: `${mm(INSIDE_LEFT_NARRATIVE_CLOSING_MARGIN_TOP_MM)} 0 0 0`,
          }}>
            For sovereign players, infrastructure is no longer a cost. It is a selection power.
          </div>
        </section>
      </div>

      {/* ═══ OPPORTUNITY — fond papier ; gris uniquement sur le bloc secteurs (TECH …) ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: `${INSIDE_LEFT_OPPORTUNITY_BAND_MM}mm`,
        backgroundColor: PALETTE.paper,
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* Filigrane typographique — discret sur fond clair */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: INSIDE_LEFT_OPPORTUNITY_FILIGREE_PT,
          color: PALETTE.textInk,
          opacity: INSIDE_LEFT_OPPORTUNITY_FILIGREE_OPACITY,
          letterSpacing: TYPO_LS_DISPLAY_TIGHT,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          lineHeight: INSIDE_LEFT_OPPORTUNITY_FILIGREE_LH,
          textAlign: "center",
          zIndex: 0,
        }}>
          OPPORTUNITY
        </div>

        {/* Filigrane H Hearst */}
        <HLogo
          size={mm(INSIDE_LEFT_OPPORTUNITY_HLOGO_SIZE_MM)}
          color={PALETTE.maroon}
          opacity={INSIDE_LEFT_OPPORTUNITY_FILIGREE_OPACITY}
          style={{
            position: "absolute",
            top: mm(INSIDE_LEFT_OPPORTUNITY_HLOGO_TOP_MM),
            right: mm(INSIDE_LEFT_OPPORTUNITY_HLOGO_RIGHT_MM),
          }}
        />

        {/* Filet d’ouverture — pleine largeur (comme la zone photo hero) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: mm(INSIDE_LEFT_OPPORTUNITY_RULE_TOP_MM),
            left: 0,
            right: 0,
            height: mm(INSIDE_LEFT_OPPORTUNITY_RULE_HEIGHT_MM),
            backgroundColor: PALETTE.maroon,
            zIndex: 2,
          }}
        />

        {/* Contenu : aligné sur la marge 16mm, sauf le bloc gris qui est full-bleed */}
        <div style={{
          position: "absolute",
          top: mm(INSIDE_LEFT_OPPORTUNITY_CONTENT_TOP_MM),
          left: margin,
          right: margin,
          bottom: 0,
          zIndex: 5,
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Eyebrow color={PALETTE.maroon}>The Opportunity</Eyebrow>
              <Eyebrow color={PALETTE.textMuted}>MENA · 2024–2030</Eyebrow>
            </div>
            <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_HEAD_GAP_AFTER_MM) }} />
            <div style={{
              fontFamily: FONT, fontStyle: "italic", fontWeight: 300,
              fontSize: INSIDE_LEFT_OPPORTUNITY_ITALIC_PT, lineHeight: INSIDE_LEFT_OPPORTUNITY_ITALIC_LH, color: PALETTE.textInk,
              letterSpacing: TYPO_LS_QUOTE,
            }}>
              High-potential founders.<br />
              Undercapitalized markets.<br />
              <span style={{ color: PALETTE.maroon, fontStyle: "normal", fontWeight: 700 }}>
                Sovereign-grade infrastructure.
              </span>
            </div>
            <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_BODY_GAP_AFTER_MM) }} />
            <div style={{
              fontFamily: FONT, fontSize: INSIDE_LEFT_OPPORTUNITY_LEAD_PT, fontWeight: 400,
              lineHeight: TYPO_LINE_HEIGHT_LEAD, color: PALETTE.textInk,
            }}>
              <span style={{ fontWeight: 900, color: PALETTE.textInk }}>FUTUR ONE</span> concentrates compute, capital and living infrastructure into one controlled environment designed to accelerate company creation and scale.
            </div>
          </div>

          {/* Zone secteurs : fond gris pleine largeur ; contenu interne aligné sur margin */}
          <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_BEFORE_GRID_GAP_MM) }} />
          <div style={{
            position: "relative",
            padding: `${mm(INSIDE_LEFT_OPPORTUNITY_GRID_PADDING_Y_MM)} 0`,
          }}>
            {/* Boîte grise en absolute (élément graphique sortant du cadre) */}
            <div style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: marginNegative, right: marginNegative,
              backgroundColor: PALETTE.graphite,
              zIndex: -1,
            }} />
            <div style={{
              display: "grid",
              gridTemplateColumns: INSIDE_LEFT_OPPORTUNITY_SECTOR_GRID_TEMPLATE,
              gap: mm(INSIDE_LEFT_OPPORTUNITY_GRID_GAP_MM),
            }}>
            {(
              [
                { sector: "TECH", kpi: "38%" },
                { sector: "BIOTECH", kpi: "27%" },
                { sector: "MEDTECH", kpi: "20%" },
                { sector: "CLIMATETECH", kpi: "15%" },
              ] as const
            ).map(({ sector, kpi }) => (
                <div key={sector}>
                  <div style={{
                    fontFamily: FONT, fontWeight: 900, fontSize: INSIDE_LEFT_OPPORTUNITY_KPI_PT,
                    color: PALETTE.white, letterSpacing: TYPO_LS_DISPLAY_TIGHT, lineHeight: 1,
                  }}>{kpi}</div>
                  <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_NUMBER_MM) }} />
                  <div style={{ width: INSIDE_LEFT_OPPORTUNITY_KPI_BAR_WIDTH_PCT, height: mm(INSIDE_LEFT_OPPORTUNITY_KPI_BAR_HEIGHT_MM), backgroundColor: PALETTE.maroon }} />
                  <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_BAR_MM) }} />
                  <div style={{
                    fontFamily: FONT, fontSize: INSIDE_LEFT_OPPORTUNITY_SECTOR_LABEL_PT, fontWeight: 700,
                    color: PALETTE.maroon, letterSpacing: TYPO_LS_UPPER_WIDE,
                  }}>{sector}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Source caption — alignée sur margin */}
          <div>
            <div style={{ height: mm(INSIDE_LEFT_OPPORTUNITY_CAPTION_BEFORE_MM) }} />
            <div style={{
              fontFamily: FONT, fontSize: INSIDE_LEFT_OPPORTUNITY_CAPTION_PT, fontWeight: 400,
              color: PALETTE.textMuted, letterSpacing: TYPO_LS_CAPTION,
            }}>
              Sector weights · indicative · to be aligned with latest MAGNiTT / GSER / regional outlook sources before publication. Historical framing: MENA venture reports (e.g. MAGNiTT 2024, Startup Genome GSER 2024).
            </div>
          </div>
        </div>
      </div>

    </Panel>
  );
}
