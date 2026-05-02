export type ThemeId =
  | "futuristic-infra"
  | "desert-tech-minimal"
  | "carbon-black"
  | "arctic-data"
  | "arabian-luxury"
  | "industrial-grid"
  | "quantum-blue"
  | "emerald-vision"
  | "sunset-desert"
  | "platinum-edge"
  | "hearst-corporation";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  highlight: string;
  cmyk: { primary: string; secondary: string; accent: string };
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  heroSize: string;
  titleSize: string;
  subtitleSize: string;
  bodySize: string;
  captionSize: string;
  headingWeight: string;
  letterSpacing: string;
}

export interface ArtDirection {
  id: ThemeId;
  name: string;
  tagline: string;
  colors: ColorPalette;
  typography: Typography;
  photoStyle: string;
  graphicStyle: string;
  iconography: string;
  boxStyle: string;
  titleStyle: string;
  dividerStyle: string;
  dataVizStyle: string;
  globalTone: string;
  tailwind: {
    bg: string;
    bgSurface: string;
    bgSurfaceAlt: string;
    text: string;
    textMuted: string;
    accent: string;
    border: string;
    highlight: string;
    headerBg: string;
    footerBg: string;
  };
}

export const themes: Record<ThemeId, ArtDirection> = {
  "futuristic-infra": {
    id: "futuristic-infra",
    name: "Futuristic Infra",
    tagline: "Architecture du futur, données du présent",
    colors: {
      primary: "#0A0E1A",
      secondary: "#0D2137",
      accent: "#00D4FF",
      background: "#05080F",
      surface: "#0F1929",
      surfaceAlt: "#162235",
      text: "#E8F4FF",
      textMuted: "#6B8FAA",
      border: "#1A3A5C",
      highlight: "#00D4FF",
      cmyk: { primary: "C:100 M:80 Y:0 K:85", secondary: "C:95 M:55 Y:0 K:70", accent: "C:100 M:0 Y:0 K:0" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(48px, 6vw, 96px)",
      titleSize: "clamp(24px, 3vw, 48px)",
      subtitleSize: "clamp(14px, 1.8vw, 24px)",
      bodySize: "clamp(10px, 1.2vw, 14px)",
      captionSize: "clamp(8px, 0.9vw, 10px)",
      headingWeight: "700",
      letterSpacing: "-0.02em",
    },
    photoStyle: "Longue exposition nocturne, LED bleues, cooling towers illuminés",
    graphicStyle: "Grilles hexagonales, lignes de circuit, hologrammes data",
    iconography: "Monoline tech, contours lumineux sur fond sombre",
    boxStyle: "Glassmorphism sombre, border cyan, backdrop-blur",
    titleStyle: "Majuscules, gradient bleu-cyan, ombre portée luminescente",
    dividerStyle: "Lignes pointillées cyan animées, dégradés lumineux",
    dataVizStyle: "Barres néon cyan sur fond sombre, glow effect, data streams",
    globalTone: "Technologique, mystérieux, premium futuriste",
    tailwind: {
      bg: "bg-[#05080F]",
      bgSurface: "bg-[#0F1929]",
      bgSurfaceAlt: "bg-[#162235]",
      text: "text-[#E8F4FF]",
      textMuted: "text-[#6B8FAA]",
      accent: "text-[#00D4FF]",
      border: "border-[#1A3A5C]",
      highlight: "text-[#00D4FF]",
      headerBg: "bg-[#0A0E1A]",
      footerBg: "bg-[#05080F]",
    },
  },

  "desert-tech-minimal": {
    id: "desert-tech-minimal",
    name: "Desert Tech Minimal",
    tagline: "La puissance du désert rencontre la précision digitale",
    colors: {
      primary: "#F5EFE0",
      secondary: "#E8D5B0",
      accent: "#C17F3E",
      background: "#FAF6EE",
      surface: "#F0E8D5",
      surfaceAlt: "#E8DCC5",
      text: "#1A1410",
      textMuted: "#7A6A55",
      border: "#D4BF9A",
      highlight: "#C17F3E",
      cmyk: { primary: "C:0 M:4 Y:12 K:4", secondary: "C:0 M:12 Y:30 K:9", accent: "C:0 M:38 Y:68 K:24" },
    },
    typography: {
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(40px, 5.5vw, 88px)",
      titleSize: "clamp(20px, 2.8vw, 44px)",
      subtitleSize: "clamp(12px, 1.6vw, 20px)",
      bodySize: "clamp(10px, 1.1vw, 13px)",
      captionSize: "clamp(7px, 0.8vw, 9px)",
      headingWeight: "300",
      letterSpacing: "0.04em",
    },
    photoStyle: "Aérien désert, textures sable macro, silhouettes architecture",
    graphicStyle: "Lignes fines géométriques, espaces blancs, micro-détails",
    iconography: "Hairline icons, ultra-fin, géométrique minimal",
    boxStyle: "Bordures fines, fond sable léger, ombres douces",
    titleStyle: "Light weight, letterspacing étendu, majuscules aérées",
    dividerStyle: "Lignes fines simples, points réguliers espacés",
    dataVizStyle: "Barres fines beige/bronze, grille légère, annotations minimalistes",
    globalTone: "Épuré, luxueux discret, sophistiqué naturel",
    tailwind: {
      bg: "bg-[#FAF6EE]",
      bgSurface: "bg-[#F0E8D5]",
      bgSurfaceAlt: "bg-[#E8DCC5]",
      text: "text-[#1A1410]",
      textMuted: "text-[#7A6A55]",
      accent: "text-[#C17F3E]",
      border: "border-[#D4BF9A]",
      highlight: "text-[#C17F3E]",
      headerBg: "bg-[#F0E8D5]",
      footerBg: "bg-[#E8DCC5]",
    },
  },

  "carbon-black": {
    id: "carbon-black",
    name: "Carbon Black",
    tagline: "Infrastructure de haut rang, identité sans compromis",
    colors: {
      primary: "#0A0A0A",
      secondary: "#141414",
      accent: "#C9A84C",
      background: "#060606",
      surface: "#111111",
      surfaceAlt: "#1A1A1A",
      text: "#F0F0F0",
      textMuted: "#666666",
      border: "#2A2A2A",
      highlight: "#C9A84C",
      cmyk: { primary: "C:0 M:0 Y:0 K:97", secondary: "C:0 M:0 Y:0 K:92", accent: "C:0 M:16 Y:62 K:21" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(52px, 7vw, 104px)",
      titleSize: "clamp(26px, 3.2vw, 52px)",
      subtitleSize: "clamp(14px, 1.8vw, 22px)",
      bodySize: "clamp(10px, 1.2vw, 14px)",
      captionSize: "clamp(8px, 0.9vw, 10px)",
      headingWeight: "800",
      letterSpacing: "-0.03em",
    },
    photoStyle: "Noir et blanc contrasté, textures carbone macro, reflets or",
    graphicStyle: "Texture carbone subtile, filets or, géométrie ultra-précise",
    iconography: "Filled gold sur fond noir, poids visuel fort",
    boxStyle: "Fond noir profond, bordure or fine, coin biseauté",
    titleStyle: "Extra-bold noir/blanc, accent or sur lettre clé",
    dividerStyle: "Ligne or fine avec ornement central, filigrane",
    dataVizStyle: "Barres or sur noir, contraste maximal, valeurs en mono",
    globalTone: "Prestige absolu, exclusif, puissance discrète",
    tailwind: {
      bg: "bg-[#060606]",
      bgSurface: "bg-[#111111]",
      bgSurfaceAlt: "bg-[#1A1A1A]",
      text: "text-[#F0F0F0]",
      textMuted: "text-[#666666]",
      accent: "text-[#C9A84C]",
      border: "border-[#2A2A2A]",
      highlight: "text-[#C9A84C]",
      headerBg: "bg-[#0A0A0A]",
      footerBg: "bg-[#060606]",
    },
  },

  "arctic-data": {
    id: "arctic-data",
    name: "Arctic Data",
    tagline: "La clarté des données dans un environnement immaculé",
    colors: {
      primary: "#F8FBFF",
      secondary: "#EBF4FF",
      accent: "#0066FF",
      background: "#FFFFFF",
      surface: "#F2F7FF",
      surfaceAlt: "#E8F1FF",
      text: "#0A1628",
      textMuted: "#5578A0",
      border: "#C8DEFF",
      highlight: "#0066FF",
      cmyk: { primary: "C:2 M:1 Y:0 K:0", secondary: "C:8 M:4 Y:0 K:0", accent: "C:100 M:60 Y:0 K:0" },
    },
    typography: {
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(44px, 6vw, 92px)",
      titleSize: "clamp(22px, 3vw, 46px)",
      subtitleSize: "clamp(13px, 1.7vw, 21px)",
      bodySize: "clamp(10px, 1.1vw, 13px)",
      captionSize: "clamp(7px, 0.8vw, 9px)",
      headingWeight: "600",
      letterSpacing: "-0.01em",
    },
    photoStyle: "Installations refroidies, vapeur froide, bleu électrique pur",
    graphicStyle: "Data flow clean, isométrique bleu, grille fine sur blanc",
    iconography: "Outlined bleu, propre, consistant, system icons",
    boxStyle: "Blanc pur, ombre légère bleue, radius généreux",
    titleStyle: "Semi-bold, bleu électrique sur blanc, underline accent",
    dividerStyle: "Dégradé bleu-transparent, largeur variable",
    dataVizStyle: "Barres bleu electric, fond blanc, annotations claires",
    globalTone: "Technique, fiable, institutionnel clair",
    tailwind: {
      bg: "bg-white",
      bgSurface: "bg-[#F2F7FF]",
      bgSurfaceAlt: "bg-[#E8F1FF]",
      text: "text-[#0A1628]",
      textMuted: "text-[#5578A0]",
      accent: "text-[#0066FF]",
      border: "border-[#C8DEFF]",
      highlight: "text-[#0066FF]",
      headerBg: "bg-[#F2F7FF]",
      footerBg: "bg-[#0A1628]",
    },
  },

  "arabian-luxury": {
    id: "arabian-luxury",
    name: "Arabian Luxury",
    tagline: "Héritage millénaire, vision 2030",
    colors: {
      primary: "#1A0A2E",
      secondary: "#2D1045",
      accent: "#D4AF37",
      background: "#0F0620",
      surface: "#1F0D38",
      surfaceAlt: "#2A1448",
      text: "#F5E8D0",
      textMuted: "#9B7E60",
      border: "#4A2860",
      highlight: "#D4AF37",
      cmyk: { primary: "C:46 M:73 Y:0 K:82", secondary: "C:40 M:75 Y:0 K:73", accent: "C:0 M:17 Y:74 K:17" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(42px, 5.5vw, 88px)",
      titleSize: "clamp(22px, 2.8vw, 44px)",
      subtitleSize: "clamp(12px, 1.6vw, 20px)",
      bodySize: "clamp(10px, 1.1vw, 13px)",
      captionSize: "clamp(7px, 0.85vw, 9px)",
      headingWeight: "600",
      letterSpacing: "0.01em",
    },
    photoStyle: "Architecture islamique contemporaine, dorures, nuit qatarie",
    graphicStyle: "Motifs géométriques arabesques, filigrane or, calligraphie stylisée",
    iconography: "Or sur prune, ornemental, mix tradition/tech",
    boxStyle: "Prune profond, bordure or ornementale, texture velours",
    titleStyle: "Or sur prune, majuscules légèrement serif, prestige",
    dividerStyle: "Ornement géométrique central, filet or double",
    dataVizStyle: "Courbes or sur prune, gradient royal, élégance data",
    globalTone: "Majesteux, visionnaire, ancrage culturel fort",
    tailwind: {
      bg: "bg-[#0F0620]",
      bgSurface: "bg-[#1F0D38]",
      bgSurfaceAlt: "bg-[#2A1448]",
      text: "text-[#F5E8D0]",
      textMuted: "text-[#9B7E60]",
      accent: "text-[#D4AF37]",
      border: "border-[#4A2860]",
      highlight: "text-[#D4AF37]",
      headerBg: "bg-[#1A0A2E]",
      footerBg: "bg-[#0F0620]",
    },
  },

  "industrial-grid": {
    id: "industrial-grid",
    name: "Industrial Grid",
    tagline: "Robustesse industrielle, scalabilité sans limite",
    colors: {
      primary: "#1C2128",
      secondary: "#252D38",
      accent: "#FF6B35",
      background: "#141820",
      surface: "#1E2530",
      surfaceAlt: "#28303C",
      text: "#D8E0EB",
      textMuted: "#6878A0",
      border: "#323E50",
      highlight: "#FF6B35",
      cmyk: { primary: "C:30 M:18 Y:0 K:84", secondary: "C:28 M:16 Y:0 K:78", accent: "C:0 M:58 Y:79 K:0" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(46px, 6.5vw, 100px)",
      titleSize: "clamp(24px, 3vw, 48px)",
      subtitleSize: "clamp(13px, 1.7vw, 21px)",
      bodySize: "clamp(10px, 1.2vw, 14px)",
      captionSize: "clamp(8px, 0.9vw, 10px)",
      headingWeight: "700",
      letterSpacing: "-0.01em",
    },
    photoStyle: "Rack serveurs, cablage structuré, infrastructure physique",
    graphicStyle: "Grille isométrique, blueprints techniques, annotations",
    iconography: "Bold filled orange, technique, fonctionnel",
    boxStyle: "Fond acier sombre, accent orange, corner tags techniques",
    titleStyle: "Bold caps, accent orange sur dark, style blueprint",
    dividerStyle: "Double trait technique, hash marks de mesure",
    dataVizStyle: "Barres orange/acier, style engineering dashboard",
    globalTone: "Robuste, technique, opérationnel, confiance",
    tailwind: {
      bg: "bg-[#141820]",
      bgSurface: "bg-[#1E2530]",
      bgSurfaceAlt: "bg-[#28303C]",
      text: "text-[#D8E0EB]",
      textMuted: "text-[#6878A0]",
      accent: "text-[#FF6B35]",
      border: "border-[#323E50]",
      highlight: "text-[#FF6B35]",
      headerBg: "bg-[#1C2128]",
      footerBg: "bg-[#141820]",
    },
  },

  "quantum-blue": {
    id: "quantum-blue",
    name: "Quantum Blue",
    tagline: "Traitement des données à l'échelle quantique",
    colors: {
      primary: "#020B1A",
      secondary: "#041528",
      accent: "#00FFD1",
      background: "#010812",
      surface: "#061220",
      surfaceAlt: "#0A1A2E",
      text: "#CCE8FF",
      textMuted: "#3D6E99",
      border: "#0A2A4A",
      highlight: "#00FFD1",
      cmyk: { primary: "C:99 M:84 Y:0 K:90", secondary: "C:98 M:80 Y:0 K:85", accent: "C:100 M:0 Y:18 K:0" },
    },
    typography: {
      headingFont: "'IBM Plex Mono', monospace",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(44px, 5.8vw, 92px)",
      titleSize: "clamp(22px, 2.8vw, 44px)",
      subtitleSize: "clamp(12px, 1.6vw, 20px)",
      bodySize: "clamp(10px, 1.1vw, 13px)",
      captionSize: "clamp(7px, 0.85vw, 9px)",
      headingWeight: "500",
      letterSpacing: "0.02em",
    },
    photoStyle: "Long exposure data centers, fiber optics, quantum simulations",
    graphicStyle: "Particle systems, node networks, data flow 3D",
    iconography: "Outline phosphore vert/cyan, high-tech, abstract",
    boxStyle: "Glassmorphism vert-bleu, border lumineux, données flottantes",
    titleStyle: "Mono font, caractères lumineux, style terminal",
    dividerStyle: "Ligne de code, wave data, particules",
    dataVizStyle: "Network graphs phosphorescents, flows temps réel, matrices",
    globalTone: "Avant-garde, scientifique, puissance computationnelle",
    tailwind: {
      bg: "bg-[#010812]",
      bgSurface: "bg-[#061220]",
      bgSurfaceAlt: "bg-[#0A1A2E]",
      text: "text-[#CCE8FF]",
      textMuted: "text-[#3D6E99]",
      accent: "text-[#00FFD1]",
      border: "border-[#0A2A4A]",
      highlight: "text-[#00FFD1]",
      headerBg: "bg-[#020B1A]",
      footerBg: "bg-[#010812]",
    },
  },

  "emerald-vision": {
    id: "emerald-vision",
    name: "Emerald Vision",
    tagline: "Infrastructure durable, avenir vert garanti",
    colors: {
      primary: "#042E1A",
      secondary: "#063D24",
      accent: "#00E676",
      background: "#021510",
      surface: "#073A20",
      surfaceAlt: "#0A4828",
      text: "#C8F5DC",
      textMuted: "#4D9066",
      border: "#0D5530",
      highlight: "#00E676",
      cmyk: { primary: "C:99 M:0 Y:55 K:82", secondary: "C:99 M:0 Y:45 K:76", accent: "C:100 M:0 Y:54 K:10" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(46px, 6vw, 96px)",
      titleSize: "clamp(23px, 2.9vw, 46px)",
      subtitleSize: "clamp(13px, 1.7vw, 21px)",
      bodySize: "clamp(10px, 1.2vw, 14px)",
      captionSize: "clamp(8px, 0.9vw, 10px)",
      headingWeight: "700",
      letterSpacing: "-0.02em",
    },
    photoStyle: "Panneaux solaires, verdure, data center eco-responsable",
    graphicStyle: "Organique géométrique, feuilles circuit, biomorphique tech",
    iconography: "Vert émeraude, nature+tech hybride, leaves+chips",
    boxStyle: "Vert profond, border émeraude, texture légère",
    titleStyle: "Vert vif sur fond sombre, nature keywords",
    dividerStyle: "Courbe organique verte, growth line",
    dataVizStyle: "Barres croissance verte, KPIs sustainability, area charts",
    globalTone: "Responsable, ambitieux, tourné vers l'avenir durable",
    tailwind: {
      bg: "bg-[#021510]",
      bgSurface: "bg-[#073A20]",
      bgSurfaceAlt: "bg-[#0A4828]",
      text: "text-[#C8F5DC]",
      textMuted: "text-[#4D9066]",
      accent: "text-[#00E676]",
      border: "border-[#0D5530]",
      highlight: "text-[#00E676]",
      headerBg: "bg-[#042E1A]",
      footerBg: "bg-[#021510]",
    },
  },

  "sunset-desert": {
    id: "sunset-desert",
    name: "Sunset Desert",
    tagline: "Quand l'ambition rencontre l'horizon du Golfe",
    colors: {
      primary: "#1A0A05",
      secondary: "#2D1508",
      accent: "#FF7B2C",
      background: "#120704",
      surface: "#1E0D06",
      surfaceAlt: "#2A1208",
      text: "#FFE8D0",
      textMuted: "#9B6040",
      border: "#4A2010",
      highlight: "#FF7B2C",
      cmyk: { primary: "C:0 M:60 Y:80 K:90", secondary: "C:0 M:55 Y:75 K:82", accent: "C:0 M:52 Y:83 K:0" },
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(44px, 5.8vw, 92px)",
      titleSize: "clamp(22px, 2.8vw, 44px)",
      subtitleSize: "clamp(12px, 1.6vw, 20px)",
      bodySize: "clamp(10px, 1.1vw, 13px)",
      captionSize: "clamp(7px, 0.85vw, 9px)",
      headingWeight: "700",
      letterSpacing: "-0.01em",
    },
    photoStyle: "Couchers de soleil qataris, silhouettes gratte-ciels, skyline dorée",
    graphicStyle: "Dégradés chauds, horizons géométriques, sable en mouvement",
    iconography: "Orange chaud, filled, évocateur chaleur/énergie",
    boxStyle: "Brun sombre, border orange, chaleur visuelle",
    titleStyle: "Orange feu sur brun sombre, dynamique, élan",
    dividerStyle: "Horizon gradient orange-brun, ondulation",
    dataVizStyle: "Barres orange-rouge, palette chaleur, soleil data",
    globalTone: "Passionné, visionnaire, ancrage géographique fort",
    tailwind: {
      bg: "bg-[#120704]",
      bgSurface: "bg-[#1E0D06]",
      bgSurfaceAlt: "bg-[#2A1208]",
      text: "text-[#FFE8D0]",
      textMuted: "text-[#9B6040]",
      accent: "text-[#FF7B2C]",
      border: "border-[#4A2010]",
      highlight: "text-[#FF7B2C]",
      headerBg: "bg-[#1A0A05]",
      footerBg: "bg-[#120704]",
    },
  },

  "platinum-edge": {
    id: "platinum-edge",
    name: "Platinum Edge",
    tagline: "Précision absolue, exécution sans faille",
    colors: {
      primary: "#0D0D0D",
      secondary: "#161616",
      accent: "#E8E8E8",
      background: "#080808",
      surface: "#121212",
      surfaceAlt: "#1C1C1C",
      text: "#F5F5F5",
      textMuted: "#707070",
      border: "#282828",
      highlight: "#FFFFFF",
      cmyk: { primary: "C:0 M:0 Y:0 K:95", secondary: "C:0 M:0 Y:0 K:91", accent: "C:0 M:0 Y:0 K:9" },
    },
    typography: {
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "clamp(48px, 6.5vw, 104px)",
      titleSize: "clamp(24px, 3.2vw, 52px)",
      subtitleSize: "clamp(13px, 1.8vw, 22px)",
      bodySize: "clamp(10px, 1.2vw, 14px)",
      captionSize: "clamp(8px, 0.9vw, 10px)",
      headingWeight: "800",
      letterSpacing: "-0.04em",
    },
    photoStyle: "Noir et blanc HQ, abstraction pure, ombres dramatiques",
    graphicStyle: "Swiss grid, typographie pure, maximum whitespace",
    iconography: "Ultra-thin blanc sur noir, système iconique pur",
    boxStyle: "Noir absolu, contour blanc fin, minimalisme total",
    titleStyle: "Condensed extra-bold, blanc pur sur noir, typographie sculpture",
    dividerStyle: "1px blanc opaque, respiration maximale",
    dataVizStyle: "Blanc/gris sur noir, précision chirurgicale, élégance data",
    globalTone: "Absolu, luxe invisible, maîtrise totale",
    tailwind: {
      bg: "bg-[#080808]",
      bgSurface: "bg-[#121212]",
      bgSurfaceAlt: "bg-[#1C1C1C]",
      text: "text-[#F5F5F5]",
      textMuted: "text-[#707070]",
      accent: "text-[#E8E8E8]",
      border: "border-[#282828]",
      highlight: "text-white",
      headerBg: "bg-[#0D0D0D]",
      footerBg: "bg-[#080808]",
    },
  },

  "hearst-corporation": {
    id: "hearst-corporation",
    name: "Hearst Corporation",
    tagline: "Mining institutionnel, infrastructure durable, vision éditoriale",
    colors: {
      primary: "#FFFFFF",        // white
      secondary: "#F6FEF3",      // mint-green-lightest
      accent: "#A7FB90",         // mint-green (signature)
      background: "#FFFFFF",
      surface: "#FCFDFC",        // gin-lightest
      surfaceAlt: "#F6FEF3",     // mint-green-lightest
      text: "#000000",           // neutral-darkest
      textMuted: "#5C605C",      // gin-darker
      border: "rgba(0,0,0,0.15)",// neutral-darkest @ 15% (border officielle)
      highlight: "#A7FB90",      // mint-green
      cmyk: { primary: "C:0 M:0 Y:0 K:0", secondary: "C:3 M:0 Y:3 K:0", accent: "C:34 M:0 Y:43 K:2" },
    },
    typography: {
      headingFont: "Fkgrotesktrial, Arial, sans-serif",
      bodyFont: "Fkgrotesktrial, Arial, sans-serif",
      monoFont: "'IBM Plex Mono', monospace",
      heroSize: "5rem",          // heading-style-h1
      titleSize: "3rem",         // heading-style-h2
      subtitleSize: "1.5rem",    // heading-style-h5
      bodySize: "1rem",          // text-size-regular
      captionSize: "0.75rem",    // text-size-tiny
      headingWeight: "400",      // FK Grotesk Regular pour les H sur le site
      letterSpacing: "-0.03rem", // letter-spacing h2
    },
    photoStyle: "Photographie éditoriale clean, panneaux solaires, hardware mining, lumière naturelle, ratios mixtes",
    graphicStyle: "Whitespace généreux, grille fluide, typographie comme architecture, micro-illustrations dotted",
    iconography: "SVG monoline noir, tracé fin uniforme, géométrie simple",
    boxStyle: "Cartes blanches, border-radius 1rem, bordure rgba(0,0,0,.15) 1px, ombre soft",
    titleStyle: "FK Grotesk Regular 400, letter-spacing -0.03rem, casse normale, noir sur blanc",
    dividerStyle: "Filet 1px rgba(0,0,0,.15), respiration verticale large",
    dataVizStyle: "Barres mint-green #A7FB90 sur blanc, libellés noir, grille minimale",
    globalTone: "Éditorial corporate clean-tech, institutionnel scandinave, confiance souriante",
    tailwind: {
      bg: "bg-white",
      bgSurface: "bg-[#FCFDFC]",
      bgSurfaceAlt: "bg-[#F6FEF3]",
      text: "text-[#000000]",
      textMuted: "text-[#5C605C]",
      accent: "text-[#A7FB90]",
      border: "border-black/15",
      highlight: "bg-[#A7FB90]",
      headerBg: "bg-white",
      footerBg: "bg-[#000000]",
    },
  },
};

export const themeList = Object.values(themes);
export const defaultTheme = themes["futuristic-infra"];
