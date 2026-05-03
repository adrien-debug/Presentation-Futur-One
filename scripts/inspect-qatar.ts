/**
 * Inspect the FUTUR ONE Qatar project — list all pages, zones, content, layouts.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/inspect-qatar.ts
 */

import { db } from "@/db/client";
import { pages, projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { writeFileSync } from "node:fs";

const PROJECT_ID = "d9518e3a-a7d8-4eda-9c15-67dc40e1c4bf";

async function main() {
  const [proj] = await db.select().from(projects).where(eq(projects.id, PROJECT_ID));
  if (!proj) {
    console.log("Project not found");
    return;
  }
  console.log("=== PROJECT ===");
  console.log("id:           ", proj.id);
  console.log("name:         ", proj.name);
  console.log("userId:       ", proj.userId);
  console.log("activeThemeId:", proj.activeThemeId);
  console.log("colorOverrides keys:", Object.keys(proj.colorOverrides as object).length);
  console.log("showGrid:     ", proj.showGrid);

  const ps = await db.select().from(pages).where(eq(pages.projectId, proj.id)).orderBy(asc(pages.orderIndex));
  console.log(`\n=== ${ps.length} PAGES ===`);

  for (const p of ps) {
    console.log(`\n--- [${p.orderIndex}] ${p.name} (id=${p.id.slice(0, 8)}…) ---`);
    console.log(`hideHeader=${p.hideHeader} hideFooter=${p.hideFooter}`);

    const z = p.zones as { left?: Array<{ id: string; label: string; heightRatio: number }>, right?: Array<{ id: string; label: string; heightRatio: number }> } | Array<{ id: string; label: string; heightRatio: number }>;
    const left  = Array.isArray(z) ? z : (z.left ?? []);
    const right = Array.isArray(z) ? z : (z.right ?? []);
    console.log("  zones.left :", left.map(zz => `${zz.id}(${zz.label}, ${(zz.heightRatio * 100).toFixed(0)}%)`).join(" / "));
    console.log("  zones.right:", right.map(zz => `${zz.id}(${zz.label}, ${(zz.heightRatio * 100).toFixed(0)}%)`).join(" / "));

    const layouts = p.layoutOverrides as Record<string, string>;
    console.log(`  layoutOverrides (${Object.keys(layouts).length}):`);
    for (const [k, v] of Object.entries(layouts)) {
      console.log(`    ${k} → ${v}`);
    }

    const content = p.contentStore as Record<string, Record<string, unknown>>;
    console.log(`  contentStore (${Object.keys(content).length} zones):`);
    for (const [k, v] of Object.entries(content)) {
      console.log(`    ${k}:`);
      for (const [field, val] of Object.entries(v)) {
        const display = typeof val === "string" ? `"${val}"` : JSON.stringify(val);
        console.log(`      ${field}: ${display.length > 200 ? display.slice(0, 200) + "…" : display}`);
      }
    }

    const imgs = p.images as Record<string, { src?: string; fit?: string }>;
    if (Object.keys(imgs).length > 0) {
      console.log(`  images (${Object.keys(imgs).length}):`);
      for (const [k, v] of Object.entries(imgs)) {
        const src = v?.src || "";
        console.log(`    ${k} → ${src ? `src.length=${src.length} starts="${src.slice(0, 40)}…"` : "(no src)"}`);
      }
    }
  }

  // Backup full state
  const backup = { project: proj, pages: ps };
  const path = `/tmp/qatar-backup-${Date.now()}.json`;
  writeFileSync(path, JSON.stringify(backup, null, 2));
  console.log(`\n✓ Backup saved → ${path}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
