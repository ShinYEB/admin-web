import { ApiResponse } from './api';

export interface UserTrendSummary {
  lastWeekNewUsers: number;
  monthlyUserGrowthRate: number;
  churnRate: number;
}

export interface UserTrendItem {
  year: number;
  month: number;
  newUsers: number;
  activeUsers: number;
  churnedUsers: number;
}

export interface UserTrendsResponse extends ApiResponse<{
  userStatistics: {
    summary: UserTrendSummary;
    userTrend: UserTrendItem[];
  };
}> {}