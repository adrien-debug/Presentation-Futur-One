import { db } from "@/db/client";
import { projects, pages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

async function main() {
  const all = await db.select({ id: projects.id, name: projects.name, theme: projects.activeThemeId })
    .from(projects)
    .where(eq(projects.name, "Future One — AI Sovereign Innovation Hub"));

  console.log("Projects:");
  console.table(all);

  for (const p of all) {
    const ps = await db.select().from(pages).where(eq(pages.projectId, p.id)).orderBy(asc(pages.orderIndex));
    console.log(`\nPages for ${p.id}:`);
    for (const pg of ps) {
      const layouts = pg.layoutOverrides as Record<string, string>;
      const zones = pg.zones as Array<{ id: string; heightRatio: number }>;
      console.log(`  - ${pg.name} (orderIndex=${pg.orderIndex}, hideHeader=${pg.hideHeader}, hideFooter=${pg.hideFooter})`);
      console.log(`    zones: ${zones.map(z => `${z.id}=${z.heightRatio}`).join(", ")}`);
      console.log(`    layouts: ${Object.entries(layouts).map(([k,v]) => `${k}→${v}`).join(", ")}`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
