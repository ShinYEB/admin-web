import { ApiResponse } from './api';

export interface EventByReason {
  reason?: string;
  count?: number;
  type?: string; // 이 속성 추가
  frequency?: number;
}

export interface EventsByReasonResponse extends ApiResponse<{
  eventsStatisticsByReason: EventByReason[];
}> {}

// 영문 상수를 한글로 매핑
export const eventReasonMap: Record<string, string> = {
  'RAPID_ACCELERATION': '급가속',
  'SHARP_TURN': '급회전',
  'LANE_DEPARTURE': '차선이탈',
  'NO_OPERATION': '무동작',
};
