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

  if (!zoneKey || !kind)              return <div className="p-3"><EmptyInspector theme={theme} /></div>;
  if (kind === "zone")                return <div className="p-3"><ZoneInspector theme={theme} zoneKey={zoneKey} /></div>;
  if (kind === "image" && slotId)     return <div className="p-3"><ImageInspector theme={theme} slotId={slotId} /></div>;
  if (kind === "chart" && slotId)     return <div className="p-3"><ChartInspector theme={theme} slotId={slotId} /></div>;
  if (kind === "text"  && slotId)     return <div className="p-3"><TextInspector theme={theme} zoneKey={zoneKey} slotId={slotId} /></div>;
  return <div className="p-3"><EmptyInspector theme={theme} /></div>;
}
