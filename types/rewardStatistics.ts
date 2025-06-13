// 보상 통계 아이템 타입
export interface RewardStatisticsItem {
  reason: string;
  count: number;
  ratio: number;
}

// 총계 API 응답 타입
export interface TotalRewardStatisticsResponse {
  status: number;
  message: string;
  data: {
    totalRewardStatistics: RewardStatisticsItem[];
  };
}

// 월별 API 응답 타입
export interface MonthlyRewardStatisticsResponse {
  status: number;
  message: string;
  data: {
    monthlyRewardStatistics: RewardStatisticsItem[];
  };
}

// Mock 데이터 - 총계
export const mockTotalRewardStatistics: RewardStatisticsItem[] = [
  { reason: "종합점수", count: 1200, ratio: 51.6 },
  { reason: "주행 중(10분)", count: 3400, ratio: 20 },
  { reason: "출석점수", count: 780, ratio: 10 },
  { reason: "장기고객 리워드", count: 520, ratio: 10},
  { reason: "MoBTI 향상", count: 670, ratio: 5 }
];

// Mock 데이터 - 월별
export const mockMonthlyRewardStatistics: RewardStatisticsItem[] = [
  { reason: "종합점수", count: 800, ratio: 61.6 },
  { reason: "이벤트미발생", count: 200, ratio: 15.0 },
  { reason: "MoBTI향상", count: 300, ratio: 23.4 }
];