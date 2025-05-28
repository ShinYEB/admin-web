import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { GetServerSideProps } from 'next';

interface User {
  id: string;
  email: string;
  name?: string;
  joinDate: string;
  drivingExperience?: string;
  drivingScore: number;
  drivingCount: number;
  seedsEarned: number;
  status: 'active' | 'inactive';
}

interface DrivingRecord {
  date: string;
  distance: string;
  duration: string;
  event: string;
  seeds: number;
}

interface SeedRecord {
  type: string;
  date: string;
  amount: number;
}

interface UsersPageProps {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

const UsersPage: React.FC<UsersPageProps> = ({ users: initialUsers, totalUsers, currentPage, totalPages }) => {
  const [users] = useState(initialUsers);
  const [minScore, setMinScore] = useState<string>('0');
  const [maxScore, setMaxScore] = useState<string>('30');
  const [period, setPeriod] = useState<string>('전체');
  const [status, setStatus] = useState<string>('전체');
  
  // 모달 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('seeds'); // 'seeds' 또는 'driving'
  
  // 더미 운전 기록
  const dummyDrivingRecords: DrivingRecord[] = [
    { date: '2025-04-25', distance: '15.2km', duration: '32분', event: '없음', seeds: 120 },
    { date: '2025-04-23', distance: '8.7km', duration: '18분', event: '없음', seeds: 80 },
    { date: '2025-04-18', distance: '21.5km', duration: '45분', event: '급가속 1회', seeds: 130 },
  ];
  
  // 더미 씨앗 내역
  const dummySeedRecords: SeedRecord[] = [
    { type: '일반 운전 보상', date: '2025-04-25', amount: 120 },
    { type: '주행 거리 보상', date: '2025-04-23', amount: 80 },
    { type: '보상 사용 (기프트콘)', date: '2025-04-20', amount: -500 },
    { type: '환경 운전 보상', date: '2025-04-18', amount: 150 },
    { type: '주행 거리 보상', date: '2025-04-15', amount: 90 },
  ];
  
  const resetFilters = () => {
    setMinScore('0');
    setMaxScore('30');
    setPeriod('전체');
    setStatus('전체');
  };

  const applyFilters = () => {
    // 여기에 필터 적용 로직 구현 (API 호출 등)
    console.log('필터 적용:', { minScore, maxScore, period, status });
  };
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    // 실제 삭제 로직 구현
    console.log(`사용자 ${selectedUser?.id} 삭제 처리`);
    setShowDeleteModal(false);
  };

  return (
    <Layout title="회원 관리 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">회원 관리</h1>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">사용자 필터링</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="minScore" className="block text-sm font-medium text-gray-700 mb-1">운전 점수 (최소)</label>
              <input
                type="number"
                id="minScore"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-1">운전 점수 (최대)</label>
              <input
                type="number"
                id="maxScore"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">기간 설정</label>
              <select
                id="period"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="오늘">오늘</option>
                <option value="1주일">1주일</option>
                <option value="1개월">1개월</option>
                <option value="3개월">3개월</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="활성">활성</option>
                <option value="탈퇴">탈퇴</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium"
            >
              필터 적용
            </button>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 사용자 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">운전 점수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">운전 횟수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">적립 씨앗</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.drivingScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.drivingCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.seedsEarned.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '활성' : '탈퇴'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 bg-blue-50 rounded"
                      onClick={() => handleViewUser(user)}
                    >
                      보기
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded"
                      onClick={() => handleDeleteUser(user)}
                    >
                      탈퇴
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button className="px-2 py-1 rounded-md bg-gray-200 text-gray-600">
              &lt;
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">2</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">3</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">4</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">5</button>
            <button className="px-2 py-1 rounded-md bg-gray-200 text-gray-600">
              &gt;
            </button>
          </nav>
        </div>
      </div>

      {/* 사용자 상세 정보 모달 */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">사용자 상세 정보</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">회원 ID</p>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">이름</p>
                  <p className="font-medium">{selectedUser.name || '홍길동'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">가입일</p>
                  <p className="font-medium">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">운전 경력</p>
                  <p className="font-medium">{selectedUser.drivingExperience || '5년'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">운전 점수</p>
                  <p className="font-medium">{selectedUser.drivingScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">적립 씨앗</p>
                  <p className="font-medium">{selectedUser.seedsEarned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status === 'active' ? '활성' : '탈퇴'}
                  </span>
                </div>
              </div>

              {/* 탭 인터페이스 */}
              <div className="border-b mb-4">
                <div className="flex">
                  <button
                    className={`py-2 px-4 focus:outline-none ${
                      activeTab === 'seeds'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('seeds')}
                  >
                    씨앗 내역
                  </button>
                  <button
                    className={`py-2 px-4 focus:outline-none ${
                      activeTab === 'driving'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('driving')}
                  >
                    운전 기록
                  </button>
                </div>
              </div>

              {/* 탭 내용 */}
              {activeTab === 'seeds' ? (
                <div className="max-h-64 overflow-y-auto">
                  {dummySeedRecords.map((record, index) => (
                    <div key={index} className="py-3 border-b last:border-0 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-gray-500">{record.date}</p>
                      </div>
                      <span className={record.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        {record.amount > 0 ? `+${record.amount}` : record.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주행거리</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주행시간</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이벤트</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">획득 씨앗</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dummyDrivingRecords.map((record, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{record.date}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{record.distance}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{record.duration}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{record.event}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600">+{record.seeds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-4">회원 탈퇴 확인</h2>
              <p className="text-lg font-medium mb-2">{selectedUser.id} 회원을 정말 탈퇴 처리하시겠습니까?</p>
              <p className="text-gray-500 mb-4">이 작업은 되돌릴 수 없으며, 모든 사용자 데이터가 삭제됩니다.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                확인
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // 더미 데이터
  const mockUsers: User[] = [
    {
      id: 'MOD_1024',
      email: 'user1@example.com',
      joinDate: '2025-04-25',
      drivingScore: 42,
      drivingCount: 9,
      seedsEarned: 1820,
      status: 'active',
    },
    {
      id: 'MOD_1023',
      email: 'user2@example.com',
      joinDate: '2025-04-24',
      drivingScore: 27,
      drivingCount: 3,
      seedsEarned: 980,
      status: 'active',
    },
    {
      id: 'MOD_1022',
      email: 'user3@example.com',
      joinDate: '2025-04-23',
      drivingScore: 0,
      drivingCount: 1,
      seedsEarned: 0,
      status: 'inactive',
    },
    {
      id: 'MOD_1021',
      email: 'user4@example.com',
      joinDate: '2025-04-23',
      drivingScore: 15,
      drivingCount: 7,
      seedsEarned: 650,
      status: 'active',
    },
    {
      id: 'MOD_1020',
      email: 'user5@example.com',
      joinDate: '2025-04-22',
      drivingScore: 8,
      drivingCount: 2,
      seedsEarned: 320,
      status: 'inactive',
    },
    {
      id: 'MOD_1019',
      email: 'user6@example.com',
      joinDate: '2025-04-22',
      drivingScore: 31,
      drivingCount: 4,
      seedsEarned: 1240,
      status: 'active',
    },
    {
      id: 'MOD_1018',
      email: 'user7@example.com',
      joinDate: '2025-04-21',
      drivingScore: 5,
      drivingCount: 1,
      seedsEarned: 210,
      status: 'active',
    },
  ];

  return {
    props: {
      users: mockUsers,
      totalUsers: 50,
      currentPage: 1,
      totalPages: 5,
    },
  };
};

export default UsersPage;
