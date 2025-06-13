import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserTrendsChart } from '@/components/Dashboard/UserTrendsChart';
import { UserTrendItem } from '@/types/userTrends';

// Mock Chart.js register function
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
  Line: () => <div data-testid="line-chart">Line Chart</div>,
}));

describe('UserTrendsChart', () => {
  const mockData: UserTrendItem[] = [
    { year: 2023, month: 1, activeUsers: 100, newUsers: 20, churnedUsers: 5 },
    { year: 2023, month: 2, activeUsers: 115, newUsers: 25, churnedUsers: 10 },
    { year: 2023, month: 3, activeUsers: 130, newUsers: 30, churnedUsers: 15 },
  ];

  it('TC-UTRENDS-001::Unit::컴포넌트 렌더링::데이터가 있을 때::차트 표시', () => {
    render(<UserTrendsChart data={mockData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Line Chart')).toBeInTheDocument();
  });

  it('TC-UTRENDS-002::Unit::컴포넌트 렌더링::데이터가 없을 때::빈 데이터 메시지 표시', () => {
    render(<UserTrendsChart data={[]} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-UTRENDS-003::Unit::컴포넌트 렌더링::null 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with null data
    render(<UserTrendsChart data={null} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-UTRENDS-004::Unit::컴포넌트 렌더링::undefined 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with undefined data
    render(<UserTrendsChart data={undefined} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });
});
