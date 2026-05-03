// ─── FUTUR ONE × QATAR — Plaquette commerciale pliée ─────────────────────
//
// Format imprimeur :
//   Papier  : A3 paysage (420 × 297 mm)
//   Pliage  : pli central vertical → A4 portrait fermé (210 × 297 mm)
//   Fonds perdus (bleed) : 3 mm tout autour
//   Page  taille fichier : 426 × 303 mm (trim + 3mm bleed * 2 côtés)
//
// Compose de 2 pages :
//   Page 1 — RECTO extérieur :  [ DOS (gauche)  |  COUVERTURE (droite) ]
//   Page 2 — VERSO intérieur :  [ INSIDE-LEFT   |  INSIDE-RIGHT        ]
//
// Pour itérer en live :
//   typst watch main.typ
//
// Pour générer le PDF final :
//   typst compile main.typ
//
// Pour basculer en mode imprimeur (CMYK), éditer palette.typ → MODE = "print"
// puis recompiler.

#import "palette.typ": c
#import "components.typ": *
#import "panels/cover.typ": cover-panel
#import "panels/back.typ": back-panel
#import "panels/inside-left.typ": inside-left-panel
#import "panels/inside-right.typ": inside-right-panel

// ─── Constantes de format ────────────────────────────────────────────────
#let TRIM_W = 420mm            // A3 landscape width (open spread)
#let TRIM_H = 297mm            // A3 landscape height
#let BLEED  = 3mm              // fonds perdus
#let PAGE_W = TRIM_W + 2 * BLEED
#let PAGE_H = TRIM_H + 2 * BLEED
#let PANEL_W = TRIM_W / 2      // 210mm — un panneau A4 portrait

// ─── Setup global page ───────────────────────────────────────────────────
#set page(
  width: PAGE_W,
  height: PAGE_H,
  margin: 0pt,
  background: rect(width: 100%, height: 100%, fill: c("white")),
)

#set text(font: "Helvetica Neue", size: 10pt, fill: c("ink"))

// ─── Helper : assemble 2 panneaux côte à côte avec bleed ─────────────────
#let spread(left-content, right-content) = {
  // Outer container = full page (with bleed)
  // Inner trim area = 420×297mm, centered
  place(top + left, dx: BLEED, dy: BLEED, {
    grid(
      columns: (PANEL_W, PANEL_W),
      rows: (TRIM_H,),
      gutter: 0pt,
      box(width: PANEL_W, height: TRIM_H, clip: true, left-content),
      box(width: PANEL_W, height: TRIM_H, clip: true, right-content),
    )
  })

  // Trait de pli (visible uniquement en mode "preview", masqué via bordure papier en print)
  place(top + left, dx: BLEED + PANEL_W, dy: BLEED, {
    line(length: TRIM_H, angle: 90deg, stroke: (paint: c("ash").transparentize(70%), thickness: 0.2pt, dash: "dotted"))
  })
}

// ─── PAGE 1 — RECTO extérieur (ce qu'on voit la plaquette fermée) ────────
#spread(
  back-panel(width: PANEL_W, height: TRIM_H),
  cover-panel(width: PANEL_W, height: TRIM_H),
)

#pagebreak()

// ─── PAGE 2 — VERSO intérieur (ce qu'on voit la plaquette ouverte) ───────
#spread(
  inside-left-panel(width: PANEL_W, height: TRIM_H),
  inside-right-panel(width: PANEL_W, height: TRIM_H),
)
