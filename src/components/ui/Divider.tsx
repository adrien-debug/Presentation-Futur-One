"use client";

import React from "react";
import { ArtDirection } from "@/design-system";

type DividerStyle =
  | "simple"
  | "double"
  | "dotted"
  | "gradient"
  | "ornament"
  | "with-label"
  | "thick-short"
  | "dashes";

interface DividerProps {
  theme: ArtDirection;
  style?: DividerStyle;
  label?: string;
  margin?: string;
}

export default function Divider({
  theme,
  style = "simple",
  label,
  margin = "4px 0",
}: DividerProps) {
  const baseColor = theme.colors.border;
  const accentColor = theme.colors.accent;

  if (style === "simple") {
    return (
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: baseColor,
          margin,
        }}
      />
    );
  }

  if (style === "double") {
    return (
      <div style={{ margin }}>
        <div style={{ width: "100%", height: "1px", backgroundColor: baseColor }} />
        <div style={{ height: "3px" }} />
        <div style={{ width: "100%", height: "1px", backgroundColor: baseColor }} />
      </div>
    );
  }

  if (style === "dotted") {
    return (
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundImage: `repeating-linear-gradient(90deg, ${baseColor} 0, ${baseColor} 6px, transparent 6px, transparent 12px)`,
          margin,
        }}
      />
    );
  }

  if (style === "gradient") {
    return (
      <div
        style={{
          width: "100%",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, ${accentColor} 70%, transparent 100%)`,
          margin,
        }}
      />
    );
  }

  if (style === "ornament") {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "8px", margin }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: baseColor }} />
        <div
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: accentColor,
            transform: "rotate(45deg)",
          }}
        />
        <div style={{ flex: 1, height: "1px", backgroundColor: baseColor }} />
      </div>
    );
  }

  if (style === "with-label") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", margin }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: baseColor }} />
        {label && (
          <div
            style={{
              fontSize: "9px",
              fontFamily: "monospace",
              color: accentColor,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        )}
        <div style={{ flex: 1, height: "1px", backgroundColor: baseColor }} />
      </div>
    );
  }

  if (style === "thick-short") {
    return (
      <div style={{ margin }}>
        <div
          style={{
            width: "40px",
            height: "3px",
            backgroundColor: accentColor,
          }}
        />
      </div>
    );
  }

  if (style === "dashes") {
    return (
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          margin,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "1px",
              backgroundColor: i % 3 === 0 ? accentColor : baseColor,
            }}
          />
        ))}
      </div>
    );
  }

  return <div style={{ width: "100%", height: "1px", backgroundColor: baseColor, margin }} />;
}
