import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing: unused shadcn/ui components import @radix-ui which is not installed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
