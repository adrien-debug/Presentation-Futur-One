"use client";

import { useCallback, useEffect, useState } from "react";

export interface Asset {
  id:        string;
  src:       string | null;
  mimeType:  string | null;
  sizeBytes: number | null;
  createdAt: string;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export function useAssets(projectId?: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = projectId ? `/api/assets?projectId=${projectId}` : "/api/assets";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAssets(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const upload = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Seules les images sont acceptées");
      return null;
    }
    const dataUrl = await readAsDataUrl(file);
    const res = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, mimeType: file.type, dataUrl }),
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({})) as { error?: string };
      setError(msg.error ?? `Upload échoué (${res.status})`);
      return null;
    }
    const created = await res.json() as Asset;
    setAssets((prev) => prev.some((a) => a.id === created.id) ? prev : [created, ...prev]);
    return created;
  }, [projectId]);

  return { assets, loading, error, upload, refresh };
}
