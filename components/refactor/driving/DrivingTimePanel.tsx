import React from 'react';
import { Clock, Info, CheckCircle } from 'lucide-react';

// 타입 정의
interface DrivingSession {
    durationHours?: number;
    formattedStartTime?: string;
    formattedEndTime?: string;
    progress?: number;
}

// HorizontalProgressBar 컴포넌트
interface HorizontalProgressBarProps {
    progress: number;
    width: number;
    height: number;
    color: string;
    backgroundColor: string;
    useGradient?: boolean;
    gradientColors?: string[];
    style?: React.CSSProperties;
}

const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
                                                                         progress,
                                                                         width,
                                                                         height,
                                                                         color,
                                                                         backgroundColor,
                                                                         useGradient = false,
                                                                         gradientColors = [],
                                                                         style = {}
                                                                     }) => {
    const progressWidth = (progress / 100) * width;

    const gradientStyle = useGradient && gradientColors.length > 0
        ? {
            background: `linear-gradient(to right, ${gradientColors.join(', ')})`
        }
        : {
            backgroundColor: color
        };

    return (
        <div
            className="relative rounded-full overflow-hidden"
            style={{ width: `${width}px`, height: `${height}px`, backgroundColor, ...style }}
        >
            <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                    width: `${progressWidth}px`,
                    ...gradientStyle
                }}
            />
        </div>
    );
};

interface DrivingTimePanelProps {
    session: DrivingSession;
    score: number;
    colors: {
        chart: {
            red: string;
            yellow: string;
            blue: string;
            green: string;
        };
        text: {
            primary: string;
            secondary: string;
        };
    };
}

const DrivingTimePanel: React.FC<DrivingTimePanelProps> = ({
                                                               session,
                                                               score,
                                                               colors
                                                           }) => {
    const totalDrivingHours = session?.durationHours || 0;
    const sessionStartTime = session?.formattedStartTime || "";
    const sessionEndTime = session?.formattedEndTime || "";

    // 점수에 따른 색상
    const scoreColor = score < 50 ? colors.chart.red : colors.chart.yellow;

    return (
        <div className="flex flex-col items-center mt-2">
            {/* 점수 표시 */}
            <div
                className="text-4xl font-extrabold mt-4 tracking-wide"
                style={{
                    color: scoreColor,
                    textShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
            >
                {score.toFixed(1)} 점
            </div>

            {/* 설명 텍스트 */}
            <p className="text-base leading-6 mt-2.5 mb-6 text-center font-medium tracking-wide px-4">
                총 운전 시간: {totalDrivingHours.toFixed(1)}시간
            </p>

            {/* 차트 컨테이너 */}
            <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <h3 className="text-lg font-bold mb-5 text-center px-5 tracking-wide">
                    운전 시간 분석
                </h3>

                <div className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl min-h-[250px]">
                    {/* 운전 시간 정보 */}
                    <div
                        className="w-[90%] p-4 rounded-xl mb-5"
                        style={{ backgroundColor: 'rgba(255, 217, 39, 0.1)' }}
                    >
                        <div className="flex flex-row items-center py-2">
                            <Clock size={20} color={colors.chart.yellow} />
                            <span className="text-base font-semibold ml-3">
                {sessionStartTime} ~ {sessionEndTime}
              </span>
                        </div>
                    </div>

                    {/* 진행률 컨테이너 */}
                    <div className="w-full flex flex-col items-center my-5">
                        <p className="text-base font-semibold mb-3 text-center">
                            4시간 권장 운전 시간 대비 ({totalDrivingHours.toFixed(1)}/4시간)
                        </p>

                        <HorizontalProgressBar
                            progress={session?.progress || 0}
                            width={300}
                            height={30}
                            color={totalDrivingHours > 4 ? colors.chart.red : colors.chart.yellow}
                            backgroundColor="rgba(255, 217, 39, 0.2)"
                            useGradient={true}
                            gradientColors={[
                                `${colors.chart.yellow}FF`,
                                `${colors.chart.yellow}AA`,
                                `${colors.chart.yellow}88`
                            ]}
                            style={{ marginTop: 16, marginBottom: 16 }}
                        />

                        <div className="w-full mt-3">
                            <div className="flex flex-row items-center my-1">
                                <Info size={16} color={colors.chart.blue} />
                                <span
                                    className="ml-2 text-sm"
                                    style={{ color: colors.text.secondary }}
                                >
                  한 번에 4시간 이상 운전 시 휴식이 필요합니다.
                </span>
                            </div>
                        </div>
                    </div>

                    {/* 안전 가이드 컨테이너 */}
                    <div
                        className="w-[90%] p-4 rounded-xl mt-5 border-l-4"
                        style={{
                            backgroundColor: 'rgba(104, 211, 146, 0.1)',
                            borderLeftColor: colors.chart.green
                        }}
                    >
                        <h4
                            className="text-base font-bold mb-3 text-center"
                            style={{ color: colors.text.primary }}
                        >
                            안전 운전 시간 가이드
                        </h4>

                        <div className="flex flex-row items-center my-1.5">
                            <CheckCircle size={16} color={colors.chart.green} />
                            <span
                                className="ml-2.5 text-sm"
                                style={{ color: colors.text.secondary }}
                            >
                2시간 연속 운전 후에는 최소 10~15분 휴식
              </span>
                        </div>

                        <div className="flex flex-row items-center my-1.5">
                            <CheckCircle size={16} color={colors.chart.green} />
                            <span
                                className="ml-2.5 text-sm"
                                style={{ color: colors.text.secondary }}
                            >
                4시간 이상 운전 시 30분 이상 충분한 휴식
              </span>
                        </div>

                        <div className="flex flex-row items-center my-1.5">
                            <CheckCircle size={16} color={colors.chart.green} />
                            <span
                                className="ml-2.5 text-sm"
                                style={{ color: colors.text.secondary }}
                            >
                야간 운전은 더 많은 휴식이 필요합니다.
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrivingTimePanel;
