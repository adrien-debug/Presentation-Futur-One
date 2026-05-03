// ─── INTÉRIEUR DROIT ──────────────────────────────────────────────────────
//
// Quand on ouvre la plaquette : page de droite.
// Rôle : poser la SOLUTION — Why Futur One + visuel data center
// + KPIs campus + doctrine HPR.

#import "../palette.typ": c
#import "../components.typ": *

#let inside-right-panel(width: 210mm, height: 297mm) = block(
  width: width,
  height: height,
  fill: c("ink"),
  inset: 0pt,
  breakable: false,
  {
    // ── Bandeau facetté en haut (40% de la hauteur) ─────────────────────
    place(top + left, facet-pattern(
      width: 100%,
      height: height * 0.40,
      cols: 14,
      rows: 6,
      seed: 31,
    ))

    place(top + left, dy: height * 0.40, led-line-glow(length: 100%, color: c("gold")))

    // ── Header band (sur le facet pattern, contraste cream) ─────────────
    place(top + left, dx: 12mm, dy: 14mm, box(width: width - 24mm, {
      spec-band(left-text: "Why Futur One · Vision 2030", right-text: "02 / 04", color: c("cream"))
    }))

    // ── Titre principal posé sur le bandeau facetté ─────────────────────
    place(top + left, dx: 12mm, dy: 60mm, box(width: width - 24mm, {
      eyebrow("Why Futur One", color: c("gold"))
      v(6mm)
      display(text(
        size: 42pt,
        fill: c("cream"),
        tracking: -0.5pt,
        "AI is the",
      ))
      v(-1mm)
      display(text(
        size: 42pt,
        fill: c("amber"),
        tracking: -0.5pt,
        "new gas.",
      ))
    }))

    // ── Image data center (entre facetted band et KPIs) ─────────────────
    // Si tu déposes assets/datacenter.jpg, il sera utilisé. Sinon : placeholder.
    let datacenter-img = "../assets/datacenter.jpg"
    place(top + left, dx: 12mm, dy: height * 0.42 + 8mm, box(
      width: width - 24mm,
      height: 70mm,
      fill: c("maroon-deep"),
      stroke: 0.5pt + c("gold").transparentize(50%),
      // image() with fallback : will fail to compile if file missing.
      // For now, use a placeholder block.
      align(center + horizon, {
        eyebrow("Photo · Data Center · Doha", color: c("gold").transparentize(40%))
        v(2mm)
        mono(text(size: 6pt, fill: c("gold").transparentize(60%), "Déposer dans assets/datacenter.jpg"))
      })
    ))

    // ── 3 KPIs en strip horizontal ──────────────────────────────────────
    place(bottom + left, dx: 12mm, dy: -52mm, box(width: width - 24mm, {
      grid(
        columns: (1fr, 1fr, 1fr),
        gutter: 4mm,
        ..(
          ("17 HA", "CAMPUS", "Hub · résidences · life"),
          ("48 MW", "PHASE 1", "Tier IV reliability"),
          ("15 K SQM", "CORE HUB", "3 000–4 000 résidents"),
        ).map(item => {
          let (value, label, sub) = item
          block(
            width: 100%,
            inset: (x: 4mm, y: 6mm),
            stroke: (left: 1pt + c("gold")),
            {
              eyebrow(label, color: c("gold"))
              v(1mm)
              display(text(size: 22pt, fill: c("cream"), tracking: -0.5pt, value))
              v(1mm)
              text(size: 7pt, fill: c("cream").transparentize(40%), sub)
            }
          )
        })
      )
    }))

    // ── Doctrine HPR en bas ─────────────────────────────────────────────
    place(bottom + left, dx: 12mm, dy: -16mm, box(width: width - 24mm, {
      led-line-glow(length: 100%, color: c("gold"))
      v(4mm)
      eyebrow("HPR Doctrine — A Positive Revolution", color: c("gold"))
      v(2mm)
      text(
        size: 10pt,
        fill: c("cream"),
        weight: 400,
        "Performance × Well-Being × Social Integration. AI gives everyone the opportunity to create, innovate.",
      )
    }))

    // ── Mire d'angle ────────────────────────────────────────────────────
    place(top + right, dx: -6mm, dy: 6mm, box(width: 6mm, height: 6mm, stroke: (top: 0.6pt + c("gold"), right: 0.6pt + c("gold"))))
    place(bottom + left, dx: 6mm, dy: -6mm, box(width: 6mm, height: 6mm, stroke: (bottom: 0.6pt + c("gold"), left: 0.6pt + c("gold"))))
  }
)
