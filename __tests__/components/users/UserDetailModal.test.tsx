import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserDetailModal from '@/components/users/UserDetailModal';
import { UserDetail, DrivingRecord, SeedRecord } from '@/types/user';

describe('UserDetailModal', () => {
  const mockUser: UserDetail = {
    userId: 'user123',
    email: 'test@example.com',
    nickname: '테스트유저',
    joinedAt: '2023-01-15T12:00:00Z',
    experience: 3,
    driveCount: 15,
    isActive: 1,
  };

  const mockDrivingRecords: DrivingRecord[] = [
    {
      id: 'drive1',
      date: '2023-05-01',
      distance: '10.5km',
      duration: '35분',
      event: '과속 1회',
      seeds: 20,
    },
    {
      id: 'drive2',
      date: '2023-05-03',
      distance: '8.2km',
      duration: '25분',
      event: '없음',
      seeds: 30,
    },
  ];

  const mockSeedRecords: SeedRecord[] = [
    {
      rewardId: 'seed1',
      email: 'test@example.com',
      issuedDate: '2023-05-01',
      reason: '안전 주행',
      amount: 20,
    },
    {
      rewardId: 'seed2',
      email: 'test@example.com',
      issuedDate: '2023-05-03',
      reason: '친환경 주행',
      amount: 30,
    },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    user: mockUser,
    drivingRecords: mockDrivingRecords,
    seedRecords: mockSeedRecords,
    isLoading: false,
    onDeleteUser: jest.fn(),
  };

  it('TC-USERDETAIL-001::Unit::컴포넌트 렌더링::모달이 닫혀있을 때::렌더링되지 않음', () => {
    render(
      <UserDetailModal
        {...defaultProps}
        isOpen={false}
      />
    );
    
    expect(screen.queryByText('사용자 상세 정보')).not.toBeInTheDocument();
  });

  it('TC-USERDETAIL-002::Unit::컴포넌트 렌더링::모달이 열려있을 때::사용자 정보 표시', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    expect(screen.getByText('사용자 상세 정보')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('테스트유저')).toBeInTheDocument();
    expect(screen.getByText('3년')).toBeInTheDocument();
    expect(screen.getByText('15회')).toBeInTheDocument();
    expect(screen.getByText('활성')).toBeInTheDocument();
    
    // 날짜 포맷팅 확인
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-003::Unit::컴포넌트 동작::씨앗 내역 탭::씨앗 정보 표시', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    // 기본적으로 씨앗 내역 탭이 선택되어 있어야 함
    expect(screen.getByText('안전 주행')).toBeInTheDocument();
    expect(screen.getByText('친환경 주행')).toBeInTheDocument();
    expect(screen.getByText('+20')).toBeInTheDocument();
    expect(screen.getByText('+30')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-004::Unit::컴포넌트 동작::운전 기록 탭::운전 정보 표시', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    // 운전 기록 탭으로 변경
    const drivingTab = screen.getByText('운전 기록');
    fireEvent.click(drivingTab);
    
    expect(screen.getByText('10.5km')).toBeInTheDocument();
    expect(screen.getByText('8.2km')).toBeInTheDocument();
    expect(screen.getByText('35분')).toBeInTheDocument();
    expect(screen.getByText('25분')).toBeInTheDocument();
    expect(screen.getByText('과속 1회')).toBeInTheDocument();
    expect(screen.getByText('없음')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-005::Unit::컴포넌트 동작::닫기 버튼::onClose 함수 호출', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    const closeButton = screen.getAllByText('닫기')[0];
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('TC-USERDETAIL-006::Unit::컴포넌트 동작::회원 탈퇴 버튼::onDeleteUser 함수 호출', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    const deleteButton = screen.getByText('회원 탈퇴');
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDeleteUser).toHaveBeenCalledWith(mockUser);
  });

  it('TC-USERDETAIL-007::Unit::컴포넌트 렌더링::로딩 중일 때::로딩 상태 표시', () => {
    render(<UserDetailModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-008::Unit::컴포넌트 렌더링::씨앗 내역이 없을 때::안내 메시지 표시', () => {
    render(<UserDetailModal {...defaultProps} seedRecords={[]} />);
    
    expect(screen.getByText('씨앗 내역이 없습니다.')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-009::Unit::컴포넌트 렌더링::운전 기록이 없을 때::안내 메시지 표시', () => {
    render(<UserDetailModal {...defaultProps} drivingRecords={[]} />);
    
    // 운전 기록 탭으로 변경
    const drivingTab = screen.getByText('운전 기록');
    fireEvent.click(drivingTab);
    
    expect(screen.getByText('운전 기록이 없습니다.')).toBeInTheDocument();
  });

  it('TC-USERDETAIL-010::Unit::컴포넌트 동작::탭 전환::정확한 탭 활성화', () => {
    render(<UserDetailModal {...defaultProps} />);
    
    // 초기 상태: 씨앗 내역 탭이 활성화됨
    expect(screen.getByText('씨앗 내역')).toHaveClass('border-b-2');
    
    // 운전 기록 탭으로 변경
    const drivingTab = screen.getByText('운전 기록');
    fireEvent.click(drivingTab);
    
    // 운전 기록 탭이 활성화됨
    expect(drivingTab).toHaveClass('border-b-2');
    expect(screen.getByText('씨앗 내역')).not.toHaveClass('border-b-2');
  });
});