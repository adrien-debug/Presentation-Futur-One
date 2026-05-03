// ─── PALETTE FUTUR ONE × QATAR ────────────────────────────────────────────
//
// CMYK calibré à partir des références architecturales du data center.
// Chaque teinte a une déclinaison RGB (preview écran) et CMYK (impression).
//
// Référence : drapeau Qatar = Pantone 1955 C ≈ #8A1538
// → CMYK officiel : C:30 M:100 Y:75 K:45 (à valider avec l'imprimeur)
//
// Convention : utiliser uniquement les jetons exposés ici.
// Pour l'écran (`#`-hex) : utiliser `palette.preview.<name>`.
// Pour le print          : utiliser `palette.cmyk.<name>`.

#let cmyk-pal = (
  // Cœur de marque ── bordeaux Qatar
  "maroon-deep":   cmyk(30%, 100%, 80%, 65%),  // bordeaux profond, fonds, ombres
  "maroon":        cmyk(30%, 100%, 75%, 45%),  // bordeaux principal (drapeau)
  "maroon-light":  cmyk(20%,  90%, 60%, 25%),  // bordeaux clair, dégradé

  // Accents chauds ── facettes & sunset
  "magenta":       cmyk( 0%,  80%, 40%, 10%),  // panneaux roses translucides
  "sunset":        cmyk( 0%,  75%, 90%,  0%),  // orange sunset
  "amber":         cmyk( 5%,  40%, 90%,  0%),  // ambre doré
  "gold":          cmyk( 0%,  20%, 85%,  0%),  // jaune LED, lignes lumineuses
  "gold-soft":     cmyk( 0%,  10%, 50%,  0%),  // doré atténué

  // Neutres
  "ink":           cmyk(50%,  60%, 50%, 100%), // rich black (pour textes denses)
  "ink-soft":      cmyk(40%,  50%, 40%,  85%),
  "cream":         cmyk( 0%,  10%, 30%,   0%), // beige sable
  "white":         cmyk( 0%,   0%,  0%,   0%),
  "smoke":         cmyk( 0%,   5%, 15%,  10%), // off-white légèrement chaud
  "ash":           cmyk( 0%,   0%,  0%,  60%), // gris technique

  // Ciel (pour les images de bâtiment au sunset)
  "sky-teal":      cmyk(60%,  25%, 20%, 15%),
)

#let preview-pal = (
  "maroon-deep":  rgb("#3F0A14"),
  "maroon":       rgb("#8A1538"),
  "maroon-light": rgb("#B53556"),
  "magenta":      rgb("#C73E5C"),
  "sunset":       rgb("#E25822"),
  "amber":        rgb("#E89F2E"),
  "gold":         rgb("#FFC93C"),
  "gold-soft":    rgb("#E8C97A"),
  "ink":          rgb("#0A0507"),
  "ink-soft":     rgb("#1A1014"),
  "cream":        rgb("#F5DEB3"),
  "white":        rgb("#FFFFFF"),
  "smoke":        rgb("#F4EEE6"),
  "ash":          rgb("#6B6B6B"),
  "sky-teal":     rgb("#5A8FA8"),
)

// ── API d'accès (active le mode `print` pour basculer sur CMYK) ──────────
#let MODE = "preview"  // "preview" | "print"

#let c(name) = if MODE == "print" { cmyk-pal.at(name) } else { preview-pal.at(name) }
