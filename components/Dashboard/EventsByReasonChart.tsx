import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { EventByReason } from '@/types/eventsByReason';
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
            barThickness: 35,
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
                grid: {
                    drawBorder: false,
                },
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

    return (
        <div style={{width:"700px", height:"400px"}} >
            <Bar data={chartData} options={options} />
        </div>
    );
};
