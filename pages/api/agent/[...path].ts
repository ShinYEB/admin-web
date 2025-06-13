import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 경로 파라미터 추출
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    
    // API URL 구성 - HTTPS 사용
    const apiUrl = `http://modive.site/agent/${apiPath}`;
    
    // 요청 데이터 로깅
    console.log(`프록시 요청: ${req.method} ${apiUrl}`);
    console.log('요청 본문:', JSON.stringify(req.body, null, 2));
    
    // 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // 인증 헤더 추가
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // 요청 옵션
    const options = {
      method: req.method,
      headers: headers,
      // GET 요청이 아니면 본문 추가
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { 
        body: JSON.stringify(req.body) 
      })
    };
    
    console.log('요청 옵션:', {
      method: options.method,
      headers: Object.keys(headers),
      bodySize: options.body ? options.body.length : 0
    });

    // 외부 API로 요청 전송
    const response = await fetch(apiUrl, options);
    
    // 응답 처리
    const responseText = await response.text();
    console.log(`응답 상태: ${response.status}, 크기: ${responseText.length}`);
    
    // JSON으로 파싱 시도
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('응답 파싱 실패:', e);
      // 파싱 실패 시 텍스트 응답 그대로 사용
      responseData = { 
        success: false, 
        message: '서버 응답을 처리할 수 없습니다',
        rawResponse: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
      };
    }
    
    // 상태 코드와 응답 전달
    return res.status(response.status).json(responseData);
    
  } catch (error) {
    // 오류 처리
    console.error('API 프록시 오류:', error);
    return res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다', 
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}