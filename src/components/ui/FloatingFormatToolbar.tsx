"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

interface FloatingFormatToolbarProps {
  accentColor: string;
  active: boolean;
}

interface ToolbarPos {
  x: number;
  y: number;
}

const COLORS = [
  "#FFFFFF",
  "#0A0A0A",
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00D4FF",
  "#5856D6",
  "#AF52DE",
];

/**
 * Floating toolbar that appears above any text selection within a contentEditable
 * element marked with `data-richtext="true"`. Uses document.execCommand which is
 * still well-supported in browsers for rich-text editing.
 */
export default function FloatingFormatToolbar({ accentColor, active }: FloatingFormatToolbarProps) {
  const [pos, setPos] = useState<ToolbarPos | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const ignoreNextSelectionChange = useRef(false);

  useEffect(() => {
    if (!active) {
      setPos(null);
      return;
    }

    const update = () => {
      if (ignoreNextSelectionChange.current) {
        ignoreNextSelectionChange.current = false;
        return;
      }

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null);
        setShowColorPicker(false);
        return;
      }

      // Check the selection sits within a richtext-enabled contentEditable
      const anchor = sel.anchorNode;
      const editable = anchor?.parentElement?.closest('[data-richtext="true"]');
      if (!editable) {
        setPos(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPos(null);
        return;
      }

      setPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    };

    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  if (!active || !pos) return null;

  // Restoring selection between button clicks
  const exec = (cmd: string, val?: string) => {
    ignoreNextSelectionChange.current = true;
    document.execCommand(cmd, false, val);
  };

  const button = (label: string, onClick: () => void, title: string, style?: React.CSSProperties) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        width: "26px",
        height: "26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        border: "none",
        color: "#E0E0E8",
        fontSize: "13px",
        fontFamily: "system-ui, sans-serif",
        cursor: "pointer",
        borderRadius: "3px",
        transition: "background-color 0.1s, color 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${accentColor}25`;
        (e.currentTarget as HTMLButtonElement).style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "#E0E0E8";
      }}
    >
      {label}
    </button>
  );

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
        backgroundColor: "#1A1A24",
        border: "1px solid #2A2A3A",
        borderRadius: "6px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        padding: "3px",
        display: "flex",
        gap: "1px",
      }}
      onMouseDown={(e) => e.preventDefault()} // keep selection alive
    >
      {button("B", () => exec("bold"), "Gras (⌘B)", { fontWeight: 800 })}
      {button("I", () => exec("italic"), "Italique (⌘I)", { fontStyle: "italic" })}
      {button("U", () => exec("underline"), "Souligné (⌘U)", { textDecoration: "underline" })}
      {button("S", () => exec("strikeThrough"), "Barré", { textDecoration: "line-through" })}

      <div style={{ width: "1px", backgroundColor: "#2A2A3A", margin: "2px 2px" }} />

      {button("A", () => setShowColorPicker((v) => !v), "Couleur du texte", {
        color: accentColor,
        fontWeight: 700,
        position: "relative",
      })}

      {button("⬛", () => {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) {
          exec("backColor", `${accentColor}40`);
        }
      }, "Surligner", { fontSize: "11px" })}

      {button("⌫", () => {
        exec("removeFormat");
        exec("foreColor", "inherit");
        exec("backColor", "transparent");
      }, "Effacer le formatage", { fontSize: "13px" })}

      {/* Color picker */}
      {showColorPicker && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1A1A24",
            border: "1px solid #2A2A3A",
            borderRadius: "6px",
            padding: "6px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {[accentColor, ...COLORS].map((c) => (
            <button
              key={c}
              onMouseDown={(e) => {
                e.preventDefault();
                exec("foreColor", c);
                setShowColorPicker(false);
              }}
              title={c}
              style={{
                width: "18px",
                height: "18px",
                backgroundColor: c,
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
