import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // Turbopack è già abilitato di default in Next.js 16
};

export default nextConfig;
