import React from 'react';

export type AnalysisDataItem = {
    label: string;
    value: number;
    color: string;
};

interface AnalysisChartProps {
    chartData: AnalysisDataItem[];
}

export default function AnalysisChart({ chartData }: AnalysisChartProps) {
    return (
        <div className="space-y-4">
            {/* 차트 제목 */}
            <div className="text-center">
                <h4 className="text-sm font-bold mt-2.5 mb-1.5 text-gray-900">
                    연비 영향 요소 분석
                </h4>
            </div>

            {/* 차트 데이터 항목들 */}
            <div className="space-y-3">
                {chartData.map((item, index) => (
                    <div key={index} className="space-y-1">
                        {/* 라벨과 값 */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className="text-sm text-gray-600">{item.value}%</span>
                        </div>

                        {/* 진행률 바 */}
                        <div className="relative h-2.5 bg-gray-300 rounded-md overflow-hidden">
                            <div
                                className="h-full rounded-md transition-all duration-300 ease-out"
                                style={{
                                    backgroundColor: item.color,
                                    width: `${Math.min(item.value, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
