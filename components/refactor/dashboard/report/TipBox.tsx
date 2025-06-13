import React from 'react';
import { Lightbulb } from 'lucide-react';
import RecommendationItem from './RecommendationItem';

export type DrivingTip = {
    text: string;
};

export type DrivingRecommendations = {
    summary: string;
    tips: DrivingTip[];
};


interface TipBoxProps {
    recommendations: DrivingRecommendations;
}

export default function TipBox({ recommendations }: TipBoxProps) {
    return (
        <div className="bg-blue-50 space-y-3 p-4 rounded-xl">
            {/* 제목 */}
            <div className="flex items-center gap-1.5">
                <Lightbulb size={24} className="text-indigo-600" />
                <h3 className="text-base font-bold text-gray-900">
                    연비 향상을 위한 맞춤 조언
                </h3>
            </div>

            {/* 요약 문단 */}
            <p className="text-sm leading-5 text-gray-700">
                {recommendations.summary}
            </p>

            {/* 팁 리스트 */}
            <div className="space-y-3">
                {recommendations.tips.map((tip, index) => (
                    <RecommendationItem key={index} index={index} text={tip.text} />
                ))}
            </div>
        </div>
    );
}
