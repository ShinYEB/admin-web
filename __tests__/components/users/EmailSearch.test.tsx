import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailSearch from '@/components/users/EmailSearch';

describe('EmailSearch', () => {
  const mockProps = {
    searchKeyword: '',
    isLoading: false,
    onSearchKeywordChange: jest.fn(),
    onSearch: jest.fn(),
    onClear: jest.fn(),
  };

  it('TC-EMAILSEARCH-001::Unit::컴포넌트 렌더링::기본 상태::검색 인터페이스 표시', () => {
    render(<EmailSearch {...mockProps} />);
    
    expect(screen.getByPlaceholderText('이메일을 입력하세요...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '검색' })).toBeInTheDocument();
    
    // 검색어가 없으므로 지우기 버튼이 표시되지 않아야 함
    expect(screen.queryByRole('button', { name: '지우기' })).not.toBeInTheDocument();
  });

  it('TC-EMAILSEARCH-002::Unit::컴포넌트 동작::검색어 입력::onSearchKeywordChange 함수 호출', () => {
    render(<EmailSearch {...mockProps} />);
    
    const input = screen.getByPlaceholderText('이메일을 입력하세요...');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(mockProps.onSearchKeywordChange).toHaveBeenCalledWith('test@example.com');
  });

  it('TC-EMAILSEARCH-003::Unit::컴포넌트 동작::검색 버튼 클릭::onSearch 함수 호출', () => {
    render(<EmailSearch {...mockProps} />);
    
    const searchButton = screen.getByRole('button', { name: '검색' });
    fireEvent.click(searchButton);
    
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('TC-EMAILSEARCH-004::Unit::컴포넌트 동작::Enter키 입력::onSearch 함수 호출', () => {
    render(<EmailSearch {...mockProps} />);
    
    const input = screen.getByPlaceholderText('이메일을 입력하세요...');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('TC-EMAILSEARCH-005::Unit::컴포넌트 렌더링::검색어가 있을 때::지우기 버튼 표시', () => {
    render(<EmailSearch {...mockProps} searchKeyword="test@example.com" />);
    
    expect(screen.getByRole('button', { name: '지우기' })).toBeInTheDocument();
  });

  it('TC-EMAILSEARCH-006::Unit::컴포넌트 동작::지우기 버튼 클릭::onClear 함수 호출', () => {
    render(<EmailSearch {...mockProps} searchKeyword="test@example.com" />);
    
    const clearButton = screen.getByRole('button', { name: '지우기' });
    fireEvent.click(clearButton);
    
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('TC-EMAILSEARCH-007::Unit::컴포넌트 렌더링::로딩 중일 때::검색 버튼 비활성화 및 텍스트 변경', () => {
    render(<EmailSearch {...mockProps} isLoading={true} />);
    
    const searchButton = screen.getByRole('button', { name: '검색중...' });
    expect(searchButton).toBeDisabled();
  });

  it('TC-EMAILSEARCH-008::Unit::컴포넌트 동작::로딩 중 지우기 버튼 클릭::버튼 비활성화', () => {
    render(<EmailSearch {...mockProps} isLoading={true} searchKeyword="test@example.com" />);
    
    const clearButton = screen.getByRole('button', { name: '지우기' });
    expect(clearButton).toBeDisabled();
  });
});