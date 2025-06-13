import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersFilter from '@/components/users/UsersFilter';

// Mock 하위 컴포넌트
jest.mock('@/components/users/EmailSearch', () => {
  return function MockEmailSearch({ searchKeyword, onSearchKeywordChange, onSearch, onClear }) {
    return (
      <div data-testid="email-search">
        <input
          data-testid="email-search-input"
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchKeywordChange(e.target.value)}
        />
        <button data-testid="email-search-button" onClick={onSearch}>검색</button>
        <button data-testid="email-clear-button" onClick={onClear}>지우기</button>
      </div>
    );
  };
});

jest.mock('@/components/users/AdvancedFilter', () => {
  return function MockAdvancedFilter({
    minExperience,
    maxExperience,
    accountAgeInMonths,
    status,
    onMinExperienceChange,
    onMaxExperienceChange,
    onAccountAgeChange,
    onStatusChange,
    onApplyFilters,
    onResetFilters
  }) {
    return (
      <div data-testid="advanced-filter">
        <input
          data-testid="min-experience-input"
          type="text"
          value={minExperience}
          onChange={(e) => onMinExperienceChange(e.target.value)}
        />
        <input
          data-testid="max-experience-input"
          type="text"
          value={maxExperience}
          onChange={(e) => onMaxExperienceChange(e.target.value)}
        />
        <input
          data-testid="period-input"
          type="text"
          value={accountAgeInMonths}
          onChange={(e) => onAccountAgeChange(e.target.value)}
        />
        <select
          data-testid="status-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="활성">활성</option>
          <option value="탈퇴">탈퇴</option>
        </select>
        <button data-testid="apply-filters-button" onClick={onApplyFilters}>필터 적용</button>
        <button data-testid="reset-filters-button" onClick={onResetFilters}>초기화</button>
      </div>
    );
  };
});

describe('UsersFilter', () => {
  const mockProps = {
    searchKeyword: '',
    minScore: '',
    maxScore: '',
    period: '',
    status: '전체',
    isLoading: false,
    onSearchKeywordChange: jest.fn(),
    onMinScoreChange: jest.fn(),
    onMaxScoreChange: jest.fn(),
    onPeriodChange: jest.fn(),
    onStatusChange: jest.fn(),
    onSearch: jest.fn(),
    onApplyFilters: jest.fn(),
    onResetFilters: jest.fn(),
  };

  it('TC-USERSFILTER-001::Unit::컴포넌트 렌더링::기본 상태::필터링 UI 표시', () => {
    render(<UsersFilter {...mockProps} />);
    
    expect(screen.getByTestId('email-search')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-filter')).toBeInTheDocument();
  });

  it('TC-USERSFILTER-002::Integration::이메일 검색::검색어 입력 및 검색 버튼 클릭::검색 함수 호출', () => {
    render(<UsersFilter {...mockProps} />);
    
    const searchInput = screen.getByTestId('email-search-input');
    const searchButton = screen.getByTestId('email-search-button');
    
    fireEvent.change(searchInput, { target: { value: 'test@example.com' } });
    fireEvent.click(searchButton);
    
    expect(mockProps.onSearchKeywordChange).toHaveBeenCalledWith('test@example.com');
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('TC-USERSFILTER-003::Integration::필터링::고급 필터 입력 및 적용::필터링 함수 호출', () => {
    render(<UsersFilter {...mockProps} />);
    
    const minScoreInput = screen.getByTestId('min-experience-input');
    const maxScoreInput = screen.getByTestId('max-experience-input');
    const periodInput = screen.getByTestId('period-input');
    const statusSelect = screen.getByTestId('status-select');
    const applyButton = screen.getByTestId('apply-filters-button');
    
    fireEvent.change(minScoreInput, { target: { value: '1' } });
    fireEvent.change(maxScoreInput, { target: { value: '5' } });
    fireEvent.change(periodInput, { target: { value: '6' } });
    fireEvent.change(statusSelect, { target: { value: '활성' } });
    fireEvent.click(applyButton);
    
    expect(mockProps.onMinScoreChange).toHaveBeenCalledWith('1');
    expect(mockProps.onMaxScoreChange).toHaveBeenCalledWith('5');
    expect(mockProps.onPeriodChange).toHaveBeenCalledWith('6');
    expect(mockProps.onStatusChange).toHaveBeenCalledWith('활성');
    expect(mockProps.onApplyFilters).toHaveBeenCalled();
  });

  it('TC-USERSFILTER-004::Integration::필터 초기화::초기화 버튼 클릭::초기화 함수 호출', () => {
    render(<UsersFilter {...mockProps} />);
    
    const resetButton = screen.getByTestId('reset-filters-button');
    fireEvent.click(resetButton);
    
    expect(mockProps.onResetFilters).toHaveBeenCalled();
  });

  it('TC-USERSFILTER-005::Integration::이메일 지우기::지우기 버튼 클릭::초기화 함수 호출', () => {
    render(<UsersFilter {...mockProps} />);
    
    const clearButton = screen.getByTestId('email-clear-button');
    fireEvent.click(clearButton);
    
    expect(mockProps.onResetFilters).toHaveBeenCalled();
  });
});