"use client";

import React, { useRef, useState } from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import { DEFAULT_IMAGE, ImageData, ImageFit } from "@/data/types";
import { IMAGE_TREATMENTS } from "@/data/content";
import { IconUpload, IconTrash } from "@/components/ui/Icon";

export default function ImageInspector({ theme, slotId }: { theme: ArtDirection; slotId: string }) {
  const { images, setImage, removeImage } = useEditor();
  const current: ImageData = { ...DEFAULT_IMAGE, ...(images[slotId] ?? {}) };
  const [urlInput, setUrlInput] = useState(current.src && !current.src.startsWith("data:") ? current.src : "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accent = theme.colors.accent;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(slotId, { src: reader.result as string });
    reader.readAsDataURL(file);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#16161F", border: "1px solid #2A2A3A",
    color: "#E5E5EE", padding: "5px 7px", fontSize: 11, fontFamily: "monospace", outline: "none", boxSizing: "border-box",
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: accent, letterSpacing: "0.15em" }}>IMAGE</div>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: "#666" }}>{slotId}</div>
      </div>

      <Section label="Source" theme={theme}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase py-1.5 transition-colors"
          style={{ border: "1px solid #2A2A3A", backgroundColor: "#16161F", color: "#C5C5D0", letterSpacing: "0.1em" }}
        >
          <IconUpload size={11} />
          Upload fichier
        </button>
        <input
          type="text"
          placeholder="https://..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onBlur={() => urlInput.trim() && setImage(slotId, { src: urlInput.trim() })}
          onKeyDown={(e) => { if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); } }}
          style={inputStyle}
        />
        {current.src && (
          <button onClick={() => { removeImage(slotId); setUrlInput(""); }}
            className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase py-1.5"
            style={{ border: "1px solid #5A2A2A", backgroundColor: "#16161F", color: "#E07070", letterSpacing: "0.1em" }}>
            <IconTrash size={11} />
            Supprimer l&apos;image
          </button>
        )}
      </Section>

      <Section label={`Filtre (${IMAGE_TREATMENTS.length})`} theme={theme}>
        <div className="grid grid-cols-3 gap-1">
          <FilterChip active={current.filter === "none"} accent={accent} onClick={() => setImage(slotId, { filter: "none" })} label="NONE" css="" />
          {IMAGE_TREATMENTS.map((t) => (
            <FilterChip
              key={t.name}
              active={current.filter === t.css}
              accent={accent}
              onClick={() => setImage(slotId, { filter: t.css })}
              label={t.name.split(" ")[0]}
              css={t.css}
            />
          ))}
        </div>
      </Section>

      <Section label="Fit" theme={theme}>
        <div className="grid grid-cols-3 gap-1">
          {(["cover", "contain", "fill"] as ImageFit[]).map((f) => (
            <button
              key={f}
              onClick={() => setImage(slotId, { fit: f })}
              className="text-[10px] font-mono uppercase py-1"
              style={{
                border: `1px solid ${current.fit === f ? accent : "#2A2A3A"}`,
                backgroundColor: current.fit === f ? `${accent}22` : "#16161F",
                color: current.fit === f ? accent : "#C5C5D0",
              }}
            >{f}</button>
          ))}
        </div>
      </Section>

      <Section label={`Opacité · ${Math.round(current.opacity * 100)}%`} theme={theme}>
        <input
          type="range" min={0} max={100} value={Math.round(current.opacity * 100)}
          onChange={(e) => setImage(slotId, { opacity: Number(e.target.value) / 100 })}
          style={{ width: "100%", accentColor: accent }}
        />
      </Section>

      <Section label="Overlay" theme={theme}>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={current.overlay && current.overlay !== "none" ? current.overlay : "#000000"}
            onChange={(e) => setImage(slotId, { overlay: e.target.value })}
            style={{ width: 36, height: 28, background: "#16161F", border: "1px solid #2A2A3A", cursor: "pointer", padding: 2 }}
          />
          <button
            onClick={() => setImage(slotId, { overlay: current.overlay === "none" ? "#000000" : "none" })}
            className="flex-1 text-[10px] font-mono uppercase py-1"
            style={{
              border: `1px solid ${current.overlay !== "none" ? accent : "#2A2A3A"}`,
              backgroundColor: current.overlay !== "none" ? `${accent}22` : "#16161F",
              color: current.overlay !== "none" ? accent : "#C5C5D0",
            }}
          >
            {current.overlay === "none" ? "Off" : "On — clic pour off"}
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ label, theme, children }: { label: string; theme: ArtDirection; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 pb-3 border-b" style={{ borderColor: "#1E1E2A" }}>
      <div className="text-[7px] font-mono uppercase tracking-widest" style={{ color: theme.colors.accent, letterSpacing: "0.15em" }}>{label}</div>
      {children}
    </div>
  );
}

function FilterChip({ active, accent, onClick, label, css }: { active: boolean; accent: string; onClick: () => void; label: string; css: string }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer"
      style={{ border: `1px solid ${active ? accent : "#2A2A3A"}`, padding: 0, aspectRatio: "1.4/1" }}
      title={label}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #5C7CC8 0%, #C89B5C 50%, #2C2C3C 100%)", filter: css || undefined }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(0,0,0,0.7)", color: active ? accent : "#E5E5EE",
        fontFamily: "monospace", fontSize: 6, textAlign: "center", padding: "2px 1px",
        textTransform: "uppercase", letterSpacing: "0.05em",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{label}</div>
    </button>
  );
}
