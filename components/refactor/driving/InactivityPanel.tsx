import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

// 타입 정의
interface InactivityEvent {
    formattedTime: string;
    timestamp?: number;
}

// TimelineChart 컴포넌트 (간단한 구현)
interface TimelineChartProps {
    events: InactivityEvent[];
    title: string;
    height: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ events, title, height }) => {
    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-500">
                감지된 이벤트가 없습니다.
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">{title}</h4>
            <div className="relative">
                {/* 타임라인 배경선 */}
                <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-300"></div>

                {/* 이벤트 포인트들 */}
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={index} className="relative flex items-center">
                            {/* 타임라인 점 */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-10"></div>

                            {/* 시간 표시 */}
                            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'ml-auto pl-8 text-left'}`}>
                <span className="text-sm font-medium text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {event.formattedTime}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface InactivityPanelProps {
    events: InactivityEvent[];
    score: number;
    colors: {
        chart: {
            red: string;
            yellow: string;
        };
        text: {
            primary: string;
            secondary: string;
        };
        primary: string;
    };
}

const InactivityPanel: React.FC<InactivityPanelProps> = ({
                                                             events,
                                                             score,
                                                             colors
                                                         }) => {
    const inactivityCount = events.length;

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
            <p
                className="text-base leading-6 mt-2.5 mb-6 text-center font-medium tracking-wide px-4"
                style={{ color: colors.text.secondary }}
            >
                감지된 차량 미조작: {inactivityCount}회
            </p>

            {/* 차트 컨테이너 */}
            <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <h3
                    className="text-lg font-bold mb-5 text-center px-5 tracking-wide"
                    style={{ color: colors.text.primary }}
                >
                    차량 미조작 감지 시점
                </h3>

                <div className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl min-h-[250px] overflow-visible">
                    {/* 타임라인 차트 */}
                    <TimelineChart
                        events={events}
                        title="미조작 발생 시간"
                        height={200}
                    />

                    {/* 미조작 감지 시간 목록 */}
                    <div
                        className="w-[90%] p-4 rounded-xl mt-5"
                        style={{ backgroundColor: 'rgba(255, 217, 39, 0.1)' }}
                    >
                        <h4
                            className="text-base font-bold mb-3 text-center"
                            style={{ color: colors.text.primary }}
                        >
                            미조작 감지 시간
                        </h4>
                        <div className="w-full">
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex flex-row items-center justify-between py-2 border-b border-gray-300 border-opacity-30"
                                >
                  <span
                      className="text-sm font-semibold w-10"
                      style={{ color: colors.text.primary }}
                  >
                    #{index + 1}
                  </span>
                                    <span
                                        className="flex-1 text-sm"
                                        style={{ color: colors.text.primary }}
                                    >
                    {event.formattedTime}
                  </span>
                                    <AlertTriangle size={16} color={colors.chart.red} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 정보 박스 */}
                    <div
                        className="flex flex-row items-start p-4 rounded-xl mt-5 w-[90%]"
                        style={{ backgroundColor: 'rgba(255, 217, 39, 0.1)' }}
                    >
                        <Info size={20} color={colors.primary} className="mt-0.5 flex-shrink-0" />
                        <p
                            className="flex-1 text-sm ml-3 leading-5"
                            style={{ color: colors.text.secondary }}
                        >
                            차량 미조작은 핸들을 잡지 않거나 운전에 주의를 기울이지 않는 상태를 감지한 것입니다.
                            주행 중에는 항상 핸들을 잡고 전방 주시를 유지하세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InactivityPanel;
