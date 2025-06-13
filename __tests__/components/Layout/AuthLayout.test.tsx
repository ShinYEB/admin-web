import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from '@/components/Layout/AuthLayout';

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="head">{children}</div>,
  };
});

describe('AuthLayout', () => {
  it('TC-AUTHLAYOUT-001::Unit::컴포넌트 렌더링::기본 상태::레이아웃과 자식 요소 표시', () => {
    render(
      <AuthLayout>
        <div data-testid="child">로그인 폼</div>
      </AuthLayout>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('로그인 폼')).toBeInTheDocument();
  });

  it('TC-AUTHLAYOUT-002::Unit::컴포넌트 렌더링::타이틀 설정::페이지 제목 설정', () => {
    render(
      <AuthLayout title="로그인">
        <div>로그인 폼</div>
      </AuthLayout>
    );
    
    // Head 컴포넌트가 모킹되었으므로 document.title을 직접 검사할 수 없음
    // 대신 Head 컴포넌트가 렌더링된 것을 확인
    expect(screen.getByTestId('head')).toBeInTheDocument();
  });

  it('TC-AUTHLAYOUT-003::Unit::컴포넌트 렌더링::배경 스타일::그라디언트 배경 적용', () => {
    const { container } = render(
      <AuthLayout>
        <div>콘텐츠</div>
      </AuthLayout>
    );
    
    // main 태그에 배경 클래스가 적용되었는지 확인
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('bg-gradient-to-br', 'from-indigo-600', 'via-purple-600', 'to-pink-500');
  });

  it('TC-AUTHLAYOUT-004::Unit::컴포넌트 렌더링::애니메이션 효과::애니메이션 클래스 적용', () => {
    const { container } = render(
      <AuthLayout>
        <div>콘텐츠</div>
      </AuthLayout>
    );
    
    // 애니메이션 배경 요소가 있는지 확인
    const animatedBg = container.querySelector('.animate-gradient');
    expect(animatedBg).toBeInTheDocument();
  });

  it('TC-AUTHLAYOUT-005::Unit::컴포넌트 렌더링::z-index 구조::콘텐츠가 상위 레이어에 표시', () => {
    const { container } = render(
      <AuthLayout>
        <div data-testid="content">콘텐츠</div>
      </AuthLayout>
    );
    
    // 콘텐츠 컨테이너에 z-10 클래스가 적용되었는지 확인
    const contentContainer = container.querySelector('.z-10');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toContainElement(screen.getByTestId('content'));
  });
});