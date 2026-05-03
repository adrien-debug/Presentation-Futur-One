"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { useEditor } from "@/contexts/EditorContext";
import EmptyInspector from "./EmptyInspector";
import ZoneInspector from "./ZoneInspector";
import TextInspector from "./TextInspector";
import ImageInspector from "./ImageInspector";
import ChartInspector from "./ChartInspector";

interface InspectorProps {
  theme: ArtDirection;
}

export default function Inspector({ theme }: InspectorProps) {
  const { selection } = useEditor();
  const { zoneKey, slotId, kind } = selection;

  const wrapperStyle: React.CSSProperties = { padding: "16px" };

  if (!zoneKey || !kind)              return <div style={wrapperStyle}><EmptyInspector theme={theme} /></div>;
  if (kind === "zone")                return <div style={wrapperStyle}><ZoneInspector theme={theme} zoneKey={zoneKey} /></div>;
  if (kind === "image" && slotId)     return <div style={wrapperStyle}><ImageInspector theme={theme} slotId={slotId} /></div>;
  if (kind === "chart" && slotId)     return <div style={wrapperStyle}><ChartInspector theme={theme} slotId={slotId} /></div>;
  if (kind === "text"  && slotId)     return <div style={wrapperStyle}><TextInspector theme={theme} zoneKey={zoneKey} slotId={slotId} /></div>;
  return <div style={wrapperStyle}><EmptyInspector theme={theme} /></div>;
}
