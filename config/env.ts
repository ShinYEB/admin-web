// filepath: c:\Projects\Modive\FE\src\config\env.ts
import { Platform } from 'react-native';

// API 서버 환경 설정
const API_CONFIG = {
  MAIN: {
    DEV: {
      IOS: 'http://192.168.0.241:8080',
      ANDROID: 'http://10.0.2.2:8080'
    },
    PROD: 'https://modive.site'
  },
  AUTH: {
    DEV: {
      IOS: 'http://192.168.0.241:8000',
      ANDROID: 'http://10.0.2.2:8000'
    },
    PROD: 'https://modive.site/auth'
  }
};

// 환경에 따른 API URL 결정
const getApiUrl = (apiType: 'MAIN' | 'AUTH') => {
  if (__DEV__) {
    return Platform.OS === 'ios' 
      ? API_CONFIG[apiType].DEV.IOS 
      : API_CONFIG[apiType].DEV.ANDROID;
  }
  return API_CONFIG[apiType].PROD;
};

export const API = {
  BASE_URL: getApiUrl('MAIN'),
  AUTH_URL: getApiUrl('AUTH'),
  
  // 기존 API 엔드포인트 정의는 그대로 유지하되 BASE_URL 참조
  DRIVING: {
    HISTORY: `${getApiUrl('MAIN')}/dashboard/post-drive`,
    DETAIL: (driveId: string) => `${getApiUrl('MAIN')}/dashboard/post-drive/${driveId}`,
    // 나머지 엔드포인트...
  },
};