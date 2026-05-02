/**
 * Design tokens extraits de https://www.hearstcorporation.io
 * Source : CSS Webflow `hearst-01aa38.shared.d9730528f.min.css`
 * Structure originale : `--_primitives---*` + `--color-scheme-N--*` + `--_ui-styles---*`
 */

export const hearstColors = {
  // ── Mint green (couleur signature, 7 nuances) ─────────────────
  mintGreenDarkest: "#324B2B",
  mintGreenDarker:  "#426439",
  mintGreenDark:    "#85C873",
  mintGreen:        "#A7FB90", // ← signature brand
  mintGreenLight:   "#C1FCB1",
  mintGreenLighter: "#EDFEE8",
  mintGreenLightest:"#F6FEF3",

  // ── Gin (vert-gris désaturé, 7 nuances) ───────────────────────
  ginDarkest:  "#454845",
  ginDarker:   "#5C605C",
  ginDark:     "#B8C0B8",
  gin:         "#E6F1E7",
  ginLight:    "#EDF5EE",
  ginLighter:  "#FAFCFA",
  ginLightest: "#FCFDFC",

  // ── Neutres ────────────────────────────────────────────────────
  neutralDarkest:  "#000000",
  neutralDarker:   "#191919",
  neutralDark:     "#4C4C4C",
  neutral:         "#7F7F7F",
  neutralLight:    "#B2B2B2",
  neutralLighter:  "#D8D8D8",
  neutralLightest: "#F2F2F2",
  white:           "#FFFFFF",
} as const;

export const hearstOpacityNeutralDarkest = {
  "5":  "rgba(0, 0, 0, 0.05)",
  "10": "rgba(0, 0, 0, 0.10)",
  "15": "rgba(0, 0, 0, 0.15)", // border par défaut
  "20": "rgba(0, 0, 0, 0.20)",
  "30": "rgba(0, 0, 0, 0.30)",
  "40": "rgba(0, 0, 0, 0.40)",
  "50": "rgba(0, 0, 0, 0.50)",
  "60": "rgba(0, 0, 0, 0.60)",
} as const;

export const hearstOpacityWhite = {
  "5":  "rgba(255, 255, 255, 0.05)",
  "10": "rgba(255, 255, 255, 0.10)",
  "15": "rgba(255, 255, 255, 0.15)",
  "20": "rgba(255, 255, 255, 0.20)",
  "30": "rgba(255, 255, 255, 0.30)",
  "40": "rgba(255, 255, 255, 0.40)",
  "50": "rgba(255, 255, 255, 0.50)",
  "60": "rgba(255, 255, 255, 0.60)",
} as const;

/**
 * Color schemes — chaque section du site applique un scheme
 * via une classe (color-scheme-1 à color-scheme-4).
 */
export const hearstColorSchemes = {
  scheme1: {
    background: hearstColors.white,
    foreground: hearstColors.white,
    text:       hearstColors.neutralDarkest,
    accent:     hearstColors.neutralDarkest,
    border:     hearstOpacityNeutralDarkest["15"],
  },
  scheme2: {
    background: hearstColors.mintGreenDark, // #85C873
    foreground: hearstColors.mintGreenDark,
    text:       hearstColors.neutralDarkest,
    accent:     hearstColors.neutralDarkest,
    border:     hearstOpacityNeutralDarkest["15"],
  },
  scheme3: {
    background: hearstColors.mintGreenLightest, // #F6FEF3
    foreground: hearstColors.mintGreenLightest,
    text:       hearstColors.neutralDarkest,
    accent:     hearstColors.neutralDarkest,
    border:     hearstOpacityNeutralDarkest["15"],
  },
  scheme4: {
    background: hearstColors.ginLightest, // #FCFDFC
    foreground: hearstColors.ginLightest,
    text:       hearstColors.neutralDarkest,
    accent:     hearstColors.neutralDarkest,
    border:     hearstOpacityNeutralDarkest["15"],
  },
} as const;

export const hearstTypography = {
  fontFamily: {
    body:    "Fkgrotesktrial, Arial, sans-serif",
    heading: "Fkgrotesktrial, Arial, sans-serif",
  },
  fontWeight: {
    regular: 400,
    medium:  500,
    bold:    700,
  },
  // Échelle de titres (heading-style-h1..h6)
  heading: {
    h1: { fontSize: "5rem",    lineHeight: 1,   letterSpacing: "-0.035rem", fontWeight: 400 },
    h2: { fontSize: "3rem",    lineHeight: 1.1, letterSpacing: "-0.03rem",  fontWeight: 400 },
    h3: { fontSize: "2.5rem",  lineHeight: 1.2, letterSpacing: "-0.025rem", fontWeight: 400 },
    h4: { fontSize: "2rem",    lineHeight: 1.3, letterSpacing: "-0.02rem",  fontWeight: 400 },
    h5: { fontSize: "1.5rem",  lineHeight: 1.4, letterSpacing: "-0.015rem", fontWeight: 400 },
    h6: { fontSize: "1.25rem", lineHeight: 1.4, letterSpacing: "-0.0125rem",fontWeight: 400 },
  },
  // Tailles de texte (text-size-*)
  body: {
    large:   { fontSize: "1.25rem" },  // 20px
    medium:  { fontSize: "1.125rem" }, // 18px
    regular: { fontSize: "1rem" },     // 16px
    small:   { fontSize: "0.875rem" }, // 14px
    tiny:    { fontSize: "0.75rem" },  // 12px
  },
  fontUrl: {
    regular: "https://cdn.prod.website-files.com/67dbd8172ab8cd70cb0ed553/67dbdb54c7cf5fffc5902b9b_FKGroteskTrial-Regular.otf",
    medium:  "https://cdn.prod.website-files.com/67dbd8172ab8cd70cb0ed553/67dbdb541fd6f6e703bc6173_FKGroteskTrial-Medium.otf",
    bold:    "https://cdn.prod.website-files.com/67dbd8172ab8cd70cb0ed553/67dbdb54904513d21b23121e_FKGroteskTrial-Bold.otf",
  },
} as const;

export const hearstUI = {
  radius: {
    small:   "8px",
    medium:  "8px",
    regular: "1rem",
    pill:    "100px", // boutons
  },
  stroke: {
    border:  "1px",
    divider: "1px",
  },
  padding: {
    sectionLargeDesktop:  "8rem",
    sectionLargeMobile:   "4rem",
    sectionMediumDesktop: "5rem",
    sectionMediumMobile:  "2.5rem",
  },
  shadow: {
    xs: "0 1px 2px rgba(0,0,0,0.05)",
    sm: "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
    md: "0 12px 16px -4px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)",
    lg: "0 20px 24px -4px rgba(0,0,0,0.08), 0 8px 8px -4px rgba(0,0,0,0.03)",
    xl: "0 24px 48px -12px rgba(0,0,0,0.18)",
    xxl:"0 32px 64px -12px rgba(0,0,0,0.14)",
  },
} as const;

/**
 * Style du bouton primaire signature Hearst.
 * Pill mint-green pleine, hauteur 3rem, bordure same color.
 */
export const hearstButton = {
  background: hearstColors.mintGreen,
  borderColor: hearstColors.mintGreen,
  color: hearstColors.neutralDarkest,
  height: "3rem",
  padding: "0.5rem 1.25rem",
  borderRadius: hearstUI.radius.pill,
  fontWeight: hearstTypography.fontWeight.medium,
  transition: "color 0.35s cubic-bezier(.165,.84,.44,1), border-color 0.35s, background-color 0.35s",
  gap: "0.5rem",
} as const;

/** Liste exhaustive des 14 verts (mint + gin). Utile pour pickers / inspectors. */
export const hearstAllGreens = [
  { name: "mint-green-darkest",  hex: hearstColors.mintGreenDarkest },
  { name: "mint-green-darker",   hex: hearstColors.mintGreenDarker },
  { name: "mint-green-dark",     hex: hearstColors.mintGreenDark },
  { name: "mint-green",          hex: hearstColors.mintGreen },
  { name: "mint-green-light",    hex: hearstColors.mintGreenLight },
  { name: "mint-green-lighter",  hex: hearstColors.mintGreenLighter },
  { name: "mint-green-lightest", hex: hearstColors.mintGreenLightest },
  { name: "gin-darkest",         hex: hearstColors.ginDarkest },
  { name: "gin-darker",          hex: hearstColors.ginDarker },
  { name: "gin-dark",            hex: hearstColors.ginDark },
  { name: "gin",                 hex: hearstColors.gin },
  { name: "gin-light",           hex: hearstColors.ginLight },
  { name: "gin-lighter",         hex: hearstColors.ginLighter },
  { name: "gin-lightest",        hex: hearstColors.ginLightest },
] as const;
