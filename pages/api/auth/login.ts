import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다' });
  }

  try {
    const { id, pw } = req.body;
    
    // Postman과 동일한 URL로 요청
    const response = await fetch('http://modive.site/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, pw }),
    });
    
    // 응답 데이터 가져오기
    const data = await response.json();
    
    // 클라이언트에 응답 전달
    res.status(response.status).json(data);
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    res.status(500).json({ 
      message: '로그인 처리 중 오류가 발생했습니다',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    });
  }
}