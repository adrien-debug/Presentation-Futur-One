"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconChevronLeft } from "@/components/ui/Icon";

interface ProjectType {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  pageCount: number;
}

const TYPES: ProjectType[] = [
  { id: "one-pager",    label: "One Pager",    sublabel: "1 double-page",  description: "Synthèse · fiche produit · landing print",          pageCount: 1  },
  { id: "two-pager",   label: "Two Pager",    sublabel: "2 double-pages", description: "Brief · executive summary · présentation courte",    pageCount: 2  },
  { id: "presentation",label: "Présentation", sublabel: "6 double-pages", description: "Pitch deck · client deck · proposal",                pageCount: 6  },
  { id: "portfolio",   label: "Portfolio",    sublabel: "8 double-pages", description: "Lookbook · catalogue · showcase",                    pageCount: 8  },
  { id: "rapport",     label: "Rapport",      sublabel: "12 double-pages",description: "Annual report · white paper · étude de marché",      pageCount: 12 },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ProjectType | null>(null);
  const [pending, start] = useTransition();
  const [name, setName] = useState("");

  const accent  = "#00D4FF";
  const SATOSHI = "'Satoshi', 'Inter', sans-serif";

  const handleCreate = () => {
    if (!selected) return;
    start(async () => {
      const res = await fetch("/api/projects", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:      name.trim() || selected.label,
          pageCount: selected.pageCount,
          showGrid:  true,
        }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/projects/${p.id}`);
      }
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#05080F", color: "#E8F4FF", fontFamily: SATOSHI }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-4 px-8 py-4 border-b flex-shrink-0"
        style={{ borderColor: "#131C28", backgroundColor: "#08101A" }}
      >
        <Link
          href="/projects"
          className="h-8 w-8 flex items-center justify-center transition-colors"
          style={{ border: "1px solid #131C28", color: "#6B8FAA" }}
        >
          <IconChevronLeft size={14} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: accent, color: "#05080F" }}>F1</div>
          <span className="text-[12px] font-bold uppercase" style={{ letterSpacing: "0.14em" }}>Nouveau projet</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-4xl">

          {/* Title */}
          <div className="mb-10">
            <h1 className="text-[28px] font-bold mb-2" style={{ letterSpacing: "-0.025em" }}>
              Quel type de projet ?
            </h1>
            <p className="text-[12px]" style={{ color: "#6B8FAA" }}>
              Pages blanches avec quadrillage · Format A3 paysage double-page
            </p>
          </div>

          {/* Type cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-10">
            {TYPES.map((t) => {
              const active = selected?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setSelected(t); if (!name) setName(t.label); }}
                  className="flex flex-col items-start p-5 text-left transition-all"
                  style={{
                    border:          `1px solid ${active ? accent : "#131C28"}`,
                    backgroundColor: active ? `${accent}08` : "#08101A",
                    outline:         active ? `1px solid ${accent}20` : "none",
                    outlineOffset:   "2px",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = `${accent}40`; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "#131C28"; }}
                >
                  {/* Spread preview */}
                  <div className="mb-5 w-full flex justify-center">
                    <SpreadPreview count={t.pageCount} accent={accent} active={active} />
                  </div>

                  <div className="text-[15px] font-semibold mb-0.5" style={{ color: active ? accent : "#E8F4FF" }}>
                    {t.label}
                  </div>
                  <div className="text-[9px] font-mono mb-3" style={{ color: active ? `${accent}70` : "#3D6080", letterSpacing: "0.08em" }}>
                    {t.sublabel}
                  </div>
                  <div className="text-[10px] leading-relaxed" style={{ color: "#6B8FAA" }}>
                    {t.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Name + CTA */}
          {selected && (
            <div
              className="flex items-center gap-4 p-5"
              style={{ border: "1px solid #131C28", backgroundColor: "#08101A" }}
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[9px] font-mono uppercase" style={{ color: "#6B8FAA", letterSpacing: "0.12em" }}>
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                  placeholder={selected.label}
                  autoFocus
                  className="px-3 py-2.5 text-[13px] font-medium outline-none transition-all"
                  style={{
                    backgroundColor: "#060D14",
                    border:          `1px solid ${accent}40`,
                    color:           "#E8F4FF",
                    caretColor:      accent,
                  }}
                  onFocus={(e)  => (e.currentTarget.style.borderColor = accent)}
                  onBlur={(e)   => (e.currentTarget.style.borderColor = `${accent}40`)}
                />
              </div>
              <div className="flex-shrink-0 pt-5">
                <button
                  onClick={handleCreate}
                  disabled={pending}
                  className="h-10 px-8 text-[12px] font-semibold transition-all disabled:opacity-40"
                  style={{ backgroundColor: accent, color: "#05080F", letterSpacing: "0.06em" }}
                >
                  {pending ? "Création…" : `Créer · ${selected.pageCount}p`}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Spread preview SVG ────────────────────────────────────────────────────────

function SpreadPreview({ count, accent, active }: { count: number; accent: string; active: boolean }) {
  const W = 52;
  const H = 34;
  const stack = Math.min(count, 4);
  const off = 3;
  const svgW = W + (stack - 1) * off + 4;
  const svgH = H + (stack - 1) * off + 4;
  const border = active ? accent : "#1E3448";
  const fill   = active ? `${accent}10` : "#0A1520";
  const grid   = active ? `${accent}25` : "#131C28";

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
      {/* Back pages */}
      {Array.from({ length: stack - 1 }, (_, i) => {
        const d = stack - 1 - i;
        return (
          <rect
            key={i}
            x={2 + d * off} y={2 + d * off}
            width={W} height={H} rx="1"
            fill="#07101A" stroke={border}
            strokeWidth="0.75" opacity={0.35 + i * 0.15}
          />
        );
      })}

      {/* Front page */}
      <rect x={2} y={2} width={W} height={H} rx="1" fill={fill} stroke={border} strokeWidth="1" />

      {/* Center spine */}
      <line x1={2 + W / 2} y1={3} x2={2 + W / 2} y2={1 + H} stroke={border} strokeWidth="0.6" opacity={0.6} />

      {/* Horizontal grid lines */}
      {[0.33, 0.66].map((r) => (
        <line key={r} x1={3} y1={2 + H * r} x2={1 + W} y2={2 + H * r} stroke={grid} strokeWidth="0.5" />
      ))}
      {/* Vertical grid lines */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line key={r} x1={2 + W * r} y1={3} x2={2 + W * r} y2={1 + H} stroke={grid} strokeWidth="0.5" />
      ))}

      {/* Page count */}
      {count > 1 && (
        <text x={1 + W} y={1 + H - 2} textAnchor="end" fontSize="5" fontFamily="monospace" fill={border} opacity={0.8}>
          {count}p
        </text>
      )}
    </svg>
  );
}
