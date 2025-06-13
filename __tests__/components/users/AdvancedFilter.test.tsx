import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedFilter from '@/components/users/AdvancedFilter';

describe('AdvancedFilter', () => {
  const mockProps = {
    minExperience: '',
    maxExperience: '',
    accountAgeInMonths: '',
    status: '전체',
    isLoading: false,
    onMinExperienceChange: jest.fn(),
    onMaxExperienceChange: jest.fn(),
    onAccountAgeChange: jest.fn(),
    onStatusChange: jest.fn(),
    onApplyFilters: jest.fn(),
    onResetFilters: jest.fn(),
  };

  it('TC-ADVFILTER-001::Unit::컴포넌트 렌더링::기본 상태::고급 필터 UI 표시', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    expect(screen.getByText('사용자 필터링')).toBeInTheDocument();
    expect(screen.getByText('최소 운전 경력 (년)')).toBeInTheDocument();
    expect(screen.getByText('최대 운전 경력 (년)')).toBeInTheDocument();
    expect(screen.getByText('가입 후 경과 개월 수')).toBeInTheDocument();
    expect(screen.getByText('계정 상태')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: '초기화' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '필터 적용' })).toBeInTheDocument();
  });

  it('TC-ADVFILTER-002::Unit::컴포넌트 동작::최소 운전 경력 입력::onMinExperienceChange 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const minInput = screen.getByPlaceholderText('예: 1');
    fireEvent.change(minInput, { target: { value: '2' } });
    
    expect(mockProps.onMinExperienceChange).toHaveBeenCalledWith('2');
  });

  it('TC-ADVFILTER-003::Unit::컴포넌트 동작::최대 운전 경력 입력::onMaxExperienceChange 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const maxInput = screen.getByPlaceholderText('예: 10');
    fireEvent.change(maxInput, { target: { value: '5' } });
    
    expect(mockProps.onMaxExperienceChange).toHaveBeenCalledWith('5');
  });

  it('TC-ADVFILTER-004::Unit::컴포넌트 동작::가입 후 경과 개월 수 입력::onAccountAgeChange 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const periodInput = screen.getByPlaceholderText('예: 6');
    fireEvent.change(periodInput, { target: { value: '12' } });
    
    expect(mockProps.onAccountAgeChange).toHaveBeenCalledWith('12');
  });

  it('TC-ADVFILTER-005::Unit::컴포넌트 동작::계정 상태 변경::onStatusChange 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: '활성' } });
    
    expect(mockProps.onStatusChange).toHaveBeenCalledWith('활성');
  });

  it('TC-ADVFILTER-006::Unit::컴포넌트 동작::필터 적용 버튼 클릭::onApplyFilters 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const applyButton = screen.getByRole('button', { name: '필터 적용' });
    fireEvent.click(applyButton);
    
    expect(mockProps.onApplyFilters).toHaveBeenCalled();
  });

  it('TC-ADVFILTER-007::Unit::컴포넌트 동작::초기화 버튼 클릭::onResetFilters 함수 호출', () => {
    render(<AdvancedFilter {...mockProps} />);
    
    const resetButton = screen.getByRole('button', { name: '초기화' });
    fireEvent.click(resetButton);
    
    expect(mockProps.onResetFilters).toHaveBeenCalled();
  });

  it('TC-ADVFILTER-008::Unit::컴포넌트 렌더링::로딩 중일 때::버튼 비활성화', () => {
    render(<AdvancedFilter {...mockProps} isLoading={true} />);
    
    const applyButton = screen.getByRole('button', { name: '필터 적용' });
    const resetButton = screen.getByRole('button', { name: '초기화' });
    
    expect(applyButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
    
    // 로딩 아이콘 표시 확인
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('TC-ADVFILTER-009::Unit::컴포넌트 렌더링::기존 필터값 표시::정확한 값 표시', () => {
    const propsWithValues = {
      ...mockProps,
      minExperience: '2',
      maxExperience: '5',
      accountAgeInMonths: '12',
      status: '활성',
    };
    
    render(<AdvancedFilter {...propsWithValues} />);
    
    const minInput = screen.getByPlaceholderText('예: 1') as HTMLInputElement;
    const maxInput = screen.getByPlaceholderText('예: 10') as HTMLInputElement;
    const periodInput = screen.getByPlaceholderText('예: 6') as HTMLInputElement;
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
    
    expect(minInput.value).toBe('2');
    expect(maxInput.value).toBe('5');
    expect(periodInput.value).toBe('12');
    expect(statusSelect.value).toBe('활성');
  });
});