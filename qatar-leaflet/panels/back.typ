// ─── DOS (back cover) ─────────────────────────────────────────────────────
//
// Panneau de gauche quand la plaquette est posée fermée.
// Identité : monogramme F1 + coordonnées + manifesto pull-quote.

#import "../palette.typ": c
#import "../components.typ": *

#let back-panel(width: 210mm, height: 297mm) = block(
  width: width,
  height: height,
  fill: c("cream"),
  inset: 0pt,
  breakable: false,
  {
    // ── Bandeau bordeaux dégradé en bas (1/3) ───────────────────────────
    place(bottom + left, facet-pattern(
      width: 100%,
      height: height * 0.32,
      cols: 10,
      rows: 4,
      seed: 23,
    ))

    // Lignes LED dorées soulignant le bandeau (par le haut)
    place(bottom + left, dy: -(height * 0.32), led-line-glow(length: 100%, color: c("gold")))

    // ── Monogramme F1 en haut ───────────────────────────────────────────
    place(top + left, dx: 14mm, dy: 18mm, {
      box(
        width: 22mm,
        height: 22mm,
        fill: c("maroon"),
        stroke: 0.6pt + c("gold"),
        align(center + horizon, display(text(size: 22pt, fill: c("cream"), "F1"))),
      )
    })

    // ── Pull quote au centre ────────────────────────────────────────────
    place(top + left, dx: 14mm, dy: 60mm, box(width: width - 28mm, {
      eyebrow("Manifesto", color: c("maroon"))
      v(6mm)
      text(
        size: 22pt,
        weight: 300,
        fill: c("ink"),
        "« AI is the new gas. Compute is the infrastructure of nations. »",
      )
      v(8mm)
      mono(text(
        size: 8pt,
        fill: c("ash"),
        tracking: 1.5pt,
        upper("FUTUR ONE — Vision 2030"),
      ))
    }))

    // ── Coordonnées en pied (dans le bandeau bordeaux) ──────────────────
    place(bottom + left, dx: 14mm, dy: -16mm, box(width: width - 28mm, {
      grid(
        columns: (1fr, 1fr),
        gutter: 6mm,
        {
          eyebrow("Contact", color: c("gold"))
          v(2mm)
          text(size: 9pt, fill: c("cream"), "contact@futurone.qa")
          linebreak()
          text(size: 9pt, fill: c("cream"), "+974 0000 0000")
        },
        {
          eyebrow("Site", color: c("gold"))
          v(2mm)
          text(size: 9pt, fill: c("cream"), "Doha · Qatar")
          linebreak()
          text(size: 9pt, fill: c("cream"), "futurone.qa")
        },
      )
      v(8mm)
      grid(
        columns: (1fr, auto),
        align: (left, right),
        mono(text(size: 6pt, fill: c("cream").transparentize(40%), tracking: 1.5pt, "© 2030 FUTUR ONE DATACENTER LLC")),
        mono(text(size: 6pt, fill: c("cream").transparentize(40%), tracking: 1.5pt, "v1.0 · CONFIDENTIEL")),
      )
    }))

    // ── Mire d'angle ────────────────────────────────────────────────────
    place(top + left, dx: 6mm, dy: 6mm, box(width: 6mm, height: 6mm, stroke: (top: 0.6pt + c("maroon"), left: 0.6pt + c("maroon"))))
    place(top + right, dx: -6mm, dy: 6mm, box(width: 6mm, height: 6mm, stroke: (top: 0.6pt + c("maroon"), right: 0.6pt + c("maroon"))))
    place(bottom + left, dx: 6mm, dy: -6mm, box(width: 6mm, height: 6mm, stroke: (bottom: 0.6pt + c("gold"), left: 0.6pt + c("gold"))))
    place(bottom + right, dx: -6mm, dy: -6mm, box(width: 6mm, height: 6mm, stroke: (bottom: 0.6pt + c("gold"), right: 0.6pt + c("gold"))))
  }
)
