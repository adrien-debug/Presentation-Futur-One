/**
 * Grille plaquette Qatar — source unique pour repères (Panel) + layout (panels).
 * Le contenu utile se cale sur `margin` (= LEAFLET_MARGIN_MM mm).
 */

/** Valeur CSS `NNmm` (y compris décimales). */
export function mm(n: number): string {
  return `${n}mm`;
}

// ─── Partagé · HLogo, Eyebrow, helpers CSS ───────────────────────────────────

export const HLOGO_DEFAULT_SIZE_MM = 40;

/** Prop `size` de `<Eyebrow />` (taille en points). */
export const EYEBROW_PT_DEFAULT = 8;
export const EYEBROW_PT_SECONDARY = 7;
export const EYEBROW_PT_BAND = 6;
export const EYEBROW_PT_MATRIX = 4;
export const EYEBROW_PT_BLOCK = 5;

/** `letterSpacing` du composant `<Eyebrow />` (em). */
export const EYEBROW_LETTER_SPACING = "0.25em";

/** Légendes / notes secondaires répétées (em). */
export const TYPO_LS_CAPTION = "0.04em";

/** Bandeaux uppercase « étirés » — taglines, labels KPI / secteurs (em). */
export const TYPO_LS_UPPER_WIDE = "0.15em";
export const TYPO_LS_UPPER_NORMAL = "0.09em";
export const TYPO_LS_UPPER_TIGHT = "0.07em";
export const TYPO_LS_UPPER_KICKER = "0.16em";
export const TYPO_LS_DISPLAY = "-0.045em";
export const TYPO_LS_DISPLAY_TIGHT = "-0.04em";
export const TYPO_LS_QUOTE = "-0.03em";
export const TYPO_LS_NARRATIVE = "0.28em";

/** Opacités texte sur fond sombre (Hero). */
export const TYPO_OPACITY_TEXT_HIGH = 0.88;
export const TYPO_OPACITY_TEXT_MED = 0.78;
export const TYPO_OPACITY_TEXT_LOW = 0.82;

/** Interligne titres massifs (Cover, Hero, Headers). */
export const TYPO_LINE_HEIGHT_DISPLAY = 0.82;
export const TYPO_LINE_HEIGHT_DISPLAY_HERO = 0.88;
export const TYPO_LINE_HEIGHT_DISPLAY_QUOTE = 1;

/** Interligne corps « détendu » (hero body, bandeau bas, matrices…). */
export const TYPO_LINE_HEIGHT_RELAXED = 1.35;
export const TYPO_LINE_HEIGHT_LEAD = 1.26;
export const TYPO_LINE_HEIGHT_NARRATIVE = 1.42;

/** Interligne petit corps dense (notes cellules, blocs Selection…). */
export const TYPO_LINE_HEIGHT_COMPACT = 1.3;
export const TYPO_LINE_HEIGHT_TIGHT = 1.05;
export const TYPO_LINE_HEIGHT_TIGHTER = 0.9;
export const TYPO_LINE_HEIGHT_FOOTNOTE = 1.45;

export const CSS_WIDTH_FULL = "100%";

export const PANEL_W_MM = 210;
export const PANEL_H_MM = 297;

export const LEAFLET_MARGIN_MM = 16;

/** Marge intérieure — identique au repère `showGuides` dans `Panel`. */
export const margin = `${LEAFLET_MARGIN_MM}mm` as const;
export const marginNegative = `-${LEAFLET_MARGIN_MM}mm` as const;

/** Bandeau bas intérieur gauche « Opportunity » (mm). */
export const INSIDE_LEFT_OPPORTUNITY_BAND_MM = 100;

/** Pas vertical type « bloc » sur intérieur gauche (mm). */
export const INSIDE_LEFT_BLOCK_STEP_MM = 12;

// ─── Couverture ─────────────────────────────────────────────────────────────

/** Overlay principal (bas de couverture). `#000000` = `PALETTE.black`. */
export const COVER_OVERLAY_MAIN_GRADIENT = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 72%, #000000 100%)`;
export const COVER_OVERLAY_BOTTOM_HEIGHT_PCT = "38%";
export const COVER_OVERLAY_BOTTOM_GRADIENT = `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.12) 100%)`;

export const COVER_HLOGO_SIZE_MM = 140;
export const COVER_HLOGO_BOTTOM_MM = 20;
export const COVER_HLOGO_RIGHT_MM = -50;

export const COVER_F1_BOX_MM = 24;
export const COVER_F1_FONT_PT = "24pt";

export const COVER_FUTUR_TOP_MM = 140;
export const COVER_FUTUR_PT = "140pt";
export const COVER_ONE_TOP_MM = 190;
export const COVER_ONE_PT = "110pt";

export const COVER_DISPLAY_LINE_HEIGHT = TYPO_LINE_HEIGHT_DISPLAY;
export const COVER_FUTUR_LETTER_SPACING = "-0.06em";
export const COVER_ONE_LETTER_SPACING = "-0.05em";

export const COVER_SPECS_BORDER_MM = 0.5;
export const COVER_SPECS_PADDING_TOP_MM = 8;
export const COVER_SPECS_VALUE_PT = "14pt";

// ─── Dos ─────────────────────────────────────────────────────────────────────

export const BACK_PHOTO_ZONE_MM = 118;
export const BACK_OVERLAY_GRADIENT = `linear-gradient(180deg, rgba(0,0,0,0.12) 0%, #FAFAFA 90%)`;

export const BACK_HLOGO_SIZE_MM = 100;
export const BACK_HLOGO_BOTTOM_MM = 24;
export const BACK_HLOGO_RIGHT_MM = -40;

export const BACK_QUOTE_TOP_MM = 100;
export const BACK_QUOTE_PT = "52pt";

export const BACK_SPACER_AFTER_QUOTE_MM = 10;
export const BACK_HAIRLINE_LENGTH_MM = 40;
export const BACK_HAIRLINE_THICKNESS_MM = 0.5;
export const BACK_SPACER_AFTER_HAIRLINE_MM = 5;

export const BACK_TAGLINE_PT = "11pt";

export const BACK_CONTACT_TITLE_BODY_GAP_MM = 4;
export const BACK_CONTACT_BODY_PT = "10pt";

export const BACK_FOOTNOTE_RIGHT_MM = 80;
export const BACK_FOOTNOTE_PT = "7pt";
export const BACK_FOOTNOTE_LETTER_SPACING = "0.08em";

// ─── Partagé · hairline / icônes hero ─────────────────────────────────────────

export const HAIRLINE_DEFAULT_LENGTH_MM = 20;
export const HAIRLINE_DEFAULT_THICKNESS_MM = 0.4;
export const HAIRLINE_THIN_THICKNESS_MM = 0.3;

export const INSIDE_LEFT_HERO_BAR_ICON_PX = 32;

/**
 * Zone image intérieur gauche — fond hero jusqu’à bande hero (HERO_TOP + STRIP).
 * Repère bas de zone = `HERO_TOP + HERO_STRIP` (mm depuis le haut du panneau).
 * Hero un peu plus compact (~−18 mm) pour éviter chevauchement Why now / Capital avec Opportunity.
 */
export const INSIDE_LEFT_HERO_TOP_MM = 96;
export const INSIDE_LEFT_HERO_STRIP_MM = 25;
export const INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM =
  INSIDE_LEFT_HERO_TOP_MM + INSIDE_LEFT_HERO_STRIP_MM;
export const INSIDE_LEFT_HERO_BAR_BOTTOM_MM = PANEL_H_MM - INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM;

/** Début bloc « Why now » — sous la zone hero image (pas sur la photo). */
export const INSIDE_LEFT_WHY_NOW_TOP_MM = INSIDE_LEFT_PHOTO_ZONE_BOTTOM_MM + 4;

/** Écart vertical entre les blocs Why now et Capital Discipline (flux colonne dans `panels.tsx`). */
export const INSIDE_LEFT_WHY_CAPITAL_GAP_MM = 8;

// ─── Intérieur gauche · hero (texte sur photo) ──────────────────────────────

export const INSIDE_LEFT_HERO_EYEBROW_MAX_WIDTH_PCT = "62%";
export const INSIDE_LEFT_HERO_INDEX_MARGIN_LEFT_MM = 4;
export const INSIDE_LEFT_HERO_EYEBROW_ROW_PT = "7pt";

export const INSIDE_LEFT_HERO_TITLE_LH = TYPO_LINE_HEIGHT_DISPLAY;
export const INSIDE_LEFT_HERO_TITLE_TOP_MM = 22;
export const INSIDE_LEFT_HERO_TITLE_WIDTH_PCT = "72%";
export const INSIDE_LEFT_HERO_TITLE_MAX_WIDTH_MM = 138;
export const INSIDE_LEFT_HERO_TITLE_LINE1_PT = "53pt";
export const INSIDE_LEFT_HERO_TITLE_LINE2_PT = "48pt";
export const INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_LEFT_MM = 6;
export const INSIDE_LEFT_HERO_TITLE_LINE2_MARGIN_TOP_MM = 1;

export const INSIDE_LEFT_HERO_STACK_TOP_MM = 66;
export const INSIDE_LEFT_HERO_STACK_WIDTH_PCT = "52%";
export const INSIDE_LEFT_HERO_STACK_MAX_WIDTH_MM = 112;
export const INSIDE_LEFT_HERO_KICKER_PT = "8.5pt";
export const INSIDE_LEFT_HERO_KICKER_MARGIN_BOTTOM_MM = 1.5;
export const INSIDE_LEFT_HERO_LEAD_PT = "10.5pt";
export const INSIDE_LEFT_HERO_LEAD_MARGIN_BOTTOM_MM = 1.5;
export const INSIDE_LEFT_HERO_BODY_PT = "8pt";
export const INSIDE_LEFT_HERO_BODY_MARGIN_BOTTOM_MM = 2;
export const INSIDE_LEFT_HERO_QUOTE_PT = "8.5pt";

export const INSIDE_LEFT_HERO_BAR_PADDING_Y_MM = 5;
export const INSIDE_LEFT_HERO_BAR_GAP_MM = 6;
export const INSIDE_LEFT_HERO_BAR_COLUMN_GAP_MM = 2.5;
export const INSIDE_LEFT_HERO_BAR_LABEL_PT = "10pt";
export const INSIDE_LEFT_HERO_BAR_DESC_PT = "7.5pt";

/** Calques au-dessus de la photo (identiques à la logique historique dans `panels.tsx`). */
export const INSIDE_LEFT_HERO_OVERLAY_BACKGROUNDS = [
  `linear-gradient(90deg, rgba(138, 21, 56, 0.2) 0%, rgba(138, 21, 56, 0) 44%)`,
  `linear-gradient(90deg, rgba(0,0,0,0.63) 0%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.12) 100%)`,
].join(", ");

// ─── Intérieur gauche · Why now / Capital ───────────────────────────────────

export const INSIDE_LEFT_NARRATIVE_SECTION_TITLE_MARGIN_BOTTOM_MM = 3;
export const INSIDE_LEFT_NARRATIVE_BODY_PT = "8pt";
export const INSIDE_LEFT_NARRATIVE_STAT_PT = "9.5pt";
export const INSIDE_LEFT_NARRATIVE_STAT_MARGIN_TOP_MM = 5;
export const INSIDE_LEFT_NARRATIVE_KEY_PT = "12pt";
export const INSIDE_LEFT_NARRATIVE_KEY_MARGIN_TOP_MM = 6;
export const INSIDE_LEFT_NARRATIVE_KEY_MARGIN_BOTTOM_MM = 5.5;
export const INSIDE_LEFT_NARRATIVE_CLOSING_PT = "6.5pt";
export const INSIDE_LEFT_NARRATIVE_CLOSING_MARGIN_TOP_MM = 2;

// ─── Intérieur gauche · Opportunity ─────────────────────────────────────────

export const INSIDE_LEFT_OPPORTUNITY_FILIGREE_PT = "72pt";
export const INSIDE_LEFT_OPPORTUNITY_FILIGREE_LH = 0.85;
export const INSIDE_LEFT_OPPORTUNITY_HLOGO_SIZE_MM = 80;
export const INSIDE_LEFT_OPPORTUNITY_HLOGO_TOP_MM = 20;
export const INSIDE_LEFT_OPPORTUNITY_HLOGO_RIGHT_MM = -50;

export const INSIDE_LEFT_OPPORTUNITY_RULE_TOP_MM = 10;
export const INSIDE_LEFT_OPPORTUNITY_RULE_HEIGHT_MM = 0.8;

/** Hauteur du bloc contenu sous le filet (depuis le haut du bandeau Opportunity). */
export const INSIDE_LEFT_OPPORTUNITY_CONTENT_TOP_MM = 18.8;

export const INSIDE_LEFT_OPPORTUNITY_HEAD_GAP_AFTER_MM = 6;
export const INSIDE_LEFT_OPPORTUNITY_ITALIC_PT = "20pt";
export const INSIDE_LEFT_OPPORTUNITY_ITALIC_LH = 1.1;
export const INSIDE_LEFT_OPPORTUNITY_BODY_GAP_AFTER_MM = 5;
export const INSIDE_LEFT_OPPORTUNITY_BEFORE_GRID_GAP_MM = 5;

export const INSIDE_LEFT_OPPORTUNITY_GRID_PADDING_Y_MM = 6;
export const INSIDE_LEFT_OPPORTUNITY_GRID_GAP_MM = 4;
export const INSIDE_LEFT_OPPORTUNITY_SECTOR_GRID_TEMPLATE = "repeat(4, 1fr)";
export const INSIDE_LEFT_OPPORTUNITY_FILIGREE_OPACITY = 0.04;
export const INSIDE_LEFT_OPPORTUNITY_KPI_PT = "22pt";
export const INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_NUMBER_MM = 1.5;
export const INSIDE_LEFT_OPPORTUNITY_KPI_BAR_WIDTH_PCT = "40%";
export const INSIDE_LEFT_OPPORTUNITY_KPI_BAR_HEIGHT_MM = 1;
export const INSIDE_LEFT_OPPORTUNITY_KPI_AFTER_BAR_MM = 1.5;
export const INSIDE_LEFT_OPPORTUNITY_LEAD_PT = "8.5pt";

export const INSIDE_LEFT_OPPORTUNITY_CAPTION_BEFORE_MM = 4;
export const INSIDE_LEFT_OPPORTUNITY_CAPTION_PT = "5.5pt";
export const INSIDE_LEFT_OPPORTUNITY_SECTOR_LABEL_PT = "7pt";

// ─── Intérieur droit · mise en page (`InsideRightPanel`) ─────────────────────

export const INSIDE_RIGHT_SPINE_WIDTH_MM = 0.5;

export const INSIDE_RIGHT_BAND_FILIGREE_TOP_MM = 5;
export const INSIDE_RIGHT_BAND_FILIGREE_RIGHT_MM = -10;
export const INSIDE_RIGHT_BAND_FILIGREE_PT = "140pt";
export const INSIDE_RIGHT_BAND_FILIGREE_OPACITY = 0.04;

export const INSIDE_RIGHT_BAND_UNDER_PHOTO_RULE_MM = 0.5;

export const INSIDE_RIGHT_BAND_HLOGO_SIZE_MM = 120;
export const INSIDE_RIGHT_BAND_HLOGO_TOP_MM = 12;
export const INSIDE_RIGHT_BAND_HLOGO_RIGHT_MM = -40;

/** Offset sous la bande photo avant le contenu texte du bandeau bas. */
export const INSIDE_RIGHT_BAND_CONTENT_TOP_OFFSET_MM = 3;
export const INSIDE_RIGHT_BAND_CONTENT_INSET_BOTTOM_MM = 6;
export const INSIDE_RIGHT_BAND_CONTENT_COLUMN_GAP_MM = 4;

export const INSIDE_RIGHT_BAND_INTRO_GRID_GAP_MM = 6;
export const INSIDE_RIGHT_BAND_INTRO_GRID_TEMPLATE = "1.5fr 1fr";
export const INSIDE_RIGHT_BAND_INTRO_BODY_PT = "8pt";
export const INSIDE_RIGHT_BAND_INTRO_AFTER_EYEBROW_MM = 2;

export const INSIDE_RIGHT_BAND_KPI_GRID_GAP_ROW_MM = 4;
export const INSIDE_RIGHT_BAND_KPI_GRID_GAP_COL_MM = 4;
export const INSIDE_RIGHT_BAND_KPI_GRID_TEMPLATE = "1fr 1fr";
export const INSIDE_RIGHT_BAND_KPI_VALUE_PT = "22pt";
export const INSIDE_RIGHT_BAND_KPI_LABEL_PT = "5.5pt";
export const INSIDE_RIGHT_BAND_KPI_CELL_PADDING_LEFT_MM = 3;
export const INSIDE_RIGHT_BAND_KPI_AFTER_VALUE_MM = 1;

export const INSIDE_RIGHT_BAND_PUNCHLINE_PT = "17pt";
export const INSIDE_RIGHT_BAND_SIDEBAR_MAX_WIDTH_PCT = "55%";
export const INSIDE_RIGHT_BAND_SIDEBAR_NOTE_PT = "5.5pt";

export const INSIDE_RIGHT_HEADER_BORDER_MM = 0.5;
export const INSIDE_RIGHT_HEADER_PADDING_BOTTOM_MM = 4;
export const INSIDE_RIGHT_HEADER_TITLE_PT = "44pt";
export const INSIDE_RIGHT_HEADER_TITLE_LH = TYPO_LINE_HEIGHT_DISPLAY;

export const INSIDE_RIGHT_LEDE_TOP_MM = 38;
export const INSIDE_RIGHT_LEDE_PT = "8.5pt";

export const INSIDE_RIGHT_DATA_BLOCK_TOP_MM = 66;

export const INSIDE_RIGHT_DATA_CAPTION_PT = "6.5pt";
export const INSIDE_RIGHT_DATA_SECTION_GAP_MM = 2;

export const INSIDE_RIGHT_DATA_MATRIX_GAP_MM = 6;
export const INSIDE_RIGHT_DATA_MATRIX_CELL_MM = 25;
export const INSIDE_RIGHT_DATA_MATRIX_COL_GAP_MM = 6;
export const INSIDE_RIGHT_DATA_MATRIX_ROW_GAP_MM = 1;

export const INSIDE_RIGHT_DATA_HIGHLIGHT_PT = "20pt";
export const INSIDE_RIGHT_DATA_CELL_NOTE_PT = "5.5pt";
export const INSIDE_RIGHT_DATA_CELL_NOTE_MARGIN_TOP_MM = 0.6;

export const INSIDE_RIGHT_DATA_AFTER_HIGHLIGHT_NOTE_MM = 1.5;

/** Marge au-dessus de la barre de synthèse sous les matrices. */
export const INSIDE_RIGHT_DATA_MATRIX_FOOTER_MARGIN_TOP_MM = 1.5;

export const INSIDE_RIGHT_DATA_GRID_GAP_MM = 0.5;
export const INSIDE_RIGHT_DATA_BAR_GRID_TEMPLATE = "repeat(10, 1fr)";
export const INSIDE_RIGHT_DATA_TWO_COL_GRID_TEMPLATE = "1fr 1fr";
export const INSIDE_RIGHT_DATA_SUMMARY_BAR_HEIGHT_MM = 2.2;
export const INSIDE_RIGHT_DATA_SUMMARY_BAR_RADIUS_MM = 0.35;
export const INSIDE_RIGHT_DATA_SUMMARY_REGION_WIDTH_PCT = "30%";
export const INSIDE_RIGHT_DATA_SUMMARY_PROGRAM_WIDTH_PCT = "70%";
export const INSIDE_RIGHT_DATA_SUMMARY_TEXT_PT = "5pt";
export const INSIDE_RIGHT_DATA_SUMMARY_MARGIN_TOP_MM = 0.8;

export const INSIDE_RIGHT_DATA_QUOTE_COLUMN_PAD_LEFT_MM = 6;
export const INSIDE_RIGHT_DATA_QUOTE_ITALIC_PT = "11pt";

export const INSIDE_RIGHT_DATA_DENSITY_NOTE_PT = "5.5pt";

export const INSIDE_RIGHT_DATA_TABLE_BORDER_MM = 0.35;
export const INSIDE_RIGHT_DATA_TABLE_GRID_TEMPLATE = "0.5fr 1.5fr 1fr 1fr 1fr";
export const INSIDE_RIGHT_DATA_TABLE_HEADER_PAD_Y_MM = 1;
export const INSIDE_RIGHT_DATA_TABLE_ROW_PAD_Y_MM = 1.5;
export const INSIDE_RIGHT_DATA_TABLE_ROW_BORDER_MM = 0.2;
export const INSIDE_RIGHT_DATA_TABLE_ID_PT = "8pt";
export const INSIDE_RIGHT_DATA_TABLE_CELL_PT = "6.5pt";

export const INSIDE_RIGHT_DATA_BLOCK_GRID_GAP_MM = 4;
export const INSIDE_RIGHT_DATA_EYEBROW_BODY_GAP_MM = 1;
export const INSIDE_RIGHT_DATA_BODY_SMALL_PT = "6.5pt";

/** Bande photo (mm) intérieur droit — tête du bandeau bas. */
export const INSIDE_RIGHT_BAND_PHOTO_STRIP_MM = 20;

export const INSIDE_RIGHT_BAND_CONTENT_ABSOLUTE_TOP_MM = INSIDE_RIGHT_BAND_PHOTO_STRIP_MM + INSIDE_RIGHT_BAND_CONTENT_TOP_OFFSET_MM;

/** Bandeau bas intérieur droit (mm) — hauteur suffisante pour Built by + KPI + punchline sans clipping. */
export const INSIDE_RIGHT_BOTTOM_BAND_MM = 112;

/** Espace (mm) entre le bas du contenu blanc et le haut du bandeau bas — évite la superposition. */
export const INSIDE_RIGHT_WHITE_ABOVE_BAND_GAP_MM = 4;

/** Réserve bas de page droite (mm) = bandeau + marge — source unique pour le clip du bloc blanc. */
export const INSIDE_RIGHT_RESERVED_BOTTOM_MM =
  INSIDE_RIGHT_BOTTOM_BAND_MM + INSIDE_RIGHT_WHITE_ABOVE_BAND_GAP_MM;
