import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Futur One — DataCenter Design Tool",
  description: "Institutional print-ready presentation editor for DataCenter infrastructure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&family=Barlow+Condensed:wght@400;600;700&family=Playfair+Display:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;400;500;600;700&family=DM+Mono:wght@300;400;500&family=Orbitron:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Satoshi + Clash Display + Cabinet Grotesk — design system fonts */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
