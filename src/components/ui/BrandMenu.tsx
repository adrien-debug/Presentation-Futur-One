"use client";

import React, { useState, useRef, useEffect } from "react";

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
        className="flex items-center gap-2"
        title="Menu"
      >
        <div
          className="w-6 h-6 flex items-center justify-center text-[10px] font-black flex-shrink-0"
          style={{ backgroundColor: accent, color: background }}
        >F1</div>
        <div className="hidden sm:block text-left">
          <div className="text-[10px] font-bold tracking-widest uppercase" style={{ letterSpacing: "0.15em" }}>FUTUR ONE</div>
          <div className="text-[6px] font-mono" style={{ color: "#555" }}>DataCenter · Design Tool ▾</div>
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-[200px] z-50"
          style={{ backgroundColor: "#0D0D14", border: "1px solid #2A2A3A", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}
        >
          <MenuItem onClick={() => { onNewProject(); setOpen(false); }}>
            <span style={{ color: accent }}>+</span> Nouveau projet…
          </MenuItem>
          <MenuItem onClick={() => { onOpenDesignSystem(); setOpen(false); }}>
            <span style={{ color: accent }}>📐</span> Design System
          </MenuItem>
          <div className="border-t" style={{ borderColor: "#1E1E2A" }} />
          <MenuItem onClick={() => {
            if (confirm("Réinitialiser tout le projet ? Cette action est annulable via Cmd+Z.")) {
              onResetProject(); setOpen(false);
            }
          }}>
            <span>↺</span> Réinitialiser
          </MenuItem>
          <div className="border-t" style={{ borderColor: "#1E1E2A" }} />
          <div className="text-[8px] font-mono uppercase tracking-widest px-3 py-2" style={{ color: "#555", letterSpacing: "0.15em" }}>
            v0.2 · Phase 2
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 text-[10px] uppercase font-mono px-3 py-2 transition-colors"
      style={{ color: "#CCC", backgroundColor: "transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#15151E"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {children}
    </button>
  );
}
