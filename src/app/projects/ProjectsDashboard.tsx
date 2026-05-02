"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Project } from "@/db/schema";
import { IconPlus, IconClose, IconLayout } from "@/components/ui/Icon";

interface Props {
  projects: Project[];
  userEmail: string;
}

export default function ProjectsDashboard({ projects: initial, userEmail }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [creating, startCreate] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    startCreate(async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Projet ${projects.length + 1}` }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/projects/${p.id}`);
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const accent = "#00D4FF";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#05080F", color: "#E8F4FF" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0"
        style={{ borderColor: "#1A3A5C", backgroundColor: "#0A0E1A" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center text-[11px] font-black"
            style={{ backgroundColor: accent, color: "#05080F" }}
          >F1</div>
          <div>
            <div className="text-[11px] font-bold uppercase" style={{ letterSpacing: "0.18em" }}>FUTUR ONE</div>
            <div className="text-[7px] font-mono" style={{ color: "#3D6080", letterSpacing: "0.1em" }}>DataCenter · Design Tool</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono" style={{ color: "#6B8FAA" }}>{userEmail}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[9px] font-mono uppercase px-3 py-1.5 transition-colors"
            style={{ border: "1px solid #1A3A5C", color: "#6B8FAA", letterSpacing: "0.12em" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E07070"; e.currentTarget.style.color = "#E07070"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1A3A5C"; e.currentTarget.style.color = "#6B8FAA"; }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-8 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Title row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-bold" style={{ letterSpacing: "-0.02em" }}>Mes projets</h1>
              <p className="text-[11px] mt-1" style={{ color: "#6B8FAA" }}>
                {projects.length} projet{projects.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-mono uppercase font-bold transition-all disabled:opacity-40"
              style={{
                backgroundColor: accent,
                color: "#05080F",
                letterSpacing: "0.14em",
              }}
            >
              <IconPlus size={13} />
              Nouveau projet
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={() => router.push(`/projects/${p.id}`)}
                onDelete={() => handleDelete(p.id, p.name)}
                deleting={deletingId === p.id}
                accent={accent}
              />
            ))}

            {/* Create card */}
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex flex-col items-center justify-center gap-3 transition-all min-h-[160px] disabled:opacity-40"
              style={{
                border: `1px dashed ${accent}40`,
                backgroundColor: `${accent}05`,
                color: accent,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accent}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${accent}05`; }}
            >
              <IconPlus size={20} />
              <span className="text-[10px] font-mono uppercase" style={{ letterSpacing: "0.14em" }}>
                {creating ? "Création…" : "Nouveau projet"}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProjectCard({
  project, onOpen, onDelete, deleting, accent,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  deleting: boolean;
  accent: string;
}) {
  const updatedAt = new Date(project.updatedAt);
  const timeAgo = formatTimeAgo(updatedAt);

  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all"
      style={{ border: "1px solid #1A3A5C", backgroundColor: "#0F1929" }}
      onClick={onOpen}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}60`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1A3A5C"; }}
    >
      {/* Preview area */}
      <div
        className="w-full flex items-center justify-center"
        style={{ height: 100, backgroundColor: "#0A0E1A", borderBottom: "1px solid #1A3A5C" }}
      >
        <IconLayout size={32} style={{ color: `${accent}30` }} />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "#E8F4FF" }}>
            {project.name}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center flex-shrink-0 disabled:opacity-40"
            style={{ color: "#E07070" }}
            title="Supprimer"
          >
            <IconClose size={11} />
          </button>
        </div>
        <p className="text-[9px] font-mono" style={{ color: "#3D6080", letterSpacing: "0.08em" }}>
          {timeAgo}
        </p>
        <div
          className="mt-2 text-[8px] font-mono uppercase px-1.5 py-0.5 self-start"
          style={{ backgroundColor: `${accent}15`, color: accent, border: `1px solid ${accent}30`, letterSpacing: "0.12em" }}
        >
          {project.activeThemeId.replace(/-/g, " ")}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "À l'instant";
  if (mins  < 60)  return `Il y a ${mins} min`;
  if (hours < 24)  return `Il y a ${hours}h`;
  if (days  < 7)   return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR");
}
