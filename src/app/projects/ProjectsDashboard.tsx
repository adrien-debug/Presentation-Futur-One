"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Project } from "@/db/schema";
import { IconPlus, IconClose, IconLayout, IconChevronRight } from "@/components/ui/Icon";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Props {
  projects: Project[];
  userEmail: string;
}

export default function ProjectsDashboard({ projects: initial, userEmail }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const requestDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);
    setDeletingId(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const SATOSHI = "'Satoshi', 'Inter', sans-serif";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-app)", color: "var(--fg-primary)", fontFamily: SATOSHI }}>

      {/* ── TOPBAR ──────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-[11px] font-black" style={{ backgroundColor: "var(--accent)", color: "var(--bg-on-accent)" }}>
            F1
          </div>
          <div>
            <div className="text-[12px] font-bold uppercase" style={{ letterSpacing: "0.16em" }}>FUTUR ONE</div>
            <div className="text-[7px] font-mono" style={{ color: "var(--fg-muted)", letterSpacing: "0.1em" }}>DataCenter · Design Tool</div>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="text-[11px]" style={{ color: "var(--fg-secondary)" }}>{userEmail}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[10px] font-medium px-3 py-1.5 transition-colors"
            style={{ border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)", letterSpacing: "0.06em" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--fg-secondary)"; }}
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
              <p className="text-[12px] mt-1" style={{ color: "var(--fg-secondary)" }}>
                {projects.length === 0
                  ? "Aucun projet pour l'instant"
                  : `${projects.length} projet${projects.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => router.push("/projects/new")}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold transition-all"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg-on-accent)", letterSpacing: "0.06em" }}
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
              style={{ border: "1px dashed var(--border-subtle)" }}
            >
              <div style={{ color: "var(--border-strong)" }}>
                <IconLayout size={48} />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--fg-primary)" }}>
                  Aucun projet
                </p>
                <p className="text-[12px]" style={{ color: "var(--fg-secondary)" }}>
                  Commence par choisir un modèle ou une page vide.
                </p>
              </div>
              <button
                onClick={() => router.push("/projects/new")}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold"
                style={{ backgroundColor: "var(--accent)", color: "var(--bg-on-accent)" }}
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
                  onDelete={() => requestDelete(p.id, p.name)}
                  deleting={deletingId === p.id}
                />
              ))}

              {/* Add card */}
              <button
                onClick={() => router.push("/projects/new")}
                className="flex flex-col items-center justify-center gap-2 transition-all min-h-[180px]"
                style={{ border: `1px dashed var(--border-subtle)`, color: "var(--fg-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 50%, transparent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--fg-muted)"; }}
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
      <footer className="px-8 py-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-[9px] font-mono" style={{ color: "var(--fg-deep)", letterSpacing: "0.1em" }}>
          FUTUR ONE © 2025 · DataCenter Infrastructure · Qatar
        </p>
      </footer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer ce projet ?"
        message={
          <>
            Le projet <strong style={{ color: "var(--fg-primary)" }}>« {pendingDelete?.name} »</strong> sera définitivement supprimé. Cette action est irréversible.
          </>
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

// ─── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project, onOpen, onDelete, deleting,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all"
      style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-subtle)" }}
      onClick={onOpen}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
    >
      {/* Preview */}
      <div
        className="w-full flex items-center justify-center relative"
        style={{ height: 110, backgroundColor: "var(--bg-app)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        {/* Theme color strip */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }} />
        <IconLayout size={28} style={{ color: "color-mix(in srgb, var(--accent) 25%, transparent)" }} />

        {/* Open arrow on hover (always visible on touch via .touch-show) */}
        <div
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 touch-show transition-opacity flex items-center gap-1"
          style={{ color: "var(--accent)" }}
        >
          <span className="text-[8px] font-medium uppercase" style={{ letterSpacing: "0.1em" }}>Ouvrir</span>
          <IconChevronRight size={11} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--fg-primary)" }}>
            {project.name}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 touch-show touch-target transition-opacity w-5 h-5 flex items-center justify-center flex-shrink-0 disabled:opacity-40"
            style={{ color: "var(--danger)" }}
            title="Supprimer"
            aria-label={`Supprimer le projet ${project.name}`}
          >
            <IconClose size={11} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[8px] font-mono uppercase px-1.5 py-0.5"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
              border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
              letterSpacing: "0.1em",
            }}
          >
            {project.activeThemeId.replace(/-/g, " ")}
          </span>
          <span className="text-[9px]" style={{ color: "var(--fg-muted)" }}>
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
