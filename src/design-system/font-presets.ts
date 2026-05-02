export type FontPresetId =
  | "theme-default"
  | "terminal-mono"
  | "swiss-ultralight"
  | "display-black"
  | "editorial-condensed"
  | "luxury-serif"
  | "data-grotesque"
  | "cyberpunk-orbitron"
  | "clash-display"
  | "geist-system";

export interface FontPreset {
  id: FontPresetId;
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingWeight: string;
  letterSpacing: string;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "theme-default",
    name: "Thème natif",
    description: "Typographie définie par le thème actif",
    headingFont: "",
    bodyFont: "",
    monoFont: "",
    headingWeight: "",
    letterSpacing: "",
  },
  {
    id: "terminal-mono",
    name: "Terminal Mono",
    description: "Monospace partout · Bloomberg · Vercel CLI",
    headingFont: "'IBM Plex Mono', monospace",
    bodyFont: "'IBM Plex Mono', monospace",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "500",
    letterSpacing: "0.04em",
  },
  {
    id: "swiss-ultralight",
    name: "Swiss Ultralight",
    description: "Inter 300 · tracking large · Scandinavian",
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "300",
    letterSpacing: "0.08em",
  },
  {
    id: "display-black",
    name: "Display Black",
    description: "Space Grotesk 800 · tight · Linear · Pitch",
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "800",
    letterSpacing: "-0.04em",
  },
  {
    id: "editorial-condensed",
    name: "Editorial Condensed",
    description: "Barlow Condensed · Investor deck · Impact",
    headingFont: "'Barlow Condensed', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "700",
    letterSpacing: "-0.01em",
  },
  {
    id: "luxury-serif",
    name: "Luxury Serif",
    description: "Playfair Display · HNWI Finance · Prestige",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "700",
    letterSpacing: "-0.01em",
  },
  {
    id: "data-grotesque",
    name: "Data Grotesque",
    description: "DM Mono + DM Sans · Dashboard · Analytics",
    headingFont: "'DM Sans', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
    monoFont: "'DM Mono', monospace",
    headingWeight: "700",
    letterSpacing: "-0.02em",
  },
  {
    id: "cyberpunk-orbitron",
    name: "Cyberpunk",
    description: "Orbitron · Gaming · NFT · Web3 futuriste",
    headingFont: "'Orbitron', sans-serif",
    bodyFont: "'Exo 2', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "700",
    letterSpacing: "0.06em",
  },
  {
    id: "clash-display",
    name: "Clash Display",
    description: "Clash Display · Web3 premium · NFT galleries",
    headingFont: "ClashDisplay-Variable, 'Space Grotesk', sans-serif",
    bodyFont: "CabinetGrotesk-Variable, 'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "600",
    letterSpacing: "-0.02em",
  },
  {
    id: "geist-system",
    name: "Geist System",
    description: "Inter + IBM Plex Mono · Vercel Geist-inspired",
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    headingWeight: "600",
    letterSpacing: "-0.03em",
  },
];
