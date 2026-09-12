import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. The source art is PNG/JPEG photography
    // that was previously served unoptimised at full resolution.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
