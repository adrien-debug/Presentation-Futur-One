import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { assets } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { createHash } from "crypto";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB on the wire (base64 dataURL).

// GET /api/assets — list current user's assets, optionally filtered by projectId.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  const where = projectId
    ? and(eq(assets.userId, session.user.id), eq(assets.projectId, projectId))
    : eq(assets.userId, session.user.id);

  const rows = await db.select().from(assets).where(where).orderBy(desc(assets.createdAt));
  return NextResponse.json(rows);
}

// POST /api/assets — accepts { projectId?, mimeType, dataUrl }. Dedup by sha256 per user.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null) as { projectId?: string; mimeType?: string; dataUrl?: string } | null;
  if (!body?.dataUrl || !body.mimeType) {
    return NextResponse.json({ error: "Missing dataUrl or mimeType" }, { status: 400 });
  }
  if (body.dataUrl.length > MAX_BYTES) {
    return NextResponse.json({ error: "Asset too large (max 2 MB)" }, { status: 413 });
  }

  const sha256 = createHash("sha256").update(body.dataUrl).digest("hex");

  const [existing] = await db
    .select()
    .from(assets)
    .where(and(eq(assets.userId, session.user.id), eq(assets.sha256, sha256)));
  if (existing) return NextResponse.json(existing);

  const [created] = await db.insert(assets).values({
    userId:    session.user.id,
    projectId: body.projectId ?? null,
    src:       body.dataUrl,
    mimeType:  body.mimeType,
    sizeBytes: body.dataUrl.length,
    sha256,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}
