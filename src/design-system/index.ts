export * from "./themes";

// Reserved fixed zone IDs. Sections use dynamic strings (uuid-based) so they can be added/reordered.
export type ReservedZoneId = "header" | "footer";
export type ZoneId = ReservedZoneId | (string & {}); // allow any string at runtime, keep autocomplete

export interface SectionZone {
  id: string;
  label: string;
  heightRatio: number;
}

export const SPREAD_ZONES: SectionZone[] = [
  { id: "header",    label: "HEADER",    heightRatio: 0.10 },
  { id: "section-1", label: "SECTION 1", heightRatio: 0.14 },
  { id: "section-2", label: "SECTION 2", heightRatio: 0.14 },
  { id: "section-3", label: "SECTION 3", heightRatio: 0.14 },
  { id: "section-4", label: "SECTION 4", heightRatio: 0.14 },
  { id: "section-5", label: "SECTION 5", heightRatio: 0.14 },
  { id: "section-6", label: "SECTION 6", heightRatio: 0.14 },
  { id: "footer",    label: "FOOTER",    heightRatio: 0.06 },
];

export const PRINT_DIMENSIONS = {
  spreadWidthMm: 420,
  pageHeightMm: 297,
  bleedMm: 3,
  marginSafeMm: 10,
  aspectRatio: 420 / 297,
};
