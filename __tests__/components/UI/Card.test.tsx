import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '@/components/UI/Card';

describe('Card', () => {
  it('TC-CARD-001::Unit::컴포넌트 렌더링::기본 스타일::테두리와 그림자 스타일 적용', () => {
    render(<Card>테스트 콘텐츠</Card>);
    
    const card = screen.getByText('테스트 콘텐츠').parentElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow');
  });

  it('TC-CARD-002::Unit::컴포넌트 렌더링::추가 클래스 적용::사용자 정의 클래스 적용', () => {
    render(<Card className="p-4 m-2">테스트 콘텐츠</Card>);
    
    const card = screen.getByText('테스트 콘텐츠').parentElement;
    expect(card).toHaveClass('p-4', 'm-2');
  });

  it('TC-CARD-003::Unit::컴포넌트 렌더링::자식 요소 렌더링::복잡한 구조 적용', () => {
    render(
      <Card>
        <h1 data-testid="title">제목</h1>
        <p data-testid="content">내용</p>
        <button data-testid="button">버튼</button>
      </Card>
    );
    
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });
});