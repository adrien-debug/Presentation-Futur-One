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
    width: "100%",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    color: "var(--fg-primary)",
    padding: "7px 10px",
    fontSize: 11,
    fontFamily: "monospace",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div className="flex flex-col" style={{ gap: 22 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
          Image
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 3, fontFamily: "monospace" }}>
          {slotId}
        </div>
      </div>

      <Section label="Source">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center transition-colors"
          style={{
            height: 32,
            gap: 8,
            border: "1px solid var(--border-subtle)",
            backgroundColor: "transparent",
            color: "var(--fg-secondary)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          <IconUpload size={11} />
          Importer un fichier
        </button>
        <input
          type="text"
          placeholder="https://…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onBlur={() => urlInput.trim() && setImage(slotId, { src: urlInput.trim() })}
          onKeyDown={(e) => { if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); } }}
          style={inputStyle}
        />
        {current.src && (
          <button
            onClick={() => { removeImage(slotId); setUrlInput(""); }}
            className="flex items-center justify-center transition-colors"
            style={{
              height: 32,
              gap: 8,
              border: "1px solid var(--border-subtle)",
              backgroundColor: "transparent",
              color: "#E07070",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            <IconTrash size={11} />
            Supprimer l&apos;image
          </button>
        )}
      </Section>

      <Section label={`Filtre · ${IMAGE_TREATMENTS.length}`}>
        <div className="grid grid-cols-3" style={{ gap: 4 }}>
          <FilterChip active={current.filter === "none"} accent={accent} onClick={() => setImage(slotId, { filter: "none" })} label="Aucun" css="" />
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

      <Section label="Cadrage">
        <div className="grid grid-cols-3" style={{ gap: 4 }}>
          {(["cover", "contain", "fill"] as ImageFit[]).map((f) => (
            <button
              key={f}
              onClick={() => setImage(slotId, { fit: f })}
              className="transition-colors"
              style={{
                height: 30,
                border: "1px solid var(--border-subtle)",
                backgroundColor: current.fit === f ? "var(--bg-elevated)" : "transparent",
                color: current.fit === f ? "var(--fg-primary)" : "var(--fg-secondary)",
                boxShadow: current.fit === f ? `inset 0 -1px 0 ${accent}` : "none",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>

      <Section label={`Opacité · ${Math.round(current.opacity * 100)}%`}>
        <input
          type="range" min={0} max={100} value={Math.round(current.opacity * 100)}
          onChange={(e) => setImage(slotId, { opacity: Number(e.target.value) / 100 })}
          style={{ width: "100%", accentColor: accent }}
        />
      </Section>

      <Section label="Surimpression">
        <div className="flex items-center" style={{ gap: 8 }}>
          <input
            type="color"
            value={current.overlay && current.overlay !== "none" ? current.overlay : "#000000"}
            onChange={(e) => setImage(slotId, { overlay: e.target.value })}
            style={{
              width: 36,
              height: 30,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              padding: 2,
            }}
          />
          <button
            onClick={() => setImage(slotId, { overlay: current.overlay === "none" ? "#000000" : "none" })}
            className="flex-1 transition-colors"
            style={{
              height: 30,
              border: "1px solid var(--border-subtle)",
              backgroundColor: current.overlay !== "none" ? "var(--bg-elevated)" : "transparent",
              color: current.overlay !== "none" ? "var(--fg-primary)" : "var(--fg-secondary)",
              boxShadow: current.overlay !== "none" ? `inset 0 -1px 0 ${accent}` : "none",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {current.overlay === "none" ? "Désactivée" : "Active — clic pour désactiver"}
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--fg-secondary)", letterSpacing: "-0.005em" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function FilterChip({ active, accent, onClick, label, css }: { active: boolean; accent: string; onClick: () => void; label: string; css: string }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer"
      style={{
        border: "1px solid var(--border-subtle)",
        padding: 0,
        aspectRatio: "1.4/1",
        boxShadow: active ? `inset 0 -2px 0 ${accent}` : "none",
      }}
      title={label}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #5C7CC8 0%, #C89B5C 50%, #2C2C3C 100%)", filter: css || undefined }} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(5, 8, 15, 0.78)",
          color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
          fontSize: 9,
          textAlign: "center",
          padding: "2px 3px",
          letterSpacing: "-0.005em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
    </button>
  );
}
