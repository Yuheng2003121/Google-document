import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"], // 添加 Clerk 的域名
  },
};

export default nextConfig;
