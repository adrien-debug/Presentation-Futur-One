# FUTUR ONE × Qatar — Plaquette pliée

Plaquette commerciale pliée 4 panneaux, prête à imprimer.

## Format

- Papier : **A3 paysage** (420 × 297 mm)
- Pliage : pli central vertical → **A4 portrait fermé** (210 × 297 mm)
- Fonds perdus : 3 mm tout autour
- 4 panneaux : DOS · COUVERTURE · INTÉRIEUR-GAUCHE · INTÉRIEUR-DROIT

## Fichiers

| Fichier | Rôle |
|---|---|
| [`main.typ`](main.typ) | Entry point — assemble les 2 pages physiques |
| [`palette.typ`](palette.typ) | Tokens couleurs CMYK + RGB (preview/print) |
| [`components.typ`](components.typ) | Composants visuels réutilisables (facet pattern, lignes LED, eyebrows, pills, etc.) |
| [`panels/cover.typ`](panels/cover.typ) | Couverture (front) |
| [`panels/back.typ`](panels/back.typ) | Dos (back cover) |
| [`panels/inside-left.typ`](panels/inside-left.typ) | Intérieur gauche (problème · 4 verrous · ×4.2) |
| [`panels/inside-right.typ`](panels/inside-right.typ) | Intérieur droit (solution · KPIs · doctrine HPR) |
| [`assets/`](assets/) | Photos à déposer (voir [README assets](assets/README.md)) |

## Workflow

```bash
# Itération en live (recompile à chaque save)
typst watch main.typ

# Build final
typst compile main.typ

# Preview PNG haute résolution
typst compile main.typ --format png --ppi 300 preview-{p}.png
```

## Couleurs

Palette extraite des photos de la coque architecturale du data center :

| Token | Hex | Usage |
|---|---|---|
| `maroon` | #8A1538 | Bordeaux Qatar (Pantone 1955 C) — accent principal |
| `maroon-deep` | #3F0A14 | Fonds, ombres |
| `maroon-light` | #B53556 | Dégradés |
| `magenta` | #C73E5C | Panneaux roses translucides |
| `sunset` | #E25822 | Orange chaud |
| `amber` | #E89F2E | Doré sunset |
| `gold` | #FFC93C | Lignes LED, arêtes |
| `cream` | #F5DEB3 | Sable, fond clair |
| `ink` | #0A0507 | Noir profond, fond sombre |

Pour basculer en mode imprimeur (CMYK natif au lieu du RGB d'écran),
édite [`palette.typ`](palette.typ) ligne 47 :

```typ
#let MODE = "print"   // au lieu de "preview"
```

Puis recompile. Les couleurs CMYK sont approchées à partir des hex —
**à valider avec un BAT de l'imprimeur** avant tirage série.

## Préparation BAT imprimeur

Avant envoi :

1. Bascule `MODE = "print"` dans `palette.typ`
2. Recompile : `typst compile main.typ`
3. Ouvre `main.pdf` dans Adobe Acrobat (ou Affinity Publisher) pour vérifier :
   - Profil colorimétrique CMYK (FOGRA39 ou ISO Coated v2 selon imprimeur)
   - Fonds perdus 3 mm présents (zones colorées en bord de page)
   - Aucun trait < 0.25 pt
   - Texte en CMYK (rich black pour les noirs denses)
4. Si l'imprimeur exige PDF/X-1a : passer le PDF dans Acrobat Pro → Print Production → Convert Colors / Preflight

## À adapter avant tirage

- [ ] Confirmer format (A3 plié 2 vs A4 plié 3 vs autre)
- [ ] Valider couleurs Qatar officielles (Pantone exact ou CMYK fournis par l'office du gouvernement)
- [ ] Déposer les vraies photos dans `assets/`
- [ ] Renseigner les vraies coordonnées dans [`panels/back.typ`](panels/back.typ)
- [ ] Ajouter le logo JB Pastor & Fils si à intégrer
- [ ] Discuter avec l'imprimeur : bleed, type de papier, finitions (vernis sélectif sur les facettes ?), spotlight Pantone 1955 C en cinquième couleur ?
