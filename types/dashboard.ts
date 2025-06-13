import { ApiResponse, StatItem } from './api';

export interface DashboardStatistics {
  totalUsers: StatItem;
  totalDevices: StatItem;
  totalDrives: StatItem;
  totalIssuedRewards: StatItem;
}

export interface DashboardResponse extends ApiResponse<{
  dashboardStatistics: DashboardStatistics;
}> {}