import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Suppress multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname),

  /** Les clients demandent encore `/favicon.ico` ; on sert le même rendu que `app/icon.tsx`. */
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },

  // Allow external image domains if needed later
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    // ── Print assets : zero compression. ──────────────────────────────────
    // - `unoptimized: true` désactive globalement la moulinette next/image
    //   (sharp/squoosh) qui ré-encode et baisse la qualité par défaut.
    // - Les fichiers de /public/ sont dans tous les cas servis tels quels
    //   par Next quand on les utilise via <img src> ou backgroundImage CSS,
    //   pas via next/image — donc 100% des octets d'origine sont livrés.
    unoptimized: true,
  },
};

export default nextConfig;
