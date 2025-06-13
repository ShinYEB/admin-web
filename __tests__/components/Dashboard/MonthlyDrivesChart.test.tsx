import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthlyDrivesChart } from '@/components/Dashboard/MonthlyDrivesChart';
import { MonthlyDriveStats } from '@/types/monthlyDrives';

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

describe('MonthlyDrivesChart', () => {
  const mockData: MonthlyDriveStats[] = [
    { month: 1, count: 100 },
    { month: 2, count: 150 },
    { month: 3, count: 120 },
  ];

  it('TC-MDRIVES-001::Unit::컴포넌트 렌더링::데이터가 있을 때::차트 표시', () => {
    render(<MonthlyDrivesChart data={mockData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Line Chart')).toBeInTheDocument();
  });

  it('TC-MDRIVES-002::Unit::컴포넌트 렌더링::데이터가 없을 때::빈 데이터 메시지 표시', () => {
    render(<MonthlyDrivesChart data={[]} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-MDRIVES-003::Unit::컴포넌트 렌더링::null 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with null data
    render(<MonthlyDrivesChart data={null} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-MDRIVES-004::Unit::컴포넌트 렌더링::undefined 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with undefined data
    render(<MonthlyDrivesChart data={undefined} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });
});