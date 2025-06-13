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
interface TurningDataItem {
    name: string;
    value: number;
    color: string;
}

interface TurningChartProps {
    data: TurningDataItem[];
    title: string;
    pieRadius?: number;
    pieInnerRadius?: number;
}

const TurningChart: React.FC<TurningChartProps> = ({
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
        labels: data.map(item => item.name),
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
        onHover: (event: any, activeElements: any) => {
            event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        },
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
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white bg-opacity-90 rounded-full p-2 shadow-sm"
                        style={{
                            width: `${pieInnerRadius * 2}px`,
                            height: `${pieInnerRadius * 2}px`,
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                    >
            <span className="text-base font-bold text-gray-800 text-center">
              회전 비율
            </span>
                    </div>
                </div>

                {/* 범례 컨테이너 */}
                <div className="flex flex-row justify-evenly flex-wrap mt-6 w-full">
                    {data.map((item, index) => (
                        <div
                            key={index}
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
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-semibold text-gray-800">
                {item.name}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TurningChart;
