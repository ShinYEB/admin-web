const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 테스트 환경에서 next.config.js와 .env 파일을 로드합니다.
  dir: './',
});

// Jest에 전달할 사용자 정의 설정 추가
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // @testing-library/jest-dom 설정을 위함
  testEnvironment: 'jest-environment-jsdom', // DOM 환경 시뮬레이션
  moduleNameMapper: {
    // CSS 모듈을 포함한 CSS import 처리
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 이미지 및 기타 정적 에셋 import 처리
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf|eot|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    // 모듈 별칭 처리 (tsconfig.json에 설정된 경우, 예: "@/*": ["*"])
    '^@/(.*)$': '<rootDir>/$1',
  },
  // next/jest는 node_modules 변환을 처리하므로 일반적으로 transformIgnorePatterns는 필요하지 않습니다.
  // 특정 node_modules에 문제가 계속 발생하면 조정해야 할 수 있습니다.
  // transformIgnorePatterns: [
  //   '/node_modules/',
  //   '^.+\\.module\\.(css|sass|scss)$',
  // ],
  // Next/jest가 .ts, .tsx, .js, .jsx 파일에 대한 변환 설정을 처리하므로
  // 일반적으로 여기서 수동으로 지정할 필요가 없습니다.
};

// createJestConfig는 next/jest가 비동기인 Next.js 설정을 로드할 수 있도록 이렇게 export 합니다.
module.exports = createJestConfig(customJestConfig);