// 사용자 관련 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nickname: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginDate?: string;
  drivingScore?: {
    total: number;
    eco: number;
    safety: number;
    accident: number;
    attention: number;
  };
}

// 주행 기록 관련 타입
export interface DrivingRecord {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  scores: {
    ecoScore: number;
    safetyScore: number;
    accidentPreventionScore: number;
    attentionScore: number;
  };
  route: {
    startLocation: string;
    endLocation: string;
  };
}

// 대시보드 통계 타입
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDrives: number;
  avgDrivingScore: number;
  recentUsers: User[];
  dailyStats: {
    date: string;
    userCount: number;
    driveCount: number;
  }[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    pages: number;
    limit: number;
  };
}
