"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DragSession } from "@/data/types";

interface DragContextValue {
  session: DragSession | null;
  startDrag: (s: DragSession) => void;
  endDrag: () => void;
}

const DragContext = createContext<DragContextValue>({
  session: null,
  startDrag: () => {},
  endDrag: () => {},
});

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DragSession | null>(null);

  const startDrag = useCallback((s: DragSession) => {
    setSession(s);
    if (typeof document !== "undefined") {
      document.body.classList.add(`dragging-${s.type}`);
    }
  }, []);

  const endDrag = useCallback(() => {
    setSession(null);
    if (typeof document !== "undefined") {
      document.body.classList.remove("dragging-layout", "dragging-content");
    }
  }, []);

  return <DragContext.Provider value={{ session, startDrag, endDrag }}>{children}</DragContext.Provider>;
}

export const useDrag = () => useContext(DragContext);

export const DRAG_MIME = {
  LAYOUT: "application/x-futurone-layout",
  CONTENT: "application/x-futurone-content",
} as const;
