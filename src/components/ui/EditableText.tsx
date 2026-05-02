"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  tag?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  className?: string;
  accentColor?: string;
  multiline?: boolean;
  editMode?: boolean;
  /** When true, save innerHTML (preserves bold/italic/color spans). Default false → innerText. */
  richText?: boolean;
  /** Called when user enters edit mode (double-click). Useful for syncing UI selection. */
  onEnterEdit?: () => void;
}

export default function EditableText({
  value,
  onSave,
  tag = "div",
  style,
  className,
  accentColor = "#00D4FF",
  multiline = false,
  editMode = false,
  richText = false,
  onEnterEdit,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // When editing starts: populate the DOM and focus with cursor at end
  useEffect(() => {
    if (editing && ref.current) {
      if (richText) ref.current.innerHTML = value;
      else          ref.current.innerText = value;
      ref.current.focus();
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {
        // ignore edge-case selection errors
      }
    }
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync DOM when value changes from parent (while not editing)
  useEffect(() => {
    if (!editing && ref.current) {
      const current = richText ? ref.current.innerHTML : ref.current.innerText;
      if (current !== value) {
        if (richText) ref.current.innerHTML = value;
        else          ref.current.innerText = value;
      }
    }
  }, [value, editing, richText]);

  const save = useCallback(() => {
    const next = richText
      ? (ref.current?.innerHTML.trim() ?? "")
      : (ref.current?.innerText.trim() ?? "");
    onSave(next);
    setEditing(false);
  }, [onSave, richText]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setEditing(true);
    onEnterEdit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) {
        if (richText) ref.current.innerHTML = value;
        else          ref.current.innerText = value;
      }
      setEditing(false);
      return;
    }
    if (e.key === "Enter") {
      // Single-line: Enter saves. Multiline: Enter inserts newline, Cmd/Ctrl+Enter saves.
      if (!multiline && !e.shiftKey) {
        e.preventDefault();
        save();
      } else if (multiline && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        save();
      }
    }
  };

  const Tag = tag as React.ElementType;

  // Common props
  const commonProps = {
    ref,
    contentEditable: editing || undefined,
    suppressContentEditableWarning: true,
    onDoubleClick: handleDoubleClick,
    onBlur: editing ? save : undefined,
    onKeyDown: editing ? handleKeyDown : undefined,
    "data-richtext": richText ? "true" : undefined,
    style: {
      ...style,
      outline: editing ? `2px solid ${accentColor}` : "none",
      outlineOffset: "2px",
      cursor: editing || editMode ? "text" : style?.cursor,
      minHeight: editing ? "1em" : undefined,
    } as React.CSSProperties,
    className,
  };

  // Rich text mode → render via dangerouslySetInnerHTML so saved bold/italic/color survives
  if (richText) {
    return (
      <Tag
        {...commonProps}
        dangerouslySetInnerHTML={!editing ? { __html: value } : undefined}
      />
    );
  }

  return (
    <Tag {...commonProps}>
      {!editing ? value : undefined}
    </Tag>
  );
}
