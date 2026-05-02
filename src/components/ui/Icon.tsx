"use client";

import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
};

function makeIcon(viewBox: string, paths: React.ReactNode) {
  return function Icon({ size = 14, className, style, strokeWidth = 1.75 }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
      >
        {paths}
      </svg>
    );
  };
}

export const IconUndo = makeIcon(
  "0 0 24 24",
  <>
    <path d="M9 14l-4-4 4-4" />
    <path d="M5 10h11a4 4 0 0 1 0 8h-3" />
  </>
);

export const IconRedo = makeIcon(
  "0 0 24 24",
  <>
    <path d="M15 14l4-4-4-4" />
    <path d="M19 10H8a4 4 0 0 0 0 8h3" />
  </>
);

export const IconClose = makeIcon(
  "0 0 24 24",
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </>
);

export const IconChevronLeft = makeIcon("0 0 24 24", <path d="M15 18l-6-6 6-6" />);
export const IconChevronRight = makeIcon("0 0 24 24", <path d="M9 18l6-6-6-6" />);

export const IconDownload = makeIcon(
  "0 0 24 24",
  <>
    <path d="M12 4v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </>
);

export const IconCheck = makeIcon("0 0 24 24", <path d="M5 13l4 4L19 7" />);

export const IconRefresh = makeIcon(
  "0 0 24 24",
  <>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </>
);

export const IconHelp = makeIcon(
  "0 0 24 24",
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M9.5 9a2.5 2.5 0 1 1 5 0c0 1.5-2.5 2-2.5 4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </>
);

export const IconCopy = makeIcon(
  "0 0 24 24",
  <>
    <rect x="9" y="9" width="11" height="11" rx="1" />
    <path d="M5 15V5a1 1 0 0 1 1-1h10" />
  </>
);

export const IconPlus = makeIcon(
  "0 0 24 24",
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
);

export const IconUpload = makeIcon(
  "0 0 24 24",
  <>
    <path d="M12 20V8" />
    <path d="M7 13l5-5 5 5" />
    <path d="M5 4h14" />
  </>
);

export const IconLayout = makeIcon(
  "0 0 24 24",
  <>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </>
);

export const IconPalette = makeIcon(
  "0 0 24 24",
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.5 1.5-1.3 0-.4-.2-.7-.4-1-.3-.4-.4-.7-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.5-4-8.2-9-8.2z" />
    <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
    <circle cx="17" cy="10.5" r="1" fill="currentColor" stroke="none" />
  </>
);

export const IconPages = makeIcon(
  "0 0 24 24",
  <>
    <rect x="6" y="3" width="14" height="18" rx="1" />
    <path d="M3 7v13a1 1 0 0 0 1 1h12" />
  </>
);

export const IconLibrary = makeIcon(
  "0 0 24 24",
  <>
    <path d="M4 4v16" />
    <path d="M8 4v16" />
    <path d="M12 5l3-1 5 16-3 1z" />
  </>
);

export const IconDroplet = makeIcon(
  "0 0 24 24",
  <path d="M12 3l-5.5 7.5a7 7 0 1 0 11 0z" />
);

export const IconPanelRight = makeIcon(
  "0 0 24 24",
  <>
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <path d="M15 4v16" />
  </>
);

export const IconTrash = makeIcon(
  "0 0 24 24",
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </>
);

export const IconPanelLeft = makeIcon(
  "0 0 24 24",
  <>
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <path d="M9 4v16" />
  </>
);
