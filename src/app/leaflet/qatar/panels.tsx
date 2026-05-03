"use client";

import React from "react";
import Panel from "./Panel";

/**
 * Direction artistique : MONOLITH ÉDITORIAL
 * — Edge-to-edge, zéro safe margin respectueux.
 * — Une seule gestuelle typographique XL par panneau.
 * — Asymétrie assumée. Hairlines or. Couleur pleine.
 * — Pas de "boxes". Le contenu EST le design.
 */
export const PALETTE = {
  ink:        "#0A0507",
  inkSoft:    "#1A1014",
  maroonDeep: "#3F0A14",
  maroon:     "#8A1538",
  maroonHi:   "#B53556",
  amber:      "#E89F2E",
  gold:       "#FFC93C",
  cream:      "#F5DEB3",
  paper:      "#FAF6EE",
  paperWarm:  "#F4EDE0",
  ash:        "#6B6B6B",
};

const FONT = "'Satoshi', system-ui, sans-serif";

// Petits helpers (pas de "boxes", juste du texte stylé inline) ──────────
const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children, color = PALETTE.gold, size = 8,
}) => (
  <span style={{
    fontFamily: FONT,
    fontSize: `${size}pt`,
    fontWeight: 500,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color,
  }}>{children}</span>
);

const HairlineGold = ({ length = "20mm", thickness = "0.4mm" }: { length?: string; thickness?: string }) => (
  <div style={{ width: length, height: thickness, backgroundColor: PALETTE.gold }} />
);

// ═════════════════════════════════════════════════════════════════════════
// COVER — gesture : « FUTUR » massif coupé par le bord droit, « ONE. » dessous
//                   en or, hairline diagonale, monogramme top-left, specs micro
//                   en bas-droite. Tout en bleed, zéro respect du cadre.
// ═════════════════════════════════════════════════════════════════════════

export function CoverPanel({ showGuides = false }: { showGuides?: boolean }) {
  return (
    <Panel bg={PALETTE.maroonDeep} showGuides={showGuides} label="Couverture">
      {/* ── Mark F1 top-left, MASSIF (40mm) ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "40mm", height: "40mm",
        backgroundColor: PALETTE.maroon,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "30pt",
        color: PALETTE.cream,
        letterSpacing: "-0.05em",
      }}>
        F1
      </div>

      {/* ── Eyebrow vertical sur la marge droite ── */}
      <div style={{
        position: "absolute",
        top: "20mm", right: "8mm",
        transform: "rotate(90deg)",
        transformOrigin: "right top",
      }}>
        <Eyebrow color={PALETTE.gold + "BB"}>Manifesto · Vision 2030 · Doha</Eyebrow>
      </div>

      {/* ── Hairline diagonale d'or qui traverse la moitié haute ── */}
      <div style={{
        position: "absolute",
        top: "50mm", left: "0",
        width: "70%",
        height: "0.3mm",
        backgroundColor: PALETTE.gold,
        transform: "rotate(-2deg)",
        transformOrigin: "left center",
      }} />

      {/* ── « FUTUR » massif, coupé par le bord droit ── */}
      <div style={{
        position: "absolute",
        top: "70mm",
        left: "-2mm",
        right: "-20mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "180pt",
        lineHeight: 0.82,
        letterSpacing: "-0.06em",
        color: PALETTE.cream,
        whiteSpace: "nowrap",
      }}>
        FUTUR
      </div>

      {/* ── « ONE. » en or, décalé à droite, plus petit ── */}
      <div style={{
        position: "absolute",
        top: "138mm",
        left: "70mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "140pt",
        lineHeight: 0.82,
        letterSpacing: "-0.05em",
        color: PALETTE.amber,
      }}>
        ONE.
      </div>

      {/* ── Sous-titre éditorial, alignement gauche, sous le titre ── */}
      <div style={{
        position: "absolute",
        top: "215mm",
        left: "16mm",
        right: "16mm",
        fontFamily: FONT,
        fontWeight: 300,
        fontSize: "22pt",
        lineHeight: 1.18,
        letterSpacing: "-0.015em",
        color: PALETTE.cream,
        maxWidth: "150mm",
      }}>
        A new infrastructure of nations,<br />
        built for the AI era.
      </div>

      {/* ── Bandeau bas : trio de specs, micro, espacé ── */}
      <div style={{
        position: "absolute",
        bottom: "12mm",
        left: "16mm",
        right: "16mm",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: `0.2mm solid ${PALETTE.gold}55`,
        paddingTop: "5mm",
      }}>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "13pt", color: PALETTE.gold, letterSpacing: "-0.02em" }}>Tier IV</div>
          <Eyebrow color={PALETTE.cream + "AA"} size={6}>Reliability</Eyebrow>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "13pt", color: PALETTE.gold, letterSpacing: "-0.02em" }}>48 MW</div>
          <Eyebrow color={PALETTE.cream + "AA"} size={6}>Phase 1</Eyebrow>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: "13pt", color: PALETTE.gold, letterSpacing: "-0.02em" }}>17 HA</div>
          <Eyebrow color={PALETTE.cream + "AA"} size={6}>Campus</Eyebrow>
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
  return (
    <Panel bg={PALETTE.ink} showGuides={showGuides} label="Dos">
      {/* ── Index discret top-left ── */}
      <div style={{ position: "absolute", top: "16mm", left: "16mm" }}>
        <Eyebrow color={PALETTE.gold}>04</Eyebrow>
      </div>

      {/* ── Index miroir top-right ── */}
      <div style={{ position: "absolute", top: "16mm", right: "16mm" }}>
        <Eyebrow color={PALETTE.cream + "55"}>End</Eyebrow>
      </div>

      {/* ── Pull-quote MONUMENTAL ── */}
      <div style={{
        position: "absolute",
        top: "75mm",
        left: "16mm",
        right: "16mm",
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "44pt",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: PALETTE.cream,
        }}>
          AI<br />
          is the<br />
          <span style={{ color: PALETTE.amber }}>new gas.</span>
        </div>
        <div style={{ height: "16mm" }} />
        <HairlineGold length="30mm" thickness="0.5mm" />
        <div style={{ height: "5mm" }} />
        <div style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: "10pt",
          color: PALETTE.gold,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          Compute is the infrastructure of nations.
        </div>
      </div>

      {/* ── Coordonnées en bas-droit, micro, alignées à droite ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        right: "16mm",
        textAlign: "right",
      }}>
        <Eyebrow color={PALETTE.gold} size={7}>Contact</Eyebrow>
        <div style={{ height: "3mm" }} />
        <div style={{
          fontFamily: FONT,
          fontSize: "9pt",
          fontWeight: 500,
          color: PALETTE.cream,
          lineHeight: 1.55,
          letterSpacing: "-0.005em",
        }}>
          Doha · Qatar<br />
          contact@futurone.qa<br />
          futurone.qa
        </div>
      </div>

      {/* ── Mention légale en bas-gauche, micro ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        left: "16mm",
        fontFamily: FONT,
        fontSize: "6pt",
        fontWeight: 400,
        letterSpacing: "0.2em",
        color: PALETTE.cream + "55",
        textTransform: "uppercase",
      }}>
        © 2030 Futur One Datacenter LLC · v1.0 · Confidentiel
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// INSIDE LEFT — gesture : photo data center plein bleed, "01" géant en
//                         watermark cream-translucent, titre coupé par le bord
//                         bas, pas de séparation photo/texte.
// ═════════════════════════════════════════════════════════════════════════

export function InsideLeftPanel({ showGuides = false }: { showGuides?: boolean }) {
  const dcImg = "/leaflet-qatar/datacenter.jpg";
  return (
    <Panel bg={PALETTE.ink} showGuides={showGuides} label="Intérieur gauche">
      {/* ── Photo plein bleed ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: PALETTE.maroonDeep,
        backgroundImage: `url(${dcImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* ── Overlay maroon translucide pour mood ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${PALETTE.maroonDeep}80 0%, ${PALETTE.ink}40 50%, ${PALETTE.ink}E5 100%)`,
      }} />

      {/* ── « 01 » watermark XL en arrière-plan ── */}
      <div style={{
        position: "absolute",
        top: "10mm",
        right: "10mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "240pt",
        lineHeight: 0.8,
        letterSpacing: "-0.08em",
        color: PALETTE.cream + "12",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        01
      </div>

      {/* ── Eyebrow top-left ── */}
      <div style={{ position: "absolute", top: "16mm", left: "16mm" }}>
        <Eyebrow color={PALETTE.gold}>World Before AI · Manifesto</Eyebrow>
      </div>

      {/* ── Titre coupé par le bord bas ── */}
      <div style={{
        position: "absolute",
        bottom: "70mm",
        left: "16mm",
        right: "16mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "62pt",
        lineHeight: 0.88,
        letterSpacing: "-0.035em",
        color: PALETTE.cream,
      }}>
        Quatre verrous<br />
        <span style={{ color: PALETTE.amber }}>que l'IA<br />fait sauter.</span>
      </div>

      {/* ── Liste 4 punchlines en bas, monoline éditoriale ── */}
      <div style={{
        position: "absolute",
        bottom: "16mm",
        left: "16mm",
        right: "16mm",
      }}>
        <HairlineGold length="100%" thickness="0.3mm" />
        <div style={{ height: "5mm" }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4mm 8mm",
        }}>
          {[
            ["01", "Limited by technology"],
            ["02", "Dependent on developers"],
            ["03", "High costs & delays"],
            ["04", "Creativity restricted"],
          ].map(([n, label]) => (
            <div key={n} style={{ display: "flex", alignItems: "baseline", gap: "4mm" }}>
              <span style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "11pt",
                color: PALETTE.gold,
                letterSpacing: "-0.02em",
              }}>{n}</span>
              <span style={{
                fontFamily: FONT,
                fontSize: "10pt",
                fontWeight: 400,
                color: PALETTE.cream,
                letterSpacing: "-0.005em",
              }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// INSIDE RIGHT — gesture : « ×4.2 » TITAN sur 80% de la page, fond cream,
//                          colonne de texte étroite à droite, pas de KPI box.
//                          Le chiffre EST le design.
// ═════════════════════════════════════════════════════════════════════════

export function InsideRightPanel({ showGuides = false }: { showGuides?: boolean }) {
  // ─── Budget vertical (page H = 297mm) ────────────────────────────────
  // y=16    eyebrows (h≈4mm)
  // y=32    ×4.2 hero (320pt × 0.78 = 88mm box → ends ~120mm)
  // y=155   description block (hairline + 5mm + 12pt×2 lignes ≈ 16mm) → ends ~171
  // y=196   statement (28pt × 0.95 × 3 lignes ≈ 28mm) → ends ~224
  // y=265   bottom specs (hairline + values + labels ≈ 14mm) → ends ~279
  // Marges entre blocs : 25mm min entre chaque pour la respiration éditoriale.
  return (
    <Panel bg={PALETTE.paper} showGuides={showGuides} label="Intérieur droit">
      {/* ── Eyebrows top ── */}
      <div style={{
        position: "absolute", top: "16mm", left: "16mm", right: "16mm",
        display: "flex", justifyContent: "space-between",
      }}>
        <Eyebrow color={PALETTE.maroon}>Why Futur One · 02</Eyebrow>
        <Eyebrow color={PALETTE.ash}>AI Compute Demand</Eyebrow>
      </div>

      {/* ── « ×4.2 » TITAN ── */}
      <div style={{
        position: "absolute",
        top: "32mm",
        left: "-8mm",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: "320pt",
        lineHeight: 0.78,
        letterSpacing: "-0.07em",
        color: PALETTE.maroon,
      }}>
        ×4.2
      </div>

      {/* ── Description (hairline + texte court) à 155mm ── */}
      <div style={{
        position: "absolute",
        top: "155mm",
        left: "16mm",
        right: "16mm",
      }}>
        <HairlineGold length="40mm" thickness="0.5mm" />
        <div style={{ height: "5mm" }} />
        <div style={{
          fontFamily: FONT,
          fontSize: "12pt",
          fontWeight: 500,
          color: PALETTE.ink,
          lineHeight: 1.4,
          maxWidth: "120mm",
          letterSpacing: "-0.01em",
        }}>
          Multiplicateur de la demande mondiale en compute IA entre 2024 et 2030.
        </div>
      </div>

      {/* ── Statement éditorial à 196mm (25mm sous fin description ~171mm) ── */}
      <div style={{
        position: "absolute",
        top: "196mm",
        left: "16mm",
        right: "16mm",
      }}>
        <div style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: "28pt",
          lineHeight: 0.95,
          color: PALETTE.ink,
          letterSpacing: "-0.025em",
          maxWidth: "120mm",
        }}>
          Et le Qatar<br />
          le construit<br />
          <span style={{ color: PALETTE.maroon }}>maintenant.</span>
        </div>
      </div>

      {/* ── 4 specs band en bas (bottom:18mm) ── */}
      <div style={{
        position: "absolute",
        bottom: "18mm",
        left: "16mm",
        right: "16mm",
      }}>
        <HairlineGold length="100%" thickness="0.3mm" />
        <div style={{ height: "4mm" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          {[
            { v: "17 HA",    l: "Campus" },
            { v: "48 MW",    l: "Phase 1" },
            { v: "15 K SQM", l: "Core Hub" },
            { v: "Tier IV",  l: "Reliability" },
          ].map((s) => (
            <div key={s.l}>
              <div style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "16pt",
                color: PALETTE.maroon,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}>{s.v}</div>
              <div style={{ height: "1.5mm" }} />
              <div style={{
                fontFamily: FONT,
                fontSize: "6.5pt",
                fontWeight: 500,
                letterSpacing: "0.22em",
                color: PALETTE.ash,
                textTransform: "uppercase",
              }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
