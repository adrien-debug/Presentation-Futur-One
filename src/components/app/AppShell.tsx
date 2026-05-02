"use client";

import React from "react";

interface AppShellProps {
  topbar:    React.ReactNode;
  canvas:    React.ReactNode;
  panel:     React.ReactNode;
  inspector?: React.ReactNode;
  showPanel?: boolean;
}

/**
 * AppShell — fullscreen 100vw × 100dvh grid.
 * No global scroll. Topbar fixed, canvas + panel fill remaining space.
 * On narrow viewports the panel stacks under the canvas (handled in globals.css).
 */
export default function AppShell({
  topbar, canvas, panel, inspector, showPanel = true,
}: AppShellProps) {
  return (
    <div className={`app-shell ${showPanel ? "" : "app-shell--no-panel"}`}>
      <div className="app-shell__topbar">{topbar}</div>
      <div className="app-shell__canvas relative">
        {canvas}
        {/* ContextInspector floats over canvas/panel intersection */}
        {inspector}
      </div>
      {showPanel && <div className="app-shell__panel">{panel}</div>}
    </div>
  );
}
