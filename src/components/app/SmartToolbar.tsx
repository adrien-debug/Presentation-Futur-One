"use client";

import React from "react";
import { ArtDirection, ThemeId, ColorPalette } from "@/design-system";
import { AppMode } from "./ModeSwitcher";
import LayoutModePanel       from "./modes/LayoutModePanel";
import DesignSystemModePanel from "./modes/DesignSystemModePanel";
import AssetsModePanel       from "./modes/AssetsModePanel";
import PrintPreviewModePanel from "./modes/PrintPreviewModePanel";

type ColorKey = keyof Omit<ColorPalette, "cmyk">;

interface SmartToolbarProps {
  mode: AppMode;
  theme: ArtDirection;
  activeThemeId: ThemeId;
  colorOverrides: Partial<ColorPalette>;
  onSelectTheme:    (id: ThemeId) => void;
  onColorChange:    (k: ColorKey, v: string) => void;
  onResetAllColors: () => void;

  // Layout mode
  pageSide: "left" | "right";
  onPageSideChange: (s: "left" | "right") => void;
  showLabels:   boolean; onToggleLabels:   (v: boolean) => void;
  showSafeArea: boolean; onToggleSafeArea: (v: boolean) => void;
  showBleed:    boolean; onToggleBleed:    (v: boolean) => void;

  // Print mode
  onExport: () => void;

  // Assets mode
  projectId?: string;

  // Design System onboarding guide
  setupGuideActive?: boolean;
  onExitSetup?: () => void;
}

export default function SmartToolbar(props: SmartToolbarProps) {
  const accent = props.theme.colors.accent;
  const title = MODE_TITLES[props.mode];

  return (
    <aside
      className="flex flex-col h-full no-export"
      style={{
        borderLeft: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-panel)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: "var(--border-subtle)", height: 36 }}
      >
        <span className="text-[9px] font-mono uppercase" style={{ color: accent, letterSpacing: "0.2em" }}>
          {title}
        </span>
      </div>

      {/* Mode-specific content */}
      <div className="flex-1 min-h-0">
        {props.mode === "layout" && (
          <LayoutModePanel
            accent={accent}
            pageSide={props.pageSide}
            onPageSideChange={props.onPageSideChange}
            showLabels={props.showLabels}     onToggleLabels={props.onToggleLabels}
            showSafeArea={props.showSafeArea} onToggleSafeArea={props.onToggleSafeArea}
            showBleed={props.showBleed}       onToggleBleed={props.onToggleBleed}
          />
        )}
        {props.mode === "design-system" && (
          <DesignSystemModePanel
            theme={props.theme}
            activeThemeId={props.activeThemeId}
            colorOverrides={props.colorOverrides}
            onSelectTheme={props.onSelectTheme}
            onColorChange={props.onColorChange}
            onResetAllColors={props.onResetAllColors}
            setupGuideActive={props.setupGuideActive}
            onExitSetup={props.onExitSetup}
          />
        )}
        {props.mode === "assets" && (
          <AssetsModePanel theme={props.theme} projectId={props.projectId} />
        )}
        {props.mode === "print-preview" && (
          <PrintPreviewModePanel theme={props.theme} onExport={props.onExport} />
        )}
      </div>
    </aside>
  );
}

const MODE_TITLES: Record<AppMode, string> = {
  "layout":         "Maquette",
  "design-system":  "Style",
  "assets":         "Médias",
  "print-preview":  "Impression",
};
