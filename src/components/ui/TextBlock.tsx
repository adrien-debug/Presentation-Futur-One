"use client";

import React from "react";
import { ArtDirection } from "@/design-system";
import { F } from "@/utils/cqb";

interface TextBlockProps {
  theme: ArtDirection;
  text: string;
  size?: "hero" | "large" | "body" | "small" | "caption";
  highlight?: boolean;
  align?: "left" | "center" | "right";
  italic?: boolean;
  mono?: boolean;
}

const SIZE_MAP = {
  hero:    { fs: F.display, fw: "600", lh: "1.1" },
  large:   { fs: F.lead,    fw: "500", lh: "1.3" },
  body:    { fs: F.body,    fw: "400", lh: "1.5" },
  small:   { fs: F.small,   fw: "400", lh: "1.5" },
  caption: { fs: F.xs,      fw: "300", lh: "1.4" },
};

export default function TextBlock({
  theme, text, size = "body", highlight = false, align = "left", italic = false, mono = false,
}: TextBlockProps) {
  const { fs, fw, lh } = SIZE_MAP[size];
  return (
    <p
      style={{
        fontSize: fs,
        fontWeight: fw,
        color: highlight ? theme.colors.accent : theme.colors.textMuted,
        fontFamily: mono ? theme.typography.monoFont : theme.typography.bodyFont,
        lineHeight: lh,
        textAlign: align,
        fontStyle: italic ? "italic" : "normal",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}
