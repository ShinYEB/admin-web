/** @type {import('next').NextConfig} */
const nextConfig = {
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
