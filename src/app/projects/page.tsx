import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ProjectsDashboard from "./ProjectsDashboard";

export default async function ProjectsPage() {
  const session = await requireAuth();

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.lastOpenedAt));

  // First visit → auto-create a project and go straight to editor
  if (userProjects.length === 0) {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/projects`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "" },
        body: JSON.stringify({ name: "Mon projet" }),
      }
    );
    if (res.ok) {
      const created = await res.json();
      redirect(`/projects/${created.id}`);
    }
  }

  // If exactly one project → go straight to editor
  if (userProjects.length === 1) {
    redirect(`/projects/${userProjects[0].id}`);
  }

  return <ProjectsDashboard projects={userProjects} userEmail={session.user.email ?? ""} />;
}
