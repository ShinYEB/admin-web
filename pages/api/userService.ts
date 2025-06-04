// api/users.ts
import {
  User,
  UserDetail,
  DrivingRecord,
  SeedRecord,
  FilterParams,
  PageResponse,
  CommonRes,
  UserListItem,
  UserRewardItem,
  UserDriveListItem,
  UCFilterUserResData,
} from '@/types/user';

class UserService {
  private baseURL = 'http://localhost:60004/admin/users';
  
  private getAuthHeaders() {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MDEzOGYxYy05NjFiLTQ4NjQtYTI2YS1iZGFkYTViMTJlYjMiLCJ1c2VySWQiOiI5MDEzOGYxYy05NjFiLTQ4NjQtYTI2YS1iZGFkYTViMTJlYjMiLCJyb2xlIjoiQURNSU4iLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0IiwiaWF0IjoxNzQ4ODgyMTcxLCJleHAiOjE3NDg4ODU3NzF9.Hn7RgFlcuI3OHlIocQYXnjPIHcVHWQ-DeEKYL7O3yxU';
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // 백엔드 UserListItem을 프론트엔드 User 타입으로 변환
  private mapToUser(item: UserListItem): User {
    return {
      userId: item.userId,
      nickname: item.nickname,
      email: item.email,
      experience: item.experience,
      joinedAt: item.joinedAt,
      driveCount: item.driveCount,
      isActive: item.isActive,
    };
  }

  // 백엔드 UserListItem을 프론트엔드 UserDetail 타입으로 변환
  private mapToUserDetail(item: UserListItem): UserDetail {
    return {
      userId: item.userId,
      nickname: item.nickname,
      email: item.email,
      experience: item.experience,
      joinedAt: item.joinedAt,
      driveCount: item.driveCount,
      isActive: item.isActive,
    };
  }

  // 사용자 목록 조회 (필터링 포함) - 통합 메서드
  async getUsersWithDriveCount(params: FilterParams = {}): Promise<PageResponse<User>> {
    try {
      // 이메일 검색이 있는 경우만 별도 API 사용
      if (params.email && params.email.trim()) {
        return await this.searchUsers(params.email.trim(), params);
      }
      
      // 모든 경우에 필터링 API 사용 (조건이 없어도 기본 목록과 동일)
      return await this.filterUsers(params);
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  // 사용자 검색 (GET /admin/users/search) - 이메일 검색
  private async searchUsers(searchKeyword: string, params: FilterParams): Promise<PageResponse<User>> {
    // 이메일을 안전하게 URL 인코딩
    const encodedEmail = encodeURIComponent(searchKeyword);
    const url = `${this.baseURL}/search?searchKeyword=${encodedEmail}`;
    
    console.log('이메일 검색 API 호출:', url);
    console.log('원본 이메일:', searchKeyword);
    console.log('인코딩된 이메일:', encodedEmail);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        mode: 'cors',
      });
      
      console.log('검색 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('검색 API 에러:', errorText);
        throw new Error(`검색 실패: ${response.status} - ${errorText}`);
      }

      const result: CommonRes<{ searchResult: UserListItem[] }> = await response.json();
      console.log('검색 결과:', result);
      
      const users = result.data.searchResult.map(item => this.mapToUser(item));

      const page = params.page || 0;
      const pageSize = params.pageSize || 10;
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = users.slice(startIndex, endIndex);
      const totalElements = users.length;
      const totalPages = Math.ceil(totalElements / pageSize);

      return {
        content: paginatedUsers,
        number: page,
        size: pageSize,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      };
    } catch (error) {
      console.error('이메일 검색 실패:', error);
      throw error;
    }
  }

  // 사용자 필터링 (GET /admin/users/filter) - 기본 목록 조회도 겸함
  private async filterUsers(params: FilterParams): Promise<PageResponse<User>> {
    const searchParams = new URLSearchParams();
    
    // 필터 조건들 (있을 때만 추가)
    if (params.minExperience !== undefined && params.minExperience !== null) {
      searchParams.append('minExperience', params.minExperience.toString());
    }
    if (params.maxExperience !== undefined && params.maxExperience !== null) {
      searchParams.append('maxExperience', params.maxExperience.toString());
    }
    if (params.accountAgeInMonths !== undefined && params.accountAgeInMonths !== null) {
      searchParams.append('accountAgeInMonths', params.accountAgeInMonths.toString());
    }
    if (params.active !== undefined && params.active !== null) {
      searchParams.append('active', params.active.toString());
    }
    
    // 페이지네이션 (필수)
    searchParams.append('page', (params.page || 0).toString());
    searchParams.append('pageSize', (params.pageSize || 10).toString());

    const url = `${this.baseURL}/filter?${searchParams.toString()}`;
    console.log('필터 API 호출:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        mode: 'cors',
      });
      
      console.log('필터 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('필터 API 에러 응답:', errorText);
        throw new Error(`필터 조회 실패: ${response.status} - ${errorText}`);
      }

      const result: CommonRes<{ filterResult: UCFilterUserResData }> = await response.json();
      console.log('필터 API 응답 데이터:', result);
      
      const filterData = result.data.filterResult;
      const users = filterData.content.map(item => this.mapToUser(item));

      return {
        content: users,
        number: filterData.number,
        size: filterData.size,
        totalElements: filterData.totalElements,
        totalPages: filterData.totalPages,
        first: filterData.first,
        last: filterData.last,
      };
    } catch (error) {
      console.error('필터 API 호출 실패:', error);
      
      // CORS 에러인 경우 더 명확한 메시지
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('서버 연결 실패: CORS 설정을 확인하거나 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  // 사용자 상세 조회 
  async getUserDetailWithDriveCount(userId: string): Promise<UserDetail> {
    const response = await fetch(`${this.baseURL}/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`사용자 상세 조회 실패: ${response.status}`);
    }

    const result: CommonRes<{ userDetail: UserListItem[] }> = await response.json();
    
    if (result.data.userDetail && result.data.userDetail.length > 0) {
      return this.mapToUserDetail(result.data.userDetail[0]);
    }
    
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }

  // 사용자 탈퇴
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/${userId}/delete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`사용자 탈퇴 실패: ${response.status} - ${errorText}`);
    }
  }

  // 사용자 씨앗 내역 조회
  async getUserRewards(userId: string, page: number = 0, pageSize: number = 10): Promise<SeedRecord[]> {
    const response = await fetch(`${this.baseURL}/${userId}/rewards?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`씨앗 내역 조회 실패: ${response.status}`);
    }

    const result: CommonRes<{ rewardHistory: UserRewardItem[] }> = await response.json();
    
    // 백엔드 UserRewardItem을 프론트엔드 SeedRecord로 변환
    // UserRewardItem: { issuedDate: string, reason: string, amount: number }
    return result.data.rewardHistory.map(item => ({
      issuedDate: new Date(item.issuedDate).toISOString().split('T')[0],
      reason: item.reason,
      amount: item.amount,
    }));
  }

  // 사용자 운전 기록 조회
  async getUserDrives(userId: string, pageSize: number = 10): Promise<DrivingRecord[]> {
    const response = await fetch(`${this.baseURL}/drives/${userId}?pageSize=${pageSize}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`운전 기록 조회 실패: ${response.status}`);
    }

    const result: CommonRes<{ 
      driveHistory: UserDriveListItem[]; 
      startTime?: string; 
      driveId?: string; 
    }> = await response.json();
    
    // 백엔드 UserDriveListItem을 프론트엔드 DrivingRecord로 변환
    // UserDriveListItem: { date: string, driveDuration: number, events: UserDriveListEventItem[], rewards: number }
    return result.data.driveHistory.map(item => ({
      date: new Date(item.date).toISOString().split('T')[0],
      distance: '0km', // 백엔드에서 제공하지 않음
      duration: `${item.driveDuration}분`,
      event: item.events && item.events.length > 0 ? `${item.events.length}건` : '0건',
      seeds: item.rewards,
    }));
  }
}

export const userService = new UserService();