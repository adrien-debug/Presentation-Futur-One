"use client";

import { useEffect } from "react";

/**
 * Loads a stylesheet without blocking initial render. The browser fetches it
 * with `media="print"` (no rendering impact), then we swap to `media="all"`
 * once it's in the DOM. Used for theme-only typography presets that aren't
 * needed until the user opens an editor and picks the relevant preset.
 */
export default function LazyStylesheet({ href }: { href: string }) {
  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>(`link[data-lazy-href="${href}"]`);
    if (existing) {
      existing.media = "all";
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.media = "print";
    link.dataset.lazyHref = href;
    link.onload = () => { link.media = "all"; };
    document.head.appendChild(link);
  }, [href]);

  return null;
}
