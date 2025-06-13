import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationModal from '@/components/users/DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockUser = {
    userId: 'user123',
    email: 'test@example.com',
  };
  
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    user: mockUser,
    isProcessing: false,
  };

  it('TC-DELETEMODAL-001::Unit::컴포넌트 렌더링::모달이 닫혀있을 때::렌더링되지 않음', () => {
    render(
      <DeleteConfirmationModal
        {...mockProps}
        isOpen={false}
      />
    );
    
    expect(screen.queryByText('사용자 탈퇴 처리')).not.toBeInTheDocument();
  });

  it('TC-DELETEMODAL-002::Unit::컴포넌트 렌더링::모달이 열려있을 때::탈퇴 확인 UI 표시', () => {
    render(<DeleteConfirmationModal {...mockProps} />);
    
    expect(screen.getByText('사용자 탈퇴 처리')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('이 작업은 되돌릴 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '탈퇴 확인' })).toBeInTheDocument();
  });

  it('TC-DELETEMODAL-003::Unit::컴포넌트 동작::취소 버튼 클릭::onClose 함수 호출', () => {
    render(<DeleteConfirmationModal {...mockProps} />);
    
    const cancelButton = screen.getByRole('button', { name: '취소' });
    fireEvent.click(cancelButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('TC-DELETEMODAL-004::Unit::컴포넌트 동작::탈퇴 확인 버튼 클릭::onConfirm 함수 호출', () => {
    render(<DeleteConfirmationModal {...mockProps} />);
    
    const confirmButton = screen.getByRole('button', { name: '탈퇴 확인' });
    fireEvent.click(confirmButton);
    
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });

  it('TC-DELETEMODAL-005::Unit::컴포넌트 렌더링::처리 중일 때::버튼 비활성화 및 로딩 표시', () => {
    render(<DeleteConfirmationModal {...mockProps} isProcessing={true} />);
    
    const cancelButton = screen.getByRole('button', { name: '취소' });
    const confirmButton = screen.getByText('처리 중...');
    const loadingIcon = screen.getByRole('img', { hidden: true }); // SVG는 hidden 역할을 가짐
    
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
    expect(loadingIcon).toBeInTheDocument();
  });

  it('TC-DELETEMODAL-006::Unit::컴포넌트 렌더링::사용자 정보가 없을 때::안전하게 렌더링', () => {
    render(<DeleteConfirmationModal {...mockProps} user={null} />);
    
    expect(screen.getByText('사용자 탈퇴 처리')).toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
});