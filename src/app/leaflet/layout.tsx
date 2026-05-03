import React from "react";

// Layout minimaliste pour les plaquettes print : pas de TopBar, pas d'auth,
// fond gris atelier pour faire ressortir le papier.
//
// Satoshi Variable est chargée depuis Fontshare (CDN public, gratuit, licence
// pro). Une seule famille couvre tous les usages (display, body, micro).

export default function LeafletLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900,1,2&display=swap"
      />
      <div
        style={{
          minHeight: "100dvh",
          backgroundColor: "#1a1a1a",
          color: "#e8e8e8",
          fontFamily: "'Satoshi', system-ui, -apple-system, sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}
