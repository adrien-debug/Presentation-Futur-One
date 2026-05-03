"use client";

import React from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  title?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  accent?: string;
}

export default function SegmentedControl<T extends string>({
  options, value, onChange, size = "md", fullWidth = false, accent = "#00D4FF",
}: SegmentedControlProps<T>) {
  const h = size === "sm" ? 26 : 32;
  const px = size === "sm" ? 10 : 14;
  const fs = size === "sm" ? 10 : 11;

  return (
    <div
      role="tablist"
      className={`inline-flex ${fullWidth ? "w-full" : ""}`}
      style={{
        border: "1px solid var(--border-subtle)",
        backgroundColor: "transparent",
      }}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            title={opt.title ?? opt.label}
            onClick={() => onChange(opt.value)}
            className="flex items-center justify-center transition-colors flex-1"
            style={{
              height: h,
              padding: `0 ${px}px`,
              gap: 7,
              fontSize: fs,
              fontWeight: active ? 500 : 400,
              letterSpacing: "-0.005em",
              color: active ? "var(--fg-primary)" : "var(--fg-secondary)",
              backgroundColor: active ? "var(--bg-elevated)" : "transparent",
              borderLeft: i === 0 ? "none" : "1px solid var(--border-subtle)",
              boxShadow: active ? `inset 0 -1px 0 ${accent}` : "none",
            }}
          >
            {opt.icon}
            {opt.label && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
