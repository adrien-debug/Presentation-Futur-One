import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEV_EMAIL = "dev@futurone.local";
const DEV_NAME  = "Dev User";
const BASE_URL  = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 });
  }

  // Upsert dev user
  let [user] = await db.select().from(users).where(eq(users.email, DEV_EMAIL));
  if (!user) {
    [user] = await db.insert(users).values({
      email:         DEV_EMAIL,
      name:          DEV_NAME,
      emailVerified: new Date(),
    }).returning();
  }

  // Create a long-lived dev session
  const token   = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(sessions).values({
    sessionToken: token,
    userId:       user.id,
    expires,
  }).onConflictDoNothing();

  const res = NextResponse.redirect(new URL("/projects", BASE_URL));

  // NextAuth v5 uses "authjs.session-token" on HTTP (dev)
  res.cookies.set("authjs.session-token", token, {
    expires,
    httpOnly: true,
    secure:   false,
    sameSite: "lax",
    path:     "/",
  });

  return res;
}
