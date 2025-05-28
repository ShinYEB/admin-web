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
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
