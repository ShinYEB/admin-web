import React, { useState, useEffect } from "react";
import { useUsers, useUserActions } from "@/store/useUserStore";
import Layout from "@/components/Layout/Layout";
import UsersTable from "@/components/users/UsersTable";
import UsersFilter from "@/components/users/UsersFilter";
import Pagination from "@/components/common/Pagination";
import UserDetailModal from "@/components/users/UserDetailModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";

export default function UsersPage() {
  // 스토어에서 사용자 데이터 및 액션 가져오기
  const {
    users,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    isLoading,
    error,
  } = useUsers();

  const {
    fetchUsers,
    setPage,
    setPageSize,
    clearFilters,
    clearErrors,
    fetchUserDetail,
    fetchUserDrives,
    fetchUserRewards,
    deleteUser,
  } = useUserActions();

  // 로컬 상태 관리
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [status, setStatus] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [accountAgeInMonths, setAccountAgeInMonths] = useState("");

  // 컴포넌트 마운트 시 사용자 목록 로드
  useEffect(() => {
    // 초기 데이터 로드
    fetchUsers({ page: 0, pageSize });

    // 컴포넌트 언마운트 시 필터와 에러 초기화
    return () => {
      clearFilters();
      clearErrors();
    };
  }, [fetchUsers, clearFilters, clearErrors, pageSize]);

  // 필터 적용
  const applyFilters = async () => {
    try {
      const filters = {
        page: 0,
        pageSize,
      };

      // 검색어가 있으면 추가
      if (searchKeyword) {
        filters.email = searchKeyword;
      }

      // 기타 필터 추가
      if (minExperience) {
        filters.minExperience = parseInt(minExperience);
      }

      if (maxExperience) {
        filters.maxExperience = parseInt(maxExperience);
      }

      if (accountAgeInMonths) {
        filters.accountAgeInMonths = parseInt(accountAgeInMonths);
      }

      // 상태값 활성/비활성 처리
      if (status !== "전체") {
        filters.active = status === "활성";
      }

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
    fetchUsers({ page: 0, pageSize });
  };

  // 사용자 상세 보기
  const handleUserDetail = async (user) => {
    try {
      if (!user || !user.userId) {
        console.error("유효하지 않은 사용자 정보:", user);
        return;
      }

      await fetchUserDetail(user.userId);
      await fetchUserDrives(user.userId);
      await fetchUserRewards(user.userId);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("사용자 상세 정보 로드 실패:", error);
    }
  };

  // 사용자 탈퇴 모달 열기
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // 사용자 탈퇴 처리
  const handleConfirmDelete = async () => {
    try {
      if (userToDelete && userToDelete.userId) {
        await deleteUser(userToDelete.userId);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        // 현재 페이지 다시 로드
        fetchUsers({ page: currentPage, pageSize });
      }
    } catch (error) {
      console.error("사용자 탈퇴 처리 중 오류:", error);
    }
  };

  return (
    <Layout title="회원 관리 | Modive 관리자">
      <div className="container mx-auto px-4 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원 관리</h1>
          <p className="text-sm text-gray-600">
            총 {totalElements?.toLocaleString() || "0"}명의 회원이 등록되어
            있습니다.
          </p>
        </div>

        {/* 필터 영역 */}
        <UsersFilter
          status={status}
          setStatus={setStatus}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          minExperience={minExperience}
          setMinExperience={setMinExperience}
          maxExperience={maxExperience}
          setMaxExperience={setMaxExperience}
          accountAgeInMonths={accountAgeInMonths}
          setAccountAgeInMonths={setAccountAgeInMonths}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

        {/* 에러 메시지 */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* 테이블 */}
            <UsersTable
              users={users || []}
              onUserDetail={handleUserDetail}
              onDeleteUser={handleDeleteClick}
              isLoading={isLoading}
            />

            {/* 페이지네이션 */}
            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
            )}
          </>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 사용자 탈퇴 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
      />
    </Layout>
  );
}
