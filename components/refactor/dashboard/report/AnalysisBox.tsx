import React from 'react';
import { BarChart3 } from 'lucide-react';
import AnalysisChart from './AnalysisChart';

export type AnalysisDataItem = {
    label: string;
    value: number;
    color: string;
};

export type DrivingAnalysis = {
    title: string;
    summary: string;
    data: AnalysisDataItem[];
};

interface AnalysisBoxProps {
    analysis: DrivingAnalysis;
}

export default function AnalysisBox({ analysis }: AnalysisBoxProps) {
    return (
        <div className="bg-blue-50 space-y-3 p-4 rounded-xl">
            {/* 분석 제목 */}
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={24} className="text-indigo-600" />
                {analysis.title}
            </h3>

            {/* 요약 텍스트 */}
            <p className="text-sm leading-5 text-gray-700">
                {analysis.summary}
            </p>

            {/* 분석 차트 */}
            <AnalysisChart chartData={analysis.data} />
        </div>
    );
}
