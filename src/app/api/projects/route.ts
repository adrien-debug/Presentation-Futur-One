import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { projects, pages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SPREAD_ZONES, defaultTheme } from "@/design-system";

// GET /api/projects — list current user's projects
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.lastOpenedAt));

  return NextResponse.json(rows);
}

// POST /api/projects — create a new project (optionally from template pages)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    name      = "Mon projet",
    themeId   = defaultTheme.id,
    pageCount = 1,
    showGrid  = true,
  } = body;

  const [project] = await db.insert(projects).values({
    userId:        session.user.id,
    name,
    activeThemeId: themeId,
    showGrid,
  }).returning();

  // Always blank pages — content stays empty, zones standard
  const pageNames: Record<number, string> = {
    1: "Page 1", 2: "Page 1", 3: "Page 1",
    4: "Page 1", 5: "Page 1", 6: "Page 1",
    8: "Page 1", 10: "Page 1", 12: "Page 1",
  };

  await db.insert(pages).values(
    Array.from({ length: pageCount }, (_, i) => ({
      projectId:  project.id,
      orderIndex: i,
      name:       i === 0 ? (pageNames[pageCount] ?? "Page 1") : `Page ${i + 1}`,
      zones:      SPREAD_ZONES as unknown as object[],
    }))
  );

  return NextResponse.json(project, { status: 201 });
}
