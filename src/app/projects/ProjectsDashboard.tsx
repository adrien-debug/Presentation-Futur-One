"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Project } from "@/db/schema";
import { IconPlus, IconClose, IconLayout, IconChevronRight } from "@/components/ui/Icon";

interface Props {
  projects: Project[];
  userEmail: string;
}

export default function ProjectsDashboard({ projects: initial, userEmail }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const SATOSHI = "'Satoshi', 'Inter', sans-serif";
  const accent  = "#00D4FF";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#05080F", color: "#E8F4FF", fontFamily: SATOSHI }}>

      {/* ── TOPBAR ──────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0"
        style={{ borderColor: "#131C28", backgroundColor: "#08101A" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-[11px] font-black" style={{ backgroundColor: accent, color: "#05080F" }}>
            F1
          </div>
          <div>
            <div className="text-[12px] font-bold uppercase" style={{ letterSpacing: "0.16em" }}>FUTUR ONE</div>
            <div className="text-[7px] font-mono" style={{ color: "#3D6080", letterSpacing: "0.1em" }}>DataCenter · Design Tool</div>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="text-[11px]" style={{ color: "#6B8FAA" }}>{userEmail}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[10px] font-medium px-3 py-1.5 transition-colors"
            style={{ border: "1px solid #131C28", color: "#6B8FAA", letterSpacing: "0.06em" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E07070"; e.currentTarget.style.color = "#E07070"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#131C28"; e.currentTarget.style.color = "#6B8FAA"; }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 px-8 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Title row */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-[26px] font-bold" style={{ letterSpacing: "-0.025em" }}>
                Mes projets
              </h1>
              <p className="text-[12px] mt-1" style={{ color: "#6B8FAA" }}>
                {projects.length === 0
                  ? "Aucun projet pour l'instant"
                  : `${projects.length} projet${projects.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => router.push("/projects/new")}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold transition-all"
              style={{ backgroundColor: accent, color: "#05080F", letterSpacing: "0.06em" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <IconPlus size={13} />
              Nouveau projet
            </button>
          </div>

          {/* Empty state */}
          {projects.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24 gap-6"
              style={{ border: "1px dashed #131C28" }}
            >
              <div style={{ color: "#1A3A5C" }}>
                <IconLayout size={48} />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold mb-1" style={{ color: "#E8F4FF" }}>
                  Aucun projet
                </p>
                <p className="text-[12px]" style={{ color: "#6B8FAA" }}>
                  Commence par choisir un modèle ou une page vide.
                </p>
              </div>
              <button
                onClick={() => router.push("/projects/new")}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold"
                style={{ backgroundColor: accent, color: "#05080F" }}
              >
                <IconPlus size={13} />
                Créer mon premier projet
              </button>
            </div>
          )}

          {/* Project grid */}
          {projects.length > 0 && (
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

              {/* Add card */}
              <button
                onClick={() => router.push("/projects/new")}
                className="flex flex-col items-center justify-center gap-2 transition-all min-h-[180px]"
                style={{ border: `1px dashed #131C28`, color: "#3D6080" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}50`; e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#131C28"; e.currentTarget.style.color = "#3D6080"; }}
              >
                <IconPlus size={18} />
                <span className="text-[10px] font-medium uppercase" style={{ letterSpacing: "0.1em" }}>
                  Nouveau projet
                </span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="px-8 py-4 border-t" style={{ borderColor: "#131C28" }}>
        <p className="text-[9px] font-mono" style={{ color: "#1A3A5C", letterSpacing: "0.1em" }}>
          FUTUR ONE © 2025 · DataCenter Infrastructure · Qatar
        </p>
      </footer>
    </div>
  );
}

// ─── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project, onOpen, onDelete, deleting, accent,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  deleting: boolean;
  accent: string;
}) {
  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all"
      style={{ border: "1px solid #131C28", backgroundColor: "#08101A" }}
      onClick={onOpen}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#131C28"; }}
    >
      {/* Preview */}
      <div
        className="w-full flex items-center justify-center relative"
        style={{ height: 110, backgroundColor: "#060D14", borderBottom: "1px solid #131C28" }}
      >
        {/* Theme color strip */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: `${accent}30` }} />
        <IconLayout size={28} style={{ color: `${accent}25` }} />

        {/* Open arrow on hover */}
        <div
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          style={{ color: accent }}
        >
          <span className="text-[8px] font-medium uppercase" style={{ letterSpacing: "0.1em" }}>Ouvrir</span>
          <IconChevronRight size={11} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
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

        <div className="flex items-center gap-2">
          <span
            className="text-[8px] font-mono uppercase px-1.5 py-0.5"
            style={{ backgroundColor: `${accent}12`, color: accent, border: `1px solid ${accent}25`, letterSpacing: "0.1em" }}
          >
            {project.activeThemeId.replace(/-/g, " ")}
          </span>
          <span className="text-[9px]" style={{ color: "#3D6080" }}>
            {formatTimeAgo(new Date(project.updatedAt))}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const diff  = Date.now() - date.getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return "À l'instant";
  if (mins  < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days  < 7)  return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR");
}
