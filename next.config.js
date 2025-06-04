/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://modive.site/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
