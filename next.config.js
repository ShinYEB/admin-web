/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 이미지 최적화 비활성화 (next export를 위해)
  images: {
    unoptimized: true,
  },
  
  // API 요청 재작성 규칙
  async rewrites() {
    return [
      // 인증 관련 경로는 별도 처리
      {
        source: '/api/auth/:path*',
        destination: 'http://modive.site/auth/:path*',
      },
      // 기타 API 경로
      {
        source: '/api/modive/:path*',
        destination: 'http://modive.site/:path*',
      }
    ];
  },
  
  // 빌드 시 출력 옵션 (배포를 위한 정적 HTML 출력)
  // output: 'export',
};

module.exports = nextConfig;
