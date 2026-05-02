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
        { value: "layout",         label: compact ? "" : "Maquette",   icon: <IconLayout   size={12} />, title: "Maquette · mise en page" },
        { value: "design-system",  label: compact ? "" : "Style",      icon: <IconPalette  size={12} />, title: "Style · couleurs et typographie" },
        { value: "assets",         label: compact ? "" : "Médias",     icon: <IconLibrary  size={12} />, title: "Médias · images et icônes" },
        { value: "print-preview",  label: compact ? "" : "Impression", icon: <IconDownload size={12} />, title: "Impression · aperçu PDF" },
      ]}
    />
  );
}
