/**
 * Refonte du contenu de la slide unique du projet Qatar (FUTUR ONE).
 *
 *   - Préserve : zones, layoutOverrides, boxStyles, images, chartConfigs, hideHeader
 *   - Réécrit  : contentStore (eyebrows, titres, captions, body) avec copy DA
 *   - Désactive showGrid pour le rendu présentation
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/refonte-qatar.ts
 *
 * Backup: a JSON snapshot of the current state is written to /tmp before any
 * mutation (so we can restore if the new copy doesn't pass review).
 */

import { db } from "@/db/client";
import { pages, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFileSync } from "node:fs";
import type { LayoutContent } from "@/data/types";

const PROJECT_ID = "d9518e3a-a7d8-4eda-9c15-67dc40e1c4bf";

// Discover the SECTION-5 left zone id (it's a uuid-like custom id, see inspect)
async function findLeftSection5Id(pageId: string): Promise<string | null> {
  const [p] = await db.select().from(pages).where(eq(pages.id, pageId));
  if (!p) return null;
  const z = p.zones as { left?: Array<{ id: string; label: string }> };
  const left = z.left ?? [];
  const found = left.find((zz) => zz.label === "SECTION 5" || zz.id.startsWith("section-mootgkdl"));
  return found?.id ?? null;
}

async function main() {
  const [proj] = await db.select().from(projects).where(eq(projects.id, PROJECT_ID));
  if (!proj) throw new Error(`Project not found: ${PROJECT_ID}`);

  const ps = await db.select().from(pages).where(eq(pages.projectId, PROJECT_ID));
  if (ps.length !== 1) throw new Error(`Expected 1 page, got ${ps.length}`);
  const page = ps[0];
  const pageId = page.id;

  // ── 1. Backup ──────────────────────────────────────────────────────────
  const backupPath = `/tmp/qatar-refonte-backup-${Date.now()}.json`;
  writeFileSync(backupPath, JSON.stringify({ project: proj, pages: ps }, null, 2));
  console.log(`✓ Backup saved → ${backupPath}`);

  // ── 2. Find the left SECTION 5 zone (custom uuid-like id) ─────────────
  const leftS5Id = await findLeftSection5Id(pageId);
  console.log(`  Left SECTION 5 id: ${leftS5Id ?? "(not found)"}`);

  // ── 3. Build the new contentStore ──────────────────────────────────────
  // Strategy: preserve any field we don't explicitly override, but set the ones
  // we care about. We do per-zone object spread to avoid losing customizations.
  const oldContent = (page.contentStore as Record<string, Partial<LayoutContent>>) ?? {};

  const refonte: Record<string, Partial<LayoutContent>> = {
    // ───────────── LEFT PAGE ─────────────
    "left-section-1": {
      ...(oldContent["left-section-1"] ?? {}),
      eyebrow:    "MANIFESTO 2030",
      heroTitle:  "FUTUR ONE",
      heroAccent: "NO LIMITS, BY AI.",
    },
    "left-section-2": {
      ...(oldContent["left-section-2"] ?? {}),
      imageEyebrow: "WORLD BEFORE AI · VISION 2030",
      imageLabel:   "DU CODE AU SUNSET — DATA CENTER ÉMERGE",
      imageCaption: "Doha · 48 MW Phase 1 · Tier IV",
    },
    "left-section-3": {
      ...(oldContent["left-section-3"] ?? {}),
      // Layout = chart, so the meaningful fields are chartStat*
      chartLabel:     "AI COMPUTE DEMAND 2024 → 2030",
      chartStatLabel: "GROWTH",
      chartStatValue: "×4.2",
      chartStatSub:   "Global AI compute · capacity multiplier",
      chartType:      "bar",
      // Stale text-full fields that exist on this zone — keep for the day the
      // user re-switches layout, just refresh copy
      textEyebrow: "WORLD BEFORE AI",
      bodyText:    "Quatre verrous que l'IA fait sauter.",
      tags:        ["LIMITED BY TECHNOLOGY", "DEPENDENT ON DEVELOPERS", "HIGH COSTS & DELAYS", "CREATIVITY RESTRICTED"],
    },

    // ───────────── RIGHT PAGE ────────────
    "right-section-1": {
      ...(oldContent["right-section-1"] ?? {}),
      eyebrow:    "WHY FUTUR ONE",
      heroTitle:  "AI IS THE",
      heroAccent: "NEW GAS.",
    },
    "right-section-2": {
      ...(oldContent["right-section-2"] ?? {}),
      imageEyebrow: "FUTUR ONE — SYMBOL OF VISION 2030",
      imageLabel:   "DATA CENTER · DOHA",
      imageCaption: "48 MW Phase 1 · Tier IV reliability standard",
    },
    "right-section-3": {
      ...(oldContent["right-section-3"] ?? {}),
      imageEyebrow:  "SOVEREIGN BUILDER",
      imageLabel:    "JB PASTOR & FILS",
      imageBodyText: "Pierre fondatrice — Monaco, depuis 1880. JB Pastor & Fils accompagne FUTUR ONE comme partenaire historique du bâti souverain.",
    },
    "right-section-4": {
      ...(oldContent["right-section-4"] ?? {}),
      imageEyebrow: "MASTER PLAN",
      imageLabel:   "CAMPUS · HUB · LIFE",
      imageCaption: "17 HA · 3 000–4 000 résidents · Doha",
    },
    "right-section-5": {
      ...(oldContent["right-section-5"] ?? {}),
      twoCol: {
        left: {
          label: "CAMPUS · KEY FIGURES",
          text:  "17 HA — Total Campus (Hub · résidences · life). 15 K SQM — Core Hub. 3 000–4 000 — Target population.",
        },
        right: {
          label: "MANIFESTO",
          items: ["AI is the new gas.", "Compute is the infrastructure of nations."],
        },
      },
    },
    "right-section-6": {
      ...(oldContent["right-section-6"] ?? {}),
      imageEyebrow:  "A POSITIVE REVOLUTION",
      imageLabel:    "HPR DOCTRINE",
      imageBodyText: "HPR = Performance × Well-Being × Social Integration. AI gives everyone the opportunity to create, innovate.",
    },
  };

  // Trust strip for the empty SECTION 5 zone (left)
  if (leftS5Id) {
    const key = `left-${leftS5Id}`;
    refonte[key] = {
      ...(oldContent[key] ?? {}),
      textEyebrow: "PROOF",
      bodyText:    "Hyperscale-grade · Carrier neutral · AI-ready · Tier IV reliability.",
      tags:        ["HYPERSCALE", "CARRIER NEUTRAL", "AI-READY", "TIER IV"],
    };
  }

  // Preserve any zone we didn't touch
  const merged = { ...oldContent, ...refonte };

  // ── 4. Set the layout for the empty SECTION 5 to text-full ─────────────
  const oldLayouts = (page.layoutOverrides as Record<string, string>) ?? {};
  const newLayouts: Record<string, string> = { ...oldLayouts };
  if (leftS5Id) {
    newLayouts[`left-${leftS5Id}`] = "text-full";
  }

  // ── 5. Apply ──────────────────────────────────────────────────────────
  console.log("\nApplying changes…");
  await db.update(projects)
    .set({ showGrid: false, updatedAt: new Date() })
    .where(eq(projects.id, PROJECT_ID));
  console.log("  ✓ project.showGrid → false");

  await db.update(pages)
    .set({
      contentStore:    merged as object,
      layoutOverrides: newLayouts as object,
      updatedAt:       new Date(),
    })
    .where(eq(pages.id, pageId));
  console.log(`  ✓ page contentStore + layoutOverrides updated (${Object.keys(merged).length} zones)`);

  console.log("\n✅ Refonte applied. Refresh the browser to see the result.");
  console.log(`   Backup at ${backupPath}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
