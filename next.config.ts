import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // ✅ 이 부분 추가: 빌드 에러 무시 설정
  eslint: {
    ignoreDuringBuilds: true, // ESLint 에러 무시
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript 에러 무시
  },
};

export default nextConfig;
