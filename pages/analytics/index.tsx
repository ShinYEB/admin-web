import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card } from '@/components/UI/Card';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format } from 'date-fns';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 더미 데이터
const statsData = [
  { title: '총 씨앗 발급', value: '1,247,890', increase: '3.2%' },
  { title: '이번 달 씨앗 발급', value: '20,700', increase: '12.5%' },
  { title: '월간 활동 참여자', value: '730', increase: '5.8%' },
  { title: '월간 콘텐츠 사용', value: '158', increase: '2.1%' },
];

const seedIssuanceData = [
  { id: 'SEED_1024', user: 'user1@example.com', date: '2025-04-25', reason: '일반 주행', amount: 120 },
  { id: 'SEED_1023', user: 'user2@example.com', date: '2025-04-24', reason: '에코 주행', amount: 85 },
  { id: 'SEED_1022', user: 'user6@example.com', date: '2025-04-24', reason: '출석 체크', amount: 50 },
  { id: 'SEED_1021', user: 'user4@example.com', date: '2025-04-23', reason: '이벤트 참여', amount: 200 },
  { id: 'SEED_1020', user: 'user1@example.com', date: '2025-04-22', reason: '일반 주행', amount: 95 },
];

const monthlyData = {
  labels: ['10월', '11월', '12월', '01월', '02월', '03월', '04월'],
  data: [10800, 13800, 15200, 14300, 16800, 18500, 20700],
};

const reasonRatioData = {
  labels: ['출석체크', '주행 중 (10%)', '주행완료', '친기초펑 이벤트', '친환경 설문'],
  data: [51.6, 21, 12, 8.4, 7],
  backgroundColor: ['#FF7043', '#4CAF50', '#42A5F5', '#FFD54F', '#E57373'],
};

const AnalyticsPage = () => {
  // 필터 상태 
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  
  // 필터링된 데이터
  const filteredData = seedIssuanceData.filter(item => {
    return (
      (userFilter === '' || item.user.includes(userFilter)) &&
      (dateFilter === '' || item.date === dateFilter) &&
      (reasonFilter === '' || item.reason === reasonFilter)
    );
  });

  return (
    <Layout title="씨앗 내역 통계 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">씨앗 내역 통계</h1>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-bold">{stat.value}</p>
                <span className="text-sm text-green-500">▲ {stat.increase} 증가</span>
              </div>
            </Card>
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 발급 사유별 비율 및 건수 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">발급 사유별 비율 및 건수</h2>
              <div className="flex space-x-2">
                <button className="text-sm bg-blue-500 text-white px-2 py-1 rounded">종합</button>
                <button className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">월별</button>
              </div>
            </div>
            <div className="h-64 flex justify-center">
              <Doughnut
                data={{
                  labels: reasonRatioData.labels,
                  datasets: [
                    {
                      data: reasonRatioData.data,
                      backgroundColor: reasonRatioData.backgroundColor,
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                      },
                    },
                  },
                  cutout: '70%',
                }}
              />
            </div>
          </Card>

          {/* 월별 씨앗 지급 추이 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">월별 씨앗 지급 추이</h2>
              <div className="flex space-x-2">
                <button className="text-sm bg-blue-500 text-white px-2 py-1 rounded">최근 6개월</button>
                <button className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">1년</button>
              </div>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels: monthlyData.labels,
                  datasets: [
                    {
                      label: '씨앗 발급량',
                      data: monthlyData.data,
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.3,
                      fill: true,
                      pointBackgroundColor: '#3B82F6',
                      pointRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        {/* 최근 씨앗 발급 내역 */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">최근 씨앗 발급 내역</h2>
            <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded">수정</button>
          </div>

          {/* 필터 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="userFilter" className="block text-sm font-medium text-gray-700 mb-1">사용자</label>
              <input
                type="text"
                id="userFilter"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="이메일로 검색"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">발급일</label>
              <input
                type="date"
                id="dateFilter"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="reasonFilter" className="block text-sm font-medium text-gray-700 mb-1">발급 사유</label>
              <select
                id="reasonFilter"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="">전체</option>
                <option value="일반 주행">일반 주행</option>
                <option value="에코 주행">에코 주행</option>
                <option value="출석 체크">출석 체크</option>
                <option value="이벤트 참여">이벤트 참여</option>
              </select>
            </div>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    씨앗 ID
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
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-center space-x-1 mt-4">
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              &lt;
            </button>
            <button className="px-2 py-1 bg-blue-500 text-white border border-blue-500 rounded-md text-sm">
              1
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              2
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              3
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              4
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              5
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-sm">
              &gt;
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;