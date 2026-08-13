import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker needs standalone; Vercel 16.3 breaks if both adapter + standalone are on.
  output: process.env.VERCEL ? undefined : "standalone",
  serverExternalPackages: ["googleapis", "redis"],
  experimental: {
    proxyClientMaxBodySize: "25mb",
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
