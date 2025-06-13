// filepath: c:\Projects\Modive\FE\src\config\env.ts

// Next.js 환경 설정
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API 서버 환경 설정
const API_CONFIG = {
  development: {
    baseURL: 'http://modive.site', // HTTPS에서 HTTP로 변경
    timeout: 10000,
  },
  production: {
    baseURL: 'http://modive.site', // HTTPS에서 HTTP로 변경
    timeout: 15000,
  }
};

// 현재 환경에 따른 설정
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;

// 환경 변수들
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL,
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: isProduction,
};

// API 엔드포인트들
export const API_ENDPOINTS = {
  // 대시보드
  DASHBOARD_SUMMARY: '/admin/dashboard/summary',
  DASHBOARD_USERS_MONTHLY: '/admin/dashboard/users/monthly-stats',
  DASHBOARD_DRIVES_MONTHLY: '/admin/dashboard/drives/monthly-stats',
  DASHBOARD_EVENTS_BY_REASON: '/admin/dashboard/events/by-reason/total',
  
  // 리워드
  REWARDS_SUMMARY: '/admin/rewards/summary',
  REWARDS_BY_REASON_TOTAL: '/admin/rewards/by-reason/total',
  REWARDS_BY_REASON_MONTHLY: '/admin/rewards/by-reason/monthly-stats',
  REWARDS_MONTHLY_STATS: '/admin/rewards/monthly-stats',
  REWARDS_HISTORY: '/admin/rewards/history',
  REWARDS_SEARCH: '/admin/rewards',
};

export default ENV;