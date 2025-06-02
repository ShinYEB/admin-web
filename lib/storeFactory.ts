import { StateCreator } from 'zustand';
import { fetchApi } from './api';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiActions<T, P = void> {
  fetch: (params?: P) => Promise<void>;
  resetError: () => void;
}

export type ApiSlice<T, P = void> = ApiState<T> & ApiActions<T, P>;

interface ApiOptions<T, P> {
  endpoint: string | ((params: P) => string);
  mockData: T;
  transformResponse?: (response: any) => T;
}

export function createApiSlice<T, P = void>(
  options: ApiOptions<T, P>
): StateCreator<ApiSlice<T, P>, [], [], ApiSlice<T, P>> {
  const { endpoint, mockData, transformResponse } = options;
  
  return (set) => ({
    // 초기 상태
    data: null,
    isLoading: false,
    error: null,
    
    // 액션
    fetch: async (params?: P) => {
      try {
        set({ isLoading: true, error: null });
        
        // 엔드포인트 결정
        const url = typeof endpoint === 'function' && params !== undefined
          ? endpoint(params)
          : endpoint;
          
        // API 호출
        const response = await fetchApi(url);
        
        // 응답 변환 (필요한 경우)
        const data = transformResponse ? transformResponse(response) : response.data;
        
        set({ data, isLoading: false });
      } catch (error) {
        console.error(`API 데이터 로딩 실패 (${typeof endpoint === 'string' ? endpoint : 'dynamic endpoint'}):`, error);
        
        // Mock 데이터로 폴백
        set({ 
          data: mockData,
          isLoading: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류 발생'
        });
      }
    },
    
    resetError: () => set({ error: null }),
  });
}