import { create } from 'zustand';
import { fetchApi } from '@/lib/api';

// API 응답 타입 정의
interface MonthlyDriveStats {
  year: number;
  month: number;
  count: number;
}

interface MonthlyDrivesResponse {
  status: number;
  message: string;
  data: {
    monthlyDrivesStatistics: MonthlyDriveStats[];
  };
}

// Mock 데이터 (당월 기준 12개월)
const mockMonthlyDrives: MonthlyDriveStats[] = [
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
  { year: 2025, month: 5, count: 21000 },
];

interface MonthlyDrivesStore {
  // 상태
  monthlyDrives: MonthlyDriveStats[] | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchMonthlyDrives: (token?: string) => Promise<void>;
  resetError: () => void;
}

const useMonthlyDrivesStore = create<MonthlyDrivesStore>((set) => ({
  // 초기 상태
  monthlyDrives: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchMonthlyDrives: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const response = await fetchApi<MonthlyDrivesResponse>('/admin/dashboard/drives/monthly-stats', {
        token,
      });
      
      // 안전한 데이터 접근
      if (response?.data?.monthlyDrivesStatistics && Array.isArray(response.data.monthlyDrivesStatistics)) {
        set({ 
          monthlyDrives: response.data.monthlyDrivesStatistics,
          isLoading: false 
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('월별 운전 횟수 데이터 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        monthlyDrives: mockMonthlyDrives,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useMonthlyDrivesStore;
export type { MonthlyDriveStats };