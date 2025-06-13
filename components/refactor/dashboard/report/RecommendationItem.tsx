import React from 'react';

interface RecommendationItemProps {
    index: number;
    text: string;
}

export default function RecommendationItem({
                                               index,
                                               text,
                                           }: RecommendationItemProps) {
    return (
        <div className="flex items-start gap-2.5">
            {/* 번호 원형 배지 */}
            <div className="w-5.5 h-5.5 rounded-full bg-indigo-100 flex justify-center items-center flex-shrink-0">
        <span className="text-indigo-600 font-bold text-xs">
          {index + 1}
        </span>
            </div>

            {/* 추천 텍스트 */}
            <p className="text-sm text-gray-800 leading-5 flex-1">
                {/* 강조 처리 - **로 둘러싸인 텍스트를 굵게 표시 */}
                {text.split('**').map((textPart, idx) =>
                        idx % 2 === 1 ? (
                            <span key={idx} className="text-black font-bold">
              {textPart}
            </span>
                        ) : (
                            <span key={idx}>{textPart}</span>
                        ),
                )}
            </p>
        </div>
    );
}
