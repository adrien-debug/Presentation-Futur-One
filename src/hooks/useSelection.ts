"use client";

import { useState, useCallback } from "react";
import { SlotKind, UISelection } from "@/data/types";

const EMPTY: UISelection = { zoneKey: null, slotId: null, kind: null };

/**
 * UI selection state — separate from the editor reducer (NOT undoable, NOT persisted).
 * Switching pages, pressing Escape, or clicking outside any zone should clear it.
 */
export function useSelection() {
  const [sel, setSel] = useState<UISelection>(EMPTY);

  const selectZone = useCallback((zoneKey: string) => {
    setSel({ zoneKey, slotId: null, kind: "zone" });
  }, []);

  const selectSlot = useCallback((zoneKey: string, slotId: string, kind: SlotKind) => {
    setSel({ zoneKey, slotId, kind });
  }, []);

  const clearSelection = useCallback(() => {
    setSel(EMPTY);
  }, []);

  return {
    selection: sel,
    selectZone,
    selectSlot,
    clearSelection,
  };
}
