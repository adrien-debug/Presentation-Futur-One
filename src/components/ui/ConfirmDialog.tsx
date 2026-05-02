"use client";

import React, { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "neutral";
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight confirmation modal — replaces window.confirm() for actions
 * we want to brand and keep on-design. Handles Escape, click-outside,
 * and focuses the cancel button on open (safer default than confirm).
 */
export default function ConfirmDialog({
  open, title, message,
  confirmLabel = "Confirmer",
  cancelLabel  = "Annuler",
  variant      = "neutral",
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }
      if (e.key === "Enter")  { e.preventDefault(); onConfirm(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const confirmBg     = isDanger ? "var(--danger)"    : "var(--accent)";
  const confirmFg     = isDanger ? "var(--fg-primary)" : "var(--bg-on-accent)";
  const confirmBorder = isDanger ? "var(--danger)"    : "var(--accent)";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        className="relative w-[min(420px,90vw)]"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-2">
          <div
            id="confirm-dialog-title"
            className="text-[14px] font-semibold mb-2"
            style={{ color: "var(--fg-primary)" }}
          >
            {title}
          </div>
          <div
            id="confirm-dialog-message"
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--fg-secondary)" }}
          >
            {message}
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="h-8 px-4 text-[11px] font-medium uppercase transition-colors"
            style={{
              border: "1px solid var(--border-strong)",
              color: "var(--fg-secondary)",
              backgroundColor: "transparent",
              letterSpacing: "0.06em",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-4 text-[11px] font-semibold uppercase transition-all"
            style={{
              border: `1px solid ${confirmBorder}`,
              color: confirmFg,
              backgroundColor: confirmBg,
              letterSpacing: "0.06em",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
