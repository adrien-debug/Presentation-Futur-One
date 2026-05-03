"use client";

import React, { useState } from "react";
import { CoverPanel, BackPanel, InsideLeftPanel, InsideRightPanel } from "./panels";

type View = "cover" | "back" | "closed" | "open" | "all";

export default function QatarLeafletPage() {
  const [view, setView] = useState<View>("cover");
  const [showGuides, setShowGuides] = useState(false);
  const [zoom, setZoom] = useState(0.7);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* ─── Toolbar ──────────────────────────────────────────── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #2a2a2a",
        padding: "12px 24px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            fontFamily: "Satoshi, system-ui, sans-serif",
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "#888",
            textTransform: "uppercase",
            marginRight: 8,
          }}>FUTUR ONE · Qatar Leaflet</span>

          {(["cover", "back", "closed", "open", "all"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 12px",
                fontFamily: "Satoshi, system-ui, sans-serif",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "1px solid",
                borderColor: view === v ? "#FFC93C" : "#333",
                background: view === v ? "#FFC93C15" : "transparent",
                color: view === v ? "#FFC93C" : "#aaa",
              }}
            >{v}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "Satoshi, system-ui, sans-serif", fontSize: 11, color: "#aaa",
          }}>
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(e) => setShowGuides(e.target.checked)}
            />
            guides
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "Satoshi, system-ui, sans-serif", fontSize: 11, color: "#888" }}>zoom</span>
            <input
              type="range"
              min={0.3}
              max={1.2}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ fontFamily: "Satoshi, system-ui, sans-serif", fontSize: 11, color: "#aaa", minWidth: 36 }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              padding: "6px 12px",
              fontFamily: "Satoshi, system-ui, sans-serif",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              border: "1px solid #333",
              background: "transparent",
              color: "#aaa",
            }}
          >Print PDF</button>
        </div>
      </div>

      {/* ─── Canvas ───────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 24px",
        overflow: "auto",
      }}>
        <div style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          display: "inline-flex",
          gap: "24px",
        }}>
          {view === "cover" && <CoverPanel showGuides={showGuides} />}
          {view === "back"  && <BackPanel  showGuides={showGuides} />}

          {view === "closed" && (
            <>
              <BackPanel showGuides={showGuides} />
              <CoverPanel showGuides={showGuides} />
            </>
          )}

          {view === "open" && (
            <>
              <InsideLeftPanel  showGuides={showGuides} />
              <InsideRightPanel showGuides={showGuides} />
            </>
          )}

          {view === "all" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "flex", gap: 24 }}>
                <BackPanel  showGuides={showGuides} />
                <CoverPanel showGuides={showGuides} />
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <InsideLeftPanel  showGuides={showGuides} />
                <InsideRightPanel showGuides={showGuides} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
