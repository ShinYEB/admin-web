interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // 유닉스 타임스탬프
}

class AuthService {
  private static instance: AuthService;
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private tokenExpiryKey = 'tokenExpiry';
  
  // 싱글톤 인스턴스 접근
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  // 액세스 토큰 가져오기 (만료 확인 포함)
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null; // 서버 사이드에서는 null 반환
    }
    
    const token = localStorage.getItem(this.accessTokenKey);
    const expiryStr = localStorage.getItem(this.tokenExpiryKey);
    const expiry = expiryStr ? parseInt(expiryStr, 10) : 0;
    
    // 만료 확인
    if (token && expiry && Date.now() < expiry) {
      return token;
    } else if (token && (!expiry || Date.now() >= expiry)) {
      console.warn('토큰이 만료되었습니다. 갱신이 필요합니다.');
      // 리프레시 토큰으로 갱신 시도 (실제 구현은 별도 필요)
      this.refreshAccessToken();
      return token; // 갱신 시도 중이니 기존 토큰 반환
    }
    
    // 개발 환경의 기본 토큰
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_DEFAULT_AUTH_TOKEN || null;
    }
    
    return null;
  }
  
  // 리프레시 토큰 가져오기
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.refreshTokenKey);
  }
  
  // 토큰 설정 (로그인 성공 시 호출)
  setToken(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.setItem(this.accessTokenKey, accessToken);
    
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    
    // JWT에서 만료 시간 추출
    const expiresAt = this.getExpiryFromToken(accessToken);
    if (expiresAt) {
      localStorage.setItem(this.tokenExpiryKey, expiresAt.toString());
      console.log('토큰이 저장되었습니다. 만료 시간:', new Date(expiresAt).toLocaleString());
    }
  }
  
  // 액세스 토큰 갱신 (리프레시 토큰 사용)
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.error('리프레시 토큰이 없습니다.');
      return false;
    }
    
    try {
      // 리프레시 토큰으로 새 액세스 토큰 요청
      const response = await fetch('/api/modive/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }
      
      const data = await response.json();
      
      if (data.data && data.data.accessToken) {
        // 새 토큰 저장
        this.setToken(data.data.accessToken, data.data.refreshToken || refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      return false;
    }
  }
  
  // JWT 토큰에서 만료 시간 추출
  getExpiryFromToken(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.exp ? decoded.exp * 1000 : null; // 초를 밀리초로 변환
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return null;
    }
  }
  
  // 토큰이 유효한지 확인
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  
  // 로그아웃
  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    console.log('로그아웃되었습니다.');
  }
  
  // 인증 헤더 가져오기
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'x-user-id': '1'
    } : {
      'x-user-id': '1'
    };
  }
}

// 싱글톤 인스턴스 익스포트
export const authService = AuthService.getInstance();