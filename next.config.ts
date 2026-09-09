import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow a separate build output directory so a running dev server never blocks a production build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
