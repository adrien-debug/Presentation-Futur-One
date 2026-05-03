// ─── COMPOSANTS VISUELS RÉUTILISABLES ─────────────────────────────────────
//
// Inspirés directement de la coque architecturale du data center :
//   - tessellation triangulaire (panneaux facettés)
//   - lignes LED dorées sur les arêtes
//   - dégradé bordeaux → magenta → ambre (lumière sunset)
//   - hirondelles / corner brackets technique

#import "palette.typ": c

// ── Typo helpers ──────────────────────────────────────────────────────────

// System fonts (calibrés sur macOS ; remplaçables par Inter/JetBrains
// si tu installes les polices via `brew install --cask font-inter font-jetbrains-mono`).
#let mono(body) = text(font: "Menlo", body)
#let display(body) = text(font: "Helvetica Neue", weight: 900, body)
#let serif(body) = text(font: "Helvetica Neue", body)

// ── Eyebrow (label en haut d'un bloc, mono accent) ───────────────────────

#let eyebrow(content, color: c("gold")) = mono(
  text(size: 7pt, tracking: 2pt, fill: color, upper(content))
)

// ── Stat XL (chiffre dominant, type ×4.2 / 48 MW) ────────────────────────

#let stat-xl(value, label: none, sub: none, color: c("maroon")) = {
  display(text(size: 64pt, fill: color, value))
  if label != none {
    v(-14pt)
    eyebrow(label, color: c("ash"))
  }
  if sub != none {
    v(2pt)
    text(size: 9pt, fill: c("ink-soft"), sub)
  }
}

// ── Pill / Badge ──────────────────────────────────────────────────────────

#let pill(label, color: c("maroon"), fill-color: none) = box(
  inset: (x: 6pt, y: 3pt),
  stroke: 0.5pt + color,
  fill: fill-color,
  mono(text(size: 7pt, fill: color, tracking: 1.5pt, upper(label)))
)

// ── Trust strip (suite de pills) ──────────────────────────────────────────

#let trust-strip(items) = {
  for (i, item) in items.enumerate() {
    pill(item)
    if i < items.len() - 1 { h(6pt) }
  }
}

// ── Corner brackets (les hirondelles techniques de la slide actuelle) ────

#let corner-brackets(size: 6pt, weight: 1pt, color: c("gold")) = {
  let bracket(corner) = place(
    corner,
    box(
      width: size,
      height: size,
      stroke: (
        top: if corner.position("top") != none { weight + color },
        bottom: if corner.position("bottom") != none { weight + color },
        left: if corner.position("left") != none { weight + color },
        right: if corner.position("right") != none { weight + color },
      ),
    ),
  )
  // Note: simpler version below
}

#let bracket-frame(content, inset-amount: 8pt, size: 8pt, weight: 0.8pt, color: c("gold")) = {
  let cb(dir) = place(dir, box(width: size, height: size, stroke: (
    top:    if dir.position("top")    != none { weight + color } else { none },
    bottom: if dir.position("bottom") != none { weight + color } else { none },
    left:   if dir.position("left")   != none { weight + color } else { none },
    right:  if dir.position("right")  != none { weight + color } else { none },
  )))
  block(inset: inset-amount, {
    place(top + left,    box(width: size, height: size, stroke: (top: weight + color, left: weight + color)))
    place(top + right,   box(width: size, height: size, stroke: (top: weight + color, right: weight + color)))
    place(bottom + left, box(width: size, height: size, stroke: (bottom: weight + color, left: weight + color)))
    place(bottom + right,box(width: size, height: size, stroke: (bottom: weight + color, right: weight + color)))
    content
  })
}

// ── LED line (ligne dorée fine, comme les arêtes des panneaux) ───────────

#let led-line(length: 100%, weight: 0.5pt, color: c("gold")) = line(
  length: length,
  stroke: weight + color,
)

#let led-line-glow(length: 100%, weight: 1.2pt, color: c("gold")) = stack(
  spacing: 0pt,
  line(length: length, stroke: weight + color.transparentize(60%)),
  v(-weight - 0.4pt),
  line(length: length, stroke: 0.4pt + color),
)

// ── Facet pattern (motif triangulaire — la coque du datacenter) ──────────
//
// Génère une bande de triangles à dégradé maroon → magenta → amber.
// `cols` = nb de triangles dans la largeur, `rows` = répétitions.
// Couleur par triangle pseudo-aléatoire mais déterministe (semée).

#let facet-pattern(width: 100%, height: 60mm, cols: 16, rows: 4, seed: 7) = {
  let palette = (
    c("maroon-deep"),
    c("maroon"),
    c("maroon-light"),
    c("magenta"),
    c("sunset"),
    c("amber"),
  )

  let pick(i, j) = {
    let h = calc.rem((i * 73 + j * 41 + seed * 17), palette.len())
    palette.at(h)
  }

  // Compute concrete cell sizes from container dimensions.
  // For a fully responsive pattern we render in a fixed-size box and use
  // fractional placement.
  block(width: width, height: height, breakable: false, {
    let cell-h = height / rows
    let cell-w-frac = 1.0 / cols  // fraction of width per triangle base

    for r in range(rows) {
      for ci in range(cols) {
        let up = calc.rem(ci + r, 2) == 0
        let color = pick(ci, r)

        // Each triangle lives in a sub-box of size (cell-w-frac × cell-h)
        // positioned with `place(dx: ...)`.
        let stroke-color = c("gold").transparentize(60%)

        let pts = if up {
          ((0%, 0%), (100%, 0%), (50%, 100%))
        } else {
          ((50%, 0%), (100%, 100%), (0%, 100%))
        }

        place(
          top + left,
          dy: r * cell-h,
          dx: ci * cell-w-frac * 100%,
          box(width: cell-w-frac * 100%, height: cell-h, {
            polygon(
              fill: color,
              stroke: 0.3pt + stroke-color,
              ..pts,
            )
          }),
        )
      }
    }
  })
}

// ── Page numbering / footer technique ─────────────────────────────────────

#let print-mark(label, color: c("ash")) = mono(text(size: 5pt, fill: color, label))

// ── Header band (ruban dans le style "spec sheet") ────────────────────────

#let spec-band(left-text: "", right-text: "", color: c("maroon")) = {
  grid(
    columns: (1fr, auto),
    align: (left, right),
    mono(text(size: 7pt, fill: color, tracking: 2pt, upper(left-text))),
    mono(text(size: 7pt, fill: color, tracking: 1pt, right-text)),
  )
  v(2pt)
  led-line(color: color)
}

// ── Image avec overlay caption en bas ─────────────────────────────────────

#let photo-frame(path, caption: none, height: auto, width: 100%) = {
  block(width: width, breakable: false, {
    box(width: 100%, image(path, width: width, height: height, fit: "cover"))
    if caption != none {
      v(3pt)
      mono(text(size: 7pt, fill: c("ash"), tracking: 1pt, caption))
    }
  })
}
