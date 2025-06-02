import { API_BASE_URL } from '@/config/env';
import { ApiResponse } from '@/types/api';

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
}

// Mock 데이터 정의 (개발 중에 필요한 경우)
const mockData = {
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
  // 대시보드 요약 데이터 추가
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
  '/admin/rewards/monthly-stats': {
    status: 200,
    message: "월별 씨앗 지급 통계에 성공했습니다.",
    data: {
      monthlyRewardStatistics: [
        { year: 2024, month: 6, count: 12500 }, // amount -> count로 변경
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
        { year: 2024, month: 6, count: 12080 }, // amount -> count로 통일
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
  // 정확한 엔드포인트로 매칭
  if (mockData[endpoint]) {
    return mockData[endpoint];
  }
  
  // 월별 통계 요청 패턴 매칭
  if (endpoint.startsWith('/admin/rewards/by-reason/monthly-stats')) {
    return {
      status: 200,
      message: "발급 사유별 월별 통계에 성공했습니다.",
      data: {
        monthlyRewardStatistics: [
          { reason: "종합점수", count: 8, ratio: 61.6 },
          { reason: "이벤트미발생", count: 2, ratio: 15.0 },
          { reason: "MoBTI향상", count: 3, ratio: 23.4 }
        ]
      }
    };
  }
  
  // 기본 응답
  console.warn(`엔드포인트 ${endpoint}에 대한 Mock 데이터가 없습니다.`);
  return {
    status: 200,
    message: "성공",
    data: {}
  };
}

// 개발 환경 확인
const isDevelopment = process.env.NODE_ENV === 'development';

// 개선된 fetchApi 함수
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  // 개발 환경에서 선택적으로 API 호출 허용
  const useMock = isDevelopment && !process.env.NEXT_PUBLIC_USE_REAL_API;
  
  if (useMock) {
    console.log('Mock 데이터 사용:', endpoint);
    const mockResponse = getMockData(endpoint);
    return mockResponse as unknown as T;
  }
  
  const { token, customHeaders, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers || {});
  
  // 토큰이 있으면 Authorization 헤더 설정
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // 커스텀 헤더가 있으면 추가
  if (customHeaders) {
    for (const [key, value] of Object.entries(customHeaders)) {
      headers.set(key, value);
    }
  }
  
  try {
    // API 프록시를 통해 요청
    const proxyUrl = `/api/proxy${endpoint}`;
    console.log('API 프록시 요청 URL:', proxyUrl);
    
    // API 호출 시도
    const response = await fetch(proxyUrl, {
      ...fetchOptions,
      headers,
    });

    // 응답을 텍스트로 먼저 받음
    const responseText = await response.text();
    
    try {
      // 텍스트를 JSON으로 파싱 시도
      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new ApiError(data.message || '요청 처리 중 오류가 발생했습니다', response.status);
      }
      
      return data;
    } catch (parseError) {
      // JSON 파싱 오류 발생 시
      console.error('응답을 JSON으로 파싱할 수 없음:', responseText);
      
      if (useMock) {
        // 개발 중 파싱 실패 시 Mock 데이터로 폴백
        console.warn('JSON 파싱 실패, Mock 데이터 반환 중:', endpoint);
        return getMockData(endpoint) as unknown as T;
      }
      
      throw new Error('응답을 JSON으로 파싱할 수 없습니다');
    }
  } catch (error) {
    console.error('API 요청 실패:', error);
    
    if (useMock) {
      // 개발 중 요청 실패 시 Mock 데이터로 폴백
      console.warn('API 요청 실패, Mock 데이터 반환 중:', endpoint);
      return getMockData(endpoint) as unknown as T;
    }
    
    throw error;
  }
}