import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import { DashboardStatistics, DashboardResponse } from '@/types/dashboard';

// Mock 데이터
const mockDashboardStatistics: DashboardStatistics = {
  totalUsers: {
    value: 8249,
    changeRate: 3.1
  },
  totalDevices: {
    value: 7842,
    changeRate: 2.5
  },
  totalDrives: {
    value: 164372,
    changeRate: 12.8
  },
  totalIssuedRewards: {
    value: 1247890,
    changeRate: 7.6
  }
};

interface DashboardStore {
  // 상태
  statistics: DashboardStatistics | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchDashboardSummary: (token?: string) => Promise<void>;
  resetError: () => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  // 초기 상태
  statistics: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchDashboardSummary: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const response = await fetchApi<DashboardResponse>('/admin/dashboard/summary', {
        token,
      });
      
      // 안전한 데이터 접근
      if (response?.data?.dashboardStatistics) {
        set({ 
          statistics: response.data.dashboardStatistics,
          isLoading: false 
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        statistics: mockDashboardStatistics,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useDashboardStore;