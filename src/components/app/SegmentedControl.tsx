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
  const h = size === "sm" ? 24 : 28;
  const px = size === "sm" ? 8 : 12;
  const fs = size === "sm" ? 9 : 10;

  return (
    <div
      role="tablist"
      className={`inline-flex ${fullWidth ? "w-full" : ""}`}
      style={{
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-elevated)",
        padding: 2,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            title={opt.title ?? opt.label}
            onClick={() => onChange(opt.value)}
            className="flex items-center justify-center gap-1.5 transition-all flex-1 uppercase font-medium"
            style={{
              height: h,
              padding: `0 ${px}px`,
              fontSize: fs,
              letterSpacing: "0.08em",
              color: active ? "#05080F" : "var(--fg-secondary)",
              backgroundColor: active ? accent : "transparent",
            }}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
