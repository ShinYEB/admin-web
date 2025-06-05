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
    drivingRecords,
    seedRecords,
    isUserDetailLoading,
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
  const [selectedUser, setSelectedUser] = useState(null); // 상태 추가
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false); // 삭제 처리 상태 추가

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

      // 선택된 사용자 정보 저장
      setSelectedUser(user);

      // API 호출
      await fetchUserDetail(user.userId);
      await fetchUserDrives(user.userId);
      await fetchUserRewards(user.userId);

      // 모달 열기
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

  // 탈퇴 처리 핸들러 수정
  const handleDeleteUser = (user) => {
    if (!user) return;

    // 모달 상태 변경
    setIsDetailModalOpen(false);
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // 탈퇴 확인 핸들러 개선
  const handleConfirmDelete = async () => {
    if (!userToDelete || !userToDelete.userId) return;

    try {
      setIsDeleteProcessing(true);

      // 사용자 탈퇴 API 호출
      await deleteUser(userToDelete.userId);

      // 성공 처리
      alert('사용자가 성공적으로 탈퇴 처리되었습니다.');
      
      // 모달 닫기
      setIsDeleteModalOpen(false);
      setUserToDelete(null);

      // 현재 페이지 다시 로드
      fetchUsers({ page: currentPage, pageSize });
    } catch (error) {
      console.error("사용자 탈퇴 처리 중 오류:", error);
      
      // 사용자에게 오류 메시지 표시
      alert(`오류 발생: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
      
      // 403 오류(권한 부족)인 경우 로그인 화면으로 리디렉션
      if (error.message.includes('권한') || error.message.includes('403')) {
        if (confirm('세션이 만료되었거나 권한이 부족합니다. 로그인 화면으로 이동하시겠습니까?')) {
          authService.logout();
          router.push('/auth/login');
        }
      }
    } finally {
      setIsDeleteProcessing(false);
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
        user={selectedUser}
        drivingRecords={drivingRecords || []} // userStore 대신 위에서 가져온 값 사용
        seedRecords={seedRecords || []} // userStore 대신 위에서 가져온 값 사용
        isLoading={isUserDetailLoading} // userStore 대신 위에서 가져온 값 사용
        onDeleteUser={handleDeleteUser} // 이 함수를 반드시 전달해야 함
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
