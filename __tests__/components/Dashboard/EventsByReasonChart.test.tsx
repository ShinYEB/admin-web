import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventsByReasonChart } from '@/components/Dashboard/EventsByReasonChart';
import { EventByReason } from '@/types/eventsByReason';

// Mock Chart.js register function
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

describe('EventsByReasonChart', () => {
  const mockData: EventByReason[] = [
    { reason: '급제동', count: 45 },
    { reason: '급가속', count: 32 },
    { reason: '급회전', count: 28 },
    { reason: '과속', count: 20 },
  ];

  it('TC-EVENTS-001::Unit::컴포넌트 렌더링::데이터가 있을 때::차트 표시', () => {
    render(<EventsByReasonChart data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('Bar Chart')).toBeInTheDocument();
  });

  it('TC-EVENTS-002::Unit::컴포넌트 렌더링::데이터가 없을 때::빈 데이터 메시지 표시', () => {
    render(<EventsByReasonChart data={[]} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-EVENTS-003::Unit::컴포넌트 렌더링::null 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with null data
    render(<EventsByReasonChart data={null} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('TC-EVENTS-004::Unit::컴포넌트 렌더링::undefined 데이터::빈 데이터 메시지 표시', () => {
    // @ts-ignore - Testing with undefined data
    render(<EventsByReasonChart data={undefined} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });
});