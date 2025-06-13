import React, { useEffect, useState } from 'react';
import useRewardHistoryStore from '@/store/useRewardHistoryStore';
import { RewardFilterOptions, RewardHistoryItem } from '@/types/rewardHistory';

// Mock 데이터 업데이트: email → userId로 변경
const mockRewardData: RewardHistoryItem[] = [
  {
    rewardId: 'SEED_1024',
    userId: '1', // email → userId로 변경
    issuedDate: '2025-04-25',
    reason: '안전 주행',
    amount: 120
  },
  {
    rewardId: 'SEED_1023',
    userId: '2', // email → userId로 변경
    issuedDate: '2025-04-24',
    reason: '예고 주행',
    amount: 85
  },
  {
    rewardId: 'SEED_1022',
    userId: '6', // email → userId로 변경
    issuedDate: '2025-04-24',
    reason: '출석 체크',
    amount: 50
  },
  {
    rewardId: 'SEED_1021',
    userId: '4', // email → userId로 변경
    issuedDate: '2025-04-23',
    reason: '이벤트 참여',
    amount: 200
  },
  {
    rewardId: 'SEED_1020',
    userId: '1', // email → userId로 변경
    issuedDate: '2025-04-22',
    reason: '안전 주행',
    amount: 95
  }
];

const RewardHistory = () => {
  const {
    rewardHistory: apiRewardHistory,
    pageInfo,
    filterOptions,
    isLoading,
    error,
    fetchRewardHistory,
    filterRewards,
    resetFilter,
  } = useRewardHistoryStore();
  
  // API 데이터 또는 Mock 데이터를 저장할 상태
  const [displayData, setDisplayData] = useState<RewardHistoryItem[]>([]);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  
  const [filterForm, setFilterForm] = useState<Partial<RewardFilterOptions>>({
    email: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRewardHistory();
      } catch (err) {
        console.log('API 연결 실패, Mock 데이터를 사용합니다.', err);
        setUsingMockData(true);
      }
    };
    
    loadData();
  }, [fetchRewardHistory]);
  
  // API 데이터 또는 Mock 데이터 설정
  useEffect(() => {
    if (error || (!apiRewardHistory || apiRewardHistory.length === 0)) {
      console.log('API 데이터 없음, Mock 데이터를 사용합니다.');
      setDisplayData(mockRewardData);
      setUsingMockData(true);
    } else {
      setDisplayData(apiRewardHistory);
      setUsingMockData(false);
    }
  }, [apiRewardHistory, error]);

  // w-full 클래스 추가하여 전체 너비 사용
  return (
    <div className="w-full mt-2">
      {/* 로딩 상태 */}
      {isLoading && <p className="text-gray-500">데이터를 불러오는 중입니다...</p>}
      
      {/* Mock 데이터 사용 시 알림 */}
      {usingMockData && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded-md w-full">
          <p className="text-yellow-800 text-sm">
            ⚠️ API 연결이 없어 Mock 데이터를 표시합니다.
          </p>
        </div>
      )}
      
      {/* 씨앗 발급 내역 테이블 - 항상 display 데이터 사용 */}
      {!isLoading && displayData && displayData.length > 0 && (
        <div className="w-full overflow-hidden">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자 ID 
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발급 사유
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수량
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayData.map((item) => (
                <tr key={item.rewardId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rewardId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userId || '미지정'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.issuedDate || item.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reason || '미지정'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 데이터가 없을 경우 */}
      {!isLoading && (!displayData || displayData.length === 0) && (
        <p className="text-gray-500 w-full text-center">표시할 씨앗 발급 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default RewardHistory;