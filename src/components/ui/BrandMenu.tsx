"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconPlus, IconLayout, IconRefresh } from "./Icon";

export default function BrandMenu({
  accent, background, onNewProject, onResetProject, onOpenDesignSystem,
}: {
  accent: string; background: string;
  onNewProject: () => void; onResetProject: () => void; onOpenDesignSystem: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5"
        title="Menu"
      >
        <div
          className="w-7 h-7 flex items-center justify-center text-[11px] font-black flex-shrink-0"
          style={{ backgroundColor: accent, color: background, letterSpacing: "-0.02em" }}
        >F1</div>
        <div className="hidden sm:block text-left">
          <div className="text-[11px] font-bold uppercase" style={{ letterSpacing: "0.16em" }}>FUTUR ONE</div>
          <div className="text-[7px] font-mono mt-0.5" style={{ color: "#666", letterSpacing: "0.08em" }}>DataCenter · Design Tool</div>
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 w-[220px] z-50"
          style={{ backgroundColor: "#0D0D14", border: "1px solid #2A2A3A", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
        >
          <MenuItem onClick={() => { onNewProject(); setOpen(false); }} accent={accent}>
            <IconPlus size={12} />
            Choisir un modèle…
          </MenuItem>
          <MenuItem onClick={() => { onOpenDesignSystem(); setOpen(false); }} accent={accent}>
            <IconLayout size={12} />
            Design System
          </MenuItem>
          <div className="border-t" style={{ borderColor: "#1E1E2A" }} />
          <MenuItem onClick={() => {
            if (confirm("Réinitialiser tout le projet ? Cette action est annulable via Cmd+Z.")) {
              onResetProject(); setOpen(false);
            }
          }} accent={accent}>
            <IconRefresh size={12} />
            Réinitialiser
          </MenuItem>
          <div className="border-t" style={{ borderColor: "#1E1E2A" }} />
          <div className="text-[8px] font-mono uppercase px-3 py-2" style={{ color: "#555", letterSpacing: "0.16em" }}>
            v0.2 · Phase 2
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ onClick, children, accent }: { onClick: () => void; children: React.ReactNode; accent: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 text-[10px] uppercase font-mono px-3 py-2 transition-colors"
      style={{ color: "#C5C5D0", backgroundColor: "transparent", letterSpacing: "0.1em" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15151E"; e.currentTarget.style.color = accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#C5C5D0"; }}
    >
      {children}
    </button>
  );
}
