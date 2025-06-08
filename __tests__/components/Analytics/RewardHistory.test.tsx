import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardHistory from '@/components/Analytics/RewardHistory';

// Mock the store
jest.mock('@/store/useRewardHistoryStore', () => ({
  __esModule: true,
  default: () => ({
    rewardHistory: mockRewardHistory,
    pageInfo: { page: 0, size: 10, totalPages: 1, totalElements: 5 },
    filterOptions: {},
    isLoading: mockIsLoading,
    error: mockError,
    fetchRewardHistory: mockFetchRewardHistory,
    filterRewards: jest.fn(),
    resetFilter: jest.fn(),
  }),
}));

// Mock variables that we can control in tests
let mockRewardHistory = [];
let mockIsLoading = false;
let mockError = null;
const mockFetchRewardHistory = jest.fn();

describe('RewardHistory', () => {
  beforeEach(() => {
    mockRewardHistory = [];
    mockIsLoading = false;
    mockError = null;
    mockFetchRewardHistory.mockClear();
  });

  it('TC-REWARD-001::Unit::컴포넌트 렌더링::로딩 중::로딩 메시지 표시', () => {
    mockIsLoading = true;
    render(<RewardHistory />);
    expect(screen.getByText('데이터를 불러오는 중입니다...')).toBeInTheDocument();
  });

  it('TC-REWARD-002::Unit::컴포넌트 렌더링::API 에러::목 데이터 사용', async () => {
    mockError = '서버 연결 오류';
    render(<RewardHistory />);
    await waitFor(() => {
      expect(screen.getByText('⚠️ API 연결이 없어 Mock 데이터를 표시합니다.')).toBeInTheDocument();
    });
  });

  it('TC-REWARD-003::Unit::컴포넌트 마운팅::데이터 요청::fetchRewardHistory 호출', async () => {
    render(<RewardHistory />);
    await waitFor(() => {
      expect(mockFetchRewardHistory).toHaveBeenCalled();
    });
  });

  it('TC-REWARD-004::Unit::컴포넌트 렌더링::API 데이터 렌더::테이블 표시', async () => {
    mockRewardHistory = [
      {
        rewardId: 'SEED_1024',
        email: 'user1@example.com',
        issuedDate: '2025-04-25',
        reason: '안전 주행',
        amount: 120
      }
    ];
    
    render(<RewardHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('SEED_1024')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('2025-04-25')).toBeInTheDocument();
      expect(screen.getByText('안전 주행')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
    });
  });
  
  it('TC-REWARD-005::Unit::컴포넌트 렌더링::빈 데이터::메시지 표시', async () => {
    // Both API data and mock data are empty
    mockRewardHistory = [];
    // Force useEffect logic to avoid using mock data
    mockError = null;
    
    render(<RewardHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('표시할 씨앗 발급 내역이 없습니다.')).toBeInTheDocument();
    });
  });
});