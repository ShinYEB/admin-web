import { create } from 'zustand';
import { fetchApi } from '@/lib/api';

// API 응답 타입 정의
interface EventByReason {
  reason: string;
  count: number;
}

interface EventsByReasonResponse {
  status: number;
  message: string;
  data: {
    eventsStatisticsByReason: EventByReason[];
  };
}

// 영문 상수를 한글로 매핑
const eventReasonMap: Record<string, string> = {
  'RAPID_ACCELERATION': '급가속',
  'SHARP_TURN': '급회전',
  'LANE_DEPARTURE': '차선이탈',
  'NO_OPERATION': '무동작',
};

// Mock 데이터
const mockEventsByReason: EventByReason[] = [
  { reason: '급가속', count: 2 },
  { reason: '급회전', count: 2 },
  { reason: '차선이탈', count: 2 },
  { reason: '무동작', count: 2 },
];

interface EventsByReasonStore {
  // 상태
  events: EventByReason[] | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchEventsByReason: (token?: string) => Promise<void>;
  resetError: () => void;
}

const useEventsByReasonStore = create<EventsByReasonStore>((set) => ({
  // 초기 상태
  events: null,
  isLoading: false,
  error: null,
  
  // 액션
  fetchEventsByReason: async (token) => {
    try {
      set({ isLoading: true, error: null });
      
      // API 호출 시도
      const response = await fetchApi<EventsByReasonResponse>('/admin/dashboard/events/by-reason/total', {
        token,
      });
      
      // 안전한 데이터 접근 - 응답 구조 검증
      if (response?.data?.eventsStatisticsByReason && Array.isArray(response.data.eventsStatisticsByReason)) {
        const events = response.data.eventsStatisticsByReason.map(event => ({
          reason: eventReasonMap[event.reason] || event.reason,
          count: event.count
        }));
        
        set({ 
          events,
          isLoading: false 
        });
      } else {
        console.warn('응답 데이터 구조가 예상과 다름:', response);
        throw new Error('응답 데이터가 올바른 형식이 아닙니다');
      }
    } catch (error) {
      console.error('이벤트 유형별 데이터 로딩 실패:', error);
      
      // Mock 데이터로 폴백
      set({ 
        events: mockEventsByReason,
        isLoading: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
      });
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useEventsByReasonStore;
export type { EventByReason };
export { eventReasonMap };