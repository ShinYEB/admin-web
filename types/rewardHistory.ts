import { ApiResponse } from './api';

export interface RewardHistoryItem {
  rewardId: string;
  email?: string;
  userId?: string;
  issuedDate?: string;
  createdAt?: string;
  reason?: string;
  description?: string;
  amount: number;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface RewardHistoryResponse extends ApiResponse<{
  rewardHistory: RewardHistoryItem[];
  pageInfo: PageInfo;
}> {}

export interface RewardFilterResponse extends ApiResponse<{
  searchResult: RewardHistoryItem[];
  pageInfo?: PageInfo;
}> {}

// 필터링 옵션 타입
export interface RewardFilterOptions {
  email?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}