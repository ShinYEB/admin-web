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
import { MonthlyDriveStats } from '@/types/monthlyDrives';

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

interface MonthlyDrivesChartProps {
  data: MonthlyDriveStats[];
}

export const MonthlyDrivesChart: React.FC<MonthlyDrivesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  // 데이터 가공
  const chartData = {
    // 월 이름 변환 (1 -> '1월', 2 -> '2월' 등)
    labels: data.map(item => `${item.month}월`),
    datasets: [{
      data: data.map(item => item.count),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4F46E5',
    }]
  };

  const options = {
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
        // grid 안에서 drawBorder 제거
        grid: {
          // drawBorder 속성 삭제
        },
        // 새로운 border 객체 추가
        border: {
          display: false,  // 이전의 drawBorder: false와 동일한 효과
        },
        ticks: {
          stepSize: 1,
          callback: function(value: number) {
            return value % 1 === 0 ? value : '';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        reverse: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};