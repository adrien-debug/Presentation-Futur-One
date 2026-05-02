import { BoxStyle, DEFAULT_BOX_STYLE } from "@/data/types";
import { ArtDirection } from "@/design-system";

/**
 * Convert a BoxStyle + theme into inline style + extra DOM markers.
 * Used by zone wrappers to render visual variations.
 */
export interface ResolvedBoxStyle {
  containerStyle: React.CSSProperties;
  showBrackets:   boolean;
  showBeveled:    boolean;
}

export function resolveBoxStyle(
  style: Partial<BoxStyle> | undefined,
  theme: ArtDirection
): ResolvedBoxStyle {
  // Always merge with defaults — store may contain only the changed fields
  const s: BoxStyle = { ...DEFAULT_BOX_STYLE, ...(style ?? {}) };

  const out: React.CSSProperties = {};

  // ── Fill ─────────────────────────────────────────────────────────────────
  switch (s.fill) {
    case "transparent":
      out.backgroundColor = "transparent";
      break;
    case "surface":
      out.backgroundColor = theme.colors.surface;
      break;
    case "surfaceAlt":
      out.backgroundColor = theme.colors.surfaceAlt;
      break;
    case "accentTint":
      out.backgroundColor = `${theme.colors.accent}18`;
      break;
    case "gradient":
      out.background = `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.surfaceAlt} 60%, ${theme.colors.background} 100%)`;
      break;
    case "glass":
      out.backgroundColor = `${theme.colors.surface}A0`;
      out.backdropFilter = "blur(12px)";
      (out as Record<string, string>).WebkitBackdropFilter = "blur(12px)";
      break;
  }

  // ── Border ───────────────────────────────────────────────────────────────
  if (s.border !== "none") {
    const borderValue = `${s.borderWidth}px ${s.border} ${theme.colors.border}`;
    switch (s.borderSides) {
      case "all":    out.border       = borderValue; break;
      case "top":    out.borderTop    = borderValue; break;
      case "bottom": out.borderBottom = borderValue; break;
      case "left":   out.borderLeft   = borderValue; break;
      case "right":  out.borderRight  = borderValue; break;
      case "x":
        out.borderLeft  = borderValue;
        out.borderRight = borderValue;
        break;
      case "y":
        out.borderTop    = borderValue;
        out.borderBottom = borderValue;
        break;
    }
  }

  // ── Radius ───────────────────────────────────────────────────────────────
  switch (s.radius) {
    case "soft":    out.borderRadius = "4px"; break;
    case "rounded": out.borderRadius = "12px"; break;
    case "square":  /* none */ break;
  }

  // ── Shadow ───────────────────────────────────────────────────────────────
  switch (s.shadow) {
    case "soft":  out.boxShadow = `0 4px 16px ${theme.colors.background}AA`; break;
    case "hard":  out.boxShadow = `4px 4px 0 0 ${theme.colors.accent}`; break;
    case "neon":  out.boxShadow = `0 0 16px ${theme.colors.accent}80, 0 0 32px ${theme.colors.accent}40`; break;
    case "inset": out.boxShadow = `inset 0 0 24px ${theme.colors.background}88`; break;
  }

  return {
    containerStyle: out,
    showBrackets:   s.corners === "brackets",
    showBeveled:    s.corners === "beveled",
  };
}
