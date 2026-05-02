import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { projects, pages } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id] — full project + ordered pages
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const projectPages = await db
    .select()
    .from(pages)
    .where(eq(pages.projectId, id))
    .orderBy(asc(pages.orderIndex));

  // Update lastOpenedAt
  await db.update(projects)
    .set({ lastOpenedAt: new Date() })
    .where(eq(projects.id, id));

  return NextResponse.json({ project, pages: projectPages });
}

// PATCH /api/projects/[id] — partial update (name, theme, colors, grid)
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const [updated] = await db.update(projects)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/projects/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db.delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

  return new NextResponse(null, { status: 204 });
}
