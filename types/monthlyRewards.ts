export interface MonthlyRewardItem {
  year: number;
  month: number;
  amount: number;
}

export interface MonthlyRewardStatisticsResponse {
  status: number;
  message: string;
  data: {
    monthlyRewardStatistics: MonthlyRewardItem[];
  }
}