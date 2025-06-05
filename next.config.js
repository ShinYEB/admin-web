/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/modive/:path*',
        destination: 'http://modive.site/:path*',
        // headers 필드는 여기에 직접 설정할 수 없습니다
      },
    ];
  },
};

module.exports = nextConfig;
