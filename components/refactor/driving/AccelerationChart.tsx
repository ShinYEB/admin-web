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
import { Chart } from 'react-chartjs-2';

// Chart.js 등록
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

// 안전 관련 색상 정의 (SAFETY_COLORS 대체)
const SAFETY_COLORS = {
    chart: {
        grid: '#E2E8F0',
        purple: '#8B5CF6',
    },
};

interface AccelerationChartProps {
    data: {
        label: string;
        value: number;
        frontColor?: string;
    }[];
    title: string;
    height?: number;
}

const AccelerationChart: React.FC<AccelerationChartProps> = ({
                                                                 data,
                                                                 title,
                                                                 height = 200
                                                             }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                데이터가 없습니다.
            </div>
        );
    }

    // 차트 데이터 구성
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Values',
                data: data.map(item => item.value),
                backgroundColor: data.map(item => item.frontColor || '#8B5CF6'),
                borderColor: data.map(item => item.frontColor || '#8B5CF6'),
                borderWidth: 1,
                borderRadius: 10,
                barThickness: 30,
            },
            {
                type: 'line' as const,
                label: 'Trend',
                data: data.map(item => item.value),
                borderColor: SAFETY_COLORS.chart.purple,
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: SAFETY_COLORS.chart.purple,
                pointBorderColor: SAFETY_COLORS.chart.purple,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    // 차트 옵션
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
        },
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
                grid: {
                    color: SAFETY_COLORS.chart.grid,
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
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    };

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                {title}
            </h3>
            <div className="p-4 flex items-center justify-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl min-h-[250px]">
                <div
                    className="py-4 flex items-center justify-center w-full relative"
                    style={{ height: `${height}px` }}
                >
                    <Chart type="bar" data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default AccelerationChart;
