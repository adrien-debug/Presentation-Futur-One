import { db } from "@/db/client";
import { pages, projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

async function main() {
  const [proj] = await db.select().from(projects).where(eq(projects.name, "Future One — AI Sovereign Innovation Hub"));
  if (!proj) return console.log("not found");
  console.log("Project:", proj.id, "theme:", proj.activeThemeId, "overrides:", Object.keys(proj.colorOverrides as object).length, "keys");

  const ps = await db.select().from(pages).where(eq(pages.projectId, proj.id)).orderBy(asc(pages.orderIndex));
  for (const p of ps) {
    const imgs = p.images as Record<string, { src?: string }>;
    console.log(`\n${p.name}`);
    for (const [k, v] of Object.entries(imgs)) {
      const src = v?.src || "";
      console.log(`  ${k} → src.length=${src.length} starts="${src.slice(0,32)}…"`);
    }
    const bs = p.boxStyles as Record<string, object>;
    console.log(`  boxStyles: ${Object.keys(bs).join(", ") || "(none)"}`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
