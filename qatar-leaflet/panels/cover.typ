// ─── COUVERTURE (front) ───────────────────────────────────────────────────
//
// Panneau de droite quand la plaquette est posée fermée.
// Identité visuelle : facettes triangulaires du data center
// + slogan FUTUR ONE / NO LIMITS BY AI.

#import "../palette.typ": c
#import "../components.typ": *

#let cover-panel(width: 210mm, height: 297mm) = block(
  width: width,
  height: height,
  fill: c("ink"),
  inset: 0pt,
  breakable: false,
  {
    // ── Bandeau facetté en haut (1/3 de la hauteur) ─────────────────────
    place(top + left, facet-pattern(
      width: 100%,
      height: height * 0.42,
      cols: 12,
      rows: 6,
      seed: 11,
    ))

    // Lignes LED dorées soulignant la limite du bandeau
    place(top + left, dy: height * 0.42, led-line-glow(length: 100%, color: c("gold")))

    // ── Bloc texte centré bas ───────────────────────────────────────────
    place(top + left, dx: 14mm, dy: height * 0.55, {
      eyebrow("Manifesto · Vision 2030", color: c("gold"))
      v(8mm)
      display(text(
        size: 56pt,
        fill: c("cream"),
        tracking: -1pt,
        "FUTUR ONE",
      ))
      v(-2mm)
      display(text(
        size: 56pt,
        fill: c("maroon-light"),
        tracking: -1pt,
        "NO LIMITS,",
      ))
      v(-3mm)
      display(text(
        size: 56pt,
        fill: c("amber"),
        tracking: -1pt,
        "BY AI.",
      ))
      v(12mm)
      led-line-glow(length: 60%, color: c("gold"))
      v(4mm)
      text(
        size: 11pt,
        fill: c("cream"),
        tracking: 0.5pt,
        "Sovereign AI Compute Hub",
      )
      v(2mm)
      text(
        size: 9pt,
        fill: c("cream").transparentize(40%),
        "Tier IV · 48 MW Phase 1 · Doha, Qatar",
      )
    })

    // ── Footer technique ─────────────────────────────────────────────────
    place(bottom + left, dx: 14mm, dy: -10mm, {
      grid(
        columns: (1fr, auto),
        align: (left, right),
        mono(text(size: 7pt, fill: c("gold").transparentize(30%), tracking: 2pt, "PROPOSITION CONFIDENTIELLE")),
        mono(text(size: 7pt, fill: c("gold").transparentize(30%), "2030 · QA")),
      )
    })

    // ── Mire d'angle (corner brackets discrets) ─────────────────────────
    place(top + left, dx: 6mm, dy: 6mm, {
      box(width: 6mm, height: 6mm, stroke: (top: 0.6pt + c("gold"), left: 0.6pt + c("gold")))
    })
    place(top + right, dx: -6mm, dy: 6mm, {
      box(width: 6mm, height: 6mm, stroke: (top: 0.6pt + c("gold"), right: 0.6pt + c("gold")))
    })
    place(bottom + left, dx: 6mm, dy: -6mm, {
      box(width: 6mm, height: 6mm, stroke: (bottom: 0.6pt + c("gold"), left: 0.6pt + c("gold")))
    })
    place(bottom + right, dx: -6mm, dy: -6mm, {
      box(width: 6mm, height: 6mm, stroke: (bottom: 0.6pt + c("gold"), right: 0.6pt + c("gold")))
    })
  }
)
