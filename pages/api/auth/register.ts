import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다' });
  }

  try {
    const { id, pw, nickname } = req.body;
    
    console.log('회원가입 요청:', { id, nickname });
    
    // Postman과 동일한 URL로 요청
    const response = await fetch('http://modive.site/auth/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, pw, nickname }),
    });
    
    // 응답 데이터 가져오기
    const responseText = await response.text();
    console.log('서버 응답 상태:', response.status);
    console.log('서버 응답 본문:', responseText);
    
    // 응답 반환
    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        res.status(response.status).json(data);
      } catch (e) {
        res.status(response.status).send(responseText);
      }
    } else {
      res.status(response.status).json({
        message: '서버 응답이 비어있습니다',
        status: response.status
      });
    }
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error);
    res.status(500).json({ 
      message: '회원가입 처리 중 오류가 발생했습니다',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    });
  }
}