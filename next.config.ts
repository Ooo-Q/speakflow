import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许手机通过局域网 IP 访问 dev 时加载客户端脚本
  allowedDevOrigins: ["172.20.10.4"],
};

export default nextConfig;
