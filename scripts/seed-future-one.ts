/**
 * Seed: "Future One — AI Sovereign Innovation Hub" two-pager (option B = print-plié).
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/seed-future-one.ts
 *
 * Mapping (option B, orthodoxe imprimerie) :
 *   App page 1 → left = BACK COVER (Qatar Label),     right = COVER (AI Sovereign…)
 *   App page 2 → left = INTÉRIEUR GAUCHE (Phrase 1+2), right = INTÉRIEUR DROIT (Phrase 3-5)
 *
 * Theme: sunset-desert + WHITE PAPER colorOverrides (bordeaux text + gold/sunset accents).
 */

import { db } from "@/db/client";
import { projects, pages, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { SectionZone } from "@/design-system";
import type {
  LayoutContent,
  LayoutType,
  BoxStyle,
  ImageData,
  ChartConfig,
} from "@/data/types";

const USER_EMAIL = "dev@futurone.local";
const PROJECT_NAME = "Future One — AI Sovereign Innovation Hub";
const THEME_ID = "sunset-desert";

// Strict palette : blanc · gris · bordeaux. H1 noir, H2/H3 gris, accent bordeaux.
const COLOR_OVERRIDES = {
  primary:    "#000000", // H1 noir
  secondary:  "#5C0F1A", // bordeaux mid pour secondaires structurels
  accent:     "#5C0F1A", // BORDEAUX accent
  background: "#FFFFFF", // blanc papier
  surface:    "#FFFFFF",
  surfaceAlt: "#F4F4F4", // gris très clair
  text:       "#000000", // body noir
  textMuted:  "#6B6B6B", // gris H2/H3
  border:     "#D4D4D4", // gris clair
  highlight:  "#3D0710", // bordeaux profond pour highlights
};

// ─── SVG placeholders (data URIs) ─────────────────────────────────────────────

const svg = (s: string) => `data:image/svg+xml;base64,${Buffer.from(s).toString("base64")}`;

// COVER : façade datacenter sunset (gros visuel droite du spread 1).
const SUNSET_FACADE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#1A050A"/>
      <stop offset="40%" stop-color="#5C0F1A"/>
      <stop offset="75%" stop-color="#FF7B2C"/>
      <stop offset="100%" stop-color="#FFC57A"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#3D0710" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="#FF7B2C" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#D4A24C" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <g opacity="0.95">
    <polygon points="0,300 0,900 600,900 700,260" fill="url(#glass)"/>
    <polygon points="600,260 600,900 1100,900 1200,200" fill="url(#glass)" opacity="0.85"/>
    <polygon points="1100,200 1100,900 1600,900 1600,170" fill="url(#glass)" opacity="0.75"/>
  </g>
  <g stroke="#FFC57A" stroke-width="1.2" opacity="0.6">
    <line x1="0" y1="450" x2="1600" y2="430"/>
    <line x1="0" y1="540" x2="1600" y2="520"/>
    <line x1="0" y1="630" x2="1600" y2="610"/>
    <line x1="0" y1="720" x2="1600" y2="700"/>
  </g>
  <g stroke="#FF7B2C" stroke-width="2" opacity="0.4">
    <line x1="200" y1="260" x2="200" y2="900"/>
    <line x1="400" y1="280" x2="400" y2="900"/>
    <line x1="700" y1="260" x2="700" y2="900"/>
    <line x1="900" y1="240" x2="900" y2="900"/>
    <line x1="1100" y1="200" x2="1100" y2="900"/>
    <line x1="1300" y1="190" x2="1300" y2="900"/>
  </g>
</svg>`);

// INTÉRIEUR GAUCHE : visuel 4:3 composite — moitié G = code/blanc, moitié D = sunset/dunes/hub.
const WORLD_VISION_COMPOSITE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sunset" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#3D0710"/>
      <stop offset="35%" stop-color="#5C0F1A"/>
      <stop offset="70%" stop-color="#FF7B2C"/>
      <stop offset="100%" stop-color="#FFD89E"/>
    </linearGradient>
    <linearGradient id="duneGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#C99466"/>
      <stop offset="100%" stop-color="#3D1A0A"/>
    </linearGradient>
  </defs>
  <!-- LEFT HALF : World Before AI (white bg + code lines) -->
  <rect x="0" y="0" width="800" height="1200" fill="#FAF6EF"/>
  <g font-family="'IBM Plex Mono', monospace" font-size="22" fill="#7A4A52" opacity="0.55">
    <text x="60" y="120">01  function future() {</text>
    <text x="60" y="160">02    if (limited.by(tech)) {</text>
    <text x="60" y="200">03      throw "DEV_BOTTLENECK"</text>
    <text x="60" y="240">04    }</text>
    <text x="60" y="280">05    while (cost &gt; 0) {</text>
    <text x="60" y="320">06      delay++;</text>
    <text x="60" y="360">07      creativity--;</text>
    <text x="60" y="400">08    }</text>
    <text x="60" y="440">09    return null;</text>
    <text x="60" y="480">10  }</text>
  </g>
  <g font-family="'IBM Plex Mono', monospace" font-size="14" fill="#D4B98A">
    <text x="60" y="540">// 4 punchlines</text>
    <text x="60" y="570">// LIMITED BY TECHNOLOGY</text>
    <text x="60" y="600">// DEPENDENT ON DEVELOPERS</text>
    <text x="60" y="630">// HIGH COSTS &amp; DELAYS</text>
    <text x="60" y="660">// CREATIVITY RESTRICTED</text>
  </g>
  <text x="60" y="1100" font-family="'Helvetica Neue', sans-serif" font-weight="900" font-size="48" fill="#3D0710" letter-spacing="2">WORLD</text>
  <text x="60" y="1150" font-family="'Helvetica Neue', sans-serif" font-weight="900" font-size="48" fill="#3D0710" letter-spacing="2">BEFORE AI</text>

  <!-- RIGHT HALF : Vision 2030 (sunset + dunes + hub + Doha skyline) -->
  <rect x="800" y="0" width="800" height="1200" fill="url(#sunset)"/>
  <!-- Doha skyline silhouette -->
  <g fill="#3D0710" opacity="0.95">
    <rect x="820" y="640" width="30" height="120"/>
    <rect x="855" y="610" width="40" height="150"/>
    <rect x="900" y="580" width="55" height="180"/>
    <rect x="960" y="600" width="35" height="160"/>
    <rect x="1000" y="560" width="45" height="200"/>
    <rect x="1050" y="540" width="60" height="220"/>
    <rect x="1115" y="600" width="35" height="160"/>
    <rect x="1155" y="570" width="50" height="190"/>
    <rect x="1210" y="620" width="30" height="140"/>
    <rect x="1245" y="585" width="45" height="175"/>
    <rect x="1295" y="560" width="40" height="200"/>
    <rect x="1340" y="600" width="55" height="160"/>
    <rect x="1400" y="640" width="30" height="120"/>
    <rect x="1435" y="610" width="40" height="150"/>
    <rect x="1480" y="630" width="50" height="130"/>
    <rect x="1535" y="600" width="45" height="160"/>
  </g>
  <!-- Hub circulaire à l'horizon (au milieu) -->
  <g transform="translate(1200,720)">
    <ellipse cx="0" cy="0" rx="160" ry="40" fill="#FAF6EF" opacity="0.85" stroke="#D4A24C" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="100" ry="22" fill="#5C0F1A" opacity="0.6"/>
  </g>
  <!-- Oasis : palmiers stylisés -->
  <g fill="#5C7C3A" opacity="0.85">
    <path d="M860,820 q-15,-30 -30,-50 q20,5 30,15 q10,-10 30,-15 q-15,20 -30,50 z"/>
    <path d="M920,830 q-12,-25 -25,-42 q17,4 25,13 q8,-9 25,-13 q-13,17 -25,42 z"/>
    <path d="M1500,825 q-15,-30 -30,-50 q20,5 30,15 q10,-10 30,-15 q-15,20 -30,50 z"/>
    <rect x="858" y="820" width="4" height="40" fill="#3D1A0A"/>
    <rect x="918" y="830" width="3" height="34" fill="#3D1A0A"/>
    <rect x="1498" y="825" width="4" height="40" fill="#3D1A0A"/>
  </g>
  <!-- Dunes au premier plan -->
  <path d="M800,920 Q1000,820 1200,890 T1600,880 L1600,1200 L800,1200 Z" fill="url(#duneGrad)"/>
  <path d="M800,1000 Q1100,940 1400,990 T1600,985 L1600,1200 L800,1200 Z" fill="#1A050A" opacity="0.9"/>
  <!-- Coque patchwork data center qui émerge de la dune -->
  <g transform="translate(1100,920)">
    <path d="M0,0 L160,-22 L300,-8 L320,120 L20,135 Z" fill="#1A050A" stroke="#D4A24C" stroke-width="2"/>
    <g fill="#FF7B2C" opacity="0.85">
      <rect x="20" y="14" width="36" height="22"/>
      <rect x="62" y="10" width="36" height="22"/>
      <rect x="104" y="6" width="36" height="22"/>
      <rect x="146" y="2" width="36" height="22"/>
      <rect x="188" y="-2" width="36" height="22"/>
      <rect x="230" y="-6" width="36" height="22"/>
      <rect x="20" y="48" width="36" height="22" opacity="0.7"/>
      <rect x="62" y="44" width="36" height="22" opacity="0.7"/>
      <rect x="104" y="40" width="36" height="22" opacity="0.7"/>
      <rect x="146" y="36" width="36" height="22" opacity="0.7"/>
      <rect x="188" y="32" width="36" height="22" opacity="0.7"/>
      <rect x="230" y="28" width="36" height="22" opacity="0.7"/>
    </g>
  </g>
  <!-- 2 silhouettes humaines au pied de la dune (regard à l'horizon) -->
  <g fill="#1A050A" transform="translate(880,950)">
    <ellipse cx="0" cy="-30" rx="6" ry="8"/>
    <path d="M-7,-22 L-9,18 L-3,18 L-2,0 L2,0 L3,18 L9,18 L7,-22 Z"/>
    <ellipse cx="22" cy="-26" rx="5" ry="7"/>
    <path d="M16,-19 L14,14 L19,14 L20,0 L24,0 L25,14 L30,14 L28,-19 Z"/>
  </g>

  <!-- Labels in-scene -->
  <text x="1200" y="160" font-family="'Helvetica Neue', sans-serif" font-weight="900" font-size="56" fill="#FAF6EF" letter-spacing="3" text-anchor="middle">VISION 2030</text>
  <text x="1200" y="200" font-family="'IBM Plex Mono', monospace" font-size="16" fill="#FFD89E" letter-spacing="4" text-anchor="middle">DOHA · QATAR</text>
</svg>`);

// INTÉRIEUR DROIT — visuel 1 : photo data center (low angle hero shot).
const DATA_CENTER_HERO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="skyHero" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#3D0710"/>
      <stop offset="40%" stop-color="#7A1525"/>
      <stop offset="75%" stop-color="#FF7B2C"/>
      <stop offset="100%" stop-color="#FFD89E"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#skyHero)"/>
  <!-- Building en perspective low-angle -->
  <g>
    <polygon points="0,1200 0,400 800,250 1600,400 1600,1200" fill="#1A050A"/>
    <polygon points="200,1200 200,520 800,400 1400,520 1400,1200" fill="#3D0710"/>
    <!-- Verre teinté avec reflets sunset -->
    <g fill="#FF7B2C" opacity="0.85">
      <rect x="240" y="560" width="80" height="60"/>
      <rect x="340" y="540" width="80" height="60"/>
      <rect x="440" y="520" width="80" height="60"/>
      <rect x="540" y="500" width="80" height="60"/>
      <rect x="640" y="480" width="80" height="60"/>
      <rect x="740" y="460" width="80" height="60"/>
      <rect x="840" y="480" width="80" height="60"/>
      <rect x="940" y="500" width="80" height="60"/>
      <rect x="1040" y="520" width="80" height="60"/>
      <rect x="1140" y="540" width="80" height="60"/>
      <rect x="1240" y="560" width="80" height="60"/>
    </g>
    <g fill="#D4A24C" opacity="0.6">
      <rect x="240" y="640" width="80" height="60"/>
      <rect x="340" y="620" width="80" height="60"/>
      <rect x="440" y="600" width="80" height="60"/>
      <rect x="540" y="580" width="80" height="60"/>
      <rect x="640" y="560" width="80" height="60"/>
      <rect x="740" y="540" width="80" height="60"/>
      <rect x="840" y="560" width="80" height="60"/>
      <rect x="940" y="580" width="80" height="60"/>
      <rect x="1040" y="600" width="80" height="60"/>
      <rect x="1140" y="620" width="80" height="60"/>
      <rect x="1240" y="640" width="80" height="60"/>
    </g>
    <g fill="#7A1525" opacity="0.7">
      <rect x="240" y="720" width="80" height="60"/>
      <rect x="340" y="700" width="80" height="60"/>
      <rect x="440" y="680" width="80" height="60"/>
      <rect x="540" y="660" width="80" height="60"/>
      <rect x="640" y="640" width="80" height="60"/>
      <rect x="740" y="620" width="80" height="60"/>
      <rect x="840" y="640" width="80" height="60"/>
      <rect x="940" y="660" width="80" height="60"/>
      <rect x="1040" y="680" width="80" height="60"/>
      <rect x="1140" y="700" width="80" height="60"/>
      <rect x="1240" y="720" width="80" height="60"/>
    </g>
    <!-- Ligne de structure dorée -->
    <g stroke="#D4A24C" stroke-width="2" opacity="0.7" fill="none">
      <line x1="200" y1="520" x2="1400" y2="520"/>
      <line x1="200" y1="780" x2="1400" y2="780"/>
      <line x1="800" y1="400" x2="800" y2="1200"/>
    </g>
  </g>
  <!-- Soleil au centre -->
  <circle cx="800" cy="280" r="80" fill="#FFD89E" opacity="0.9"/>
  <circle cx="800" cy="280" r="60" fill="#FFFFFF" opacity="0.8"/>
</svg>`);

// INTÉRIEUR DROIT — visuel 2 : drone master plan (vue aérienne hub + campus + stade).
const HUB_AERIAL = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="ground" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#5C7C3A"/>
      <stop offset="50%" stop-color="#B8794A"/>
      <stop offset="100%" stop-color="#3D1A0A"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#ground)"/>
  <g opacity="0.45" stroke="#3D0710" stroke-width="1">
    <path d="M0,200 Q400,150 800,180 T1600,170"/>
    <path d="M0,300 Q500,260 1000,290 T1600,280"/>
    <path d="M0,950 Q500,920 1000,940 T1600,935"/>
  </g>
  <!-- HUB central (forme ovale architecturale) -->
  <g transform="translate(800,580)">
    <ellipse cx="0" cy="0" rx="320" ry="190" fill="#FAF6EF" opacity="0.95"/>
    <ellipse cx="0" cy="0" rx="200" ry="120" fill="url(#ground)"/>
    <ellipse cx="0" cy="0" rx="320" ry="190" fill="none" stroke="#D4A24C" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="200" ry="120" fill="none" stroke="#D4A24C" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
  <!-- CAMPUS (résidences) -->
  <g fill="#FAF6EF" opacity="0.9">
    <rect x="200" y="780" width="100" height="80"/>
    <rect x="320" y="800" width="80" height="60"/>
    <rect x="430" y="790" width="120" height="70"/>
    <rect x="200" y="900" width="90" height="70"/>
    <rect x="310" y="910" width="100" height="60"/>
    <rect x="1100" y="790" width="90" height="70"/>
    <rect x="1210" y="780" width="110" height="80"/>
    <rect x="1340" y="795" width="70" height="65"/>
    <rect x="1100" y="900" width="100" height="60"/>
    <rect x="1220" y="910" width="80" height="70"/>
  </g>
  <!-- STADE (rectangle vert avec ligne centrale + cercle + buts) -->
  <g transform="translate(180,1010)">
    <rect width="280" height="160" rx="12" fill="#5C7C3A" stroke="#FAF6EF" stroke-width="3"/>
    <line x1="140" y1="0" x2="140" y2="160" stroke="#FAF6EF" stroke-width="2"/>
    <circle cx="140" cy="80" r="22" fill="none" stroke="#FAF6EF" stroke-width="2"/>
    <rect x="0" y="60" width="20" height="40" fill="none" stroke="#FAF6EF" stroke-width="2"/>
    <rect x="260" y="60" width="20" height="40" fill="none" stroke="#FAF6EF" stroke-width="2"/>
  </g>
  <!-- Routes / accès -->
  <g stroke="#FAF6EF" stroke-width="6" opacity="0.6" fill="none">
    <path d="M0,580 L460,580"/>
    <path d="M1140,580 L1600,580"/>
    <path d="M800,80 L800,380"/>
    <path d="M800,780 L800,1100"/>
  </g>
  <!-- Labels in-scene -->
  <text x="800" y="100" font-family="'Helvetica Neue', sans-serif" font-weight="900" font-size="42" fill="#FAF6EF" letter-spacing="6" text-anchor="middle">DRONE MASTER PLAN</text>
  <text x="800" y="138" font-family="'IBM Plex Mono', monospace" font-size="16" fill="#D4B98A" letter-spacing="4" text-anchor="middle">HUB · CAMPUS · STADE</text>
</svg>`);

// BACK COVER : drapeau Qatar discret bordeaux (cohérent palette, pas le maroon officiel pur).
const QATAR_FLAG = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
  <rect width="280" height="110" fill="#FFFFFF"/>
  <rect x="40" y="15" width="200" height="80" fill="#5C0F1A"/>
  <path d="M40,15 L130,15 L143,20 L130,25 L143,30 L130,35 L143,40 L130,45 L143,50 L130,55 L143,60 L130,65 L143,70 L130,75 L143,80 L130,85 L143,90 L130,95 L40,95 Z" fill="#FFFFFF"/>
</svg>`);

// LOGO PASTOR (depuis l'image fournie : cadre rouge + texte rouge).
const PASTOR_LOGO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" preserveAspectRatio="xMidYMid meet">
  <rect width="520" height="280" fill="#FFFFFF"/>
  <rect x="30" y="30" width="460" height="220" rx="36" fill="none" stroke="#D81C2F" stroke-width="14"/>
  <rect x="60" y="60" width="400" height="160" rx="22" fill="none" stroke="#D81C2F" stroke-width="9"/>
  <text x="260" y="148" fill="#D81C2F" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="50" letter-spacing="2">J.B. PASTOR &amp; FILS</text>
  <text x="260" y="200" fill="#D81C2F" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="38" letter-spacing="6">MONACO</text>
</svg>`);

// LOGO FUTURE ONE (placeholder F1, palette stricte blanc/noir/bordeaux).
const FUTURE_ONE_BADGE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
  <rect width="600" height="200" fill="#FFFFFF"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="120" height="120" fill="#5C0F1A"/>
    <text x="60" y="82" fill="#FFFFFF" text-anchor="middle"
      font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="60">F1</text>
  </g>
  <g transform="translate(190,60)">
    <text x="0" y="40" fill="#000000" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="46" letter-spacing="-1">FUTURE</text>
    <text x="0" y="92" fill="#5C0F1A" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="46" letter-spacing="-1">ONE</text>
  </g>
</svg>`);

// LOGO HPR METRICS (triangle bordeaux + titre METRICS noir).
const HPR_METRICS = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
  <rect width="600" height="360" fill="#FFFFFF"/>
  <polygon points="300,40 520,260 80,260" fill="none" stroke="#5C0F1A" stroke-width="14"/>
  <polygon points="300,40 520,260 80,260" fill="none" stroke="#6B6B6B" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="300" y="180" fill="#5C0F1A" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="36" letter-spacing="6">HPR</text>
  <text x="300" y="320" fill="#000000" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="42" letter-spacing="14">METRICS</text>
</svg>`);

// STAMP GREEN ÉCO (badge vert distinct, hors palette bordeaux pour contraste).
const STAMP_GREEN = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
  <rect width="300" height="300" fill="#FFFFFF"/>
  <circle cx="150" cy="150" r="120" fill="#2D9B4E"/>
  <circle cx="150" cy="150" r="120" fill="none" stroke="#1F6B36" stroke-width="4" stroke-dasharray="3 3"/>
  <circle cx="150" cy="150" r="100" fill="none" stroke="#FAF6EF" stroke-width="2"/>
  <text x="150" y="120" fill="#FAF6EF" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="22" letter-spacing="3">STAMP GREEN</text>
  <text x="150" y="155" fill="#FAF6EF" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="48" letter-spacing="4">ÉCO</text>
  <text x="150" y="195" fill="#FAF6EF" text-anchor="middle"
    font-family="'IBM Plex Mono', monospace" font-weight="700" font-size="18" letter-spacing="3">CO₂ CREDIT</text>
  <text x="150" y="225" fill="#FAF6EF" text-anchor="middle"
    font-family="'IBM Plex Mono', monospace" font-size="13" letter-spacing="2">CARBON LABEL</text>
</svg>`);

// ─── Box-style presets (palette stricte blanc/gris/bordeaux) ──────────────────

// BOX_GOLD remplacé par bordure bordeaux double + brackets, pas de gradient.
const BOX_GOLD: BoxStyle = {
  fill: "transparent", border: "double", borderWidth: 2, borderSides: "all",
  radius: "square", shadow: "soft", corners: "brackets",
};
const BOX_BRACKETS: BoxStyle = {
  fill: "transparent", border: "dashed", borderWidth: 1, borderSides: "all",
  radius: "square", shadow: "none", corners: "brackets",
};
const BOX_HEAT: BoxStyle = {
  fill: "transparent", border: "solid", borderWidth: 4, borderSides: "bottom",
  radius: "soft", shadow: "none", corners: "none",
};
const BOX_FRAME: BoxStyle = {
  fill: "surfaceAlt", border: "solid", borderWidth: 1, borderSides: "all",
  radius: "soft", shadow: "soft", corners: "none",
};
const BOX_DIVIDER: BoxStyle = {
  fill: "transparent", border: "solid", borderWidth: 1, borderSides: "y",
  radius: "square", shadow: "none", corners: "none",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Block = {
  zoneKey: string;
  layout: LayoutType;
  content?: LayoutContent;
  boxStyle?: Partial<BoxStyle>;
  imageSlot?: { role: string; data: Partial<ImageData> };
  chartSlot?: { role: string; data: Partial<ChartConfig> };
};

type PageSpec = {
  id: string;
  name: string;
  zonesLeft:  SectionZone[];
  zonesRight: SectionZone[];
  blocks: Block[];
  hideHeader?: boolean;
  hideFooter?: boolean;
};

function buildPage(spec: PageSpec) {
  const layoutOverrides: Record<string, LayoutType> = {};
  const contentStore: Record<string, LayoutContent> = {};
  const boxStyles: Record<string, Partial<BoxStyle>> = {};
  const images: Record<string, Partial<ImageData>> = {};
  const chartConfigs: Record<string, Partial<ChartConfig>> = {};

  for (const b of spec.blocks) {
    layoutOverrides[b.zoneKey] = b.layout;
    if (b.content) contentStore[b.zoneKey] = b.content;
    if (b.boxStyle) boxStyles[b.zoneKey] = b.boxStyle;
    if (b.imageSlot) images[`${b.zoneKey}-${b.imageSlot.role}`] = b.imageSlot.data;
    if (b.chartSlot) chartConfigs[`${b.zoneKey}-${b.chartSlot.role}`] = b.chartSlot.data;
  }

  return {
    id: spec.id,
    name: spec.name,
    hideHeader: spec.hideHeader ?? false,
    hideFooter: spec.hideFooter ?? false,
    zones: { left: spec.zonesLeft, right: spec.zonesRight },
    layoutOverrides,
    contentStore,
    boxStyles,
    images,
    chartConfigs,
  };
}

// ─── PAGE 1 — BACK COVER (left) | COVER (right) ───────────────────────────────
// Independent grids per side.

const PAGE_1_LEFT: SectionZone[] = [
  { id: "header",    label: "HEADER",    heightRatio: 0.08 },
  { id: "section-1", label: "DRAPEAU",   heightRatio: 0.32 },
  { id: "section-2", label: "TITRE",     heightRatio: 0.18 },
  { id: "section-3", label: "BENEFITS",  heightRatio: 0.18 },
  { id: "section-4", label: "PUNCHLINE", heightRatio: 0.16 },
  { id: "footer",    label: "FOOTER",    heightRatio: 0.08 },
];

const PAGE_1_RIGHT: SectionZone[] = [
  { id: "header",    label: "HEADER",      heightRatio: 0.08 },
  { id: "section-1", label: "FAÇADE",      heightRatio: 0.30 },
  { id: "section-2", label: "HERO TITLE",  heightRatio: 0.18 },
  { id: "section-3", label: "POSITIONING", heightRatio: 0.14 },
  { id: "section-4", label: "LOGO F1",     heightRatio: 0.12 },
  { id: "section-5", label: "LOGO PASTOR", heightRatio: 0.10 },
  { id: "footer",    label: "FOOTER",      heightRatio: 0.08 },
];

const page1 = buildPage({
  id: randomUUID(),
  name: "Back Cover · Cover",
  zonesLeft:  PAGE_1_LEFT,
  zonesRight: PAGE_1_RIGHT,
  hideHeader: true,
  hideFooter: true,
  blocks: [
    // ── LEFT = BACK COVER (Qatar Label Program) ─────────────────────────────
    {
      zoneKey: "left-section-1",
      layout: "image-full",
      content: {
        imageEyebrow: "PHASE 5 · OFFICIAL CERTIFICATION",
        imageLabel: "QATAR",
        imageCaption: "Drapeau · standard Qatar (palette bordeaux)",
      },
      imageSlot: { role: "image-main", data: { src: QATAR_FLAG, fit: "contain", overlay: "none" } },
    },
    {
      zoneKey: "left-section-2",
      layout: "hero",
      content: {
        eyebrow: "QATAR LABEL PROGRAM",
        heroTitle: "BUILT IN",
        heroAccent: "QATAR",
        heroSubtitle: "Official certification for high-potential companies.",
      },
      boxStyle: BOX_GOLD,
    },
    {
      zoneKey: "left-section-3",
      layout: "two-col",
      content: {
        twoCol: {
          left: {
            label: "BENEFITS",
            text: "Sovereign infrastructure, fast-track admission, premium living. Future One companies enter a frictionless, high-trust environment.",
          },
          right: {
            label: "PACKAGE",
            items: [
              "0% tax environment",
              "Fast company setup & full ownership",
              "Housing, education, healthcare packages",
            ],
          },
        },
      },
      boxStyle: BOX_DIVIDER,
    },
    {
      zoneKey: "left-section-4",
      layout: "quote",
      content: {
        quoteText: "Built in Qatar. Scaled to the world.",
        quoteAttribution: "— Future One",
      },
      boxStyle: BOX_HEAT,
    },

    // ── RIGHT = COVER (AI Sovereign Innovation Hub) ─────────────────────────
    {
      zoneKey: "right-section-1",
      layout: "image-full",
      content: {
        imageEyebrow: "FUTURE ONE",
        imageLabel: "AI SOVEREIGN INNOVATION HUB",
        imageCaption: "Façade sunset · Hearst Qatar",
      },
      imageSlot: { role: "image-main", data: { src: SUNSET_FACADE, fit: "cover", overlay: "none" } },
    },
    {
      zoneKey: "right-section-2",
      layout: "hero",
      content: {
        eyebrow: "FUTURE ONE",
        heroTitle: "AI SOVEREIGN",
        heroAccent: "INNOVATION HUB",
        heroSubtitle: "AI remove limits.",
      },
      boxStyle: BOX_GOLD,
    },
    {
      zoneKey: "right-section-3",
      layout: "text-full",
      content: {
        textEyebrow: "POSITIONING",
        bodyText:
          "Future One is an AI Sovereign innovation Hub run by Hearst Qatar as well as top-tier partners.",
        tags: ["Hearst Qatar", "Norman Foster", "JB Pastor & Fils"],
      },
      boxStyle: BOX_BRACKETS,
    },
    {
      zoneKey: "right-section-4",
      layout: "image-full",
      content: {
        imageEyebrow: "BRAND",
        imageLabel: "FUTURE ONE",
        imageCaption: "Logo officiel · placeholder à remplacer",
      },
      imageSlot: { role: "image-main", data: { src: FUTURE_ONE_BADGE, fit: "contain", overlay: "none" } },
    },
    {
      zoneKey: "right-section-5",
      layout: "image-full",
      content: {
        imageEyebrow: "MONACO · DEPUIS 1880",
        imageLabel: "JB PASTOR & FILS",
        imageCaption: "Partenaire fondateur",
      },
      imageSlot: { role: "image-main", data: { src: PASTOR_LOGO, fit: "contain", overlay: "none" } },
    },
  ],
});

// ─── PAGE 2 — INTÉRIEUR GAUCHE (left) | INTÉRIEUR DROIT (right) ────────────────
// Independent grids per side.

const PAGE_2_LEFT: SectionZone[] = [
  { id: "header",    label: "HEADER",     heightRatio: 0.08 },
  { id: "section-1", label: "TITRE",      heightRatio: 0.10 },
  { id: "section-2", label: "VISUEL 4:3", heightRatio: 0.42 }, // gros — World/Vision composite
  { id: "section-3", label: "PUNCHLINES", heightRatio: 0.12 },
  { id: "section-4", label: "PHRASE 2",   heightRatio: 0.20 },
  { id: "footer",    label: "FOOTER",     heightRatio: 0.08 },
];

const PAGE_2_RIGHT: SectionZone[] = [
  { id: "header",    label: "HEADER",        heightRatio: 0.08 },
  { id: "section-1", label: "TITRE",         heightRatio: 0.08 },
  { id: "section-2", label: "DATA CENTER",   heightRatio: 0.26 },
  { id: "section-3", label: "PHRASE PASTOR", heightRatio: 0.10 },
  { id: "section-4", label: "DRONE PLAN",    heightRatio: 0.16 },
  { id: "section-5", label: "KPIs+PUNCH",    heightRatio: 0.12 },
  { id: "section-6", label: "HPR+QATAR",     heightRatio: 0.12 },
  { id: "footer",    label: "FOOTER",        heightRatio: 0.08 },
];

const page2 = buildPage({
  id: randomUUID(),
  name: "Intérieur Gauche · Intérieur Droit",
  zonesLeft:  PAGE_2_LEFT,
  zonesRight: PAGE_2_RIGHT,
  hideHeader: true,
  hideFooter: true,
  blocks: [
    // ── LEFT = INTÉRIEUR GAUCHE (Phrase 1 World/Vision + Phrase 2 stats) ────
    {
      zoneKey: "left-section-1",
      layout: "hero",
      content: {
        eyebrow: "PHRASE 1",
        heroTitle: "FUTUR ONE",
        heroAccent: "AI remove limits",
      },
      boxStyle: BOX_HEAT,
    },
    {
      zoneKey: "left-section-2",
      layout: "image-full",
      content: {
        imageEyebrow: "WORLD BEFORE AI · VISION 2030",
        imageLabel: "DU CODE AU SUNSET — COQUE DATA CENTER ÉMERGE",
        imageCaption: "4:3 unique · gauche : code/blanc · droite : sunset/dunes/hub Doha",
      },
      imageSlot: { role: "image-main", data: { src: WORLD_VISION_COMPOSITE, fit: "cover", overlay: "none" } },
    },
    {
      zoneKey: "left-section-3",
      layout: "text-full",
      content: {
        textEyebrow: "4 PUNCHLINES — WORLD BEFORE AI",
        bodyText: "Quatre verrous que l'IA fait sauter.",
        tags: [
          "LIMITED BY TECHNOLOGY",
          "DEPENDENT ON DEVELOPERS",
          "HIGH COSTS & DELAYS",
          "CREATIVITY RESTRICTED",
        ],
      },
      boxStyle: BOX_BRACKETS,
    },
    {
      zoneKey: "left-section-4",
      layout: "three-kpi",
      content: {
        kpis: [
          { value: "2025", label: "YEAR",      sub: "Phrase 2 · référence" },
          { value: "75%",  label: "BEFORE AI", sub: "Start-up failure" },
          { value: "43%",  label: "WITH AI",   sub: "Start-up failure" },
        ],
      },
      boxStyle: BOX_GOLD,
    },

    // ── RIGHT = INTÉRIEUR DROIT (Phrase 3-5 : Why + Hub + HPR + Qatar Label)
    {
      zoneKey: "right-section-1",
      layout: "hero",
      content: {
        eyebrow: "PHRASE 3",
        heroTitle: "WHY FUTURE ONE",
        heroAccent: "PROJECT ?",
      },
      boxStyle: BOX_HEAT,
    },
    {
      zoneKey: "right-section-2",
      layout: "image-full",
      content: {
        imageEyebrow: "HEARST ONE IS THE SYMBOL OF VISION 2030",
        imageLabel: "PHOTO DATA CENTER",
        imageCaption: "Low-Angle Hero Shot · caméra vers le ciel · coucher de soleil · stamp green éco · CO₂",
      },
      imageSlot: { role: "image-main", data: { src: DATA_CENTER_HERO, fit: "cover", overlay: "none" } },
    },
    {
      zoneKey: "right-section-3",
      layout: "image-text",
      content: {
        imageEyebrow: "TRANSITION",
        imageLabel: "JB PASTOR & FILS",
        imageBodyText:
          "Pierre fondatrice — Monaco, depuis 1880. JB Pastor & Fils accompagne Future One comme partenaire historique du bâti souverain.",
      },
      imageSlot: { role: "image-main", data: { src: PASTOR_LOGO, fit: "contain", overlay: "none" } },
      boxStyle: BOX_FRAME,
    },
    {
      zoneKey: "right-section-4",
      layout: "image-full",
      content: {
        imageEyebrow: "DRONE MASTER PLAN",
        imageLabel: "PHOTO HUB · CAMPUS · STADE",
        imageCaption: "Vue aérienne stratégique",
      },
      imageSlot: { role: "image-main", data: { src: HUB_AERIAL, fit: "cover", overlay: "none" } },
    },
    {
      zoneKey: "right-section-5",
      layout: "two-col",
      content: {
        twoCol: {
          left: {
            label: "CAMPUS · CHIFFRES CLÉS",
            text: "17 HA — Total Campus (Hub · résidences · life). 15 K SQM — Core Hub. 3 000–4 000 — Target Population.",
          },
          right: {
            label: "PUNCHLINE",
            items: [
              "AI is a new gas",
              "Compute is the infrastructure of Nations",
            ],
          },
        },
      },
      boxStyle: BOX_DIVIDER,
    },
    {
      zoneKey: "right-section-6",
      layout: "image-text",
      content: {
        imageEyebrow: "A POSITIVE REVOLUTION",
        imageLabel: "HPR METRICS · QATAR LABEL PROGRAMME",
        imageBodyText:
          "HPR = Performance × Well-Being × Social Integration. AI gives everyone the opportunity to create, innovate. (Phrase 5)",
      },
      imageSlot: { role: "image-main", data: { src: HPR_METRICS, fit: "contain", overlay: "none" } },
      boxStyle: BOX_GOLD,
    },
  ],
});

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  const [user] = await db.select().from(users).where(eq(users.email, USER_EMAIL));
  if (!user) throw new Error(`User ${USER_EMAIL} not found in DB`);

  const existing = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.userId, user.id), eq(projects.name, PROJECT_NAME)));

  if (existing.length > 0) {
    for (const p of existing) {
      await db.delete(projects).where(eq(projects.id, p.id));
    }
    console.log(`  Removed ${existing.length} previous seed(s).`);
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: user.id,
      name: PROJECT_NAME,
      activeThemeId: THEME_ID,
      colorOverrides: COLOR_OVERRIDES,
      showGrid: false,
    })
    .returning();

  const rows = [page1, page2].map((p, i) => ({
    id:              p.id,
    projectId:       project.id,
    orderIndex:      i,
    name:            p.name,
    hideHeader:      p.hideHeader,
    hideFooter:      p.hideFooter,
    zones:           p.zones as unknown as object[],
    contentStore:    p.contentStore as object,
    layoutOverrides: p.layoutOverrides as object,
    boxStyles:       p.boxStyles as object,
    images:          p.images as object,
    chartConfigs:    p.chartConfigs as object,
  }));

  await db.insert(pages).values(rows);

  console.log("");
  console.log("  Future One re-seeded · Option B (print plié)");
  console.log(`     Project: ${project.id}`);
  console.log(`     Open:    http://localhost:3001/projects/${project.id}`);
  console.log("");
  console.log("  ⚠️  Ferme tout onglet ouvert sur l'ancien project ID avant de recharger.");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
