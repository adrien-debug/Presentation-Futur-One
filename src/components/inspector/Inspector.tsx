"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import EmptyInspector from "./EmptyInspector";
import ZoneInspector from "./ZoneInspector";
import TextInspector from "./TextInspector";
import ImageInspector from "./ImageInspector";
import ChartInspector from "./ChartInspector";
import { IconClose } from "@/components/ui/Icon";

interface InspectorProps {
  theme: ArtDirection;
  onClose: () => void;
}

export default function Inspector({ theme, onClose }: InspectorProps) {
  const { selection } = useEditor();
  const { zoneKey, slotId, kind } = selection;

  let body: React.ReactNode;
  if (!zoneKey || !kind) {
    body = <EmptyInspector theme={theme} />;
  } else if (kind === "zone") {
    body = <ZoneInspector theme={theme} zoneKey={zoneKey} />;
  } else if (kind === "image" && slotId) {
    body = <ImageInspector theme={theme} slotId={slotId} />;
  } else if (kind === "chart" && slotId) {
    body = <ChartInspector theme={theme} slotId={slotId} />;
  } else if (kind === "text" && slotId) {
    body = <TextInspector theme={theme} zoneKey={zoneKey} slotId={slotId} />;
  } else {
    body = <EmptyInspector theme={theme} />;
  }

  return (
    <aside
      className="flex-shrink-0 overflow-y-auto border-l flex flex-col z-30 no-export"
      style={{
        width: "clamp(260px, 22vw, 320px)",
        minWidth: "260px",
        borderColor: "#2A2A3A",
        backgroundColor: "#0A0A10",
      }}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "#1E1E2A" }}>
        <span className="text-[9px] font-mono uppercase" style={{ color: theme.colors.accent, letterSpacing: "0.18em" }}>
          Inspector
        </span>
        <button
          onClick={onClose}
          title="Fermer"
          aria-label="Fermer l'inspector"
          className="w-5 h-5 flex items-center justify-center transition-colors"
          style={{ color: "#666" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#E5E5EE"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}
        >
          <IconClose size={12} />
        </button>
      </div>
      <div className="flex-1 p-3">{body}</div>
    </aside>
  );
}
