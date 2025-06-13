import React, { useState, useEffect, useRef } from 'react';

// 타입 정의
interface ReactionTimelineEvent {
    time: string;
    formattedTime: string;
}

// ACCIDENT_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const ACCIDENT_COLORS = {
    chart: {
        purple: '#8B5CF6',
        red: '#EF4444',
        grid: '#E5E7EB',
        lightGrid: '#F3F4F6',
    },
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        light: '#9CA3AF',
    },
    shadow: '#000000',
};

interface ReactionSpeedChartProps {
    events: ReactionTimelineEvent[];
    height?: number;
}

const ReactionSpeedChart: React.FC<ReactionSpeedChartProps> = ({ events, height = 200 }) => {
    const [containerWidth, setContainerWidth] = useState(300);
    const containerRef = useRef<HTMLDivElement>(null);

    // 컨테이너 크기 감지
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth - 80; // 패딩 고려
                setContainerWidth(Math.max(width, 300)); // 최소 300px
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const width = containerWidth;
    const chartHeight = height - 40;

    // 빈 이벤트 처리
    if (!events || events.length === 0) {
        return (
            <div className="w-full my-4 p-2.5 bg-white rounded-xl border border-gray-300 border-opacity-50">
                <h3 className="text-lg font-bold mb-5 text-center px-5 tracking-wide" style={{ color: ACCIDENT_COLORS.text.primary }}>
                    반응 속도 변화 추이
                </h3>
                <div className="flex items-center justify-center h-32 text-gray-500">
                    반응 속도 이벤트가 없습니다.
                </div>
            </div>
        );
    }

    // 시간을 분 단위로 변환
    const timeToMinutes = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.getHours() * 60 + date.getMinutes();
    };

    // 정렬된 이벤트
    const sortedEvents = [...events].sort((a, b) =>
        timeToMinutes(a.time) - timeToMinutes(b.time)
    );

    // 시작/종료 시간
    const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
    const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
    const timeRange = Math.max(endTime - startTime, 60);

    // 반응 시간 데이터 포인트 생성 (시뮬레이션)
    const generateDataPoints = () => {
        const points = [];
        const numPoints = 50; // 데이터 포인트 수

        for (let i = 0; i < numPoints; i++) {
            const minute = startTime + (timeRange * i / (numPoints - 1));

            // 이벤트 발생 근처에서는 반응 시간 높게 설정
            const isNearEvent = sortedEvents.some(event => {
                const eventMinute = timeToMinutes(event.time);
                return Math.abs(eventMinute - minute) < 2;
            });

            // 반응 시간 값 (낮을수록 좋음, 높을수록 나쁨) - 시뮬레이션
            // 0-1 사이 값으로 정규화 (0이 가장 좋음, 1이 가장 나쁨)
            const value = isNearEvent ?
                0.8 + Math.random() * 0.2 : // 이벤트 근처: 높은 반응 시간 (나쁨)
                0.2 + Math.random() * 0.4;  // 일반 상황: 낮은-중간 반응 시간

            const x = ((minute - startTime) / timeRange) * width;
            const y = chartHeight - (value * (chartHeight - 30)) - 10; // 위쪽이 좋은 값

            points.push({ x, y, minute, value });
        }
        return points;
    };

    const dataPoints = generateDataPoints();

    // SVG 경로 생성
    const createLinePath = () => {
        return dataPoints.map((point, index) =>
            (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
        ).join(' ');
    };

    return (
        <div
            ref={containerRef}
            className="w-full my-4 p-2.5 bg-white rounded-xl border border-gray-300 border-opacity-50 overflow-hidden"
            style={{ height: `${height}px` }}
        >
            <h3
                className="text-lg font-bold mb-5 text-center px-5 tracking-wide"
                style={{ color: ACCIDENT_COLORS.text.primary }}
            >
                반응 속도 변화 추이
            </h3>

            <svg width={width} height={chartHeight}>
                {/* 배경 격자 */}
                <line
                    x1={0} y1={chartHeight - 10}
                    x2={width} y2={chartHeight - 10}
                    stroke={ACCIDENT_COLORS.chart.grid} strokeWidth={1}
                />
                <line
                    x1={0} y1={(chartHeight - 10) * 0.5}
                    x2={width} y2={(chartHeight - 10) * 0.5}
                    stroke={ACCIDENT_COLORS.chart.lightGrid} strokeWidth={1}
                    strokeDasharray="5,5"
                />

                {/* 위험 구간 표시 */}
                <rect
                    x={0} y={0}
                    width={width}
                    height={(chartHeight - 10) * 0.3}
                    fill="rgba(239, 68, 68, 0.1)"
                />
                <text
                    x={8} y={20}
                    fill={ACCIDENT_COLORS.chart.red}
                    fontSize={11}
                    dominantBaseline="middle"
                >
                    위험 구간
                </text>

                {/* 반응 시간 선 그래프 */}
                <path
                    d={createLinePath()}
                    stroke={ACCIDENT_COLORS.chart.purple}
                    strokeWidth={3}
                    fill="none"
                />

                {/* 이벤트 발생 지점 표시 */}
                {sortedEvents.map((event, index) => {
                    const eventMinute = timeToMinutes(event.time);
                    const x = ((eventMinute - startTime) / timeRange) * width;

                    return (
                        <g key={`event-${index}`}>
                            <line
                                x1={x} y1={0}
                                x2={x} y2={chartHeight - 10}
                                stroke={ACCIDENT_COLORS.chart.red}
                                strokeWidth={2}
                                strokeDasharray="3,3"
                            />
                            <circle
                                cx={x} cy={10}
                                r={6}
                                fill={ACCIDENT_COLORS.chart.red}
                            />
                            <text
                                x={x} y={chartHeight}
                                fontSize={10}
                                fill={ACCIDENT_COLORS.text.secondary}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {event.formattedTime}
                            </text>
                        </g>
                    );
                })}

                {/* Y축 라벨 */}
                <text x={8} y={chartHeight - 15} fontSize={10} fill={ACCIDENT_COLORS.text.light}>
                    좋음
                </text>
                <text x={8} y={25} fontSize={10} fill={ACCIDENT_COLORS.chart.red}>
                    나쁨
                </text>
            </svg>

            {/* 범례 */}
            <div className="flex flex-row justify-center mt-2 flex-wrap">
                <div
                    className="flex flex-row items-center mx-3 my-2 bg-gray-50 bg-opacity-90 py-2 px-3.5 rounded-2xl shadow-sm border border-gray-50"
                    style={{
                        shadowColor: ACCIDENT_COLORS.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2
                    }}
                >
                    <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: ACCIDENT_COLORS.chart.purple }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: ACCIDENT_COLORS.text.primary }}
                    >
            반응 시간 추이
          </span>
                </div>

                <div
                    className="flex flex-row items-center mx-3 my-2 bg-gray-50 bg-opacity-90 py-2 px-3.5 rounded-2xl shadow-sm border border-gray-50"
                    style={{
                        shadowColor: ACCIDENT_COLORS.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2
                    }}
                >
                    <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: ACCIDENT_COLORS.chart.red }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: ACCIDENT_COLORS.text.primary }}
                    >
            위험 이벤트
          </span>
                </div>
            </div>
        </div>
    );
};

export default ReactionSpeedChart;
