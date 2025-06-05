// components/users/UserDetailModal.tsx
import React, { useEffect, useState } from "react";
import { UserDetail, DrivingRecord, SeedRecord } from "@/types/user";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail | null;
  drivingRecords: DrivingRecord[];
  seedRecords: SeedRecord[];
  isLoading?: boolean;
  onDeleteUser?: (user: UserDetail) => void; // 타입 수정: 올바른 매개변수 추가
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  drivingRecords,
  seedRecords,
  isLoading = false,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState("seeds");

  // 모달이 열릴 때마다 탭을 "씨앗 내역"으로 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab("seeds");
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">사용자 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* 사용자 기본 정보 */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-500">회원 ID</p>
              <p className="font-medium">{user.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">닉네임</p>
              <p className="font-medium">{user.nickname || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">운전 경력</p>
              <p className="font-medium">{user.experience}년</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">가입일</p>
              <p className="font-medium">{user.joinedAt.split("T")[0]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">운전 횟수</p>
              <p className="font-medium">{user.driveCount}회</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">상태</p>
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.isActive === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive === 1 ? "활성" : "탈퇴"}
              </span>
            </div>
          </div>

          {/* 탭 인터페이스 */}
          <div className="border-b mb-4">
            <div className="flex">
              <button
                className={`py-2 px-4 focus:outline-none ${
                  activeTab === "seeds"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("seeds")}
              >
                씨앗 내역
              </button>
              <button
                className={`py-2 px-4 focus:outline-none ${
                  activeTab === "driving"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("driving")}
              >
                운전 기록
              </button>
            </div>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* 탭 내용 */}
          {!isLoading && (
            <>
              {activeTab === "seeds" ? (
                <div className="max-h-64 overflow-y-auto">
                  {seedRecords.length > 0 ? (
                    seedRecords.map((record, index) => (
                      <div
                        key={index}
                        className="py-3 border-b last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{record.reason}</p>
                          <p className="text-sm text-gray-500">
                            {record.issuedDate}
                          </p>
                        </div>
                        <span
                          className={
                            record.amount > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {record.amount > 0
                            ? `+${record.amount}`
                            : record.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      씨앗 내역이 없습니다.
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  {drivingRecords.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            날짜
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            주행거리
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            주행시간
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            이벤트
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            획득 씨앗
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {drivingRecords.map((record, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {record.date}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {record.distance}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {record.duration}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {record.event}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600 font-medium">
                              +{record.seeds}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      운전 기록이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* 하단 버튼들 */}
          <div className="mt-6 flex items-center space-x-3">
            {/* 왼쪽 영역 - 탈퇴 버튼 */}
            <div className="flex-grow">
              {onDeleteUser && (
                <button
                  onClick={() => onDeleteUser(user)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  회원 탈퇴
                </button>
              )}
            </div>

            {/* 오른쪽 영역 - 닫기 버튼 */}
            <div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
