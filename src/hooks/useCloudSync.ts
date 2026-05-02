"use client";

import { useEffect, useRef, useCallback } from "react";
import type { EditorState } from "./useEditorState";

interface Options {
  projectId: string;
  state: EditorState;
  enabled: boolean;       // only sync when user is logged in
  debounceMs?: number;
}

type SyncStatus = "idle" | "syncing" | "error" | "saved";

/**
 * Cloud sync hook — debounced push of the full EditorState to
 * POST /api/projects/[projectId]/sync.
 *
 * Operates in parallel with localStorage auto-save (offline fallback).
 * Does NOT replace useEditorState — it just mirrors it to the DB.
 */
export function useCloudSync({ projectId, state, enabled, debounceMs = 1500 }: Options) {
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<SyncStatus>("idle");
  const mountedRef = useRef(false);

  const sync = useCallback(async (s: EditorState) => {
    if (!enabled || !projectId) return;
    statusRef.current = "syncing";
    try {
      const res = await fetch(`/api/projects/${projectId}/sync`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(s),
      });
      statusRef.current = res.ok ? "saved" : "error";
    } catch {
      statusRef.current = "error";
    }
  }, [projectId, enabled]);

  useEffect(() => {
    // Skip the very first render (state just loaded from localStorage/DB)
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => sync(state), debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, sync, enabled, debounceMs]);

  const flushSync = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return sync(state);
  }, [state, sync]);

  return { flushSync, status: statusRef.current };
}
