import React, { useEffect, useState } from 'react';
import useRewardHistoryStore from '@/store/useRewardHistoryStore';
import { RewardFilterOptions } from '@/types/rewardHistory';

const RewardHistory = () => {
  const {
    rewardHistory,
    pageInfo,
    filterOptions,
    isLoading,
    error,
    fetchRewardHistory,
    filterRewards,
    resetFilter,
  } = useRewardHistoryStore();
  
  const [filterForm, setFilterForm] = useState<Partial<RewardFilterOptions>>({
    email: '',
    reason: '',
    startDate: '',
    endDate: '',
  });
  
  // 처음 로드될 때와 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchRewardHistory();
  }, [fetchRewardHistory]);
  
  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    filterRewards({ page: newPage });
  };
  
  // 필터 적용
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    filterRewards({ ...filterForm, page: 1 });
  };
  
  // 필터 초기화
  const handleResetFilter = () => {
    setFilterForm({
      email: '',
      reason: '',
      startDate: '',
      endDate: '',
    });
    resetFilter();
  };
  
  // 필터 폼 변경 처리
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({ ...prev, [name]: value }));
  };
  
  // 발급 사유 목록 (예시)
  const reasonOptions = [
    { value: '', label: '전체' },
    { value: '안전 주행', label: '안전 주행' },
    { value: '에코 주행', label: '에코 주행' },
    { value: '출석 체크', label: '출석 체크' },
    { value: '이벤트 미발생', label: '이벤트 미발생' },
    { value: '미션 달성', label: '미션 달성' },
  ];
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">최근 씨앗 발급내역</h2>
      
      {/* 필터링 폼 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <form onSubmit={handleApplyFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 사용자 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용자 이메일</label>
            <input
              type="text"
              name="email"
              value={filterForm.email}
              onChange={handleFilterChange}
              placeholder="이메일 입력"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* 발급 사유 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발급 사유</label>
            <select
              name="reason"
              value={filterForm.reason}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {reasonOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* 발급일 필터 (시작) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발급일 (시작)</label>
            <input
              type="date"
              name="startDate"
              value={filterForm.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* 발급일 필터 (끝) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발급일 (끝)</label>
            <input
              type="date"
              name="endDate"
              value={filterForm.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* 필터 버튼 */}
          <div className="md:col-span-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              초기화
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              필터 적용
            </button>
          </div>
        </form>
      </div>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {!isLoading && error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchRewardHistory()} 
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            다시 시도
          </button>
        </div>
      )}
      
      {/* 씨앗 발급 내역 테이블 */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급 사유
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급량
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewardHistory.length > 0 ? (
                rewardHistory.map((item) => (
                  <tr key={item.rewardId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.rewardId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.email || item.userId || '알 수 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.issuedDate || item.createdAt || '알 수 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reason || item.description || '알 수 없음'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {item.amount} 씨앗
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 페이지네이션 */}
      {!isLoading && !error && pageInfo && (
        <div className="flex justify-center items-center mt-4 space-x-1">
          {/* 처음 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={pageInfo.currentPage === 1}
            className={`px-3 py-1 rounded ${
              pageInfo.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            &lt;&lt;
          </button>
          
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(pageInfo.currentPage - 1)}
            disabled={pageInfo.currentPage === 1}
            className={`px-3 py-1 rounded ${
              pageInfo.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            &lt;
          </button>
          
          {/* 페이지 번호 */}
          {Array.from({ length: Math.min(5, pageInfo.totalPages) }, (_, i) => {
            // 현재 페이지를 중심으로 표시할 페이지 범위 계산
            const startPage = Math.max(
              1,
              pageInfo.currentPage - 2
            );
            const pageNum = startPage + i;
            
            if (pageNum <= pageInfo.totalPages) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    pageNum === pageInfo.currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
          
          {/* 다음 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(pageInfo.currentPage + 1)}
            disabled={pageInfo.currentPage === pageInfo.totalPages}
            className={`px-3 py-1 rounded ${
              pageInfo.currentPage === pageInfo.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            &gt;
          </button>
          
          {/* 마지막 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(pageInfo.totalPages)}
            disabled={pageInfo.currentPage === pageInfo.totalPages}
            className={`px-3 py-1 rounded ${
              pageInfo.currentPage === pageInfo.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardHistory;