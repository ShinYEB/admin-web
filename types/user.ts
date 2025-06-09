// types/user.ts

export interface User {
  userId: string;
  nickname: string;
  email: string;
  experience: string; // 표시용 문자열 ("1년 미만", "2년 미만" 등)
  joinedAt: string;
  driveCount: number;
  isActive: number;
}

export interface UserDetail {
  userId: string;
  nickname: string;
  email: string;
  experience: string; // 표시용 문자열 ("1년 미만", "2년 미만" 등)
  joinedAt: string;
  driveCount: number;
  isActive: number;
}

export interface DrivingRecord {
  date: string;
  distance: string;
  duration: string;
  event: string;
  seeds: number;
}

export interface SeedRecord {
  issuedDate: string;
  reason: string;
  amount: number;
}

export interface FilterParams {
  email?: string;
  minExperience?: number;
  maxExperience?: number;
  accountAgeInMonths?: number;
  active?: number;
  page?: number;
  pageSize?: number;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// 어드민 백엔드 응답 타입들
export interface CommonRes<T> {
  status: number;
  message: string;
  data: T;
}

export interface UserListItem {
  userId: string;
  nickname: string;
  email: string;
  experience: number;
  joinedAt: string;
  driveCount: number;
  seedBalance: number;
  isActive: number;
}

export interface UserRewardItem {
  map(arg0: (item: any) => { issuedDate: any; reason: any; amount: any; }): SeedRecord[] | PromiseLike<SeedRecord[]>;
  issuedDate: string;
  reason: string;
  amount: number;
}

export interface UserDriveListEventItem {
  type: string;
  count: number;
}

export interface UserDriveListItem {
  date: string;
  driveDuration: number;
  events: UserDriveListEventItem[];
  rewards: number;
}

export interface UCFilterUserResData {
  content: UserListItem[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}