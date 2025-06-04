import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

// API 서버 주소
const API_HOST = 'modive.site';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // path 매개변수 추출
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    
    // 요청 URL 구성
    const apiUrl = `https://${API_HOST}/${apiPath}${
      Object.keys(req.query).length > 1 ? '?' + new URLSearchParams(
        Object.fromEntries(
          Object.entries(req.query).filter(([key]) => key !== 'path')
        )
      ).toString() : ''
    }`;

    console.log(`프록시 요청: ${req.method} ${apiUrl}`);

    // 요청 헤더 설정
    const headers: Record<string, string> = {};
    
    // Authorization 헤더 전달
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    // 커스텀 헤더 전달 (예: X-User-Id)
    if (req.headers['x-user-id']) {
      headers['X-User-Id'] = req.headers['x-user-id'] as string;
    }
    
    // Content-Type 설정
    headers['Content-Type'] = 'application/json';
    
    // URL 파싱
    const urlObj = new URL(apiUrl);

    // 요청 옵션 구성
    const options = {
      hostname: urlObj.hostname,
      port: 443, // HTTPS 기본 포트
      path: `${urlObj.pathname}${urlObj.search}`,
      method: req.method,
      headers
    };

    // 외부 API 서버에 요청 전송
    const apiResponse = await new Promise<Buffer>((resolve, reject) => {
      const apiReq = https.request(options, (apiRes) => {
        // 응답 상태 코드와 헤더 설정
        res.statusCode = apiRes.statusCode || 500;
        
        // 응답 헤더 복사 (필요한 헤더만)
        if (apiRes.headers['content-type']) {
          res.setHeader('Content-Type', apiRes.headers['content-type']);
        }

        // 응답 데이터 수집
        const chunks: Buffer[] = [];
        apiRes.on('data', (chunk) => chunks.push(chunk));
        apiRes.on('end', () => {
          const responseBody = Buffer.concat(chunks);
          resolve(responseBody);
        });
      });

      // 오류 처리
      apiReq.on('error', (error) => {
        console.error('API 프록시 오류:', error);
        reject(error);
      });

      // 요청 본문 전송 (있는 경우)
      if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        apiReq.write(JSON.stringify(req.body));
      }

      apiReq.end();
    });

    // 응답 전송
    return res.send(apiResponse);
    
  } catch (error) {
    console.error('프록시 처리 중 오류 발생:', error);
    return res.status(500).json({ 
      status: 500,
      message: '내부 서버 오류',
      error: (error as Error).message 
    });
  }
}

// API 요청 처리를 위해 body 파싱 구성
export const config = {
  api: {
    bodyParser: true,
  },
};