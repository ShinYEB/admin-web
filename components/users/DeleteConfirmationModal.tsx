import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6 shadow-md">
        {/* 우측 상단 X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* 제목 */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          회원 탈퇴 확인
        </h2>
        <div className="border-b border-gray-200 mb-6" />

        {/* 경고 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="text-center mb-6">
          <p className="text-base text-gray-800">
            <span className="font-semibold text-black">{userEmail}</span> 회원을
            정말 탈퇴 처리하시겠습니까?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            이 작업은 되돌릴 수 없으며, 사용자의 상태가{" "}
            <span className="font-medium">비활성</span>으로 변경됩니다.
          </p>
        </div>

        {/* 버튼: 취소 → 확인 순 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50 flex items-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isLoading ? "처리중..." : "확인"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
