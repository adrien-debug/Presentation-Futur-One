import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { projects, pages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SPREAD_ZONES } from "@/design-system";
import { defaultTheme } from "@/design-system";

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

// POST /api/projects — create a new project
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name = "Mon projet", themeId = defaultTheme.id } = body;

  const [project] = await db.insert(projects).values({
    userId:        session.user.id,
    name,
    activeThemeId: themeId,
  }).returning();

  // Create a default first page
  await db.insert(pages).values({
    projectId:  project.id,
    orderIndex: 0,
    name:       "Page 1",
    zones:      SPREAD_ZONES as unknown as object[],
  });

  return NextResponse.json(project, { status: 201 });
}
