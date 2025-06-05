import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // API 프록시 요청만 처리
  if (request.nextUrl.pathname.startsWith('/api/modive/')) {
    // 원래 URL 가져오기
    const url = new URL(request.url);
    
    // 목적지 URL 생성 (modive.site로 리다이렉트)
    const pathParts = request.nextUrl.pathname.split('/api/modive/');
    if (pathParts.length > 1) {
      const targetPath = pathParts[1];
      const targetUrl = new URL(`http://modive.site/${targetPath}${url.search}`);
      
      // 요청 헤더 설정
      const headers = new Headers(request.headers);
      
      // 추가 헤더 설정
      headers.set('x-user-id', '1');
      headers.set('Accept', '*/*');
      headers.set('Accept-Encoding', 'gzip, deflate');
      headers.set('Connection', 'keep-alive');
      headers.set('User-Agent', 'PostmanRuntime/7.44.0');
      
      // 토큰이 있으면 설정
      const token = request.cookies.get('authToken')?.value;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // 수정된 응답 반환
      return NextResponse.rewrite(targetUrl, {
        headers,
      });
    }
  }
  
  return NextResponse.next();
}

// 미들웨어가 적용되는 경로 지정
export const config = {
  matcher: '/api/modive/:path*',
};