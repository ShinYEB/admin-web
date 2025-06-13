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

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// 타입 정의
interface IdlingEvent {
    duration: number;
    label: string;
    startTime: string;
    endTime: string;
}

// CARBON_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const CARBON_COLORS = {
    chart: {
        grid: '#E2E8F0',
        lightGrid: '#F7FAFC',
        blue: '#007AFF',
    },
    gradient: {
        blueEnd: '#0066CC',
    },
};

interface IdlingBarChartProps {
    events: IdlingEvent[];
    title: string;
    height?: number;
}

const IdlingBarChart: React.FC<IdlingBarChartProps> = ({
                                                           events,
                                                           title,
                                                           height = 200
                                                       }) => {
    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                데이터가 없습니다.
            </div>
        );
    }

    // 차트 데이터 구성
    const chartData = {
        labels: events.map(item => item.label),
        datasets: [
            {
                label: '아이들링 시간 (분)',
                data: events.map(item => item.duration),
                backgroundColor: `${CARBON_COLORS.chart.blue}DD`,
                borderColor: CARBON_COLORS.chart.blue,
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    // 차트 옵션 (수평 막대 차트)
    const options = {
        indexAxis: 'y' as const, // 수평 막대 차트
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.parsed.x.toFixed(1)}분`;
                    }
                }
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: Math.max(...events.map(item => item.duration)) * 1.2,
                grid: {
                    color: CARBON_COLORS.chart.lightGrid,
                    display: false,
                },
                ticks: {
                    callback: function(value: any) {
                        return `${value.toFixed(1)}분`;
                    },
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
            },
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
                    color: '#4A5568',
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
            },
        },
    };

    const chartHeight = events.length * 50 + 50;

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                {title}
            </h3>

            <div
                className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl overflow-visible"
                style={{ minHeight: `${events.length * 50 + 30}px` }}
            >
                {/* 차트 콘텐츠 */}
                <div className="py-4 flex items-center w-full relative overflow-visible">
                    <div style={{ height: `${chartHeight}px`, width: '100%' }}>
                        <Bar data={chartData} options={options} />
                    </div>
                </div>

                {/* 아이들링 타임라인 정보 */}
                <div
                    className="mt-5 w-full p-4 rounded-xl border"
                    style={{
                        backgroundColor: 'rgba(0, 122, 255, 0.05)',
                        borderColor: 'rgba(0, 122, 255, 0.2)'
                    }}
                >
                    {events.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-row justify-between items-center py-1.5 border-b border-gray-300 border-opacity-30"
                        >
              <span className="text-sm font-semibold text-gray-600 w-[30%]">
                {item.label}:
              </span>
                            <span className="text-sm text-gray-800 w-[70%] text-right">
                {item.startTime} ~ {item.endTime}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IdlingBarChart;
