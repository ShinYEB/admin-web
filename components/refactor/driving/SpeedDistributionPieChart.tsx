import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

// 타입 정의
interface SpeedMaintainItem {
    label: string;
    value: number;
    color: string;
}

interface SpeedDistributionPieChartProps {
    data: SpeedMaintainItem[];
    title: string;
    pieRadius?: number;
    pieInnerRadius?: number;
}

const SpeedDistributionPieChart: React.FC<SpeedDistributionPieChartProps> = ({
                                                                                 data,
                                                                                 title,
                                                                                 pieRadius = 120,
                                                                                 pieInnerRadius = 60
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
        labels: data.map(item => item.label),
        datasets: [
            {
                data: data.map(item => item.value),
                backgroundColor: data.map(item => item.color),
                borderColor: data.map(item => item.color),
                borderWidth: 2,
                hoverOffset: 4,
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
                callbacks: {
                    label: function(context: any) {
                        return `${context.label}: ${context.parsed}%`;
                    }
                }
            },
        },
        cutout: `${(pieInnerRadius / pieRadius) * 100}%`, // 도넛 차트 비율
    };

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                {title}
            </h3>

            <div className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl min-h-[250px] overflow-visible">
                {/* 파이 차트 컨테이너 */}
                <div className="relative" style={{ width: `${pieRadius * 2}px`, height: `${pieRadius * 2}px` }}>
                    <Doughnut data={chartData} options={options} />

                    {/* 중앙 라벨 */}
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-90 rounded-full p-2"
                        style={{
                            width: `${pieInnerRadius * 2}px`,
                            height: `${pieInnerRadius * 2}px`
                        }}
                    >
            <span className="text-base font-bold text-gray-800 text-center">
              주행 비율
            </span>
                    </div>
                </div>

                {/* 속도 정보 컨테이너 */}
                <div
                    className="mt-6 w-4/5 p-4 rounded-xl border"
                    style={{
                        backgroundColor: 'rgba(0, 122, 255, 0.05)',
                        borderColor: 'rgba(0, 122, 255, 0.2)'
                    }}
                >
                    <h4 className="text-base font-semibold text-gray-800 text-center mb-3">
                        주행 속도 분포
                    </h4>

                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center justify-between my-1.5"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600 flex-1 ml-2">
                {item.label}
              </span>
                            <span className="text-sm font-semibold text-gray-800">
                {item.value}%
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpeedDistributionPieChart;
