"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { EditorState } from "./useEditorState";

interface Options {
  projectId: string;
  state: EditorState;
  enabled: boolean;       // only sync when user is logged in
  debounceMs?: number;
}

export type SyncStatus = "idle" | "dirty" | "syncing" | "saved" | "error";

/**
 * Cloud sync hook — debounced push of the full EditorState to
 * POST /api/projects/[projectId]/sync.
 *
 * Operates in parallel with localStorage auto-save (offline fallback).
 * Does NOT replace useEditorState — it just mirrors it to the DB.
 *
 * Status lifecycle:
 *   idle → dirty (state changed, debouncer pending)
 *        → syncing (POST in flight)
 *        → saved (POST succeeded; auto-reverts to idle after ~2s)
 *        → error (POST failed; sticky until next attempt)
 */
export function useCloudSync({ projectId, state, enabled, debounceMs = 1500 }: Options) {
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const [status, setStatus] = useState<SyncStatus>("idle");

  const sync = useCallback(async (s: EditorState) => {
    if (!enabled || !projectId) return;
    setStatus("syncing");
    try {
      const res = await fetch(`/api/projects/${projectId}/sync`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(s),
      });
      if (res.ok) {
        setStatus("saved");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          setStatus((prev) => (prev === "saved" ? "idle" : prev));
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [projectId, enabled]);

  useEffect(() => {
    // Skip the very first render (state just loaded from localStorage/DB)
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!enabled) return;

    setStatus("dirty");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => sync(state), debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, sync, enabled, debounceMs]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const flushSync = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return sync(state);
  }, [state, sync]);

  return { flushSync, status };
}
