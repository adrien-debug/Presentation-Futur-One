import { Template, Page, LayoutType, LayoutContent } from "./types";
import { SPREAD_ZONES } from "@/design-system";

// Helper: zones par défaut (8 zones standards)
function defaultZones() {
  return SPREAD_ZONES.map((z) => ({ ...z }));
}

// Helper: build a Page with custom layouts + content per zone
function buildPage(
  id: string,
  name: string,
  layouts: { side: "left" | "right"; zoneId: string; layout: LayoutType }[],
  content: { side: "left" | "right"; zoneId: string; data: LayoutContent }[]
): Page {
  const layoutOverrides: Record<string, LayoutType> = {};
  for (const l of layouts) layoutOverrides[`${l.side}-${l.zoneId}`] = l.layout;
  const contentStore: Record<string, LayoutContent> = {};
  for (const c of content) contentStore[`${c.side}-${c.zoneId}`] = c.data;
  return {
    id,
    name,
    zones: defaultZones(),
    contentStore,
    layoutOverrides,
    boxStyles: {},
    images: {},
    chartConfigs: {},
  };
}

// ─── 1. TECH PITCH ────────────────────────────────────────────────────────────
const techPitch: Template = {
  id: "tech-pitch",
  name: "Tech Pitch",
  description: "Pitch B2B/startup tech — vision produit, traction, roadmap technique.",
  themeId: "quantum-blue",
  tags: ["tech"],
  pages: [
    buildPage(
      "tech-pitch-cover",
      "Cover",
      [
        { side: "left",  zoneId: "section-1", layout: "hero" },
        { side: "left",  zoneId: "section-2", layout: "kpi-row" },
        { side: "left",  zoneId: "section-3", layout: "image-text" },
        { side: "left",  zoneId: "section-4", layout: "two-col" },
        { side: "left",  zoneId: "section-5", layout: "chart" },
        { side: "left",  zoneId: "section-6", layout: "quote" },
        { side: "right", zoneId: "section-1", layout: "image-full" },
        { side: "right", zoneId: "section-2", layout: "three-kpi" },
        { side: "right", zoneId: "section-3", layout: "chart-text" },
        { side: "right", zoneId: "section-4", layout: "timeline" },
        { side: "right", zoneId: "section-5", layout: "image-grid" },
        { side: "right", zoneId: "section-6", layout: "text-full" },
      ],
      [
        { side: "left", zoneId: "section-1", data: {
          eyebrow: "PITCH SÉRIE A · 2026",
          heroTitle: "PROCHAINE",
          heroAccent: "GÉNÉRATION D'INFRA IA",
          heroSubtitle: "Compute distribué pour modèles >100B paramètres · Latence subseconde · Edge multi-régional",
        }},
        { side: "left", zoneId: "section-2", data: {
          kpis: [
            { value: "+340%", label: "Croissance ARR" },
            { value: "$12M",  label: "ARR Q4 2025" },
            { value: "47",    label: "Clients enterprise" },
            { value: "22",    label: "Engineers" },
          ],
        }},
        { side: "left", zoneId: "section-3", data: {
          imageLabel: "Architecture distribuée",
          imageEyebrow: "MARCHÉ ADRESSABLE",
          imageBodyText: "Le marché de l'infrastructure IA atteindra $387B d'ici 2030. Nous capturons le segment haute-performance edge, sous-servi par les hyperscalers traditionnels.",
        }},
        { side: "left", zoneId: "section-4", data: {
          twoCol: {
            left: { label: "PROBLÈME", text: "Latence GPU sur cloud public >200ms. Coût compute multiplié par 4 en 18 mois. Modèles >70B impossibles à servir < 1s." },
            right: { label: "SOLUTION", items: ["Cluster optique propriétaire", "Inférence edge <50ms", "Coût TCO -62% vs hyperscaler", "API drop-in compatible"] },
          },
        }},
        { side: "left", zoneId: "section-5", data: {
          chartType: "bar",
          chartLabel: "ARR croissance trimestrielle",
          chartStatLabel: "MULTIPLE",
          chartStatValue: "×8.4",
          chartStatSub: "ARR sur 18 mois",
        }},
        { side: "left", zoneId: "section-6", data: {
          quoteText: "Leur infrastructure nous permet de servir nos modèles 100B en production avec une latence comparable à un appel base de données.",
          quoteAttribution: "— CTO, Fortune 100 Financial Services",
        }},
        { side: "right", zoneId: "section-1", data: {
          imageLabel: "Datacenter Phase 2 — Dublin",
          imageCaption: "48MW Tier IV — Mise en service Q3 2026 — Refroidissement immersion",
        }},
        { side: "right", zoneId: "section-2", data: {
          kpis: [
            { value: "<50ms",   label: "Latence p99",       sub: "Edge multi-régional" },
            { value: "8.7M",    label: "Tokens / sec",      sub: "Par node Hopper H200" },
            { value: "99.999%", label: "Uptime SLA",         sub: "Tier IV certifié" },
          ],
        }},
        { side: "right", zoneId: "section-3", data: {
          chartType: "donut",
          chartLabel: "Mix clientèle",
          chartStatLabel: "ENTERPRISE",
          chartStatValue: "78%",
          chartStatSub: "ARR · contrats > 3 ans",
        }},
        { side: "right", zoneId: "section-4", data: {
          timelineSteps: [
            { date: "2024", label: "MVP & seed",           done: true  },
            { date: "2025", label: "Phase 1 Dublin live",  done: true  },
            { date: "2026", label: "Série A · 50MW total", done: false },
            { date: "2028", label: "Expansion APAC",        done: false },
          ],
        }},
        { side: "right", zoneId: "section-5", data: {
          gridLabels: ["Compute", "Storage", "Network", "Cooling"],
        }},
        { side: "right", zoneId: "section-6", data: {
          textEyebrow: "PARTENAIRES TECHNOLOGIQUES",
          bodyText: "NVIDIA Elite Partner · AMD Strategic · Arista · Vertiv · Cisco. Co-développement firmware avec NVIDIA pour optimisation Hopper. Accès prioritaire roadmap Blackwell.",
          tags: ["NVIDIA", "AMD", "Arista", "Vertiv"],
        }},
      ]
    ),
  ],
};

// ─── 2. INVESTOR MEMO ─────────────────────────────────────────────────────────
const investorMemo: Template = {
  id: "investor-memo",
  name: "Investor Memo",
  description: "Memo institutionnel pour fonds & LPs — thèse d'investissement, métriques, retours.",
  themeId: "carbon-black",
  tags: ["investor"],
  pages: [
    buildPage(
      "investor-memo-cover",
      "Memo",
      [
        { side: "left",  zoneId: "section-1", layout: "hero" },
        { side: "left",  zoneId: "section-2", layout: "kpi-row" },
        { side: "left",  zoneId: "section-3", layout: "image-text" },
        { side: "left",  zoneId: "section-4", layout: "two-col" },
        { side: "left",  zoneId: "section-5", layout: "chart" },
        { side: "left",  zoneId: "section-6", layout: "text-full" },
        { side: "right", zoneId: "section-1", layout: "image-full" },
        { side: "right", zoneId: "section-2", layout: "three-kpi" },
        { side: "right", zoneId: "section-3", layout: "chart-text" },
        { side: "right", zoneId: "section-4", layout: "quote" },
        { side: "right", zoneId: "section-5", layout: "image-grid" },
        { side: "right", zoneId: "section-6", layout: "timeline" },
      ],
      [
        { side: "left", zoneId: "section-1", data: {
          eyebrow: "FONDS III · CONFIDENTIEL",
          heroTitle: "THÈSE",
          heroAccent: "D'INVESTISSEMENT 2026-2029",
          heroSubtitle: "Infrastructure critique post-IA · Tier IV souverain · €85M · Horizon 7 ans",
        }},
        { side: "left", zoneId: "section-2", data: {
          kpis: [
            { value: "€85M",  label: "Fonds levé" },
            { value: "22%",   label: "TRI cible net" },
            { value: "3.2x",  label: "MOIC cible" },
            { value: "7 ans", label: "Horizon" },
          ],
        }},
        { side: "left", zoneId: "section-3", data: {
          imageLabel: "DataCenter Tier IV · Doha",
          imageEyebrow: "CONTEXTE MARCHÉ",
          imageBodyText: "Capacité datacenter mondiale en pénurie structurelle d'ici 2027. Souveraineté numérique = priorité gouvernementale dans 47 pays. Fenêtre d'investissement de 24 mois.",
        }},
        { side: "left", zoneId: "section-4", data: {
          twoCol: {
            left: { label: "THÈSE", text: "Capter la rente d'infrastructure critique sur le segment Tier IV souverain dans les économies post-pétrole, avec barrières à l'entrée capex >€200M." },
            right: { label: "EDGE", items: ["Track record 15 ans · 9 exits", "Ticket €5-15M · sweet spot", "Réseau gouvernemental MENA", "Co-investissement sovereign funds"] },
          },
        }},
        { side: "left", zoneId: "section-5", data: {
          chartType: "bar",
          chartLabel: "Track record TRI par millésime",
          chartStatLabel: "TRI MOYEN",
          chartStatValue: "26.8%",
          chartStatSub: "Net · 3 fonds précédents",
        }},
        { side: "left", zoneId: "section-6", data: {
          textEyebrow: "MÉTHODOLOGIE",
          bodyText: "Sélection top-down par géographie + bottom-up par fundamentals. Due diligence 90 jours minimum. Co-investissement systématique avec sovereign funds locaux. Sortie via rachat hyperscaler ou IPO. Aucune dette au niveau du fond.",
          tags: ["MENA", "Sovereign", "Tier IV", "ESG"],
        }},
        { side: "right", zoneId: "section-1", data: {
          imageLabel: "Phase 1 — Doha · 48MW",
          imageCaption: "Mise en service Q3 2026 — €240M capex — Anchor tenant signé 15 ans",
        }},
        { side: "right", zoneId: "section-2", data: {
          kpis: [
            { value: "47",   label: "Deals analysés", sub: "Annuel moyen" },
            { value: "9",    label: "Exits réalisés",  sub: "Fonds I et II" },
            { value: "84%",  label: "DPI Fonds II",    sub: "À 5 ans" },
          ],
        }},
        { side: "right", zoneId: "section-3", data: {
          chartType: "donut",
          chartLabel: "Allocation sectorielle cible",
          chartStatLabel: "INFRA CRITIQUE",
          chartStatValue: "65%",
          chartStatSub: "DataCenter + énergie",
        }},
        { side: "right", zoneId: "section-4", data: {
          quoteText: "Une équipe d'opérateurs qui comprend les sovereign funds mieux que les sovereign funds eux-mêmes. Track record sans tâche.",
          quoteAttribution: "— Anchor LP, Sovereign Wealth Fund",
        }},
        { side: "right", zoneId: "section-5", data: {
          gridLabels: ["Doha I", "Riyadh", "Manama", "Muscat"],
        }},
        { side: "right", zoneId: "section-6", data: {
          timelineSteps: [
            { date: "2010", label: "Fonds I clôture",      done: true  },
            { date: "2017", label: "Fonds II · 9 exits",   done: true  },
            { date: "2026", label: "Fonds III · €85M",      done: false },
            { date: "2033", label: "Liquidation & DPI",     done: false },
          ],
        }},
      ]
    ),
  ],
};

// ─── 3. ANNUAL REPORT ─────────────────────────────────────────────────────────
const annualReport: Template = {
  id: "annual-report",
  name: "Annual Report",
  description: "Rapport annuel corporate — synthèse exécutive, performance, perspectives.",
  themeId: "arctic-data",
  tags: ["corporate"],
  pages: [
    buildPage(
      "annual-report-cover",
      "Synthèse",
      [
        { side: "left",  zoneId: "section-1", layout: "hero" },
        { side: "left",  zoneId: "section-2", layout: "kpi-row" },
        { side: "left",  zoneId: "section-3", layout: "image-text" },
        { side: "left",  zoneId: "section-4", layout: "two-col" },
        { side: "left",  zoneId: "section-5", layout: "chart" },
        { side: "left",  zoneId: "section-6", layout: "text-full" },
        { side: "right", zoneId: "section-1", layout: "image-full" },
        { side: "right", zoneId: "section-2", layout: "three-kpi" },
        { side: "right", zoneId: "section-3", layout: "chart-text" },
        { side: "right", zoneId: "section-4", layout: "timeline" },
        { side: "right", zoneId: "section-5", layout: "image-grid" },
        { side: "right", zoneId: "section-6", layout: "quote" },
      ],
      [
        { side: "left", zoneId: "section-1", data: {
          eyebrow: "EXERCICE FISCAL · 31 DÉC 2025",
          heroTitle: "RAPPORT",
          heroAccent: "ANNUEL 2025",
          heroSubtitle: "Performance, gouvernance & vision · Document de référence universel",
        }},
        { side: "left", zoneId: "section-2", data: {
          kpis: [
            { value: "€2.8B", label: "CA Groupe" },
            { value: "+14%",  label: "Croissance organique" },
            { value: "12 800", label: "Collaborateurs" },
            { value: "47",    label: "Pays présents" },
          ],
        }},
        { side: "left", zoneId: "section-3", data: {
          imageLabel: "Siège — Paris La Défense",
          imageEyebrow: "ÉDITORIAL CEO",
          imageBodyText: "2025 marque un tournant pour notre groupe. Recentrage sur les métiers à forte valeur ajoutée, accélération sur les marchés émergents, intégration profonde de l'IA dans nos opérations.",
        }},
        { side: "left", zoneId: "section-4", data: {
          twoCol: {
            left: { label: "FAITS MARQUANTS", text: "Acquisition stratégique en Asie-Pacifique. Lancement de 3 plateformes IA propriétaires. Émission obligataire green €500M sursouscrite." },
            right: { label: "INDICATEURS RSE", items: ["−38% émissions Scope 1+2", "98% énergie renouvelable", "Parité atteinte au COMEX", "Note ESG MSCI : AAA"] },
          },
        }},
        { side: "left", zoneId: "section-5", data: {
          chartType: "line",
          chartLabel: "CA consolidé · 5 ans",
          chartStatLabel: "TCAM 5 ANS",
          chartStatValue: "+11.2%",
          chartStatSub: "Croissance soutenue",
        }},
        { side: "left", zoneId: "section-6", data: {
          textEyebrow: "MESSAGE DU CONSEIL",
          bodyText: "Le Conseil d'administration tient à saluer l'engagement de l'ensemble des collaborateurs dans une année marquée par les transformations. La trajectoire stratégique 2026-2030 confirme l'ambition de devenir leader européen sur nos métiers cœur.",
          tags: ["Croissance", "ESG", "Innovation"],
        }},
        { side: "right", zoneId: "section-1", data: {
          imageLabel: "Centre R&D Sophia Antipolis",
          imageCaption: "1 200 chercheurs · 312 brevets déposés en 2025 · Investissement R&D €420M",
        }},
        { side: "right", zoneId: "section-2", data: {
          kpis: [
            { value: "−38%",  label: "CO₂ Scope 1+2", sub: "vs 2020" },
            { value: "82h",   label: "Formation / collab", sub: "Moyenne 2025" },
            { value: "52/48", label: "Parité COMEX",  sub: "F / H" },
          ],
        }},
        { side: "right", zoneId: "section-3", data: {
          chartType: "donut",
          chartLabel: "Répartition CA par BU",
          chartStatLabel: "BU CŒUR",
          chartStatValue: "68%",
          chartStatSub: "Industrie + Services",
        }},
        { side: "right", zoneId: "section-4", data: {
          timelineSteps: [
            { date: "Q1", label: "Acquisition APAC",     done: true  },
            { date: "Q2", label: "Lancement IA-1",        done: true  },
            { date: "Q3", label: "Émission green bond",   done: true  },
            { date: "Q4", label: "Plan 2026 validé",      done: true  },
          ],
        }},
        { side: "right", zoneId: "section-5", data: {
          gridLabels: ["Europe", "APAC", "Amériques", "MENA"],
        }},
        { side: "right", zoneId: "section-6", data: {
          quoteText: "Notre transformation digitale et notre engagement RSE ne sont pas des silos mais une seule stratégie : créer de la valeur durable.",
          quoteAttribution: "— Présidente du Conseil",
        }},
      ]
    ),
  ],
};

// ─── 4. CONFERENCE CATALOG ────────────────────────────────────────────────────
const conferenceCatalog: Template = {
  id: "conference-catalog",
  name: "Conference Catalog",
  description: "Programme événementiel haut de gamme — sessions, intervenants, sponsors.",
  themeId: "arabian-luxury",
  tags: ["event"],
  pages: [
    buildPage(
      "conference-catalog-cover",
      "Programme",
      [
        { side: "left",  zoneId: "section-1", layout: "hero" },
        { side: "left",  zoneId: "section-2", layout: "kpi-row" },
        { side: "left",  zoneId: "section-3", layout: "image-text" },
        { side: "left",  zoneId: "section-4", layout: "two-col" },
        { side: "left",  zoneId: "section-5", layout: "chart" },
        { side: "left",  zoneId: "section-6", layout: "quote" },
        { side: "right", zoneId: "section-1", layout: "image-full" },
        { side: "right", zoneId: "section-2", layout: "three-kpi" },
        { side: "right", zoneId: "section-3", layout: "image-grid" },
        { side: "right", zoneId: "section-4", layout: "timeline" },
        { side: "right", zoneId: "section-5", layout: "chart-text" },
        { side: "right", zoneId: "section-6", layout: "text-full" },
      ],
      [
        { side: "left", zoneId: "section-1", data: {
          eyebrow: "DOHA · 14 — 16 MARS 2026",
          heroTitle: "FUTURE",
          heroAccent: "SUMMIT 2026",
          heroSubtitle: "L'événement de référence du Golfe sur l'IA, infrastructure & souveraineté numérique",
        }},
        { side: "left", zoneId: "section-2", data: {
          kpis: [
            { value: "2 400", label: "Participants" },
            { value: "120",   label: "Speakers" },
            { value: "48",    label: "Sessions" },
            { value: "62",    label: "Pays" },
          ],
        }},
        { side: "left", zoneId: "section-3", data: {
          imageLabel: "St Regis Doha — Venue 2026",
          imageEyebrow: "VENUE & FORMAT",
          imageBodyText: "Trois jours immersifs au St Regis Doha. Keynotes plénières, ateliers techniques en parallèle, networking executive et gala de clôture sur l'île privée.",
        }},
        { side: "left", zoneId: "section-4", data: {
          twoCol: {
            left: { label: "TRACKS", text: "Infrastructure souveraine · IA générative en production · Cybersécurité post-quantique · Transition énergétique des datacenters." },
            right: { label: "NETWORKING", items: ["Welcome dinner privé", "1-on-1 meetings via app", "Sponsor lounges", "Closing gala desert experience"] },
          },
        }},
        { side: "left", zoneId: "section-5", data: {
          chartType: "donut",
          chartLabel: "Origine participants",
          chartStatLabel: "MENA",
          chartStatValue: "54%",
          chartStatSub: "Région hôte 2026",
        }},
        { side: "left", zoneId: "section-6", data: {
          quoteText: "Le seul événement où décideurs gouvernementaux, hyperscalers et acteurs régionaux se rencontrent au même niveau d'exigence.",
          quoteAttribution: "— H.E. Ministre de l'Économie Numérique",
        }},
        { side: "right", zoneId: "section-1", data: {
          imageLabel: "Keynote Stage — Plénière 2 000 places",
          imageCaption: "Sessions plénières quotidiennes · Traduction simultanée 6 langues",
        }},
        { side: "right", zoneId: "section-2", data: {
          kpis: [
            { value: "84h",  label: "Contenu",          sub: "Sessions cumulées" },
            { value: "47",   label: "Sponsors",          sub: "Toutes catégories" },
            { value: "120",  label: "Médias accrédités", sub: "Couverture mondiale" },
          ],
        }},
        { side: "right", zoneId: "section-3", data: {
          gridLabels: ["Keynote J1", "Keynote J2", "Workshop AI", "Closing"],
        }},
        { side: "right", zoneId: "section-4", data: {
          timelineSteps: [
            { date: "J1", label: "Plénière & openings", done: false },
            { date: "J2", label: "Workshops parallèles", done: false },
            { date: "J3", label: "Executive day & gala", done: false },
            { date: "J+", label: "Replay 30 jours",      done: false },
          ],
        }},
        { side: "right", zoneId: "section-5", data: {
          chartType: "bar",
          chartLabel: "Audience par track",
          chartStatLabel: "INFRA",
          chartStatValue: "32%",
          chartStatSub: "Track le plus suivi",
        }},
        { side: "right", zoneId: "section-6", data: {
          textEyebrow: "MOT DU PRÉSIDENT",
          bodyText: "Future Summit s'inscrit dans la Vision Qatar 2030 et l'ambition de positionner le Golfe comme hub mondial de l'innovation. Nous sommes honorés d'accueillir cette communauté d'excellence pour la 7e édition.",
          tags: ["Vision 2030", "Innovation", "Hub MENA"],
        }},
      ]
    ),
  ],
};

// ─── 5. PRODUCT LAUNCH ────────────────────────────────────────────────────────
const productLaunch: Template = {
  id: "product-launch",
  name: "Product Launch",
  description: "Lancement produit — promesse, fonctionnalités, preuves, call-to-action.",
  themeId: "emerald-vision",
  tags: ["product"],
  pages: [
    buildPage(
      "product-launch-cover",
      "Lancement",
      [
        { side: "left",  zoneId: "section-1", layout: "hero" },
        { side: "left",  zoneId: "section-2", layout: "kpi-row" },
        { side: "left",  zoneId: "section-3", layout: "image-full" },
        { side: "left",  zoneId: "section-4", layout: "text-full" },
        { side: "left",  zoneId: "section-5", layout: "quote" },
        { side: "left",  zoneId: "section-6", layout: "two-col" },
        { side: "right", zoneId: "section-1", layout: "three-kpi" },
        { side: "right", zoneId: "section-2", layout: "chart-text" },
        { side: "right", zoneId: "section-3", layout: "image-grid" },
        { side: "right", zoneId: "section-4", layout: "timeline" },
        { side: "right", zoneId: "section-5", layout: "image-text" },
        { side: "right", zoneId: "section-6", layout: "text-full" },
      ],
      [
        { side: "left", zoneId: "section-1", data: {
          eyebrow: "DISPONIBLE LE 15 AVRIL 2026",
          heroTitle: "INTRODUCING",
          heroAccent: "ORBIT ONE",
          heroSubtitle: "La première base de données temps-réel à scaling automatique — sub-milliseconde, multi-région, zéro ops.",
        }},
        { side: "left", zoneId: "section-2", data: {
          kpis: [
            { value: "<1ms",   label: "Latence p99" },
            { value: "12M",    label: "Ops / sec / node" },
            { value: "47",     label: "Régions" },
            { value: "99.999%", label: "Uptime SLA" },
          ],
        }},
        { side: "left", zoneId: "section-3", data: {
          imageLabel: "Orbit One — Console produit",
          imageCaption: "Interface de gestion · Setup en 90 secondes · Migration zero-downtime depuis Postgres / Mongo",
        }},
        { side: "left", zoneId: "section-4", data: {
          textEyebrow: "POURQUOI ORBIT ONE",
          bodyText: "Vos applications ont changé. Elles servent des modèles IA en production, des features temps-réel, du géo-distribué. Mais votre base de données est restée bloquée en 2010. Orbit One a été conçu pour ce nouveau monde — sans compromis sur la cohérence ni la simplicité.",
          tags: ["Real-time", "Multi-region", "Zero-ops"],
        }},
        { side: "left", zoneId: "section-5", data: {
          quoteText: "Nous avons migré 12To en 4 heures sans downtime. Notre p99 est passé de 47ms à 0.8ms. C'est juste meilleur.",
          quoteAttribution: "— Head of Platform, fintech licorne",
        }},
        { side: "left", zoneId: "section-6", data: {
          twoCol: {
            left: { label: "AVANT", text: "Stack à 7 composants. Cache externe. Read replicas. Sharding manuel. 3 ingénieurs DBA temps-plein. Pages d'astreinte chaque semaine." },
            right: { label: "APRÈS", items: ["1 service managé", "Cache intégré natif", "Sharding automatique", "Zéro DBA requis", "Pas d'astreinte"] },
          },
        }},
        { side: "right", zoneId: "section-1", data: {
          kpis: [
            { value: "62%",  label: "Réduction TCO",  sub: "vs stack legacy" },
            { value: "8x",   label: "Throughput",    sub: "Workload OLTP" },
            { value: "−94%", label: "Astreintes",    sub: "Premier semestre" },
          ],
        }},
        { side: "right", zoneId: "section-2", data: {
          chartType: "bar",
          chartLabel: "Benchmarks vs concurrents",
          chartStatLabel: "GAGNANT",
          chartStatValue: "8 / 9",
          chartStatSub: "Suite YCSB complète",
        }},
        { side: "right", zoneId: "section-3", data: {
          gridLabels: ["E-commerce", "Fintech", "Gaming", "AI/ML"],
        }},
        { side: "right", zoneId: "section-4", data: {
          timelineSteps: [
            { date: "2024", label: "Alpha closed",        done: true  },
            { date: "2025", label: "Beta · 200 design partners", done: true  },
            { date: "Q2 2026", label: "GA — 15 avril",     done: false },
            { date: "Q4 2026", label: "Free tier public",  done: false },
          ],
        }},
        { side: "right", zoneId: "section-5", data: {
          imageLabel: "Intégrations natives",
          imageEyebrow: "ÉCOSYSTÈME",
          imageBodyText: "SDK officiels pour 12 langages. Intégrations natives Vercel, Cloudflare, AWS, Datadog, Grafana, Snowflake. Compatible drivers Postgres et MongoDB pour migration sans réécriture.",
        }},
        { side: "right", zoneId: "section-6", data: {
          textEyebrow: "PRICING & DISPONIBILITÉ",
          bodyText: "Tier gratuit 1Go · 100K ops/mois. Pro $99/mois · scaling automatique. Enterprise sur devis · SLA contractuel · support 24/7. Disponible le 15 avril 2026 sur orbit-one.dev.",
          tags: ["Free tier", "Pro $99", "Enterprise"],
        }},
      ]
    ),
  ],
};

export const TEMPLATES: Template[] = [
  techPitch,
  investorMemo,
  annualReport,
  conferenceCatalog,
  productLaunch,
];
