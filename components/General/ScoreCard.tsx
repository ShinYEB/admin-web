import { ChevronRight } from 'lucide-react';
import {CircleProgress} from "@/components/General/CircleProgress";

export interface ScoreCardProps {
    score: number;
    color: string;
    bgColor: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
                                                        score,
                                                        color,
                                                        bgColor
                                                    }) => {
    return (
        <>
            <CircleProgress
                percentage={score}
                radius={36}
                color={color}
            />
            <p className="mt-2 text-sm font-medium text-gray-800 text-center leading-tight">
                {score}
            </p>
            <div className="absolute bottom-2 right-2 rounded-xl p-0.5">
                <ChevronRight size={16} color="#888" />
            </div>
        </>
    );
};
