import { LayoutContent, LayoutType } from "./types";

/**
 * Generic defaults per layout type. Used as the base when a zone's layout is changed
 * to a type that has no zone-specific content.
 *
 * Resolution order in SectionBlock:
 *   LAYOUT_DEFAULTS[layoutType] → DEFAULT_CONTENT[zoneKey] → user overrides
 */
export const LAYOUT_DEFAULTS: Record<LayoutType, LayoutContent> = {
  hero: {
    eyebrow: "VISION STRATÉGIQUE",
    heroTitle: "FUTUR ONE",
    heroAccent: "DATACENTER",
    heroSubtitle: "Infrastructure critique Tier IV · 48MW Phase 1 · Qatar 2030",
  },
  "kpi-row": {
    kpis: [
      { value: "48MW",     label: "Puissance Phase 1" },
      { value: "200MW",    label: "Capacité totale" },
      { value: "99.9999%", label: "SLA Uptime" },
      { value: "1.3",      label: "PUE Target" },
    ],
  },
  "image-text": {
    imageLabel: "Site aérien",
    imageEyebrow: "CONTEXTE RÉGIONAL",
    imageBodyText:
      "Le marché MENA affiche une croissance de 34% annuelle en capacité data center. Futur One positionne le Qatar comme hub régional incontournable d'ici 2030.",
  },
  "two-col": {
    twoCol: {
      left: {
        label: "INFRASTRUCTURE",
        text: "Architecture 2N fully redundant. Cooling adiabatique haute efficacité. Fibre multi-carrier Tier 1.",
      },
      right: {
        label: "CERTIFICATIONS",
        items: ["Tier IV Uptime Institute", "ISO 27001", "SOC 2 Type II", "PCI-DSS Compliant"],
      },
    },
  },
  chart: {
    chartType: "bar",
    chartLabel: "Capacity Growth 2024→2030",
    chartStatLabel: "CROISSANCE",
    chartStatValue: "×4.2",
    chartStatSub: "capacité entre 2024 et 2030",
  },
  "text-full": {
    textEyebrow: "PARTENARIATS",
    bodyText:
      "Futur One s'appuie sur un réseau de partenaires stratégiques tier 1 : opérateurs télécom régionaux, fournisseurs hyperscale et institutions financières qataries, garantissant une base commerciale solide dès l'ouverture.",
    tags: ["Hyperscale", "Carrier Neutral", "AI-Ready"],
  },
  "image-full": {
    imageLabel: "Vue perspective datacenter",
    imageCaption: "Simulation architecturale Phase 1 — 48 000 m² · Doha, Qatar",
  },
  "three-kpi": {
    kpis: [
      { value: "400M$", label: "CAPEX Phase 1",   sub: "Investissement total" },
      { value: "34%",   label: "Croissance MENA", sub: "Demande annuelle" },
      { value: "2026",  label: "Go-Live Phase 1", sub: "Mise en service" },
    ],
  },
  "chart-text": {
    chartType: "donut",
    chartLabel: "Market Share MENA",
    chartStatLabel: "MARCHÉ TOTAL",
    chartStatValue: "$4.8B",
    chartStatSub: "Valeur marché MENA DC 2030",
  },
  quote: {
    quoteText:
      "L'infrastructure numérique est la nouvelle infrastructure pétrolière — celui qui la contrôle, contrôle l'économie.",
    quoteAttribution: "— Vision Qatar 2030, Axe Diversification Économique",
  },
  "image-grid": {
    gridLabels: ["Cooling", "Power", "Network", "Security"],
  },
  timeline: {
    timelineSteps: [
      { date: "2024", label: "Études & permis", done: true },
      { date: "2025", label: "Groundbreaking",  done: true },
      { date: "2026", label: "Phase 1 Go-Live", done: false },
      { date: "2030", label: "200MW Complet",   done: false },
    ],
  },
  blank: {},
};

/**
 * Zone-specific overrides applied on top of LAYOUT_DEFAULTS.
 * Use this to customize a zone's content beyond its layout's generic default
 * (e.g. add a section number prefix to the eyebrow).
 */
export const DEFAULT_CONTENT: Record<string, LayoutContent> = {
  "left-section-1":  { eyebrow: "01 — VISION STRATÉGIQUE" },
  "left-section-6":  { textEyebrow: "06 — PARTENARIATS" },
};
