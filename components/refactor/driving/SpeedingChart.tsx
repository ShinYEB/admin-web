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

// SAFETY_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const SAFETY_COLORS = {
    primary: '#68D392',
    chart: {
        grid: '#E5E7EB',
        lightGrid: '#F3F4F6',
        green: '#68D392',
        red: '#EF4444',
    },
};

interface SpeedingChartProps {
    data: {
        value: number;
        label?: string;
    }[];
    title: string;
    speedLimit: number;
    height?: number;
    width?: number;
}

const SpeedingChart: React.FC<SpeedingChartProps> = ({
                                                         data,
                                                         title,
                                                         speedLimit,
                                                         height = 200,
                                                         width = 300
                                                     }) => {
    // 빈 데이터 처리
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                데이터가 없습니다.
            </div>
        );
    }

    // Chart.js 데이터 구성
    const chartData = {
        labels: data.map((_, index) => `${index + 1}`), // 시간 구간
        datasets: [
            {
                label: '주행 속도',
                data: data.map(item => item.value),
                borderColor: SAFETY_COLORS.primary,
                backgroundColor: 'rgba(104, 211, 146, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4, // 곡선 효과
                pointBackgroundColor: SAFETY_COLORS.primary,
                pointBorderColor: SAFETY_COLORS.primary,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            // 제한속도 라인 (별도 데이터셋)
            {
                label: '제한속도',
                data: data.map(() => speedLimit),
                borderColor: SAFETY_COLORS.chart.red,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5], // 점선 효과
                fill: false,
                pointRadius: 0, // 포인트 숨기기
                pointHoverRadius: 0,
            },
        ],
    };

    // Chart.js 옵션
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
        },
        plugins: {
            legend: {
                display: false, // 커스텀 범례 사용
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#2D3748',
                bodyColor: '#2D3748',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                callbacks: {
                    label: function(context: any) {
                        if (context.datasetIndex === 0) { // 주행 속도만 표시
                            const value = context.parsed.y;
                            const isOverLimit = value > speedLimit;
                            return `${value} km/h${isOverLimit ? ' (제한속도 초과)' : ''}`;
                        }
                        return null;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 150,
                grid: {
                    color: SAFETY_COLORS.chart.grid,
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 25,
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                    callback: function(value: any) {
                        return value;
                    }
                },
                title: {
                    display: true,
                    text: '속도 (km/h)',
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
            },
            x: {
                grid: {
                    color: SAFETY_COLORS.chart.lightGrid,
                    drawBorder: false,
                },
                ticks: {
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
                title: {
                    display: true,
                    text: '시간 구간',
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        hover: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                {title}
            </h3>

            <div
                className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl overflow-visible"
                style={{ minHeight: `${height + 40}px` }}
            >
                <div className="py-4 flex items-center w-full relative overflow-visible">
                    <div style={{ height: `${height}px`, width: '100%' }}>
                        <Line data={chartData} options={options} />
                    </div>
                </div>
            </div>

            {/* 범례 */}
            <div className="flex flex-row justify-evenly flex-wrap mt-6 w-full">
                <div
                    className="flex flex-row items-center mx-3 my-2 bg-gray-50 bg-opacity-90 py-2 px-3.5 rounded-2xl shadow-sm border border-gray-50"
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2
                    }}
                >
                    <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: SAFETY_COLORS.chart.green }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: '#2D3748' }}
                    >
            평균 속도
          </span>
                </div>

                <div
                    className="flex flex-row items-center mx-3 my-2 bg-gray-50 bg-opacity-90 py-2 px-3.5 rounded-2xl shadow-sm border border-gray-50"
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2
                    }}
                >
                    <div
                        className="w-3 h-0.5 mr-1.5"
                        style={{ backgroundColor: SAFETY_COLORS.chart.red }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: '#2D3748' }}
                    >
            제한 속도
          </span>
                </div>

                <div
                    className="flex flex-row items-center mx-3 my-2 bg-gray-50 bg-opacity-90 py-2 px-3.5 rounded-2xl shadow-sm border border-gray-50"
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2
                    }}
                >
          <span
              className="text-sm font-semibold"
              style={{ color: '#2D3748' }}
          >
            ※ 가로축: 시간 구간
          </span>
                </div>
            </div>
        </div>
    );
};

export default SpeedingChart;
