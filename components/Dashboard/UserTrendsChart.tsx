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

export interface UserTrendItem {
    year: number;
    month: number;
    newUsers: number;
    activeUsers: number;
    churnedUsers: number;
}

interface UserTrendsChartProps {
    data: UserTrendItem[];
}

export const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                데이터가 없습니다.
            </div>
        );
    }

    // 데이터 가공
    const chartData = {
        // 월 포맷팅 (yyyy-mm 형식)
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
                position: "bottom" as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                border: {
                    display: false,
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
                border: {
                    display: false,
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};
