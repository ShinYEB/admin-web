import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. 요청 경로 추출
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const apiUrl = `http://modive.site/${apiPath}`;
    
    console.log(`프록시 요청: ${apiUrl}`);
    console.log('요청 메서드:', req.method);
    console.log('요청 헤더:', {
      authorization: req.headers.authorization ? '토큰 있음' : '토큰 없음',
      xUserId: req.headers['x-user-id']
    });
    
    // 2. 헤더 설정
    const headers: HeadersInit = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'User-Agent': 'PostmanRuntime/7.44.0',
    };
    
    // Content-Type은 GET이 아닐 때만 설정
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
    }
    
    // Authorization 헤더 전달
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      console.log('인증 토큰이 전달되었습니다.');
    }
    
    // x-user-id 헤더 설정
    headers['x-user-id'] = (req.headers['x-user-id'] as string) || '1';
    
    console.log('API 요청 헤더:', headers);
    
    // 3. API 요청 수행
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃
      
      const response = await fetch(apiUrl, {
        method: req.method || 'GET',
        headers,
        signal: controller.signal,
        body: req.method !== 'GET' && req.method !== 'HEAD' && req.body 
          ? JSON.stringify(req.body) 
          : undefined,
      });
      
      clearTimeout(timeoutId);
      
      // 응답 로깅
      console.log(`API 응답 상태: ${response.status} ${response.statusText}`);
      
      // 4. 응답 데이터 처리
      const text = await response.text();
      console.log('API 응답 텍스트:', text.substring(0, 200));
      
      // 오류 응답이면 상세 정보 로깅 및 Mock 데이터 제안
      if (!response.ok) {
        console.error(`API 오류 응답: ${response.status} - ${text}`);
        
        // 클라이언트에게 더 유용한 정보 제공
        return res.status(500).json({
          error: 'External API Error',
          status: response.status,
          message: 'API 서버에서 오류가 발생했습니다. Mock 데이터 사용을 권장합니다.',
          originalResponse: text.substring(0, 500)
        });
      }
      
      // 5. 응답 처리
      try {
        // JSON 파싱 시도
        const data = JSON.parse(text);
        return res.status(response.status).json(data);
      } catch (parseError) {
        // JSON 파싱 실패시 텍스트 그대로 반환
        return res.status(response.status).send(text);
      }
      
    } catch (fetchError) {
      // fetch 자체 오류 (타임아웃, 네트워크 문제 등)
      console.error('API 요청 중 오류:', fetchError.message);
      return res.status(500).json({
        error: 'API Request Failed',
        message: fetchError.message,
        suggestion: 'Mock 데이터를 사용하세요.'
      });
    }
    
  } catch (error) {
    // 프록시 자체 오류
    console.error('프록시 처리 오류:', error);
    return res.status(500).json({ 
      error: 'Proxy Handler Error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}