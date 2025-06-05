import { User, UserWithDriveCount } from '@/types/user';

// Mock 데이터 정의
const mockUsers: UserWithDriveCount[] = [
  { id: "1", email: "user1@example.com", name: "사용자1", phoneNumber: "010-1234-5678", status: "ACTIVE", createdAt: "2025-05-01", totalDrives: 123, averageScore: 87.5 },
  { id: "2", email: "user2@example.com", name: "사용자2", phoneNumber: "010-2345-6789", status: "ACTIVE", createdAt: "2025-05-02", totalDrives: 85, averageScore: 92.1 },
  { id: "3", email: "user3@example.com", name: "사용자3", phoneNumber: "010-3456-7890", status: "INACTIVE", createdAt: "2025-05-03", totalDrives: 45, averageScore: 78.4 },
  { id: "4", email: "user4@example.com", name: "사용자4", phoneNumber: "010-4567-8901", status: "PENDING", createdAt: "2025-05-04", totalDrives: 0, averageScore: 0 },
  { id: "5", email: "user5@example.com", name: "사용자5", phoneNumber: "010-5678-9012", status: "ACTIVE", createdAt: "2025-05-05", totalDrives: 210, averageScore: 88.9 },
];

export interface UserFilter {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UserResponse {
  users: UserWithDriveCount[];
  totalCount: number;
  pageCount: number;
}

export class UserService {
  private baseUrl: string;
  
  constructor() {
    // API 기본 URL 설정
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://modive.site';
    console.log('UserService 초기화:', this.baseUrl);
  }
  
  // 사용자 조회 및 운전 정보 통합 메서드
  async getUsersWithDriveCount(filter: UserFilter): Promise<UserResponse> {
    try {
      // Mock 데이터 사용 여부 확인
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        console.log('Mock 데이터로 사용자 조회합니다.');
        return this.getMockFilteredUsers(filter);
      }
      
      // 실제 API 호출
      const result = await this.filterUsers(filter);
      console.log('사용자 조회 성공:', result);
      return result;
      
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      
      // 개발 환경에서는 Mock 데이터로 대체
      if (process.env.NODE_ENV === 'development') {
        console.log('오류 발생, Mock 데이터로 대체합니다.');
        return this.getMockFilteredUsers(filter);
      }
      
      throw error;
    }
  }
  
  // 필터링된 사용자 조회
  async filterUsers(filter: UserFilter): Promise<UserResponse> {
    try {
      const { page, pageSize, search, status, sortBy, sortDirection } = filter;
      
      // 쿼리 파라미터 구성
      let queryParams = `?page=${page}&pageSize=${pageSize}`;
      
      if (search) {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
      
      if (status) {
        queryParams += `&status=${status}`;
      }
      
      if (sortBy) {
        queryParams += `&sortBy=${sortBy}&sortDirection=${sortDirection || 'desc'}`;
      }
      
      // API URL 구성 - 기존의 localhost:60004 대신 프록시 경로 사용
      const url = `/api/modive/admin/users/filter${queryParams}`;
      console.log('사용자 필터 API 호출:', url);
      
      // 요청 헤더 설정
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'x-user-id': '1',
      };
      
      // 토큰 설정
      const token = localStorage.getItem('authToken') || 
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMjYwNWZkZS04OWUyLTQ0M2YtOWUwMC1kZTRmZjcyN2RhM2IiLCJ1c2VySWQiOiIyMjYwNWZkZS04OWUyLTQ0M2YtOWUwMC1kZTRmZjcyN2RhM2IiLCJyb2xlIjoiQURNSU4iLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0IiwiaWF0IjoxNzQ5MDM1NTAzLCJleHAiOjE3NDkwMzkxMDN9.K8jI1YS6jMmiONl52Two04n7CTrSv95QAqum_z_VHoo';
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API 오류 (${response.status}):`, errorText);
          throw new Error(`API 오류: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return {
          users: data.data.content || [],
          totalCount: data.data.totalElements || 0,
          pageCount: data.data.totalPages || 0
        };
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('요청 타임아웃');
          throw new Error('서버 응답 시간이 초과되었습니다.');
        } else if (fetchError.message.includes('Failed to fetch')) {
          console.error('네트워크 연결 실패:', fetchError);
          throw new Error('서버 연결 실패: CORS 설정을 확인하거나 서버가 실행 중인지 확인해주세요.');
        }
        
        throw fetchError;
      }
      
    } catch (error) {
      console.error('필터 API 호출 실패:', error);
      throw error;
    }
  }
  
  // Mock 데이터 필터링 함수
  private getMockFilteredUsers(filter: UserFilter): UserResponse {
    const { page, pageSize, search, status, sortBy, sortDirection } = filter;
    
    // 검색 및 상태 필터링
    let filteredUsers = [...mockUsers];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchLower) || 
        user.name.toLowerCase().includes(searchLower) ||
        user.phoneNumber.includes(search)
      );
    }
    
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // 정렬
    if (sortBy) {
      filteredUsers.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'email':
            comparison = a.email.localeCompare(b.email);
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'totalDrives':
            comparison = a.totalDrives - b.totalDrives;
            break;
          case 'averageScore':
            comparison = a.averageScore - b.averageScore;
            break;
          default:
            comparison = 0;
        }
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }
    
    // 페이징 처리
    const totalCount = filteredUsers.length;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const pageCount = Math.ceil(totalCount / pageSize);
    
    return {
      users: paginatedUsers,
      totalCount,
      pageCount
    };
  }
}