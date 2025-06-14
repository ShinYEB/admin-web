/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Vercel 빌드 시 TypeScript 오류 무시
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 오류도 무시
    ignoreDuringBuilds: true,
  },
  // 이미지 설정 (Next.js 이미지 최적화가 정적 내보내기에서는 작동하지 않음)
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/modive/:path*',
        destination: 'http://modive.site/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
