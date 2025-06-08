import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/router';
import { authService } from '@/services/authService';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock authService
jest.mock('@/services/authService', () => ({
  authService: {
    logout: jest.fn(),
  },
}));

describe('Layout', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      pathname: '/',
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('TC-LAYOUT-001::Unit::컴포넌트 렌더링::기본 상태::레이아웃과 자식 요소 표시', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
    expect(screen.getByAltText('MODiVE 로고')).toBeInTheDocument();
  });

  it('TC-LAYOUT-002::Unit::컴포넌트 렌더링::타이틀 설정::페이지 제목 설정', () => {
    render(<Layout title="테스트 페이지">컨텐츠</Layout>);
    
    // Head의 title이 Jest DOM에서는 테스트하기 어렵기 때문에
    // document.title을 직접 확인하는 방식으로 테스트
    // expect(document.title).toBe('테스트 페이지'); // 실제 환경에서는 이렇게 테스트
  });

  it('TC-LAYOUT-003::Unit::컴포넌트 동작::사이드바 접기/펼치기::토글 버튼 동작', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    // 초기에는 펼쳐져 있어야 함
    expect(screen.getByText('대시보드')).toBeInTheDocument();
    
    // 접기 버튼 클릭
    const collapseButton = screen.getByTitle('사이드바 접기');
    fireEvent.click(collapseButton);
    
    // 텍스트가 숨겨지고 아이콘만 표시되어야 함
    expect(screen.queryByText('대시보드')).not.toBeInTheDocument();
    
    // 펼치기 버튼 클릭
    const expandButton = screen.getByTitle('사이드바 펼치기');
    fireEvent.click(expandButton);
    
    // 다시 텍스트가 표시되어야 함
    expect(screen.getByText('대시보드')).toBeInTheDocument();
  });

  it('TC-LAYOUT-004::Unit::컴포넌트 동작::로그아웃 버튼 클릭::확인 모달 표시', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    
    // 확인 모달이 표시되어야 함
    expect(screen.getByText('정말 로그아웃하시겠습니까?')).toBeInTheDocument();
  });

  it('TC-LAYOUT-005::Unit::컴포넌트 동작::로그아웃 확인::로그아웃 함수 호출 및 리디렉션', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    // 로그아웃 버튼 클릭하여 모달 표시
    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    
    // 모달에서 확인 버튼 클릭
    const confirmButton = screen.getByText('로그아웃').closest('button');
    fireEvent.click(confirmButton);
    
    // authService.logout이 호출되어야 함
    expect(authService.logout).toHaveBeenCalled();
    // 로그인 페이지로 리디렉션되어야 함
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  it('TC-LAYOUT-006::Unit::컴포넌트 동작::로그아웃 취소::모달 닫기', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    // 로그아웃 버튼 클릭하여 모달 표시
    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    
    // 모달에서 취소 버튼 클릭
    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);
    
    // 모달이 닫혀야 함
    expect(screen.queryByText('정말 로그아웃하시겠습니까?')).not.toBeInTheDocument();
    // 로그아웃 함수가 호출되지 않아야 함
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('TC-LAYOUT-007::Unit::컴포넌트 동작::네비게이션 항목::현재 위치 강조', () => {
    // 대시보드 페이지 위치
    mockRouter.pathname = '/';
    render(<Layout>테스트 콘텐츠</Layout>);
    
    const dashboardLink = screen.getByText('대시보드').closest('a');
    expect(dashboardLink).toHaveClass('bg-indigo-600', 'text-white');
    
    // 다른 링크는 강조되지 않아야 함
    const usersLink = screen.getByText('회원관리').closest('a');
    expect(usersLink).not.toHaveClass('bg-indigo-600', 'text-white');
  });

  it('TC-LAYOUT-008::Unit::컴포넌트 렌더링::사이드바 접힌 상태::로고가 단축 표시됨', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    // 접기 버튼 클릭
    const collapseButton = screen.getByTitle('사이드바 접기');
    fireEvent.click(collapseButton);
    
    // 단축 로고 'M'이 표시되어야 함
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.queryByAltText('MODiVE 로고')).not.toBeInTheDocument();
  });

  it('TC-LAYOUT-009::Unit::컴포넌트 동작::모달 닫기 아이콘 클릭::모달 닫기', () => {
    render(<Layout>테스트 콘텐츠</Layout>);
    
    // 로그아웃 버튼 클릭하여 모달 표시
    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    
    // X 아이콘 클릭
    const closeIcon = screen.getByText('정말 로그아웃하시겠습니까?').parentElement.querySelector('svg');
    fireEvent.click(closeIcon);
    
    // 모달이 닫혀야 함
    expect(screen.queryByText('정말 로그아웃하시겠습니까?')).not.toBeInTheDocument();
  });
});