import { create } from 'zustand';
import { fetchApi } from '@/lib/api';

// API 응답 타입 정의
interface UserTrendSummary {
  lastWeekNewUsers: number;
  monthlyUserGrowthRate: number;
  churnRate: number;
}

interface UserTrendItem {
  year: number;
  month: number;
  newUsers: number;
  activeUsers: number;
  churnedUsers: number;
}

interface UserTrendsResponse {
  status: number;
  message: string;
  data: {
    userStatistics: {
      summary: UserTrendSummary;
      userTrend: UserTrendItem[];
    };
  };
}

// Mock 데이터
const mockUserTrendData = {
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
    { year: 2025, month: 5, newUsers: 780, activeUsers: 2020, churnedUsers: 58 },
  ]
};

interface UserTrendsStore {
  // 상태
  summary: UserTrendSummary | null;
  trends: UserTrendItem[] | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchUserTrends: (token?: string) => Promise<void>;
  resetError: () => void;
}

const useUserTrendsStore = create<UserTrendsStore>((set) => ({
  // 초기 상태
  summary: null,
  trends: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchUserTrends: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const response = await fetchApi<UserTrendsResponse>('/admin/dashboard/users/monthly-stats', {
        token,
      });
      
      // 안전한 데이터 접근 - 응답 구조 검증
      if (response?.data?.userStatistics) {
        const { userStatistics } = response.data;
        
        // summary와 userTrend 각각 검증
        const summary = userStatistics.summary || null;
        const trends = Array.isArray(userStatistics.userTrend) ? userStatistics.userTrend : null;
        
        set({ 
          summary,
          trends,
          isLoading: false 
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('사용자 추이 데이터 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        summary: mockUserTrendData.summary,
        trends: mockUserTrendData.userTrend,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useUserTrendsStore;
export type { UserTrendSummary, UserTrendItem };