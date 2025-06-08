import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersTable from '@/components/users/UsersTable';
import { User } from '@/types/user';

describe('UsersTable', () => {
    const mockOnUserDetail = jest.fn();
    
    const mockUsers: User[] = [
        {
            userId: 'user1',
            email: 'test1@example.com',
            nickname: '테스터1',
            joinedAt: '2023-01-01T12:00:00Z',
            experience: 3,
            driveCount: 15,
            isActive: 1,
        },
        {
            userId: 'user2',
            email: 'test2@example.com',
            nickname: '테스터2',
            joinedAt: '2023-02-01T12:00:00Z',
            experience: 5,
            driveCount: 25,
            isActive: 0,
        },
    ];

    // Added new tests after the existing ones
    
    it('TC-USERTABLE-007::Unit::컴포넌트 동작::상세보기 버튼 비활성화::로딩 중일 때', () => {
        render(
            <UsersTable
                users={mockUsers}
                currentPage={0}
                pageSize={10}
                isLoading={true}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        // 로딩 중일 때는 상세보기 버튼이 보이지 않아야 함 (로딩 상태일 때 다른 UI가 표시됨)
        expect(screen.queryByText('상세보기')).not.toBeInTheDocument();
    });

    it('TC-USERTABLE-008::Unit::컴포넌트 렌더링::테이블 헤더::모든 컬럼 헤더 존재', () => {
        render(
            <UsersTable
                users={mockUsers}
                currentPage={0}
                pageSize={10}
                isLoading={false}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        // 모든 헤더 컬럼이 표시되는지 확인
        const expectedHeaders = ['번호', '이메일', '닉네임', '가입일', '운전 경력', '운전 횟수', '상태', '관리'];
        
        expectedHeaders.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    it('TC-USERTABLE-009::Unit::컴포넌트 렌더링::페이지 번호 계산::페이지 정보 null일 때 기본 인덱스 사용', () => {
        render(
            <UsersTable
                users={mockUsers}
                currentPage={null}
                pageSize={null}
                isLoading={false}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        // currentPage와 pageSize가 null일 때는 기본 인덱스(1부터 시작)를 사용해야 함
        const firstRowNumber = screen.getByText('1');
        expect(firstRowNumber).toBeInTheDocument();
    });

    it('TC-USERTABLE-010::Unit::컴포넌트 렌더링::다양한 날짜 형식::올바른 포맷팅', () => {
        const usersWithDifferentDateFormats: User[] = [
            {
                userId: 'user3',
                email: 'date1@example.com',
                nickname: '날짜1',
                joinedAt: '2023-10-15', // ISO 날짜만 있는 형식
                experience: 1,
                driveCount: 5,
                isActive: 1,
            },
            {
                userId: 'user4',
                email: 'date2@example.com',
                nickname: '날짜2',
                joinedAt: '2023-11-20T08:30:00', // T 구분자가 있지만 Z가 없는 형식
                experience: 2,
                driveCount: 10,
                isActive: 1,
            }
        ];
        
        render(
            <UsersTable
                users={usersWithDifferentDateFormats}
                currentPage={0}
                pageSize={10}
                isLoading={false}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        // 모든 날짜 형식이 yyyy-MM-dd 형식으로 정확하게 변환되어야 함
        expect(screen.getByText('2023-10-15')).toBeInTheDocument();
        expect(screen.getByText('2023-11-20')).toBeInTheDocument();
    });

    it('TC-USERTABLE-011::Unit::컴포넌트 렌더링::undefined users 처리::오류 없이 처리', () => {
        // users prop이 undefined일 때 오류 없이 "조건에 맞는 사용자가 없습니다" 메시지를 표시해야 함
        render(
            <UsersTable
                users={undefined}
                currentPage={0}
                pageSize={10}
                isLoading={false}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        expect(screen.getByText('조건에 맞는 사용자가 없습니다.')).toBeInTheDocument();
    });

    it('TC-USERTABLE-012::Unit::컴포넌트 접근성::테이블 요소::적절한 ARIA 역할', () => {
        render(
            <UsersTable
                users={mockUsers}
                currentPage={0}
                pageSize={10}
                isLoading={false}
                onUserDetail={mockOnUserDetail}
            />
        );
        
        // 테이블과 관련 요소들이 올바른 역할을 가지고 있는지 확인
        expect(screen.getAllByRole('row').length).toBeGreaterThan(0);
        expect(screen.getAllByRole('cell').length).toBeGreaterThan(0);
        expect(screen.getAllByRole('columnheader').length).toBe(8); // 8개의 컬럼 헤더
        
        // 상세보기 버튼이 적절한 접근성을 갖고 있는지 확인
        const detailButtons = screen.getAllByText('상세보기');
        detailButtons.forEach(button => {
            expect(button).toHaveAttribute('role', 'button');
        });
    });
});

  it('TC-USERTABLE-001::Unit::컴포넌트 렌더링::로딩 상태일 때::로딩 메시지 표시', () => {
    render(
      <UsersTable
        users={[]}
        currentPage={0}
        pageSize={10}
        isLoading={true}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('TC-USERTABLE-002::Unit::컴포넌트 렌더링::사용자가 없을 때::빈 상태 메시지 표시', () => {
    render(
      <UsersTable
        users={[]}
        currentPage={0}
        pageSize={10}
        isLoading={false}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    expect(screen.getByText('조건에 맞는 사용자가 없습니다.')).toBeInTheDocument();
  });

  it('TC-USERTABLE-003::Unit::컴포넌트 렌더링::사용자가 있을 때::테이블과 사용자 데이터 표시', () => {
    render(
      <UsersTable
        users={mockUsers}
        currentPage={0}
        pageSize={10}
        isLoading={false}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
    expect(screen.getByText('테스터1')).toBeInTheDocument();
    expect(screen.getByText('테스터2')).toBeInTheDocument();
    
    // 날짜 포맷팅 테스트
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    
    // 상태 표시 테스트
    expect(screen.getByText('활성')).toBeInTheDocument();
    expect(screen.getByText('탈퇴')).toBeInTheDocument();
  });

  it('TC-USERTABLE-004::Unit::컴포넌트 동작::상세보기 버튼 클릭::onUserDetail 함수 호출', () => {
    render(
      <UsersTable
        users={mockUsers}
        currentPage={0}
        pageSize={10}
        isLoading={false}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    const detailButtons = screen.getAllByText('상세보기');
    fireEvent.click(detailButtons[0]);
    
    expect(mockOnUserDetail).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('TC-USERTABLE-005::Unit::컴포넌트 렌더링::safeRender 함수::null 값 처리', () => {
    const userWithNullValues: User = {
      userId: 'user3',
      email: 'test3@example.com',
      nickname: null,
      joinedAt: '2023-03-01T12:00:00Z',
      experience: null,
      driveCount: null,
      isActive: 1,
    };
    
    render(
      <UsersTable
        users={[userWithNullValues]}
        currentPage={0}
        pageSize={10}
        isLoading={false}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    // null 값은 '-'로 렌더링되어야 함
    const tableCells = screen.getAllByRole('cell');
    expect(tableCells[1]).toHaveTextContent('test3@example.com');
    expect(tableCells[2]).toHaveTextContent('-'); // nickname
    expect(tableCells[4]).toHaveTextContent('-'); // experience
    expect(tableCells[5]).toHaveTextContent('-'); // driveCount
  });

  it('TC-USERTABLE-006::Unit::컴포넌트 렌더링::페이지 번호 계산::정확한 행 번호 표시', () => {
    render(
      <UsersTable
        users={mockUsers}
        currentPage={2}
        pageSize={10}
        isLoading={false}
        onUserDetail={mockOnUserDetail}
      />
    );
    
    // 현재 페이지가 2(0-based)이고 페이지 크기가 10이면, 첫 행 번호는 21이어야 함
    const firstRowNumber = screen.getByText('21');
    expect(firstRowNumber).toBeInTheDocument();
  });
});