"use client";

import React from "react";
import Panel from "./Panel";

/**
 * Direction artistique : MONOLITH ÉDITORIAL
 * — Edge-to-edge, zéro safe margin respectueux.
 * — Une seule gestuelle typographique XL par panneau.
 * — Asymétrie assumée. Le contenu EST le design.
 *
 * PALETTE STRICTE : UNE seule couleur (maroon Qatar) + échelle noir/gris/blanc.
 * - Aucune variante de maroon (pas de "maroon clair" ni "maroon glow").
 * - Aucun or, aucun jaune, aucun crème.
 * - Le maroon est le SEUL signal couleur. Tout le reste = neutres.
 */
export const PALETTE = {
  // L'unique couleur — le maroon Qatar (Pantone 1955 C)
  maroon: "#8A1538",

  // Échelle neutre noir → blanc (c'est tout)
  black:    "#000000",  // noir pur (fonds, ink dense)
  ink:      "#0A0A0A",  // ink doux (fonds alternatifs)
  charcoal: "#1A1A1A",  // gris très foncé
  graphite: "#222222",  // Plus dense pour l'impression
  ash:      "#444444",  // Plus dense
  silver:   "#777777",  // Plus dense
  smoke:    "#EEEEEE",  // Presque blanc pour le texte sur noir
  fog:      "#F8F8F8",
  white:    "#FFFFFF",
};

const FONT = "'Satoshi', system-ui, sans-serif";

// Petits helpers (pas de "boxes", juste du texte stylé inline) ──────────
const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number; weight?: number }> = ({
  children, color = PALETTE.maroon, size = 8, weight = 700,
}) => (
  <span style={{
    fontFamily: FONT,
    fontSize: `${size}pt`,
    fontWeight: weight,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color,
  }}>{children}</span>
);

const Hairline = ({ length = "20mm", thickness = "0.4mm" }: { length?: string; thickness?: string }) => (
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
 *   <HLogo size="80mm" color={PALETTE.maroon} opacity={0.08}
 *          style={{ position:"absolute", top:"...", right:"..." }} />
 */
const HLogo: React.FC<{
  size?: string;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size = "40mm", color = PALETTE.maroon, opacity = 0.08, style }) => (
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

// ═════════════════════════════════════════════════════════════════════════
// COVER — gesture : « FUTUR » massif coupé par le bord droit, « ONE. » dessous
//                   en or, hairline diagonale, monogramme top-left, specs micro
//                   en bas-droite. Tout en bleed, zéro respect du cadre.
// ═════════════════════════════════════════════════════════════════════════

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

      {/* ── Overlay sombre pour lisibilité (couleur pleine, pas de dégradé complexe) ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, transparent 0%, ${PALETTE.black} 100%)`,
      }} />

      {/* ── Filigrane H Hearst ── */}
      <HLogo
        size="140mm"
        color={PALETTE.white}
        opacity={0.03}
        style={{
          position: "absolute",
          bottom: "20mm",
          right: "-50mm",
        }}
      />

      {/* ── Mark F1 top-left ── */}
      <div style={{
        position: "absolute",
        top: "16mm", left: "16mm",
        width: "24mm", height: "24mm",
        backgroundColor: PALETTE.maroon,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "24pt",
        color: PALETTE.white,
      }}>
        F1
      </div>

      {/* ── Eyebrow vertical sur la marge droite ── */}
      <div style={{
        position: "absolute",
        top: "16mm", right: "16mm",
        transform: "rotate(90deg)",
        transformOrigin: "right top",
      }}>
        <Eyebrow color={PALETTE.maroon}>Aligned with QNV 2030 · Doha</Eyebrow>
      </div>

      {/* ── « FUTUR » massif (ajusté pour ne pas déborder bizarrement) ── */}
      <div style={{
        position: "absolute",
        top: "140mm",
        left: "16mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "140pt",
        lineHeight: 0.82,
        letterSpacing: "-0.06em",
        color: PALETTE.white,
        whiteSpace: "nowrap",
      }}>
        FUTUR
      </div>

      {/* ── « ONE. » en maroon ── */}
      <div style={{
        position: "absolute",
        top: "190mm",
        left: "16mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "110pt",
        lineHeight: 0.82,
        letterSpacing: "-0.05em",
        color: PALETTE.maroon,
      }}>
        ONE.
      </div>

      {/* ── Bandeau bas : trio de specs ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        left: "16mm",
        right: "16mm",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: `0.5mm solid ${PALETTE.maroon}`,
        paddingTop: "8mm",
      }}>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "14pt", color: PALETTE.maroon }}>Tier IV</div>
          <Eyebrow color={PALETTE.silver} size={7}>Reliability</Eyebrow>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "14pt", color: PALETTE.maroon }}>48 MW</div>
          <Eyebrow color={PALETTE.silver} size={7}>Phase 1</Eyebrow>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "14pt", color: PALETTE.maroon }}>17 HA</div>
          <Eyebrow color={PALETTE.silver} size={7}>Campus</Eyebrow>
        </div>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// BACK — gesture : pull-quote en énorme italique léger, espace négatif vaste,
//                  un seul hairline d'or, coordonnées micro en bas-droit.
//                  Confidence : on n'a rien à prouver.
// ═════════════════════════════════════════════════════════════════════════

export function BackPanel({ showGuides = false }: { showGuides?: boolean }) {
  // PNG raw, servi sans compression (cf. next.config.ts unoptimized).
  const backImg = "/leaflet-qatar/back-cover.png";
  return (
    <Panel bg={PALETTE.ink} showGuides={showGuides} label="Dos">
      {/* ── PHOTO FULL BLEED ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* ── Overlay sombre dégradé ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, transparent 0%, ${PALETTE.black} 100%)`,
      }} />

      {/* ── Filigrane H Hearst ── */}
      <HLogo
        size="120mm"
        color={PALETTE.white}
        opacity={0.03}
        style={{
          position: "absolute",
          bottom: "20mm",
          right: "-50mm",
        }}
      />

      {/* ── Index top-left ── */}
      <div style={{ position: "absolute", top: "16mm", left: "16mm" }}>
        <Eyebrow color={PALETTE.maroon}>04</Eyebrow>
      </div>

      {/* ── Index miroir top-right ── */}
      <div style={{ position: "absolute", top: "16mm", right: "16mm" }}>
        <Eyebrow color={PALETTE.silver}>End</Eyebrow>
      </div>

      {/* ── Pull-quote MONUMENTAL ── */}
      <div style={{
        position: "absolute",
        top: "80mm",
        left: "16mm",
        right: "16mm",
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "60pt",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: PALETTE.white,
        }}>
          AI<br />
          is the<br />
          <span style={{ color: PALETTE.maroon, fontStyle: "normal", fontWeight: 900 }}>new gas.</span>
        </div>
        <div style={{ height: "12mm" }} />
        <Hairline length="40mm" thickness="0.5mm" />
        <div style={{ height: "6mm" }} />
        <div style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: "11pt",
          color: PALETTE.maroon,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          Compute is the infrastructure of nations.
        </div>
      </div>

      {/* ── Coordonnées en bas-droit ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        right: "16mm",
        textAlign: "right",
      }}>
        <Eyebrow color={PALETTE.maroon} size={7}>Contact</Eyebrow>
        <div style={{ height: "4mm" }} />
        <div style={{
          fontFamily: FONT,
          fontSize: "10pt",
          fontWeight: 500,
          color: PALETTE.white,
          lineHeight: 1.4,
        }}>
          Doha · Qatar<br />
          contact@futurone.qa<br />
          futurone.qa
        </div>
      </div>

      {/* ── Mention légale en bas-gauche ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        left: "16mm",
        right: "80mm",
        fontFamily: FONT,
        fontSize: "6pt",
        fontWeight: 400,
        letterSpacing: "0.1em",
        color: PALETTE.silver,
        textTransform: "uppercase",
        lineHeight: 1.4,
      }}>
        Issued under QFC Authority oversight · PDPPL Law 13/2016 compliant<br />
        © 2030 Futur One Datacenter LLC · Confidential
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// INSIDE LEFT — Manifesto sovereign + Phrase 2 VC + Opportunity
//
// Structure v4 (sovereign deal-signing) :
//  - Header eyebrow + index 01/04
//  - Title FUTUR ONE / NO LIMITS, BY AI. (twin 44pt avec Inside Right)
//  - Phrase 1 verbatim (Hub by Hearst Qatar, manifesto quote)
//  - Photo héro inside-left.png 60mm full-bleed L/R, DUOTONE maroon+noir
//  - Eyebrow vertical droite : DOHA · 17 HA · TIER IV (rotation 90°)
//  - Phrase 2 verbatim (VC selectivity context — texte seul, sans bars)
//  - Bandeau bottom Opportunity 70mm avec watermark facade duotone
//
// SUPPRIMÉS (vs v3) :
//  - Section 4 verrous (LIMITED BY TECH / DEPENDENT / HIGH COSTS / CREATIVITY)
//  - Bars Before AI / With AI (migrent vers schéma incubation Inside Right)
// ═════════════════════════════════════════════════════════════════════════

export function InsideLeftPanel({ showGuides = false }: { showGuides?: boolean }) {
  const heroImg = "/leaflet-qatar/inside-left.png";
  const bgImg   = "/leaflet-qatar/cover-facade.png";
  return (
    <Panel bg={PALETTE.black} showGuides={showGuides} label="Intérieur gauche">

      {/* ═══ TOP : eyebrow + index ═══ */}
      <div style={{
        position: "absolute", top: "16mm", left: "16mm", right: "16mm",
        display: "flex", justifyContent: "space-between",
      }}>
        <Eyebrow color={PALETTE.maroon}>Aligned with QNV 2030</Eyebrow>
        <Eyebrow color={PALETTE.silver}>01 / 04</Eyebrow>
      </div>

      {/* ── Title twin (Asymétrie : plus haut que la droite) ── */}
      <div style={{
        position: "absolute", top: "24mm", left: "16mm", right: "16mm",
        fontFamily: FONT, fontWeight: 900, fontSize: "44pt",
        lineHeight: 0.82, letterSpacing: "-0.04em", color: PALETTE.white,
        zIndex: 2,
      }}>
        FUTUR ONE<br />
        <span style={{ color: PALETTE.maroon }}>NO LIMITS, BY AI.</span>
      </div>

      {/* ── Eyebrow vertical droite ── */}
      <div style={{
        position: "absolute", top: "60mm", right: "16mm",
        transform: "rotate(90deg)",
        transformOrigin: "right top",
      }}>
        <Eyebrow color={PALETTE.maroon} size={7}>Doha · 17 HA · Tier IV</Eyebrow>
      </div>

      {/* ── PHRASE 1 ── */}
      <div style={{
        position: "absolute", top: "54mm", left: "16mm", right: "32mm",
        fontFamily: FONT, fontSize: "9pt", fontWeight: 400,
        lineHeight: 1.5, color: PALETTE.white,
        zIndex: 2,
      }}>
        <span style={{ fontWeight: 900 }}>FUTUR ONE</span> is an AI sovereign innovation hub operated by <span style={{ fontWeight: 900 }}>Hearst Qatar</span> in partnership with top-tier global players.
        <br /><br />
        <span style={{ fontStyle: "italic", fontWeight: 300 }}>
          « We will allocate compute capacity, energy, and HPC infrastructure to support the development of your projects at the scale required to empower the next generation of founders and future industry leaders. »
        </span>
      </div>

      {/* ── WHY NOW (NEW) ── */}
      <div style={{
        position: "absolute", top: "84mm", left: "16mm", right: "16mm",
        fontFamily: FONT, fontSize: "8pt", fontWeight: 400,
        lineHeight: 1.2, color: PALETTE.silver,
        zIndex: 2,
      }}>
        AI infrastructure is entering a phase of structural scarcity.<br />
        Capital is concentrating. Talent is relocating.<br /><br />
        Nations that fail to build integrated ecosystems<br />
        will lose long-term strategic positioning.<br /><br />
        <span style={{ color: PALETTE.maroon }}>Global AI compute demand is expected to increase ×4.2 by 2030.</span><br />
        <span style={{ fontSize: "6pt" }}>(Source: IDC)</span>
      </div>

      {/* ═══ PHOTO HERO ═══ */}
      <div style={{
        position: "absolute", top: "116mm", left: 0, right: 0,
        height: "35mm",
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: PALETTE.maroon,
          mixBlendMode: "multiply",
          opacity: 0.4,
        }} />
        <div style={{
          position: "absolute", bottom: "4mm", right: "16mm",
          fontFamily: FONT, fontSize: "6pt", fontWeight: 700,
          letterSpacing: "0.15em", color: PALETTE.white, textTransform: "uppercase",
        }}>
          Compute infrastructure · High-density racks · Tier IV
        </div>
      </div>

      {/* ═══ PHRASE 2 ═══ */}
      <div style={{
        position: "absolute", top: "156mm", left: "16mm", right: "16mm",
      }}>
        <Hairline length="100%" thickness="0.5mm" />
        <div style={{ height: "4mm" }} />
        <Eyebrow color={PALETTE.maroon}>Capital Discipline</Eyebrow>
        <div style={{ height: "2mm" }} />
        <div style={{
          fontFamily: FONT, fontSize: "10pt", fontWeight: 400,
          lineHeight: 1.5, color: PALETTE.white,
        }}>
          VCs are becoming increasingly selective, prioritizing <span style={{ fontWeight: 900 }}>capital efficiency</span>
          {" "}and <span style={{ fontWeight: 900 }}>sustainable business models</span>
          {" "}amid a more disciplined funding environment.
          <br /><br />
          <span style={{ fontWeight: 700, color: PALETTE.maroon }}>Access to capital now depends on infrastructure, execution and sovereign alignment.</span>
        </div>
      </div>

      {/* ═══ OPPORTUNITY 100mm — tagline + body + 4 secteurs + source + watermark ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "100mm",
        backgroundColor: PALETTE.ink,
        overflow: "hidden",
      }}>
        {/* Titre de section MASSIF en arrière-plan */}
        <div style={{
          position: "absolute", top: "5mm", left: "-10mm",
          fontFamily: FONT, fontWeight: 900, fontSize: "110pt",
          color: PALETTE.white, opacity: 0.05, letterSpacing: "-0.05em",
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>
          OPPORTUNITY
        </div>
        {/* Watermark facade */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.20,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, ${PALETTE.ink}E5 0%, ${PALETTE.ink}F2 100%)`,
        }} />

        {/* Filigrane H Hearst */}
        <HLogo
          size="80mm"
          color={PALETTE.maroon}
          opacity={0.03}
          style={{
            position: "absolute",
            top: "20mm",
            right: "-50mm",
          }}
        />

        {/* Contenu */}
        <div style={{
          position: "absolute",
          top: "10mm", left: "16mm", right: "16mm", bottom: "8mm",
        }}>
          <div style={{ 
            position: "absolute", top: "0", left: "-16mm", right: "0",
            height: "0.8mm", backgroundColor: PALETTE.maroon
          }} />
          <div style={{ height: "8mm" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Eyebrow color={PALETTE.maroon}>The Opportunity</Eyebrow>
            <Eyebrow color={PALETTE.silver} size={6}>MENA · 2024–2030</Eyebrow>
          </div>
          <div style={{ height: "6mm" }} />
          <div style={{
            fontFamily: FONT, fontStyle: "italic", fontWeight: 300,
            fontSize: "20pt", lineHeight: 1.1, color: PALETTE.white,
            letterSpacing: "-0.02em",
          }}>
            High-potential founders.<br />
            Undercapitalized markets.<br />
            <span style={{ color: PALETTE.maroon, fontStyle: "normal", fontWeight: 700 }}>
              Sovereign-grade infrastructure.
            </span>
          </div>
          <div style={{ height: "5mm" }} />
          <div style={{
            fontFamily: FONT, fontSize: "8.5pt", fontWeight: 400,
            lineHeight: 1.4, color: PALETTE.white,
          }}>
            <span style={{ fontWeight: 900 }}>FUTUR ONE</span> concentrates compute, capital and living infrastructure into one controlled environment designed to accelerate company creation and scale.
          </div>

          {/* 4 secteurs % visualisation */}
          <div style={{ height: "5mm" }} />
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4mm",
          }}>
            {["TECH", "BIOTECH", "MEDTECH", "CLIMATETECH"].map((sector) => (
              <div key={sector}>
                <div style={{
                  fontFamily: FONT, fontWeight: 900, fontSize: "28pt",
                  color: PALETTE.white, letterSpacing: "-0.04em", lineHeight: 1,
                }}>__%</div>
                <div style={{ height: "3mm" }} />
                <div style={{ width: "40%", height: "1.5mm", backgroundColor: PALETTE.maroon }} />
                <div style={{ height: "3mm" }} />
                <div style={{
                  fontFamily: FONT, fontSize: "7pt", fontWeight: 700,
                  color: PALETTE.maroon, letterSpacing: "0.15em",
                }}>{sector}</div>
              </div>
            ))}
          </div>

          {/* Source caption */}
          <div style={{ height: "4mm" }} />
          <div style={{
            fontFamily: FONT, fontSize: "5pt", fontWeight: 400,
            color: PALETTE.silver, letterSpacing: "0.04em",
          }}>
            % high-potential start-ups underfunded by sector · 2025 · sources : MAGNiTT MENA Venture Investment Report 2024 · Startup Genome GSER 2024 · McKinsey MENA Tech Outlook 2030.
          </div>
        </div>
      </div>

    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// INSIDE RIGHT — THE METHOD (incubation schema + retention proof + closing)
//
// Structure v4 (sovereign deal-signing) :
//  - Header eyebrow + index 02/04
//  - Title THE METHOD. (twin 44pt avec Inside Left — Pentagram OpenSpace 2020)
//  - Phrase 3 verbatim raccourci (Hearst Qatar develops largest DC)
//  - SCHÉMA INCUBATION (100mm) :
//      * Comparison strip MENA accelerator avg ~30% vs FUTUR ONE 70% follow-on funding rate at 18 mo
//      * Timeline hairline + chiffres 36pt 4 stages (Mevis & Van Deursen, AUCUNE card)
//      * Ratios strip + benchmarks YC/Antler/MISK
//  - Bandeau noir bleed bottom 70mm avec watermark facade duotone :
//      * BUILT BY (Hearst Qatar · Norman Foster · JB Pastor — fallback texte)
//      * Technology stack (In discussion with Tier-1 hyperscalers — pas de marques tant que LOI/MoU non signés)
//      * 4 KPIs (150 startups · 4K residents · 100K SQM · €400M)
//      * Punchline « Sovereign by design. Global by intent. »
//      * Qatar Label (0% TAX · FAST SETUP · HOUSING · etc.)
//
// + Filet maroon vertical 0.5mm au pli (côté gauche page) — M/M Paris pour Vuitton
// ═════════════════════════════════════════════════════════════════════════

export function InsideRightPanel({ showGuides = false }: { showGuides?: boolean }) {
  const bgImg = "/leaflet-qatar/cover-facade.png";

  // 4 stages d'incubation (sourcé du PDF V3)
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
    <Panel bg={PALETTE.white} showGuides={showGuides} label="Intérieur droit">

      {/* ── Filet maroon vertical au pli central (côté gauche) ── */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: "0.5mm", backgroundColor: PALETTE.maroon,
      }} />

      {/* ═══ HEADER COMPRESSÉ ═══ */}
      <div style={{
        position: "absolute", top: "16mm", left: "16mm", right: "16mm",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderBottom: `0.5mm solid ${PALETTE.maroon}`,
        paddingBottom: "4mm",
        backgroundColor: `${PALETTE.maroon}05`, // subtle maroon bg
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: "44pt",
          lineHeight: 0.8, letterSpacing: "-0.04em", color: PALETTE.ink,
        }}>
          THE <span style={{ color: PALETTE.maroon }}>METHOD.</span>
        </div>
        <Eyebrow color={PALETTE.silver}>02 / 04</Eyebrow>
      </div>

      {/* ── PHRASE 3 ── */}
      <div style={{
        position: "absolute", top: "38mm", left: "16mm", right: "16mm",
        fontFamily: FONT, fontSize: "8.5pt", fontWeight: 400,
        lineHeight: 1.4, color: PALETTE.graphite,
      }}>
        <span style={{ color: PALETTE.ink, fontWeight: 700 }}>Hearst Qatar</span>
        {" "}is developing one of the largest data centers in the region to provide dedicated energy and{" "}
        <span style={{ color: PALETTE.ink, fontWeight: 700 }}>HPC capacity</span>
        {" "}to startups, established enterprises, and major private-sector players establishing operations locally, with sovereign wealth funds as anchor stakeholders.
        <br /><br />
        <span style={{ color: PALETTE.maroon, fontWeight: 700 }}>This ensures priority access to compute, long-term cost control and strategic independence.</span>
      </div>

      {/* ═══ DATA MATRIX & TABLEAU TECHNIQUE ═══ */}
      <div style={{
        position: "absolute", top: "66mm", left: "16mm", right: "16mm",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Eyebrow color={PALETTE.maroon}>Follow-on funding rate at 18 months</Eyebrow>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "20pt", color: PALETTE.maroon, lineHeight: 0.8 }}>70%</div>
        </div>
        <div style={{ height: "2mm" }} />
        
        {/* Data Matrix + Quote côte à côte */}
        <div style={{ display: "flex", gap: "6mm" }}>
          <div style={{ width: "25mm" }}>
            <Eyebrow color={PALETTE.silver} size={4}>MENA (~30%)</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5mm" }}>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={i} style={{ aspectRatio: "1", backgroundColor: i < 30 ? PALETTE.silver : PALETTE.smoke }} />
              ))}
            </div>
          </div>
          <div style={{ width: "25mm" }}>
            <Eyebrow color={PALETTE.maroon} size={4}>FUTUR ONE (70%)</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "0.5mm" }}>
              {Array.from({ length: 100 }, (_, i) => (
                <div key={i} style={{ aspectRatio: "1", backgroundColor: i < 70 ? PALETTE.maroon : PALETTE.smoke }} />
              ))}
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: "6mm", borderLeft: `0.5mm solid ${PALETTE.smoke}`, display: "flex", alignItems: "center" }}>
            <div style={{
              fontFamily: FONT, fontStyle: "italic", fontWeight: 300,
              fontSize: "11pt", lineHeight: 1.2, color: PALETTE.maroon,
            }}>
              “We will be the world’s first fully AI-managed campus, orchestrating every dimension from sports and health to energy optimization and beyond.”
            </div>
          </div>
        </div>

        <div style={{ height: "4mm" }} />

        {/* Tableau technique ultra-dense */}
        <div style={{ borderTop: `0.5mm solid ${PALETTE.ink}`, borderBottom: `0.5mm solid ${PALETTE.ink}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.5fr 1fr 1fr 1fr", padding: "1mm 0", borderBottom: `0.2mm solid ${PALETTE.smoke}` }}>
            <Eyebrow color={PALETTE.silver} size={4}>ID</Eyebrow>
            <Eyebrow color={PALETTE.silver} size={4}>PHASE</Eyebrow>
            <Eyebrow color={PALETTE.silver} size={4}>STAGE</Eyebrow>
            <Eyebrow color={PALETTE.silver} size={4}>DURATION</Eyebrow>
            <Eyebrow color={PALETTE.silver} size={4}>CAPACITY</Eyebrow>
          </div>
          {stages.map((s, i) => (
            <div key={s.n} style={{ 
              display: "grid", gridTemplateColumns: "0.5fr 1.5fr 1fr 1fr 1fr", padding: "1.5mm 0",
              borderBottom: i < stages.length - 1 ? `0.2mm solid ${PALETTE.smoke}` : "none",
              alignItems: "center"
            }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "8pt", color: PALETTE.maroon }}>{s.n}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "6pt", color: PALETTE.ink, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: "6pt", color: PALETTE.graphite }}>{s.stage}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: "6pt", color: PALETTE.graphite }}>{s.duration}</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: "6pt", color: PALETTE.graphite }}>{s.batch}</div>
            </div>
          ))}
        </div>

        <div style={{ height: "4mm" }} />
        
        {/* Nouveaux blocs: Selection, Doctrine, Timeline, Risk */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm" }}>
          <div>
            <Eyebrow color={PALETTE.maroon} size={5}>Selection</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ fontFamily: FONT, fontSize: "6.5pt", color: PALETTE.graphite, lineHeight: 1.3 }}>
              Capacity is intentionally capped at 150 startups<br/>
              to maximize performance, capital efficiency and ecosystem quality.<br/>
              <span style={{ fontWeight: 700 }}>Selection ratio: ~1/200 applicants.</span>
            </div>
          </div>
          <div>
            <Eyebrow color={PALETTE.maroon} size={5}>Doctrine</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ fontFamily: FONT, fontSize: "6.5pt", color: PALETTE.ink, textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1.3, fontWeight: 700 }}>
              Performance<br/>
              Wellbeing<br/>
              Social Integration
            </div>
          </div>
        </div>

        <div style={{ height: "3mm" }} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm" }}>
          <div>
            <Eyebrow color={PALETTE.maroon} size={5}>Timeline</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ fontFamily: FONT, fontSize: "6.5pt", color: PALETTE.graphite, lineHeight: 1.3 }}>
              <span style={{ fontWeight: 700 }}>Phase 1</span> — Core Campus &amp; AI Systems: 2027<br/>
              <span style={{ fontWeight: 700 }}>Phase 2</span> — Full Campus Expansion: 2030
            </div>
          </div>
          <div>
            <Eyebrow color={PALETTE.maroon} size={5}>Risk Management</Eyebrow>
            <div style={{ height: "1mm" }} />
            <div style={{ fontFamily: FONT, fontSize: "6pt", color: PALETTE.graphite, lineHeight: 1.3 }}>
              <span style={{ fontWeight: 700 }}>Construction risk</span> managed by Hearst Qatar and Tier-1 partners.<br/>
              <span style={{ fontWeight: 700 }}>Technology risk</span> mitigated through hyperscaler collaboration.<br/>
              <span style={{ fontWeight: 700 }}>Market risk</span> reduced through sovereign-backed pipeline.
            </div>
          </div>
        </div>

      </div>

      {/* ═══ BANDEAU BOTTOM DENSIFIÉ (90mm) ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "90mm",
        backgroundColor: PALETTE.ink, overflow: "hidden",
      }}>
        {/* Titre de section MASSIF en arrière-plan */}
        <div style={{
          position: "absolute", top: "5mm", right: "-10mm",
          fontFamily: FONT, fontWeight: 900, fontSize: "140pt",
          color: PALETTE.white, opacity: 0.03, letterSpacing: "-0.05em",
          whiteSpace: "nowrap", pointerEvents: "none", textAlign: "right",
        }}>
          CAMPUS
        </div>
        {/* Photo facade duotone watermark */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, ${PALETTE.ink}E5 0%, ${PALETTE.ink}F2 100%)`,
        }} />

        {/* Filigrane H Hearst */}
        <HLogo size="120mm" color={PALETTE.maroon} opacity={0.03} style={{ position: "absolute", top: "10mm", right: "-40mm" }} />

        {/* Contenu */}
        <div style={{ position: "absolute", top: "8mm", left: "16mm", right: "16mm", bottom: "8mm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          
          <div>
            <div style={{ position: "absolute", top: "-8mm", left: "0", right: "-16mm", height: "0.8mm", backgroundColor: PALETTE.maroon }} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "6mm" }}>
              <div>
                <Eyebrow color={PALETTE.maroon} size={6}>Built by</Eyebrow>
                <div style={{ height: "2mm" }} />
                <div style={{ fontFamily: FONT, fontSize: "8pt", fontWeight: 500, color: PALETTE.white, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>Hearst Qatar</span> — Sovereign Project Initiator &amp; Strategic Operator<br/>
                  Designed by Pritzker Prize architect <span style={{ fontWeight: 700 }}>Lord Norman Foster</span><br/>
                  Engineering &amp; Construction by <span style={{ fontWeight: 700 }}>JB Pastor &amp; Fils, Monaco</span>
                </div>
              </div>
              <div>
                <Eyebrow color={PALETTE.silver} size={6}>Technology stack</Eyebrow>
                <div style={{ height: "2mm" }} />
                <div style={{ fontFamily: FONT, fontSize: "8pt", fontWeight: 500, color: PALETTE.silver, lineHeight: 1.4 }}>
                  In discussion with Tier-1 hyperscalers and silicon partners.
                </div>
              </div>
            </div>
          </div>

          {/* Grille KPIs Extrême */}
          <div>
            <Hairline length="100%" thickness="0.3mm" />
            <div style={{ height: "3mm" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm" }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ borderLeft: `1px solid ${PALETTE.charcoal}`, paddingLeft: "3mm" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "32pt", color: PALETTE.white, lineHeight: 0.9, letterSpacing: "-0.04em" }}>{k.v}</div>
                  <div style={{ height: "1mm" }} />
                  <div style={{ fontFamily: FONT, fontSize: "5.5pt", fontWeight: 700, color: PALETTE.maroon, textTransform: "uppercase", letterSpacing: "0.15em" }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Punchline & Label */}
          <div>
            <Hairline length="100%" thickness="0.3mm" />
            <div style={{ height: "3mm" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: "20pt", lineHeight: 1.05, color: PALETTE.white, letterSpacing: "-0.02em" }}>
                Built in Qatar.<br />
                <span style={{ color: PALETTE.maroon, fontWeight: 900 }}>Scaled to the world.</span>
              </div>
              <div style={{ textAlign: "right", maxWidth: "55%" }}>
                <div style={{ fontFamily: FONT, fontSize: "5.5pt", fontWeight: 500, color: PALETTE.ash, letterSpacing: "0.1em", lineHeight: 1.4 }}>
                  <span style={{ color: PALETTE.silver, fontWeight: 700 }}>QATAR LABEL PROGRAM</span> · Official certification for high-potential companies.<br/>
                  • 0% tax environment • Fast company setup &amp; full ownership<br/>
                  • Housing, education, healthcare packages
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Panel>
  );
}
