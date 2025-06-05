import { User, UserDetail, UserDrivingRecord, UserSeedRecord } from '@/types/user';
import { authService } from '@/services/authService';

class UserService {
  // API 엔드포인트 기본 경로를 Next.js API 라우트로 사용
  private baseUrl = '/api/modive';

  // 인증 헤더 가져오기
  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // 사용자 목록 조회 + 운전 횟수
  async getUsersWithDriveCount(params: { page: number; pageSize: number }): Promise<any> {
    try {
      return await this.filterUsers({
        page: params.page,
        pageSize: params.pageSize,
      });
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  // 필터를 사용하여 사용자 목록 조회
  async filterUsers(filters: any = {}): Promise<any> {
    try {
      console.log("필터 API 호출:", filters);
      
      // 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();
      
      // 페이지네이션 파라미터
      if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
      if (filters.pageSize !== undefined) queryParams.append('pageSize', filters.pageSize.toString());
      
      // 필터 파라미터
      if (filters.email) queryParams.append('email', filters.email);
      if (filters.minExperience !== undefined) queryParams.append('minExperience', filters.minExperience.toString());
      if (filters.maxExperience !== undefined) queryParams.append('maxExperience', filters.maxExperience.toString());
      if (filters.accountAgeInMonths !== undefined) queryParams.append('accountAgeInMonths', filters.accountAgeInMonths.toString());
      if (filters.active !== undefined) queryParams.append('active', filters.active.toString());
      
      const queryString = queryParams.toString();
      const url = `${this.baseUrl}/admin/users/filter${queryString ? '?' + queryString : ''}`;
      
      console.log("API 요청 URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        // credentials: 'include', // 필요한 경우 쿠키 포함
      });
      
      if (!response.ok) {
        console.error(`API 오류 응답: ${response.status} ${response.statusText}`);
        // 응답 본문 확인
        try {
          const errorText = await response.text();
          console.error('오류 응답 본문:', errorText);
        } catch (e) {
          console.error('오류 응답 본문을 읽을 수 없음');
        }
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("필터 API 호출 실패:", error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('서버 연결 실패: CORS 설정을 확인하거나 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  // 사용자 상세 정보 조회
  async getUserDetail(userId: string): Promise<UserDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("사용자 상세 정보 조회 실패:", error);
      throw error;
    }
  }

  // 사용자 운전 기록 조회
  async getUserDrivingRecords(userId: string): Promise<UserDrivingRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}/drives`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("사용자 운전 기록 조회 실패:", error);
      throw error;
    }
  }

  // 사용자 씨앗 기록 조회
  async getUserSeedRecords(userId: string): Promise<UserSeedRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}/seeds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("사용자 씨앗 기록 조회 실패:", error);
      throw error;
    }
  }

  // 사용자 탈퇴 처리
  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("사용자 탈퇴 처리 실패:", error);
      throw error;
    }
  }

  // 관리자 통계 대시보드 요약 데이터 조회
  async getDashboardSummary(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("대시보드 요약 데이터 조회 실패:", error);
      throw error;
    }
  }

  // 월별 운전 통계 조회
  async getMonthlyDrives(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard/monthly-drives`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("월별 운전 통계 조회 실패:", error);
      throw error;
    }
  }

  // 이벤트별 통계 조회
  async getEventsByReason(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard/events-by-reason`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("이벤트별 통계 조회 실패:", error);
      throw error;
    }
  }

  // 사용자 트렌드 조회
  async getUserTrends(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/dashboard/user-trends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
      });
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("사용자 트렌드 조회 실패:", error);
      throw error;
    }
  }
}

export const userService = new UserService();