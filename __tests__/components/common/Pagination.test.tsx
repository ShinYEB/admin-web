import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '@/components/common/Pagination';

describe('Pagination', () => {
  const mockProps = {
    currentPage: 0,
    totalPages: 10,
    totalElements: 100,
    pageSize: 10,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  it('TC-PAGINATION-001::Unit::컴포넌트 렌더링::기본 상태::페이지네이션 UI 표시', () => {
    render(<Pagination {...mockProps} />);
    
    expect(screen.getByText('1-10명 표시 중 (전체 100명)')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 현재 페이지 (0+1)
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('TC-PAGINATION-002::Unit::컴포넌트 렌더링::총 페이지가 1 이하일 때::렌더링하지 않음', () => {
    const { container } = render(
      <Pagination {...mockProps} totalPages={1} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('TC-PAGINATION-003::Unit::컴포넌트 동작::페이지 번호 클릭::onPageChange 함수 호출', () => {
    render(<Pagination {...mockProps} />);
    
    const pageThreeButton = screen.getByText('3');
    fireEvent.click(pageThreeButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2); // 0-based index
  });

  it('TC-PAGINATION-004::Unit::컴포넌트 동작::이전 페이지 버튼 클릭::onPageChange 함수 호출', () => {
    render(<Pagination {...mockProps} currentPage={1} />);
    
    const prevButton = screen.getByText('<');
    fireEvent.click(prevButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(0); // 이전 페이지 (1-1)
  });

  it('TC-PAGINATION-005::Unit::컴포넌트 동작::다음 페이지 버튼 클릭::onPageChange 함수 호출', () => {
    render(<Pagination {...mockProps} />);
    
    const nextButton = screen.getByText('>');
    fireEvent.click(nextButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(1); // 다음 페이지 (0+1)
  });

  it('TC-PAGINATION-006::Unit::컴포넌트 렌더링::첫 페이지일 때::이전 버튼 비활성화', () => {
    render(<Pagination {...mockProps} />); // currentPage = 0
    
    const prevButton = screen.getByText('<');
    expect(prevButton).toBeDisabled();
  });

  it('TC-PAGINATION-007::Unit::컴포넌트 렌더링::마지막 페이지일 때::다음 버튼 비활성화', () => {
    render(<Pagination {...mockProps} currentPage={9} />); // totalPages = 10
    
    const nextButton = screen.getByText('>');
    expect(nextButton).toBeDisabled();
  });

  it('TC-PAGINATION-008::Unit::컴포넌트 동작::페이지 크기 변경::onPageSizeChange 함수 호출', () => {
    render(<Pagination {...mockProps} />);
    
    const pageSizeSelect = screen.getByRole('combobox');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    
    expect(mockProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('TC-PAGINATION-009::Unit::컴포넌트 렌더링::중간 페이지일 때::페이지 범위 정확히 표시', () => {
    render(<Pagination {...mockProps} currentPage={5} />);
    
    // 3,4,5,6,7 이 표시되어야 함 (5가 중앙)
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('TC-PAGINATION-010::Unit::컴포넌트 렌더링::현재 페이지 강조::스타일 적용', () => {
    render(<Pagination {...mockProps} currentPage={2} />);
    
    const currentPageButton = screen.getByText('3'); // currentPage + 1
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
  });
});