import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import { MonthlyRewardItem, MonthlyRewardStatisticsResponse } from '@/types/monthlyRewards';

// Mock 데이터 정의 (API 호출 실패 시 사용)
export const mockMonthlyRewardStatistics: MonthlyRewardItem[] = [
  { year: 2024, month: 6, amount: 12500 },
  { year: 2024, month: 7, amount: 13200 },
  { year: 2024, month: 8, amount: 14500 },
  { year: 2024, month: 9, amount: 16000 },
  { year: 2024, month: 10, amount: 16700 },
  { year: 2024, month: 11, amount: 17900 },
  { year: 2024, month: 12, amount: 18500 },
  { year: 2025, month: 1, amount: 19200 },
  { year: 2025, month: 2, amount: 19800 },
  { year: 2025, month: 3, amount: 20100 },
  { year: 2025, month: 4, amount: 20500 },
  { year: 2025, month: 5, amount: 21000 },
];

interface MonthlyRewardsState {
  monthlyStats: MonthlyRewardItem[];
  isLoading: boolean;
  error: string | null;
  fetchMonthlyRewardStatistics: (token?: string) => Promise<void>;
}

const useMonthlyRewardsStore = create<MonthlyRewardsState>((set) => ({
  monthlyStats: [],
  isLoading: false,
  error: null,
  
  fetchMonthlyRewardStatistics: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출
      const response = await fetchApi<MonthlyRewardStatisticsResponse>('/admin/rewards/monthly-stats', {
        token,
        customHeaders: {
          'X-User-Id': '1' // 필요한 경우 사용자 ID 추가
        }
      });
      
      // 응답 데이터 처리
      if (response && response.data && response.data.monthlyRewardStatistics) {
        set({ 
          monthlyStats: response.data.monthlyRewardStatistics,
          isLoading: false 
        });
      } else {
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('월별 씨앗 지급 통계 데이터 로딩 실패:', error);
      
      // API 호출 실패 시 Mock 데이터로 대체
      set({ 
        monthlyStats: mockMonthlyRewardStatistics,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
}));

export default useMonthlyRewardsStore;