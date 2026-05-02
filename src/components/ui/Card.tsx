"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

type CardVariant =
  | "default"
  | "glass"
  | "accent"
  | "highlight-bar"
  | "certificate"
  | "dual-col";

interface CardProps {
  theme: ArtDirection;
  variant?: CardVariant;
  title?: string;
  value?: string;
  description?: string;
  label?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export default function Card({
  theme,
  variant = "default",
  title,
  value,
  description,
  label,
  children,
  compact = false,
}: CardProps) {
  const pad = compact ? "12px" : "12px";

  if (variant === "glass") {
    return (
      <div
        style={{
          padding: pad,
          background: `${theme.colors.surface}CC`,
          border: `1px solid ${theme.colors.accent}30`,
          backdropFilter: "blur(8px)",
          borderRadius: "2px",
        }}
      >
        {label && (
          <div style={{ fontSize: "8px", color: theme.colors.accent, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
            {label}
          </div>
        )}
        {value && (
          <div style={{ fontSize: "clamp(14px, 2vw, 24px)", fontWeight: "700", color: theme.colors.text, fontFamily: theme.typography.headingFont }}>
            {value}
          </div>
        )}
        {title && (
          <div style={{ fontSize: "12px", color: theme.colors.textMuted, marginTop: "2px" }}>
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }

  if (variant === "accent") {
    return (
      <div
        style={{
          padding: pad,
          background: `linear-gradient(135deg, ${theme.colors.accent}20, ${theme.colors.surface})`,
          border: `1px solid ${theme.colors.accent}50`,
          borderLeft: `3px solid ${theme.colors.accent}`,
        }}
      >
        {label && (
          <div style={{ fontSize: "8px", color: theme.colors.accent, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
            {label}
          </div>
        )}
        {value && (
          <div style={{ fontSize: "clamp(16px, 2.2vw, 28px)", fontWeight: "800", color: theme.colors.accent, fontFamily: theme.typography.headingFont, letterSpacing: "-0.02em" }}>
            {value}
          </div>
        )}
        {description && (
          <div style={{ fontSize: "10px", color: theme.colors.textMuted, lineHeight: "1.5", marginTop: "4px" }}>
            {description}
          </div>
        )}
        {children}
      </div>
    );
  }

  if (variant === "highlight-bar") {
    return (
      <div
        style={{
          padding: `${compact ? "9px" : "10px"} ${pad}`,
          backgroundColor: theme.colors.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {label && (
          <div style={{ fontSize: "9px", fontFamily: "monospace", color: theme.colors.background, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700" }}>
            {label}
          </div>
        )}
        {value && (
          <div style={{ fontSize: "clamp(10px, 1.5vw, 18px)", fontWeight: "800", color: theme.colors.background, fontFamily: theme.typography.headingFont }}>
            {value}
          </div>
        )}
        {children}
      </div>
    );
  }

  if (variant === "certificate") {
    return (
      <div
        style={{
          padding: pad,
          border: `2px solid ${theme.colors.accent}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          background: `${theme.colors.accent}08`,
        }}
      >
        <div
          style={{
            width: compact ? "16px" : "24px",
            height: compact ? "16px" : "24px",
            backgroundColor: theme.colors.accent,
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {title && (
          <div style={{ fontSize: "9px", fontWeight: "700", color: theme.colors.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>
            {title}
          </div>
        )}
        {label && (
          <div style={{ fontSize: "8px", color: theme.colors.accent, fontFamily: "monospace", textAlign: "center" }}>
            {label}
          </div>
        )}
      </div>
    );
  }

  if (variant === "dual-col") {
    return (
      <div
        style={{
          padding: pad,
          border: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.colors.surface,
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "10px", color: theme.colors.textMuted }}>{title}</div>
        <div style={{ fontSize: compact ? "13px" : "15px", fontWeight: "700", color: theme.colors.text, fontFamily: theme.typography.headingFont, flexShrink: 0 }}>
          {value}
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div
      style={{
        padding: pad,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      {label && (
        <div style={{ fontSize: "8px", color: theme.colors.accent, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
          {label}
        </div>
      )}
      {value && (
        <div style={{ fontSize: "clamp(14px, 2vw, 24px)", fontWeight: "700", color: theme.colors.text, fontFamily: theme.typography.headingFont }}>
          {value}
        </div>
      )}
      {title && (
        <div style={{ fontSize: "10px", color: theme.colors.textMuted, marginTop: "2px" }}>
          {title}
        </div>
      )}
      {description && (
        <div style={{ fontSize: "9px", color: `${theme.colors.textMuted}80`, lineHeight: "1.5", marginTop: "4px" }}>
          {description}
        </div>
      )}
      {children}
    </div>
  );
}
