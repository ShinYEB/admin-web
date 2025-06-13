/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 이미지 설정 (Next.js 이미지 최적화가 정적 내보내기에서는 작동하지 않음)
  images: {
    unoptimized: true,
  },
  // reactStrictMode: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/modive/:path*',
  //       destination: 'http://modive.site/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
