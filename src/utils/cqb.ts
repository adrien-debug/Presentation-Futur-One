/**
 * Font size tokens in cqb (container query block = % of zone HEIGHT).
 *
 * Reference zone height at natural 14% = 131px:
 *   display  28cqb = 36.7px  hero titles
 *   title    22cqb = 28.8px  section titles / KPI large
 *   lead     16cqb = 20.9px  KPI compact / pull values
 *   body     11cqb = 14.4px  body text
 *   small     9cqb = 11.8px  secondary labels
 *   xs        7cqb =  9.2px  meta / captions
 *   micro     5cqb =  6.6px  CMYK / footnotes
 *
 * Benefits:
 * - Zone dragged bigger  → fonts grow  ✓
 * - Zone dragged smaller → fonts shrink ✓
 * - Window resize        → transform scale handles it ✓
 */
export const F = {
  display: "28cqb",
  title:   "22cqb",
  lead:    "16cqb",
  body:    "11cqb",
  small:    "9cqb",
  xs:       "7cqb",
  micro:    "5cqb",
} as const;

export type FontToken = keyof typeof F;
