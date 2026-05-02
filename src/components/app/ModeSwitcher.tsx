"use client";

import React from "react";
import SegmentedControl from "./SegmentedControl";
import { IconLayout, IconPalette, IconLibrary, IconDownload } from "@/components/ui/Icon";

export type AppMode = "layout" | "design-system" | "assets" | "print-preview";

interface ModeSwitcherProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  accent?: string;
  compact?: boolean;
}

export default function ModeSwitcher({ mode, onChange, accent, compact = false }: ModeSwitcherProps) {
  return (
    <SegmentedControl<AppMode>
      value={mode}
      onChange={onChange}
      accent={accent}
      size={compact ? "sm" : "md"}
      options={[
        { value: "layout",         label: compact ? "" : "Layout",   icon: <IconLayout   size={12} />, title: "Layout" },
        { value: "design-system",  label: compact ? "" : "Design",   icon: <IconPalette  size={12} />, title: "Design System" },
        { value: "assets",         label: compact ? "" : "Assets",   icon: <IconLibrary  size={12} />, title: "Assets" },
        { value: "print-preview",  label: compact ? "" : "Print",    icon: <IconDownload size={12} />, title: "Print Preview" },
      ]}
    />
  );
}
