import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyRewardsChart from '@/components/analytics/MonthlyRewardsChart';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Monthly Rewards Chart</div>,
}));

// Mock the store
jest.mock('@/store/useMonthlyRewardsStore', () => {
  return {
    __esModule: true,
    default: () => ({
      monthlyStats: mockMonthlyStats,
      isLoading: mockIsLoading,
      error: mockError,
      fetchMonthlyRewardStatistics: mockFetchMonthlyRewardStatistics,
    }),
  };
});

// Mock variables that we can control in tests
let mockMonthlyStats = [];
let mockIsLoading = false;
let mockError = null;
const mockFetchMonthlyRewardStatistics = jest.fn();

describe('MonthlyRewardsChart', () => {
  beforeEach(() => {
    mockMonthlyStats = [
      { year: 2023, month: 1, amount: 1200 },
      { year: 2023, month: 2, amount: 1500 },
      { year: 2023, month: 3, amount: 1350 },
    ];
    mockIsLoading = false;
    mockError = null;
    mockFetchMonthlyRewardStatistics.mockClear();
  });

  it('TC-MREWARDS-001::Unit::컴포넌트 렌더링::정상 데이터::차트 표시', async () => {
    render(<MonthlyRewardsChart />);
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByText('Monthly Rewards Chart')).toBeInTheDocument();
    });
  });

  it('TC-MREWARDS-002::Unit::컴포넌트 마운팅::데이터 요청::fetchMonthlyRewardStatistics 호출', async () => {
    render(<MonthlyRewardsChart />);
    
    await waitFor(() => {
      expect(mockFetchMonthlyRewardStatistics).toHaveBeenCalled();
    });
  });

  it('TC-MREWARDS-003::Unit::컴포넌트 렌더링::로딩 중::로딩 스피너 표시', async () => {
    mockIsLoading = true;
    
    render(<MonthlyRewardsChart />);
    
    expect(screen.getByTestId('line-chart')).not.toBeInTheDocument;
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('TC-MREWARDS-004::Unit::컴포넌트 렌더링::에러 발생::에러 메시지 표시', async () => {
    mockError = '데이터를 불러오는 중 오류가 발생했습니다.';
    
    render(<MonthlyRewardsChart />);
    
    expect(screen.getByText('데이터를 불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });
});