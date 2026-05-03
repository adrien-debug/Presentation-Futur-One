import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { AppSessionProvider } from "@/components/AppSessionProvider";
import LazyStylesheet from "./LazyStylesheet";

export const metadata: Metadata = {
  title: "Futur One — DataCenter Design Tool",
  description: "Institutional print-ready presentation editor for DataCenter infrastructure",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
  },
};

// ─── Font loading strategy ────────────────────────────────────────────────────
// Critical (blocking, in <head>): only the fonts the UI itself needs.
//   • Inter           — UI default + most theme presets
//   • IBM Plex Mono   — mono everywhere (labels, codes, captions)
//   • Satoshi         — UI body font (Fontshare)
// Non-critical (loaded after first paint via LazyStylesheet):
//   • Space Grotesk, Barlow Condensed, Playfair Display, DM Sans, DM Mono,
//     Orbitron, Exo 2, Clash Display, Cabinet Grotesk
//   These power user-selectable theme presets that most users never touch on
//   the first navigation, so we don't pay their cost upfront.
// Weights are trimmed to what's actually used (400/500/600/700 baseline).

const CRITICAL_FONTS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Inter:wght@400;500;600;700" +
  "&family=IBM+Plex+Mono:wght@400;500" +
  "&display=swap";

const SATOSHI_HREF =
  "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap";

const THEME_FONTS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Space+Grotesk:wght@400;500;700" +
  "&family=Barlow+Condensed:wght@400;700" +
  "&family=Playfair+Display:wght@400;700" +
  "&family=DM+Sans:opsz,wght@9..40,400;500;700" +
  "&family=DM+Mono:wght@400;500" +
  "&family=Orbitron:wght@500;700" +
  "&family=Exo+2:wght@400;500" +
  "&display=swap";

const CLASH_CABINET_HREF =
  "https://api.fontshare.com/v2/css?f[]=clash-display@500,700&f[]=cabinet-grotesk@400,500&display=swap";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Critical typography — blocks first paint */}
        <link href={CRITICAL_FONTS_HREF} rel="stylesheet" />
        <link href={SATOSHI_HREF} rel="stylesheet" />
      </head>
      <body>
        {/* Theme-preset fonts — load after first paint, no render-blocking */}
        <LazyStylesheet href={THEME_FONTS_HREF} />
        <LazyStylesheet href={CLASH_CABINET_HREF} />
        <AppSessionProvider session={session}>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
