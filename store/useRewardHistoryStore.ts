import { create } from 'zustand';
import { fetchApi } from '@/lib/api';
import { RewardHistoryItem, PageInfo, RewardHistoryResponse, RewardFilterResponse, RewardFilterOptions } from '@/types/rewardHistory';

interface RewardHistoryStore {
  // 상태
  rewardHistory: RewardHistoryItem[];
  pageInfo: PageInfo | null;
  filterOptions: RewardFilterOptions;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchRewardHistory: (page?: number, pageSize?: number) => Promise<void>;
  filterRewards: (options: Partial<RewardFilterOptions>) => Promise<void>;
  resetFilter: () => void;
  resetError: () => void;
}

// Mock 데이터 업데이트: email → userId로 수정
const mockRewardHistory: RewardHistoryItem[] = [
  { rewardId: "SEED_1024", userId: "1", issuedDate: "2025-04-25", reason: "안전 주행", amount: 12 },
  { rewardId: "SEED_1023", userId: "2", issuedDate: "2025-04-24", reason: "에코 주행", amount: 4 },
  { rewardId: "SEED_1022", userId: "3", issuedDate: "2025-04-23", reason: "출석 체크", amount: 50 },
  { rewardId: "SEED_1021", userId: "4", issuedDate: "2025-04-22", reason: "출석 체크", amount: 12 },
  { rewardId: "SEED_1020", userId: "5", issuedDate: "2025-04-21", reason: "안전 주행", amount: 12 },
  { rewardId: "SEED_1019", userId: "6", issuedDate: "2025-04-20", reason: "이벤트 미발생", amount: 10 },
  { rewardId: "SEED_1018", userId: "7", issuedDate: "2025-04-19", reason: "안전 주행", amount: 5 },
  { rewardId: "SEED_1017", userId: "8", issuedDate: "2025-04-18", reason: "에코 주행", amount: 8 },
  { rewardId: "SEED_1016", userId: "9", issuedDate: "2025-04-17", reason: "이벤트 미발생", amount: 20 },
  { rewardId: "SEED_1015", userId: "10", issuedDate: "2025-04-16", reason: "미션 달성", amount: 100 },
];

const mockPageInfo: PageInfo = {
  currentPage: 1,
  pageSize: 10,
  totalElements: 150,
  totalPages: 15
};

const useRewardHistoryStore = create<RewardHistoryStore>((set, get) => ({
  // 초기 상태
  rewardHistory: [],
  pageInfo: null,
  filterOptions: {
    userId: '', // email → userId로 변경
    page: 1,
    pageSize: 10
  },
  isLoading: false,
  error: null,
  
  // 액션
  fetchRewardHistory: async (page = 1, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const response = await fetchApi<RewardHistoryResponse>(`/admin/rewards/history?page=${page}&pageSize=${pageSize}`, {});
      
      // 안전한 데이터 접근
      if (response?.data?.rewardHistory && Array.isArray(response.data.rewardHistory)) {
        set({ 
          rewardHistory: response.data.rewardHistory,
          pageInfo: response.data.pageInfo || null,
          isLoading: false,
          filterOptions: {
            ...get().filterOptions,
            page,
            pageSize
          }
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('씨앗 발급 내역 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        rewardHistory: mockRewardHistory,
        pageInfo: mockPageInfo,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  filterRewards: async (options: Partial<RewardFilterOptions>) => {
    try {
      const newOptions = { ...get().filterOptions, ...options };
      set({ isLoading: true, error: null, filterOptions: newOptions });
      
      // API URL 구성 (email → userId로 변경)
      let url = '/admin/rewards?';
      const params = new URLSearchParams();
      
      if (newOptions.userId) params.append('userId', newOptions.userId); // email → userId로 변경
      if (newOptions.reason) params.append('reason', newOptions.reason);
      if (newOptions.startDate) params.append('startDate', newOptions.startDate);
      if (newOptions.endDate) params.append('endDate', newOptions.endDate);
      params.append('page', newOptions.page.toString());
      params.append('pageSize', newOptions.pageSize.toString());
      
      url += params.toString();
      
      // API 호출 시도
      const response = await fetchApi<RewardFilterResponse>(url, {});
      
      // 안전한 데이터 접근
      if (response?.data?.searchResult && Array.isArray(response.data.searchResult)) {
        set({ 
          rewardHistory: response.data.searchResult,
          pageInfo: response.data.pageInfo || null,
          isLoading: false
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('씨앗 필터링 실패:', error);
      
      // Mock 데이터로 폴백 - 필터링 로직도 email → userId로 변경
      const { userId, reason, startDate, endDate } = get().filterOptions;
      let filteredData = [...mockRewardHistory];
      
      if (userId) {
        filteredData = filteredData.filter(item => 
          item.userId?.toString().includes(userId));
      }
      
      if (reason) {
        filteredData = filteredData.filter(item => item.reason === reason);
      }
      
      if (startDate && endDate) {
        filteredData = filteredData.filter(item => {
          if (!item.issuedDate && !item.createdAt) return false;
          const dateStr = item.issuedDate || item.createdAt || '';
          return dateStr >= startDate && dateStr <= endDate;
        });
      }
      
      set({ 
        rewardHistory: filteredData,
        pageInfo: { ...mockPageInfo, totalElements: filteredData.length },
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetFilter: () => {
    set({ 
      filterOptions: { userId: '', page: 1, pageSize: 10 } // email → userId로 변경
    });
    get().fetchRewardHistory(1, 10);
  },
  
  resetError: () => set({ error: null })
}));

export default useRewardHistoryStore;