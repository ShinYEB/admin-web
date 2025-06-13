/**
 * API 응답의 공통 구조를 정의하는 기본 인터페이스
 * @template T - 응답 데이터의 타입
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * 공통 상태 통계 항목 타입
 */
export interface StatItem {
  value: number;
  changeRate: number;
}