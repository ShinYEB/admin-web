export interface StatItem {
  value: number;
  changeRate: number;
}

export interface RewardSummary {
  totalIssued: StatItem;
  monthlyIssued: StatItem;
  dailyAverageIssued: StatItem;
  perUserAverageIssued: StatItem;
}

export interface RewardSummaryResponse {
  status: number;
  message: string;
  data: RewardSummary;
}

// Mock 데이터
export const mockRewardSummary: RewardSummary = {
  totalIssued: {
    value: 1247890,
    changeRate: 7.6
  },
  monthlyIssued: {
    value: 124580,
    changeRate: 8.3
  },
  dailyAverageIssued: {
    value: 4152,
    changeRate: 10.5
  },
  perUserAverageIssued: {
    value: 151,
    changeRate: 4.2
  }
};