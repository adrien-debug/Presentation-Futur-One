/**
 * Grille plaquette Qatar — source unique pour repères (Panel) + layout (panels).
 * Le contenu utile se cale sur `margin` (= LEAFLET_MARGIN_MM mm).
 */
export const PANEL_W_MM = 210;
export const PANEL_H_MM = 297;

export const LEAFLET_MARGIN_MM = 16;

/** Marge intérieure — identique au repère `showGuides` dans `Panel`. */
export const margin = `${LEAFLET_MARGIN_MM}mm` as const;

/** Bandeau bas intérieur gauche « Opportunity » (mm). */
export const INSIDE_LEFT_OPPORTUNITY_BAND_MM = 100;

/** Bande photo (mm) en tête du bandeau bas (transition visuelle / crédits). */
export const INSIDE_RIGHT_BAND_PHOTO_STRIP_MM = 26;

/** Bandeau bas intérieur droit « campus / méthode » (mm) — inclut la bande photo. */
export const INSIDE_RIGHT_BOTTOM_BAND_MM = 100;

/** Espace (mm) entre le bas du contenu blanc et le haut du bandeau bas — évite la superposition. */
export const INSIDE_RIGHT_WHITE_ABOVE_BAND_GAP_MM = 4;

/** Réserve bas de page droite (mm) = bandeau + marge — source unique pour le clip du bloc blanc. */
export const INSIDE_RIGHT_RESERVED_BOTTOM_MM =
  INSIDE_RIGHT_BOTTOM_BAND_MM + INSIDE_RIGHT_WHITE_ABOVE_BAND_GAP_MM;
