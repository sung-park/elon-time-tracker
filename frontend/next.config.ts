import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/elon-time-tracker",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
