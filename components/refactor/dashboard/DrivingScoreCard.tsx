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

export interface DrivingScoreCardProps {
    title: string;
    color: string;
    textColor: string;
    score: number;
    data: {
        value: number;
        color: string;
        label: { text: string };
    }[];
}

export default function DrivingScoreCard({
                                             title,
                                             color,
                                             textColor,
                                             score,
                                             data,
                                         }: DrivingScoreCardProps) {
    // Chart.js 데이터 구성
    const chartData = {
        datasets: [
            {
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color),
                borderWidth: 0,
                cutout: '70%', // 도넛 차트의 중앙 구멍 크기
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // 커스텀 범례를 사용하므로 비활성화
            },
            tooltip: {
                enabled: false, // 툴팁 비활성화
            },
        },
    };

    return (
        <div
            className="w-[48%] rounded-2xl border flex flex-col"
            style={{ borderColor: color }}
        >
            {/* 카드 제목 */}
            <div
                className="font-bold text-sm text-gray-800 p-3 rounded-t-2xl"
                style={{ backgroundColor: color }}
            >
                {title}
            </div>

            {/* 카드 내용 */}
            <div className="flex-1 flex flex-col justify-between p-3">
                {/* 점수 차트 */}
                <div className="flex justify-center items-center relative">
                    <div className="w-25 h-25 relative">
                        <Doughnut data={chartData} options={options} />
                        {/* 중앙 점수 텍스트 */}
                        <div className="absolute inset-0 flex justify-center items-center">
              <span
                  className="text-lg font-bold"
                  style={{ color: textColor }}
              >
                {score.toFixed(2)}
              </span>
                        </div>
                    </div>
                </div>

                {/* 범례 */}
                <div className="mt-2.5">
                    {data.map((d, idx) => (
                        <div key={idx} className="flex items-center mb-1">
                            <div
                                className="w-2.5 h-2.5 rounded-full mr-1.5"
                                style={{ backgroundColor: d.color }}
                            />
                            <span className="text-xs text-gray-700">
                {d.label.text}: {d.value}점
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
