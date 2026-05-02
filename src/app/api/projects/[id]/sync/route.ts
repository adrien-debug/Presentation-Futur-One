import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { projects, pages } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { EditorState } from "@/hooks/useEditorState";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/projects/[id]/sync
 * Full state sync — replaces all pages and project meta atomically.
 * Body: EditorState (the full reducer state, no history).
 */
export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const state: EditorState = await req.json();

  // 1. Update project meta
  await db.update(projects)
    .set({
      activeThemeId:  state.activeThemeId,
      colorOverrides: state.colorOverrides as object,
      showGrid:       state.showGrid,
      updatedAt:      new Date(),
    })
    .where(eq(projects.id, id));

  // 2. Get existing page IDs
  const existingPages = await db
    .select({ id: pages.id })
    .from(pages)
    .where(eq(pages.projectId, id));

  const existingIds = new Set(existingPages.map((p) => p.id));
  const incomingIds = new Set(state.pageOrder);

  // 3. Delete pages removed from pageOrder
  const toDelete = [...existingIds].filter((pid) => !incomingIds.has(pid));
  if (toDelete.length > 0) {
    await db.delete(pages).where(inArray(pages.id, toDelete));
  }

  // 4. Upsert each page in order
  for (let i = 0; i < state.pageOrder.length; i++) {
    const pageId = state.pageOrder[i];
    const p = state.pages[pageId];
    if (!p) continue;

    await db
      .insert(pages)
      .values({
        id:              pageId,
        projectId:       id,
        orderIndex:      i,
        name:            p.name,
        hideHeader:      p.hideHeader ?? false,
        hideFooter:      p.hideFooter ?? false,
        zones:           p.zones as unknown as object,
        contentStore:    p.contentStore as object,
        layoutOverrides: p.layoutOverrides as object,
        boxStyles:       p.boxStyles as object,
        images:          p.images as object,
        chartConfigs:    p.chartConfigs as object,
        updatedAt:       new Date(),
      })
      .onConflictDoUpdate({
        target: pages.id,
        set: {
          orderIndex:      i,
          name:            p.name,
          hideHeader:      p.hideHeader ?? false,
          hideFooter:      p.hideFooter ?? false,
          zones:           p.zones as unknown as object,
          contentStore:    p.contentStore as object,
          layoutOverrides: p.layoutOverrides as object,
          boxStyles:       p.boxStyles as object,
          images:          p.images as object,
          chartConfigs:    p.chartConfigs as object,
          updatedAt:       new Date(),
        },
      });
  }

  return NextResponse.json({ ok: true, synced: state.pageOrder.length });
}
