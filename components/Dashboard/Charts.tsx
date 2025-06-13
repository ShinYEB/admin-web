import React from 'react';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DailyStatsChartProps {
  data: {
    date: string;
    userCount: number;
    driveCount: number;
  }[];
}

export const DailyStatsChart: React.FC<DailyStatsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: '신규 사용자',
        data: data.map(item => item.userCount),
        borderColor: '#4945FF',
        backgroundColor: '#4945FF20',
        tension: 0.1,
      },
      {
        label: '주행 횟수',
        data: data.map(item => item.driveCount),
        borderColor: '#BB27FF',
        backgroundColor: '#BB27FF20',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

interface ScoreDistributionChartProps {
  data: {
    scoreRange: string;
    count: number;
  }[];
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.scoreRange),
    datasets: [
      {
        label: '사용자 수',
        data: data.map(item => item.count),
        backgroundColor: [
          '#FF5252',
          '#FFA726',
          '#FFD927',
          '#4ECD7B',
          '#4945FF',
        ],
        borderColor: [
          '#FF5252',
          '#FFA726',
          '#FFD927',
          '#4ECD7B',
          '#4945FF',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// 월별 운전 횟수 차트
interface MonthlyDriveStats {
  year: number;
  month: number;
  count: number;
}

interface MonthlyDrivesChartProps {
  data: MonthlyDriveStats[];
}

export const MonthlyDrivesChart: React.FC<MonthlyDrivesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => `${item.year}.${item.month.toString().padStart(2, '0')}`),
    datasets: [
      {
        label: '월별 운전 횟수',
        data: data.map(item => item.count),
        borderColor: '#4945FF',
        backgroundColor: '#4945FF20',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// 이벤트 유형별 차트 (Y축 정수로 설정)
interface EventByReason {
  reason: string;
  count: number;
}

interface EventsByReasonChartProps {
  data: EventByReason[];
}

export const EventsByReasonChart: React.FC<EventsByReasonChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.reason),
    datasets: [
      {
        label: '이벤트 발생 횟수',
        data: data.map(item => item.count),
        backgroundColor: [
          '#FF5252',
          '#FFA726',
          '#FFD927',
          '#4ECD7B',
        ],
        borderColor: [
          '#FF5252',
          '#FFA726',
          '#FFD927',
          '#4ECD7B',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // 1 단위로 증가
          callback: function(value: any) {
            // 정수만 표시
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
