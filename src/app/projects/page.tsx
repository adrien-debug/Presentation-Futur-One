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

  // Always show the dashboard — let the user choose what to open or create
  return <ProjectsDashboard projects={userProjects} userEmail={session.user.email ?? ""} />;
}
