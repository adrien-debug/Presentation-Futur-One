# Assets plaquette Qatar

Fichiers utilisés par la route **`/leaflet/qatar`** (aliases : `/leaflet`, `/qatar` → même page). Assets sous `/leaflet-qatar/<filename>` :

| Fichier | Usage |
|--------|--------|
| `cover-facade.png` | Couverture + bande photo footer intérieur droit |
| `back-cover.png` | Dos (bande photo haute) |
| `inside-left.png` | Intérieur gauche — fond blocs 1–5 (`INSIDE_LEFT_HERO_TOP_MM` + `INSIDE_LEFT_HERO_STRIP_MM` → `INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM`) ; overlay CSS : teinte maroon gauche + dégradé noir gauche→droite (`panels.tsx`) |
| `logo-hearst-h.svg` | Filigrane H (mask-image dans `panels.tsx`) |

Pas besoin de redémarrer le serveur après ajout ou remplacement d’un fichier dans ce dossier.

## Code & Architecture

L'architecture a été refactorisée pour être modulaire et maintenir un alignement "Pixel-Perfect" strict :

- **`src/app/leaflet/qatar/panels.tsx`** : Point d'entrée et layout principal qui exporte les composants.
- **`src/app/leaflet/qatar/components/`** : Dossier contenant les sous-composants isolés (`CoverPanel.tsx`, `BackPanel.tsx`, `InsideLeftPanel.tsx`, `InsideRightPanel.tsx`) ainsi que les éléments partagés (`shared.tsx`).
- **`src/app/leaflet/qatar/design-tokens.ts`** : Source unique de vérité pour les tokens de design (tailles, marges, typos, couleurs). Tous les calculs dynamiques complexes ont été remplacés par des tokens nommés pour éviter les erreurs dans le JSX.

### Convention d'Alignement

- **Conteneur Principal** : Le conteneur parent du contenu utile est systématiquement calé sur la marge de 16mm (`left: margin`, `right: margin`).
- **Éléments Graphiques** : Seuls les éléments graphiques (photos, boîtes grises, filigranes) sont autorisés à sortir de ce cadre (full-bleed).
- **Bloc Opportunity** : Isolé pour garantir que le filigrane en position absolue ne pousse jamais le contenu, et que la boîte grise reste "full-bleed" sans casser la grille du texte.

### 📜 Certificat d'Engagement Pixel-Perfect

Ce document et le commit associé représentent un engagement formel sur la stabilité du projet :
- **Isolation Garantie** : 4 panneaux indépendants (`components/`).
- **Zéro Mathématiques dans le JSX** : Tous les calculs sont déportés dans `design-tokens.ts`.
- **Alignement Verrouillé** : Contenu utile encadré par `margin`, débordements graphiques gérés via `marginNegative`.
- **Sécurité Typée** : Validation stricte via TypeScript.

En cas de problème futur (rupture de grille, fuzzy matching), ce point de sauvegarde (commit) sert de référence absolue pour restaurer, comparer ou comprendre la structure saine.
