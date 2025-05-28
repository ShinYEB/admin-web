import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 더미 데이터
const statCards = [
  { title: '총 사용자 수', value: '8,249', increase: '3.1%' },
  { title: '디바이스 수', value: '7,842', increase: '2.5%' },
  { title: '누적 운전 횟수', value: '164,372', increase: '12.8%' },
  { title: '누적 적립 씨앗', value: '1,247,890', increase: '7.6%' },
];

const monthlyCounts = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
  datasets: [
    {
      data: [12000, 14500, 13500, 15500, 17000, 18000, 19500, 20000, 21500, 23000],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4F46E5',
    },
  ],
};

const eventTypeData = {
  labels: ['급가속', '급감속', '과속', '급회전', '장시간 운전'],
  datasets: [
    {
      data: [1800, 2400, 3050, 900, 1400],
      backgroundColor: ['#FF6B8A', '#38B2FF', '#FFCE45', '#67CDB0', '#AB7AFF'],
      barThickness: 35,
    },
  ],
};

const focusMetrics = [
  { label: '지난 주 신규 가입자', value: '245' },
  { label: '전월 대비 사용자 증가율', value: '14.2%' },
  { label: '이탈률', value: '3.5%' },
];

const trendData = {
  labels: ['2025-11', '2025-12', '2025-01', '2025-02', '2025-03', '2025-04'],
  datasets: [
    {
      label: '전체 사용자',
      data: [1250, 1400, 1650, 2000, 2300, 2600],
      borderColor: '#38B2FF',
      backgroundColor: 'rgba(56, 178, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#38B2FF',
    },
    {
      label: '신규 가입자',
      data: [450, 500, 550, 600, 650, 800],
      borderColor: '#4CAF50',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointBackgroundColor: '#4CAF50',
    },
    {
      label: '이탈 사용자',
      data: [100, 110, 115, 120, 125, 130],
      borderColor: '#F44336',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointBackgroundColor: '#F44336',
    },
  ],
};

const Dashboard = () => {
  return (
    <Layout title="대시보드 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">대시보드</h1>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-bold">{card.value}</p>
                <span className="text-sm text-green-500">▲ {card.increase} 증가</span>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 월별 운전 횟수 추이 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">월별 운전 횟수 추이</h2>
            <div className="h-64">
              <Line
                data={{
                  labels: monthlyCounts.labels,
                  datasets: monthlyCounts.datasets,
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* 이벤트 유형별 추이 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">이벤트 유형별 추이</h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: eventTypeData.labels,
                  datasets: eventTypeData.datasets,
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* 사용자 중점 추이 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-6">사용자 중점 추이</h2>
          
          {/* 메트릭 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {focusMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
          
          {/* 트렌드 라인 차트 */}
          <div className="h-72">
            <Line
              data={{
                labels: trendData.labels,
                datasets: trendData.datasets,
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      boxWidth: 6,
                      padding: 20,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
