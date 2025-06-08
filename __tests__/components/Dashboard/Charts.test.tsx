import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  DailyStatsChart, 
  ScoreDistributionChart, 
  MonthlyDrivesChart as ChartMonthlyDrivesChart,
  EventsByReasonChart as ChartEventsByReasonChart
} from '@/components/Dashboard/Charts';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

describe('Charts', () => {
  // DailyStatsChart tests
  describe('DailyStatsChart', () => {
    const mockDailyData = [
      { date: '2023-01-01', userCount: 10, driveCount: 50 },
      { date: '2023-01-02', userCount: 15, driveCount: 65 },
      { date: '2023-01-03', userCount: 12, driveCount: 55 },
    ];

    it('TC-CHARTS-001::Unit::DailyStatsChart::데이터가 있을 때::차트 렌더링', () => {
      render(<DailyStatsChart data={mockDailyData} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  // ScoreDistributionChart tests
  describe('ScoreDistributionChart', () => {
    const mockScoreData = [
      { scoreRange: '0-20', count: 5 },
      { scoreRange: '21-40', count: 15 },
      { scoreRange: '41-60', count: 25 },
      { scoreRange: '61-80', count: 40 },
      { scoreRange: '81-100', count: 15 },
    ];

    it('TC-CHARTS-002::Unit::ScoreDistributionChart::데이터가 있을 때::차트 렌더링', () => {
      render(<ScoreDistributionChart data={mockScoreData} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  // MonthlyDrivesChart tests
  describe('MonthlyDrivesChart', () => {
    const mockMonthlyData = [
      { year: 2023, month: 1, count: 120 },
      { year: 2023, month: 2, count: 150 },
      { year: 2023, month: 3, count: 130 },
    ];

    it('TC-CHARTS-003::Unit::MonthlyDrivesChart::데이터가 있을 때::차트 렌더링', () => {
      render(<ChartMonthlyDrivesChart data={mockMonthlyData} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('TC-CHARTS-004::Unit::MonthlyDrivesChart::빈 데이터::메시지 표시', () => {
      render(<ChartMonthlyDrivesChart data={[]} />);
      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });
  });

  // EventsByReasonChart tests
  describe('EventsByReasonChart', () => {
    const mockEventsData = [
      { reason: '급제동', count: 45 },
      { reason: '급가속', count: 32 },
      { reason: '급회전', count: 28 },
    ];

    it('TC-CHARTS-005::Unit::EventsByReasonChart::데이터가 있을 때::차트 렌더링', () => {
      render(<ChartEventsByReasonChart data={mockEventsData} />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('TC-CHARTS-006::Unit::EventsByReasonChart::빈 데이터::메시지 표시', () => {
      render(<ChartEventsByReasonChart data={[]} />);
      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });
  });
});