import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import {
  useUsers,
  useUserDetail,
  useUserRecords,
  useUserActions,
} from "@/store/useUserStore";
import { User } from "@/types/user";
import UsersTable from "@/components/users/UsersTable";
import UserDetailModal from "@/components/users/UserDetailModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";
import UsersFilter from "@/components/users/UsersFilter";
import Pagination from "@/components/common/Pagination";

export default function UsersPage() {
  // 스토어에서 상태와 액션 가져오기
  const {
    users,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    isLoading,
    error,
  } = useUsers();

  const { selectedUser, isDetailLoading } = useUserDetail();

  const {
    drivingRecords,
    seedRecords,
    isDrivingRecordsLoading,
    isSeedRecordsLoading,
  } = useUserRecords();

  const {
    fetchUsers,
    fetchUserDetail,
    fetchUserDrives,
    fetchUserRewards,
    deleteUser,
    setFilters,
    clearFilters,
    clearErrors,
    clearSelectedUser,
    setPage,
    setPageSize,
  } = useUserActions();

  // 로컬 상태 - 필터 폼 데이터
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [accountAgeInMonths, setAccountAgeInMonths] = useState("");
  const [status, setStatus] = useState("전체");

  // 모달 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 컴포넌트 마운트 시 사용자 목록 조회
  useEffect(() => {
    fetchUsers();
  }, []);

  // 검색 처리
  const handleSearch = async () => {
    try {
      let searchFilters;

      if (!searchKeyword.trim()) {
        searchFilters = { page: 0, pageSize: pageSize };
      } else {
        searchFilters = {
          email: searchKeyword.trim(),
          page: 0,
          pageSize: pageSize,
        };
      }

      console.log("검색 필터:", searchFilters);
      setFilters(searchFilters);
      await fetchUsers(searchFilters);
    } catch (error) {
      console.error("검색 중 오류:", error);
    }
  };

  // 필터 적용
  const applyFilters = async () => {
    try {
      const filters = {
        minExperience: minExperience ? parseInt(minExperience) : undefined,
        maxExperience: maxExperience ? parseInt(maxExperience) : undefined,
        accountAgeInMonths: accountAgeInMonths
          ? parseInt(accountAgeInMonths)
          : undefined,
        active: status === "활성" ? 1 : status === "탈퇴" ? 0 : undefined,
        page: 0,
        pageSize: pageSize,
      };

      console.log("적용할 필터:", filters);
      setFilters(filters);
      await fetchUsers(filters);
    } catch (error) {
      console.error("필터 적용 중 오류:", error);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setMinExperience("");
    setMaxExperience("");
    setAccountAgeInMonths("");
    setStatus("전체");
    setSearchKeyword("");
    clearFilters();
    clearErrors();
    fetchUsers({ page: 0, pageSize: pageSize });
  };

  // 사용자 상세 보기
  const handleUserDetail = async (user: User) => {
    try {
      await fetchUserDetail(user.userId);
      await fetchUserDrives(user.userId);
      await fetchUserRewards(user.userId);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("사용자 상세 정보 로드 실패:", error);
    }
  };

  // 사용자 탈퇴 모달 열기
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setIsDetailModalOpen(false); // 상세 모달 닫기
  };

  // 사용자 탈퇴 확인
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.userId);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers(); // 목록 새로고침
    } catch (error) {
      console.error("사용자 탈퇴 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    clearSelectedUser();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = async (newPageSize: number) => {
    try {
      await setPageSize(newPageSize);
    } catch (error) {
      console.error("페이지 크기 변경 실패:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원 관리</h1>
          <p className="text-sm text-gray-600">
            총 {totalElements.toLocaleString()}명의 회원이 등록되어 있습니다.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <UsersFilter
          searchKeyword={searchKeyword}
          minScore={minExperience}
          maxScore={maxExperience}
          period={accountAgeInMonths}
          status={status}
          isLoading={isLoading}
          onSearchKeywordChange={setSearchKeyword}
          onMinScoreChange={setMinExperience}
          onMaxScoreChange={setMaxExperience}
          onPeriodChange={setAccountAgeInMonths}
          onStatusChange={setStatus}
          onSearch={handleSearch}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

        {/* 페이지 설정 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            페이지당
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="mx-2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
              <option value={100}>100개</option>
            </select>
            표시
          </div>
          {/* {error && (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded border border-red-200">
              {error}
            </div>
          )} */}
        </div>

        {/* 회원 테이블 */}
        <UsersTable
          users={users}
          currentPage={currentPage}
          pageSize={pageSize}
          isLoading={isLoading}
          onViewUser={handleUserDetail}
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
        />

        {/* 사용자 상세 모달 */}
        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          user={selectedUser}
          drivingRecords={drivingRecords}
          seedRecords={seedRecords}
          isLoading={
            isDetailLoading || isDrivingRecordsLoading || isSeedRecordsLoading
          }
          onDeleteUser={() => {
            if (selectedUser) {
              const userForDelete = {
                userId: selectedUser.userId,
                email: selectedUser.email,
                nickname: selectedUser.nickname,
                joinedAt: selectedUser.joinedAt,
                experience: selectedUser.experience,
                driveCount: selectedUser.driveCount,
                isActive: selectedUser.isActive,
              };
              handleDeleteUser(userForDelete);
            }
          }}
        />

        {/* 삭제 확인 모달 */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          userEmail={userToDelete?.email || ""}
          isLoading={isDeleting}
        />
      </div>
    </Layout>
  );
}
