import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { EventByReason } from '@/types/eventsByReason';  // 이 임포트를 유지합니다
import Card from '../UI/Card';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// 이벤트 유형별 색상
const eventColors = ['#FF6B8A', '#38B2FF', '#FFCE45', '#67CDB0', '#AB7AFF', '#FF9F40', '#5D87FF'];

interface EventsByReasonChartProps {
    data: EventByReason[];
}

export const EventsByReasonChart: React.FC<EventsByReasonChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                데이터가 없습니다.
            </div>
        );
    }

    // 데이터 가공
    const chartData = {
        labels: data.map(item => item.reason == null ? item.type : item.reason),
        datasets: [{
            data: data.map(item => item.count == null? item.frequency : item.count),
            backgroundColor: data.map((_, index) => eventColors[index % eventColors.length]),
            barThickness: 30,
        }]
    };

    // 차트 옵션
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
                ticks: {
                    stepSize: 1,
                    callback: function (value: number) {  // 'number' 타입 명시
                        return value % 1 === 0 ? value : '';
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-full" style={{ minHeight: '250px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};
