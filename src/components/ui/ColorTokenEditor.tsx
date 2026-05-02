"use client";

import React, { useRef, useState } from "react";
import { ColorPalette, ArtDirection } from "@/design-system";
import { hexToCmyk, isValidHex } from "@/utils/color";
import { IconRefresh } from "./Icon";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

interface TokenGroup {
  label: string;
  keys: ColorKey[];
}

const TOKEN_GROUPS: TokenGroup[] = [
  { label: "Backgrounds", keys: ["background", "surface", "surfaceAlt"] },
  { label: "Brand",       keys: ["primary", "secondary", "accent", "highlight"] },
  { label: "Text",        keys: ["text", "textMuted"] },
  { label: "Structure",   keys: ["border"] },
];

const TOKEN_LABELS: Record<ColorKey, string> = {
  background: "Background",
  surface:    "Surface",
  surfaceAlt: "Surface Alt",
  primary:    "Primary",
  secondary:  "Secondary",
  accent:     "Accent ★",
  highlight:  "Highlight",
  text:       "Text",
  textMuted:  "Text Muted",
  border:     "Border",
};

interface ColorTokenEditorProps {
  theme: ArtDirection;
  overrides: Partial<ColorPalette>;
  onChange: (key: ColorKey, value: string) => void;
  onResetKey: (key: ColorKey) => void;
  onResetAll: () => void;
}

export default function ColorTokenEditor({
  theme,
  overrides,
  onChange,
  onResetKey,
  onResetAll,
}: ColorTokenEditorProps) {
  const hasOverrides = Object.keys(overrides).length > 0;
  const merged = { ...theme.colors, ...overrides };

  return (
    <div style={{ backgroundColor: "#08080E" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: "1px solid #1E1E2A", borderBottom: "1px solid #1E1E2A" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-3" style={{ backgroundColor: theme.colors.accent }} />
          <span className="text-[7px] font-mono uppercase tracking-widest" style={{ color: "#888" }}>
            Custom Couleurs
          </span>
          {hasOverrides && (
            <span
              className="px-1 py-0.5 text-[5px] font-mono uppercase tracking-wider"
              style={{
                backgroundColor: `${theme.colors.accent}25`,
                color: theme.colors.accent,
                border: `1px solid ${theme.colors.accent}40`,
              }}
            >
              {Object.keys(overrides).length} modifié{Object.keys(overrides).length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {hasOverrides && (
          <button
            onClick={onResetAll}
            className="text-[6px] font-mono uppercase tracking-wider px-1.5 py-0.5 transition-colors"
            style={{ color: "#555", border: "1px solid #2A2A3A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#f8717160";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2A2A3A";
            }}
          >
            Reset tout
          </button>
        )}
      </div>

      {/* Token groups */}
      <div className="px-3 py-2 flex flex-col gap-3">
        {TOKEN_GROUPS.map((group) => (
          <div key={group.label}>
            <div
              className="text-[5px] font-mono uppercase tracking-widest mb-1.5"
              style={{ color: "#444" }}
            >
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.keys.map((key) => (
                <ColorTokenRow
                  key={key}
                  tokenKey={key}
                  label={TOKEN_LABELS[key]}
                  currentValue={merged[key] as string}
                  baseValue={theme.colors[key] as string}
                  isOverridden={key in overrides}
                  accentColor={theme.colors.accent}
                  onChange={onChange}
                  onReset={onResetKey}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CMYK reference for accent */}
      <div
        className="px-3 py-2 flex items-center justify-between"
        style={{ borderTop: "1px solid #1E1E2A" }}
      >
        <span className="text-[5px] font-mono" style={{ color: "#444" }}>
          ACCENT CMYK
        </span>
        <span className="text-[5px] font-mono" style={{ color: theme.colors.accent }}>
          {hexToCmyk(merged.accent)}
        </span>
      </div>
    </div>
  );
}

// ─── Single token row ─────────────────────────────────────────────────────────

function ColorTokenRow({
  tokenKey,
  label,
  currentValue,
  baseValue,
  isOverridden,
  accentColor,
  onChange,
  onReset,
}: {
  tokenKey: ColorKey;
  label: string;
  currentValue: string;
  baseValue: string;
  isOverridden: boolean;
  accentColor: string;
  onChange: (key: ColorKey, value: string) => void;
  onReset: (key: ColorKey) => void;
}) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [hexInput, setHexInput] = useState(currentValue);
  const [inputFocused, setInputFocused] = useState(false);

  // Keep hex input in sync when value changes externally (theme switch)
  React.useEffect(() => {
    if (!inputFocused) setHexInput(currentValue);
  }, [currentValue, inputFocused]);

  const handleHexCommit = (raw: string) => {
    const val = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(val)) {
      onChange(tokenKey, val);
      setHexInput(val);
    } else {
      setHexInput(currentValue); // revert
    }
  };

  return (
    <div
      className="flex items-center gap-2 py-0.5 group"
      style={{ position: "relative" }}
    >
      {/* Modified dot */}
      <div
        className="w-1 h-1 rounded-full flex-shrink-0"
        style={{
          backgroundColor: isOverridden ? accentColor : "transparent",
          border: isOverridden ? "none" : "1px solid #333",
        }}
      />

      {/* Color swatch — click opens native picker */}
      <div
        className="relative flex-shrink-0 cursor-pointer"
        style={{
          width: "20px",
          height: "14px",
          border: isOverridden ? `1px solid ${accentColor}80` : "1px solid #333",
        }}
        onClick={() => pickerRef.current?.click()}
        title="Cliquer pour choisir une couleur"
      >
        <div className="w-full h-full" style={{ backgroundColor: currentValue }} />
        {/* Invisible native color input */}
        <input
          ref={pickerRef}
          type="color"
          value={currentValue}
          onChange={(e) => {
            onChange(tokenKey, e.target.value);
            setHexInput(e.target.value);
          }}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      {/* Token label */}
      <span
        className="text-[7px] flex-1 truncate"
        style={{ color: isOverridden ? "#CCC" : "#666" }}
      >
        {label}
      </span>

      {/* Hex input */}
      <input
        type="text"
        value={inputFocused ? hexInput : currentValue.toUpperCase()}
        onChange={(e) => setHexInput(e.target.value)}
        onFocus={() => {
          setInputFocused(true);
          setHexInput(currentValue);
        }}
        onBlur={(e) => {
          setInputFocused(false);
          handleHexCommit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.currentTarget as HTMLInputElement).blur();
          }
          if (e.key === "Escape") {
            setHexInput(currentValue);
            setInputFocused(false);
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        maxLength={7}
        spellCheck={false}
        className="font-mono text-center outline-none"
        style={{
          width: "52px",
          fontSize: "7px",
          backgroundColor: inputFocused ? "#1C1C2A" : "#111118",
          border: `1px solid ${inputFocused ? accentColor : isOverridden ? `${accentColor}40` : "#2A2A3A"}`,
          color: isOverridden ? accentColor : "#777",
          padding: "2px 3px",
          letterSpacing: "0.05em",
        }}
      />

      {/* Reset single token */}
      {isOverridden && (
        <button
          onClick={() => {
            onReset(tokenKey);
            setHexInput(baseValue);
          }}
          className="leading-none flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ color: "#f87171", width: "12px", height: "12px" }}
          title="Réinitialiser"
          aria-label="Réinitialiser cette couleur"
        >
          <IconRefresh size={11} />
        </button>
      )}
      {!isOverridden && <div style={{ width: "12px" }} />}
    </div>
  );
}
