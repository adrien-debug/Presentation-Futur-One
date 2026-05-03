// ─── INTÉRIEUR GAUCHE ─────────────────────────────────────────────────────
//
// Quand on ouvre la plaquette : page de gauche.
// Rôle : poser le PROBLÈME — "World Before AI" + 4 verrous + chiffre clé.

#import "../palette.typ": c
#import "../components.typ": *

#let inside-left-panel(width: 210mm, height: 297mm) = block(
  width: width,
  height: height,
  fill: c("smoke"),
  inset: 0pt,
  breakable: false,
  {
    // ── Header band ─────────────────────────────────────────────────────
    place(top + left, dx: 12mm, dy: 14mm, box(width: width - 24mm, {
      spec-band(left-text: "World Before AI · Vision 2030", right-text: "01 / 04", color: c("maroon"))
    }))

    // ── Hero title ──────────────────────────────────────────────────────
    place(top + left, dx: 12mm, dy: 32mm, box(width: width - 24mm, {
      eyebrow("Manifesto 2030", color: c("maroon"))
      v(6mm)
      display(text(
        size: 38pt,
        fill: c("ink"),
        tracking: -0.5pt,
        "Quatre verrous",
      ))
      v(-1mm)
      display(text(
        size: 38pt,
        fill: c("maroon"),
        tracking: -0.5pt,
        "que l'IA fait sauter.",
      ))
    }))

    // ── Quatre punchlines ───────────────────────────────────────────────
    let punchlines = (
      ("01", "Limited by technology",  "Plafond d'échelle, plafond d'innovation."),
      ("02", "Dependent on developers","Goulet d'étranglement humain."),
      ("03", "High costs & delays",    "Time-to-value qui s'effondre avec l'IA."),
      ("04", "Creativity restricted",  "L'expression bridée par l'outil."),
    )

    place(top + left, dx: 12mm, dy: 100mm, box(width: width - 24mm, {
      for (i, item) in punchlines.enumerate() {
        let (num, title, sub) = item
        block(below: 6mm, {
          grid(
            columns: (14mm, 1fr),
            gutter: 4mm,
            align: (left + top, left + top),
            mono(text(size: 18pt, fill: c("gold"), weight: 700, num)),
            {
              text(size: 12pt, fill: c("ink"), weight: 700, title)
              v(1mm)
              text(size: 9pt, fill: c("ink-soft"), sub)
            }
          )
          v(2mm)
          led-line(length: 100%, color: c("ash").transparentize(80%))
        })
      }
    }))

    // ── Big stat en bas ─────────────────────────────────────────────────
    place(bottom + left, dx: 12mm, dy: -18mm, box(width: width - 24mm, {
      grid(
        columns: (auto, 1fr),
        gutter: 8mm,
        align: (left + bottom, left + bottom),
        {
          display(text(
            size: 78pt,
            fill: c("maroon"),
            tracking: -2pt,
            "×4.2",
          ))
        },
        {
          v(0pt)
          eyebrow("AI Compute Demand", color: c("ash"))
          v(2mm)
          text(size: 10pt, fill: c("ink"), weight: 600, "Multiplicateur 2024 → 2030")
          v(1mm)
          text(size: 9pt, fill: c("ink-soft"), "Capacité globale × 4.2 en six ans.")
          linebreak()
          text(size: 9pt, fill: c("ink-soft"), "Source · IDC AI Compute Index 2024.")
        },
      )
    }))

    // ── Mire d'angle technique ──────────────────────────────────────────
    place(top + left, dx: 6mm, dy: 6mm, box(width: 6mm, height: 6mm, stroke: (top: 0.5pt + c("maroon"), left: 0.5pt + c("maroon"))))
    place(bottom + right, dx: -6mm, dy: -6mm, box(width: 6mm, height: 6mm, stroke: (bottom: 0.5pt + c("maroon"), right: 0.5pt + c("maroon"))))
  }
)
