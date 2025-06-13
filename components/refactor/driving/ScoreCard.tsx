import React from 'react';
import { ChevronRight } from 'lucide-react';
import CircleChart from './CircleChart'; // 이전에 변환한 CircleChart 사용

// 타입 정의
interface DrivingScoreItem {
    name: string;
    value: number;
    color: string;
}

interface ScoreCardProps {
    score: DrivingScoreItem;
    bgColor: string;
    onPress: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
                                                 score,
                                                 bgColor,
                                                 onPress
                                             }) => {
    return (
        <button
            className="w-[48%] flex flex-col items-center py-3 rounded-xl shadow-sm mb-4 relative hover:shadow-md active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{ backgroundColor: bgColor }}
            onClick={onPress}
            aria-label={`${score.name}: ${Math.round(score.value)}%`}
            type="button"
        >
            {/* 원형 차트 */}
            <CircleChart
                percentage={score.value}
                radius={36}
                color={score.color}
            />

            {/* 라벨 */}
            <p
                className="mt-2 text-sm font-medium text-gray-800 text-center leading-tight"
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {score.name}
            </p>

            {/* 화살표 아이콘 */}
            <div className="absolute bottom-2 right-2 rounded-xl p-0.5">
                <ChevronRight size={16} color="#888" />
            </div>
        </button>
    );
};

export default ScoreCard;
