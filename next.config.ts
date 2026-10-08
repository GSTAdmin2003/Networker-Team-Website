import type { NextConfig } from "next";
import { legalPages } from "./lib/site";

const nextConfig: NextConfig = {
  // Self-hosted in Docker: ship only the files each route needs.
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // The root layout is the dynamic `[locale]` segment, so unmatched
    // paths outside any locale need a standalone 404 document.
    globalNotFound: true,
  },
  async redirects() {
    return [
      // One canonical URL for Georgian (served at `/` via the rewrite below).
      { source: "/ka", destination: "/", permanent: true },
      ...legalPages.map((page) => ({
        source: `/ka/${page}`,
        destination: `/${page}`,
        permanent: true,
      })),
      // URLs of the original static site.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index_en.html", destination: "/en", permanent: true },
      { source: "/index_ru.html", destination: "/ru", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/ka" },
        ...legalPages.map((page) => ({ source: `/${page}`, destination: `/ka/${page}` })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
