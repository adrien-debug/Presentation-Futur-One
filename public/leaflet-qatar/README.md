# Assets plaquette Qatar

Fichiers utilisés par `/leaflet/qatar` (servis sous `/leaflet-qatar/<filename>`) :

| Fichier | Usage |
|--------|--------|
| `cover-facade.png` | Couverture + watermarks bandeaux |
| `back-cover.png` | Dos (bande photo haute) |
| `inside-left.png` | Photo hero intérieur gauche |
| `logo-hearst-h.svg` | Filigrane H (mask-image dans `panels.tsx`) |

Pas besoin de redémarrer le serveur après ajout ou remplacement d’un fichier dans ce dossier.

## Code

Grille : `src/app/leaflet/qatar/design-tokens.ts` (`margin` = 16 mm, aligné sur `Panel.tsx` `showGuides`). Intérieur droit : réserve `INSIDE_RIGHT_RESERVED_BOTTOM_MM` ; bandeaux `INSIDE_LEFT_OPPORTUNITY_BAND_MM`, `INSIDE_RIGHT_BOTTOM_BAND_MM`. En dev : `npm run dev:clean`.
