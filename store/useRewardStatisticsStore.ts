import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import {
  RewardStatisticsItem,
  TotalRewardStatisticsResponse,
  MonthlyRewardStatisticsResponse,
  mockTotalRewardStatistics,
  mockMonthlyRewardStatistics
} from '@/types/rewardStatistics';

type StatsMode = 'total' | 'monthly';

interface RewardStatisticsState {
  // 상태
  mode: StatsMode;
  totalStats: RewardStatisticsItem[] | null;
  monthlyStats: RewardStatisticsItem[] | null;
  selectedYear: number;
  selectedMonth: number;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  setMode: (mode: StatsMode) => void;
  fetchTotalStatistics: (token?: string) => Promise<void>;
  fetchMonthlyStatistics: (year: number, month: number, token?: string) => Promise<void>;
  setSelectedDate: (year: number, month: number) => void;
  resetError: () => void;
}

const useRewardStatisticsStore = create<RewardStatisticsState>((set, get) => {
  // 현재 날짜 기준으로 연도와 월 설정
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript는 월이 0부터 시작하므로 +1

  return {
    // 초기 상태
    mode: 'total',
    totalStats: null,
    monthlyStats: null,
    selectedYear: currentYear,
    selectedMonth: currentMonth,
    isLoading: false,
    error: null,
    
    // 액션
    setMode: (mode) => {
      set({ mode });
      if (mode === 'total' && !get().totalStats) {
        get().fetchTotalStatistics();
      } else if (mode === 'monthly' && !get().monthlyStats) {
        const { selectedYear, selectedMonth } = get();
        get().fetchMonthlyStatistics(selectedYear, selectedMonth);
      }
    },
    
    fetchTotalStatistics: async (token) => {
      try {
        set({ isLoading: true, error: null });
        
        // API 호출
        const response = await fetchApi<TotalRewardStatisticsResponse>('/admin/rewards/by-reason/total', {
          token,
          customHeaders: {
            'X-User-Id': '1' // 필요에 따라 조정
          }
        });
        
        if (response && response.data && response.data.totalRewardStatistics) {
          set({ 
            totalStats: response.data.totalRewardStatistics,
            isLoading: false 
          });
        } else {
          throw new Error('응답 데이터가 올바른 형식이 아닙니다');
        }
      } catch (error) {
        console.error('발급 사유별 총 통계 데이터 로딩 실패:', error);
        
        // Mock 데이터로 폴백
        set({ 
          totalStats: mockTotalRewardStatistics,
          isLoading: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
        });
      }
    },
    
    fetchMonthlyStatistics: async (year, month, token) => {
      try {
        set({ isLoading: true, error: null });
        
        // API 호출
        const response = await fetchApi<MonthlyRewardStatisticsResponse>(
          `/admin/rewards/by-reason/monthly-stats?year=${year}&month=${month}`, 
          {
            token,
            customHeaders: {
              'X-User-Id': '1' // 필요에 따라 조정
            }
          }
        );
        
        if (response && response.data && response.data.monthlyRewardStatistics) {
          set({ 
            monthlyStats: response.data.monthlyRewardStatistics,
            isLoading: false 
          });
        } else {
          throw new Error('응답 데이터가 올바른 형식이 아닙니다');
        }
      } catch (error) {
        console.error('발급 사유별 월별 통계 데이터 로딩 실패:', error);
        
        // Mock 데이터로 폴백
        set({ 
          monthlyStats: mockMonthlyRewardStatistics,
          isLoading: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
        });
      }
    },
    
    setSelectedDate: (year, month) => {
      set({ selectedYear: year, selectedMonth: month });
      if (get().mode === 'monthly') {
        get().fetchMonthlyStatistics(year, month);
      }
    },
    
    resetError: () => set({ error: null }),
  };
});

export default useRewardStatisticsStore;