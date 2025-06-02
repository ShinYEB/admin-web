import { ApiResponse } from './api';

export interface MonthlyDriveStats {
  year: number;
  month: number;
  count: number;
}

export interface MonthlyDrivesResponse extends ApiResponse<{
  monthlyDrivesStatistics: MonthlyDriveStats[];
}> {}