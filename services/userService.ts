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
import { fetchApi } from '@/lib/api';

class UserService {
  // experience 값을 표시용 문자열로 변환
  private getExperienceText(experience: number): string {
    if (experience === 0) return '1년 미만';
    return `${experience}년 이상`;
  }

  // 백엔드 UserListItem을 프론트엔드 User 타입으로 변환
  private mapToUser(item: UserListItem): User {
    return {
      userId: item.userId,
      nickname: item.nickname,
      email: item.email,
      experience: this.getExperienceText(item.experience),
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
      experience: this.getExperienceText(item.experience),
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
    try {
      // 이메일을 안전하게 URL 인코딩
      const encodedEmail = encodeURIComponent(searchKeyword);
      const endpoint = `/admin/users/search?searchKeyword=${encodedEmail}`;
      
      console.log('이메일 검색 API 호출:', endpoint);
      console.log('원본 이메일:', searchKeyword);
      console.log('인코딩된 이메일:', encodedEmail);
      
      const result = await fetchApi<CommonRes<{ searchResult: UserListItem[] }>>(endpoint, {
        method: 'GET',
      });
      
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
    try {
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

      const endpoint = `/admin/users/filter?${searchParams.toString()}`;
      console.log('필터 API 호출:', endpoint);

      const result = await fetchApi<CommonRes<{ filterResult: UCFilterUserResData }>>(endpoint, {
        method: 'GET',
      });
      
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
      throw error;
    }
  }

  // 사용자 상세 조회 
  async getUserDetailWithDriveCount(userId: string): Promise<UserDetail> {
    try {
      const endpoint = `/admin/users/${userId}`;
      
      const result = await fetchApi<CommonRes<{ userDetail: UserListItem[] }>>(endpoint, {
        method: 'GET',
      });
      
      if (result.data.userDetail && result.data.userDetail.length > 0) {
        return this.mapToUserDetail(result.data.userDetail[0]);
      }
      
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    } catch (error) {
      console.error(`사용자 상세 조회 실패 (userId: ${userId}):`, error);
      throw error;
    }
  }

  // 사용자 탈퇴
  async deleteUser(userId: string): Promise<void> {
    try {
      const endpoint = `/admin/users/${userId}/delete`;
      
      await fetchApi<CommonRes<any>>(endpoint, { method: 'POST' });
      
      console.log(`사용자 탈퇴 성공 (userId: ${userId})`);
    } catch (error) {
      console.error(`사용자 탈퇴 실패 (userId: ${userId}):`, error);
      throw error;
    }
  }

  // 사용자 씨앗 내역 조회
  async getUserRewards(userId: string, page: number = 0, pageSize: number = 10): Promise<SeedRecord[]> {
    try {
      const endpoint = `/admin/users/${userId}/rewards?page=${page}&pageSize=${pageSize}`;
      
      const result = await fetchApi<CommonRes<{ rewardHistory: UserRewardItem[] }>>(endpoint, {
        method: 'GET',
      });
      
      console.log('씨앗 내역 API 응답:', result);
      
      // 안전 가드: rewardHistory가 존재하고 배열인지 확인
      if (!result?.data?.rewardHistory) {
        console.warn('씨앗 내역 데이터가 없습니다:', result);
        return [];
      }
      
      if (!Array.isArray(result.data.rewardHistory)) {
        console.warn('씨앗 내역이 배열이 아닙니다:', result.data.rewardHistory);
        return [];
      }
      
      // 백엔드 UserRewardItem을 프론트엔드 SeedRecord로 변환
      // UserRewardItem: { issuedDate: string, reason: string, amount: number }
      return result.data.rewardHistory.map(item => ({
        issuedDate: new Date(item.issuedDate).toISOString().split('T')[0],
        reason: item.reason || '알 수 없음',
        amount: item.amount || 0,
      }));
    } catch (error) {
      console.error(`씨앗 내역 조회 실패 (userId: ${userId}):`, error);
      
      // 에러 시 빈 배열 반환 (에러를 던지지 않음)
      return [];
    }
  }

  // 사용자 운전 기록 조회
  async getUserDrives(userId: string, pageSize: number = 10): Promise<DrivingRecord[]> {
    try {
      const endpoint = `/admin/users/drives/${userId}?pageSize=${pageSize}`;
      
      const result = await fetchApi<CommonRes<{ 
        driveHistory: UserDriveListItem[]; 
        startTime?: string; 
        driveId?: string; 
      }>>(endpoint, {
        method: 'GET',
      });
      
      console.log('운전 기록 API 응답:', result);
      
      // 안전 가드: driveHistory가 존재하고 배열인지 확인
      if (!result?.data?.driveHistory) {
        console.warn('운전 기록 데이터가 없습니다:', result);
        return [];
      }
      
      if (!Array.isArray(result.data.driveHistory)) {
        console.warn('운전 기록이 배열이 아닙니다:', result.data.driveHistory);
        return [];
      }
      
      // 백엔드 UserDriveListItem을 프론트엔드 DrivingRecord로 변환
      // UserDriveListItem: { date: string, driveDuration: number, events: UserDriveListEventItem[], rewards: number }
      return result.data.driveHistory.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0],
        distance: '0km', // 백엔드에서 제공하지 않음
        duration: `${item.driveDuration}분`,
        event: item.events && Array.isArray(item.events) && item.events.length > 0 
          ? `${item.events.length}건` 
          : '0건',
        seeds: item.rewards || 0,
      }));
    } catch (error) {
      console.error(`운전 기록 조회 실패 (userId: ${userId}):`, error);
      
      // 에러 시 빈 배열 반환 (에러를 던지지 않음)
      return [];
    }
  }
}

export const userService = new UserService();