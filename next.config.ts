import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Suppress multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname),

  // Allow external image domains if needed later
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
