import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/bot/:path*",
        destination: "https://d0kusks0flg5.share.zrok.io/:path*",
      },
    ];
  },
};

export default nextConfig;
