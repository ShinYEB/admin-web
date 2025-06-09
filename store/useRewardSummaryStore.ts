import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import { RewardSummary, RewardSummaryResponse, mockRewardSummary } from '@/types/rewardSummary';

interface RewardSummaryStore {
  // 상태
  summary: RewardSummary | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchRewardSummary: (token?: string) => Promise<void>;
  resetError: () => void;
}

const useRewardSummaryStore = create<RewardSummaryStore>((set) => ({
  // 초기 상태
  summary: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchRewardSummary: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const xUserId = '1'; // 예시 값
      const response = await fetchApi<RewardSummaryResponse>('/admin/rewards/summary', {
        token,
        customHeaders: {
          'X-User-Id': xUserId
        }
      });
      
      // response는 { status, message, data } 구조이므로
      // data 필드에서 실제 통계 정보를 추출
      if (response && response.data) {
        set({ 
          summary: response.data,
          isLoading: false 
        });
      } else {
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('씨앗 내역 요약 데이터 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        summary: mockRewardSummary,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useRewardSummaryStore;

export interface StatItem {
  value: number;
  changeRate: number;
}

export interface RewardSummary {
  totalIssued: StatItem;
  monthlyIssued: StatItem;
  dailyAverageIssued: StatItem;
  perUserAverageIssued: StatItem;
}

export interface RewardSummaryResponse {
  status: number;
  message: string;
  data: RewardSummary;
}