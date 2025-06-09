import { API_BASE_URL } from '@/config/env';
import { authService } from '@/services/authService';

// ApiResponse 타입이 없는 경우 정의
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
  customHeaders?: Record<string, string>;
  userId?: string; // 동적 user-id 설정을 위한 옵션
}

// Mock 데이터 정의 (기존과 동일)
const mockData = {
  '/admin/dashboard/summary': {
    status: 200,
    message: "대시 보드 통계 조회에 성공하였습니다.",
    data: {
      dashboardStatistics: {
        totalUsers: { value: 8249, changeRate: 3.1 },
        totalDevices: { value: 7842, changeRate: 2.5 },
        totalDrives: { value: 164372, changeRate: 12.8 },
        totalIssuedRewards: { value: 1247890, changeRate: 7.6 }
      }
    }
  },
  '/admin/rewards/summary': {
    status: 200,
    message: "발급 사유별 월별 통계에 성공했습니다.",
    data: {
      totalIssued: { value: 36, changeRate: 0.0 },
      monthlyIssued: { value: 3, changeRate: 0.0 },
      dailyAverageIssued: { value: 0, changeRate: 0.0 },
      perUserAverageIssued: { value: 0, changeRate: 0.0 }
    }
  },
  '/admin/rewards/by-reason/total': {
    status: 200,
    message: "발급 사유별 총 통계에 성공했습니다.",
    data: {
      totalRewardStatistics: [
        { reason: "종합점수", count: 16, ratio: 44.4 },
        { reason: "이벤트미발생", count: 11, ratio: 30.6 },
        { reason: "MoBTI향상", count: 9, ratio: 25.0 }
      ]
    }
  },
  '/admin/rewards/monthly-stats': {
    status: 200,
    message: "월별 씨앗 지급 통계에 성공했습니다.",
    data: {
      monthlyRewardStatistics: [
        { year: 2024, month: 6, count: 12500 },
        { year: 2024, month: 7, count: 13200 },
        { year: 2024, month: 8, count: 14500 },
        { year: 2024, month: 9, count: 16000 },
        { year: 2024, month: 10, count: 16700 },
        { year: 2024, month: 11, count: 17900 },
        { year: 2024, month: 12, count: 18500 },
        { year: 2025, month: 1, count: 19200 },
        { year: 2025, month: 2, count: 19800 },
        { year: 2025, month: 3, count: 20100 },
        { year: 2025, month: 4, count: 20500 },
        { year: 2025, month: 5, count: 21000 }
      ]
    }
  },
  '/admin/dashboard/events/by-reason/total': {
    status: 200,
    message: "이벤트 유형별 추이 조회에 성공하였습니다.",
    data: {
      eventsStatisticsByReason: [
        { reason: "RAPID_ACCELERATION", count: 2 },
        { reason: "SHARP_TURN", count: 2 },
        { reason: "LANE_DEPARTURE", count: 2 },
        { reason: "NO_OPERATION", count: 2 }
      ]
    }
  },
  '/admin/dashboard/users/monthly-stats': {
    status: 200,
    message: "사용자 증감 추이 조회에 성공하였습니다.",
    data: {
      userStatistics: {
        summary: {
          lastWeekNewUsers: 245,
          monthlyUserGrowthRate: 14.2,
          churnRate: 3.5
        },
        userTrend: [
          { year: 2024, month: 6, newUsers: 420, activeUsers: 1200, churnedUsers: 45 },
          { year: 2024, month: 7, newUsers: 450, activeUsers: 1280, churnedUsers: 42 },
          { year: 2024, month: 8, newUsers: 480, activeUsers: 1350, churnedUsers: 38 },
          { year: 2024, month: 9, newUsers: 520, activeUsers: 1420, churnedUsers: 40 },
          { year: 2024, month: 10, newUsers: 550, activeUsers: 1500, churnedUsers: 44 },
          { year: 2024, month: 11, newUsers: 580, activeUsers: 1580, churnedUsers: 46 },
          { year: 2024, month: 12, newUsers: 610, activeUsers: 1650, churnedUsers: 48 },
          { year: 2025, month: 1, newUsers: 650, activeUsers: 1720, churnedUsers: 50 },
          { year: 2025, month: 2, newUsers: 680, activeUsers: 1800, churnedUsers: 52 },
          { year: 2025, month: 3, newUsers: 720, activeUsers: 1880, churnedUsers: 54 },
          { year: 2025, month: 4, newUsers: 750, activeUsers: 1950, churnedUsers: 56 },
          { year: 2025, month: 5, newUsers: 780, activeUsers: 2020, churnedUsers: 58 }
        ]
      }
    }
  },
  '/admin/dashboard/drives/monthly-stats': {
    status: 200,
    message: "월별 운전 횟수 조회에 성공했습니다.",
    data: {
      monthlyDrivesStatistics: [
        { year: 2024, month: 6, count: 12080 },
        { year: 2024, month: 7, count: 13200 },
        { year: 2024, month: 8, count: 14500 },
        { year: 2024, month: 9, count: 16000 },
        { year: 2024, month: 10, count: 16700 },
        { year: 2024, month: 11, count: 17900 },
        { year: 2024, month: 12, count: 18500 },
        { year: 2025, month: 1, count: 19200 },
        { year: 2025, month: 2, count: 19800 },
        { year: 2025, month: 3, count: 20100 },
        { year: 2025, month: 4, count: 20500 },
        { year: 2025, month: 5, count: 21000 }
      ]
    }
  },
  '/admin/rewards/history': {
    status: 200,
    message: "최근 씨앗 발급 내역 조회에 성공했습니다.",
    data: {
      rewardHistory: [
        { rewardId: "SEED_1024", email: "user1@example.com", issuedDate: "2025-04-25", reason: "안전 주행", amount: 12 },
        { rewardId: "SEED_1023", email: "user2@example.com", issuedDate: "2025-04-24", reason: "에코 주행", amount: 4 },
        { rewardId: "SEED_1022", email: "user3@example.com", issuedDate: "2025-04-23", reason: "출석 체크", amount: 50 },
        { rewardId: "SEED_1021", email: "user4@example.com", issuedDate: "2025-04-22", reason: "출석 체크", amount: 12 },
        { rewardId: "SEED_1020", email: "user5@example.com", issuedDate: "2025-04-21", reason: "안전 주행", amount: 12 }
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 5,
        totalElements: 150,
        totalPages: 30
      }
    }
  },
  '/admin/rewards': {
    status: 200,
    message: "씨앗 필터링 조회에 성공하였습니다.",
    data: {
      searchResult: [
        { rewardId: "SEED_6", userId: "1", email: "user1@example.com", createdAt: "2025-05-28", amount: 4, description: "안전 주행" },
        { rewardId: "SEED_7", userId: "1", email: "user1@example.com", createdAt: "2025-05-27", amount: 1, description: "에코 주행" },
        { rewardId: "SEED_8", userId: "1", email: "user1@example.com", createdAt: "2025-05-26", amount: 4, description: "출석 체크" }
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      }
    }
  }
};

// Mock 데이터 가져오기 함수
function getMockData(endpoint: string): any {
  console.log(`Mock 데이터 반환: ${endpoint}`);
  
  // 정확한 엔드포인트로 매칭
  if (mockData[endpoint]) {
    return mockData[endpoint];
  }
  
  // 패턴 매칭
  if (endpoint.includes('/dashboard/summary')) {
    return mockData['/admin/dashboard/summary'];
  }
  
  if (endpoint.includes('/dashboard/users/monthly-stats')) {
    return mockData['/admin/dashboard/users/monthly-stats'];
  }
  
  if (endpoint.includes('/dashboard/drives/monthly-stats')) {
    return mockData['/admin/dashboard/drives/monthly-stats'];
  }
  
  if (endpoint.includes('/dashboard/events/by-reason')) {
    return mockData['/admin/dashboard/events/by-reason/total'];
  }
  
  // 기본 응답
  console.warn(`엔드포인트 ${endpoint}에 대한 Mock 데이터가 없습니다.`);
  return {
    status: 200,
    message: "Mock 데이터 (기본값)",
    data: {}
  };
}

// 직접 modive.site로 요청하는 fetchApi 함수
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  console.log(`API 요청 시작: ${endpoint}`);
  
  // 환경 변수를 사용하여 Mock 데이터 사용 여부 결정
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    console.log('개발 환경: Mock 데이터를 사용합니다.');
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockResult = getMockData(endpoint) as T;
    console.log('Mock 데이터 반환:', mockResult);
    return mockResult;
  }

  try {
    // API URL 구성
    const apiUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `/api/modive/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
    
    console.log('요청 URL:', apiUrl);
    
    // 인증 헤더를 명시적으로 추가
    const headers = {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(), // 인증 헤더 추가
      ...(options.customHeaders || {})
    };
    
    console.log('요청 헤더:', headers);
    
    // 요청 실행 (타임아웃 추가)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃
    
    try {
      const response = await fetch(apiUrl, {
        method: options.method || 'GET',
        headers,
        signal: controller.signal,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      
      clearTimeout(timeoutId);
      
      // 인증 오류 처리 (401 Unauthorized)
      if (response.status === 401) {
        console.warn('인증 토큰이 만료되었습니다. 토큰 갱신 시도...');
        
        // 토큰 갱신 시도
        const refreshed = await authService.refreshAccessToken();
        
        if (refreshed) {
          // 토큰 갱신 성공 시 재요청
          console.log('토큰 갱신 성공. 요청 재시도...');
          return fetchApi(endpoint, options);
        } else {
          // 토큰 갱신 실패 시 로그인 페이지로 이동
          console.error('토큰 갱신 실패. 재로그인이 필요합니다.');
          authService.logout();
          window.location.href = '/auth/login';
          throw new Error('인증이 만료되었습니다. 다시 로그인해 주세요.');
        }
      }
      
      console.log(`API 응답 상태: ${response.status} ${response.statusText}`);
      
      // 응답 텍스트 가져오기
      const text = await response.text();
      console.log('응답 데이터 (처음 200자):', text.substring(0, 200));
      
      // 응답 상태 확인
      if (!response.ok) {
        console.error(`API 오류: ${response.status} ${response.statusText}`);
        console.error('오류 응답:', text);
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      // JSON 파싱
      try {
        if (text && text.trim()) {
          const data = JSON.parse(text);
          console.log('API 요청 성공:', data);
          return data;
        } else {
          throw new Error('빈 응답');
        }
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        throw new Error('JSON 파싱 실패');
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('API 요청 실패:', error);
    
    // 네트워크 오류 시 Mock 데이터로 대체
    if (process.env.NODE_ENV === 'development') {
      console.log('오류 발생, Mock 데이터로 대체합니다.');
      const mockResult = getMockData(endpoint) as T;
      console.log('Mock 데이터 반환:', mockResult);
      return mockResult;
    }
    
    throw error;
  }
}