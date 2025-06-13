import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import { DashboardStats } from '@/types';

interface DashboardState {
  statistics: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardSummary: () => Promise<void>;
}

const useDashboardStore = create<DashboardState>((set) => ({
  statistics: null,
  isLoading: false,
  error: null,
  
  fetchDashboardSummary: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('대시보드 통계 요청 시작');
      
      const response = await fetchApi('/admin/dashboard/summary');
      console.log('대시보드 응답:', response);
      
      if (response && response.status === 200 && response.data) {
        set({ 
          statistics: response.data.dashboardStatistics, 
          isLoading: false 
        });
      } else {
        throw new Error('유효하지 않은 응답 형식');
      }
    } catch (error) {
      console.error('대시보드 통계 로드 실패:', error);
      set({ 
        error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다', 
        isLoading: false 
      });
    }
  },
}));

export default useDashboardStore;