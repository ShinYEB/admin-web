import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { UserTrendItem } from '@/types/userTrends';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UserTrendsChartProps {
  data: UserTrendItem[];
}

export const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
  console.log('UserTrendsChart - Received data:', data); // 디버깅용 로그
  
  // 데이터 검증 - 배열이 비어있을 때만 체크
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  // 데이터 가공
  const chartData = {
    labels: data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`),
    datasets: [
      {
        label: '활성 사용자',
        data: data.map(item => item.activeUsers),
        borderColor: '#38B2FF',
        backgroundColor: 'rgba(56, 178, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#38B2FF',
      },
      {
        label: '신규 가입자',
        data: data.map(item => item.newUsers),
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
      },
      {
        label: '이탈 사용자',
        data: data.map(item => item.churnedUsers),
        borderColor: '#F44336',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointBackgroundColor: '#F44336',
      },
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 20,
        },
      },
      tooltip: {
        intersect: false,
        mode: 'index' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        suggestedMax: 5, // 최소 Y축 최대값 설정
        ticks: {
          precision: 0,
          stepSize: 1,
          // 값이 0이어도 표시
          callback: function(value: any) {
            return value.toString();
          }
        },
        display: true,
      },
      x: {
        grid: {
          display: false,
        },
        display: true,
      },
    },
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};