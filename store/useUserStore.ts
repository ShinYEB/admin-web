// store/userStore.ts
import { create } from 'zustand';
import { User, UserDetail, DrivingRecord, SeedRecord, FilterParams } from '@/types/user';
import { userService } from '@/services/userService';

interface UserState {
  // 사용자 목록 상태
  users: User[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  currentFilters: FilterParams;

  // 사용자 상세 상태
  selectedUser: UserDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;

  // 사용자 기록 상태
  drivingRecords: DrivingRecord[];
  seedRecords: SeedRecord[];
  isDrivingRecordsLoading: boolean;
  isSeedRecordsLoading: boolean;
  drivingRecordsError: string | null;
  seedRecordsError: string | null;

  // 액션들
  fetchUsers: (params?: FilterParams) => Promise<void>;
  setPage: (page: number) => Promise<void>;
  setPageSize: (pageSize: number) => Promise<void>;
  setFilters: (filters: FilterParams) => void;
  clearFilters: () => void;
  clearErrors: () => void;
  fetchUserDetail: (userId: string) => Promise<void>;
  clearSelectedUser: () => void;
  fetchUserDrives: (userId: string) => Promise<void>;
  fetchUserRewards: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태
  users: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  isLoading: false,
  error: null,
  currentFilters: {},

  selectedUser: null,
  isDetailLoading: false,
  detailError: null,

  drivingRecords: [],
  seedRecords: [],
  isDrivingRecordsLoading: false,
  isSeedRecordsLoading: false,
  drivingRecordsError: null,
  seedRecordsError: null,

  // 액션들
  fetchUsers: async (params?: FilterParams) => {
    const state = get();
    
    if (state.isLoading) {
      return;
    }
    
    set({ isLoading: true, error: null });

    try {
      // pageSize가 없으면 기본값 설정
      const pageSize = params?.pageSize || 10;
      
      // 수정된 파라미터 
      const queryParams = {
        page: params?.page,
        pageSize: pageSize,
      };
      
      console.log("API 호출 파라미터:", queryParams);
      
      const response = await userService.getUsersWithDriveCount(queryParams);
      console.log("API 응답:", response);
      
      if (response?.data?.filterResult) {
        const { content, totalPages, totalElements, size, number } = response.data.filterResult;
        
        set({
          users: content || [],
          totalPages,
          totalElements,
          pageSize: size || pageSize, // API 응답의 size 또는 요청한 pageSize 사용
          currentPage: number || params?.page,
          isLoading: false
        });
        
        console.log(`스토어 업데이트 완료 - 페이지 크기: ${size} 현재 페이지: ${number}`);
      } else {
        throw new Error("API 응답 형식이 잘못되었습니다.");
      }
    } catch (error) {
      console.error("사용자 목록 로딩 중 오류:", error);
      set({ 
        error: error.message || "사용자 데이터를 불러오는데 실패했습니다", 
        isLoading: false 
      });
    }
  },

  setPage: async (page: number) => {
    const state = get();
    const newFilters = { ...state.currentFilters, page };
    await get().fetchUsers(newFilters);
  },

  setPageSize: async (pageSize: number) => {
    const state = get();
    set({ pageSize });
    const newFilters = { ...state.currentFilters, pageSize, page: 0 };
    await get().fetchUsers(newFilters);
  },

  setFilters: (filters: FilterParams) => {
    set({ currentFilters: filters });
  },

  clearFilters: () => {
    set({ 
      currentFilters: {},
      currentPage: 0,
    });
  },

  clearErrors: () => {
    set({ 
      error: null,
      detailError: null,
      drivingRecordsError: null,
      seedRecordsError: null,
    });
  },

  fetchUserDetail: async (userId: string) => {
    set({ isDetailLoading: true, detailError: null });

    try {
      const userDetail = await userService.getUserDetailWithDriveCount(userId);
      set({
        selectedUser: userDetail,
        isDetailLoading: false,
        detailError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '사용자 상세 정보 조회에 실패했습니다.';
      set({
        selectedUser: null,
        isDetailLoading: false,
        detailError: errorMessage,
      });
    }
  },

  clearSelectedUser: () => {
    set({ 
      selectedUser: null,
      drivingRecords: [],
      seedRecords: [],
    });
  },

  fetchUserDrives: async (userId: string) => {
    set({ isDrivingRecordsLoading: true, drivingRecordsError: null });

    try {
      const drivingRecords = await userService.getUserDrives(userId);
      set({
        drivingRecords,
        isDrivingRecordsLoading: false,
        drivingRecordsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '운전 기록 조회에 실패했습니다.';
      set({
        drivingRecords: [],
        isDrivingRecordsLoading: false,
        drivingRecordsError: errorMessage,
      });
    }
  },

  fetchUserRewards: async (userId: string) => {
    set({ isSeedRecordsLoading: true, seedRecordsError: null });

    try {
      const seedRecords = await userService.getUserRewards(userId);
      set({
        seedRecords,
        isSeedRecordsLoading: false,
        seedRecordsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '씨앗 내역 조회에 실패했습니다.';
      set({
        seedRecords: [],
        isSeedRecordsLoading: false,
        seedRecordsError: errorMessage,
      });
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await userService.deleteUser(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '사용자 탈퇴에 실패했습니다.';
      set({ error: errorMessage });
      throw error;
    }
  },
}));

// 개별 훅들로 분리 - 안정적인 참조 유지
export const useUsers = () => {
  const users = useUserStore(state => state.users);
  const totalPages = useUserStore(state => state.totalPages);
  const totalElements = useUserStore(state => state.totalElements);
  const currentPage = useUserStore(state => state.currentPage);
  const pageSize = useUserStore(state => state.pageSize);
  const isLoading = useUserStore(state => state.isLoading);
  const error = useUserStore(state => state.error);
  
  return { users, totalPages, totalElements, currentPage, pageSize, isLoading, error };
};

export const useUserDetail = () => {
  const selectedUser = useUserStore(state => state.selectedUser);
  const isDetailLoading = useUserStore(state => state.isDetailLoading);
  const detailError = useUserStore(state => state.detailError);
  
  return { selectedUser, isDetailLoading, detailError };
};

export const useUserRecords = () => {
  const drivingRecords = useUserStore(state => state.drivingRecords);
  const seedRecords = useUserStore(state => state.seedRecords);
  const isDrivingRecordsLoading = useUserStore(state => state.isDrivingRecordsLoading);
  const isSeedRecordsLoading = useUserStore(state => state.isSeedRecordsLoading);
  const drivingRecordsError = useUserStore(state => state.drivingRecordsError);
  const seedRecordsError = useUserStore(state => state.seedRecordsError);
  
  return { drivingRecords, seedRecords, isDrivingRecordsLoading, isSeedRecordsLoading, drivingRecordsError, seedRecordsError };
};

export const useUserActions = () => {
  const fetchUsers = useUserStore(state => state.fetchUsers);
  const setPage = useUserStore(state => state.setPage);
  const setPageSize = useUserStore(state => state.setPageSize);
  const setFilters = useUserStore(state => state.setFilters);
  const clearFilters = useUserStore(state => state.clearFilters);
  const clearErrors = useUserStore(state => state.clearErrors);
  const fetchUserDetail = useUserStore(state => state.fetchUserDetail);
  const clearSelectedUser = useUserStore(state => state.clearSelectedUser);
  const fetchUserDrives = useUserStore(state => state.fetchUserDrives);
  const fetchUserRewards = useUserStore(state => state.fetchUserRewards);
  const deleteUser = useUserStore(state => state.deleteUser);
  
  return {
    fetchUsers,
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    clearErrors,
    fetchUserDetail,
    clearSelectedUser,
    fetchUserDrives,
    fetchUserRewards,
    deleteUser,
  };
};