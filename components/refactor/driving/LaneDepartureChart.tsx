import React, { useState, useEffect, useRef } from 'react';

// 타입 정의
interface LaneDepartureEvent {
    time: string;
    formattedTime: string;
}

// ACCIDENT_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const ACCIDENT_COLORS = {
    chart: {
        purple: '#8B5CF6',
        red: '#EF4444',
        grid: '#E5E7EB',
    },
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
    },
    primary: '#3B82F6',
    shadow: '#000000',
};

interface LaneDepartureChartProps {
    events: LaneDepartureEvent[];
    height?: number;
}

const LaneDepartureChart: React.FC<LaneDepartureChartProps> = ({ events, height = 200 }) => {
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
    const laneHeight = 40;
    const roadHeight = laneHeight * 3; // 3개 차선
    const roadY = (chartHeight - roadHeight) / 2;

    // 빈 이벤트 처리
    if (!events || events.length === 0) {
        return (
            <div className="w-full my-4 p-2.5 bg-white rounded-xl border border-gray-300 border-opacity-50">
                <h3 className="text-lg font-bold mb-5 text-center px-5 tracking-wide" style={{ color: ACCIDENT_COLORS.text.primary }}>
                    차선 이탈 시각화
                </h3>
                <div className="flex items-center justify-center h-32 text-gray-500">
                    차선 이탈 이벤트가 없습니다.
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

    // 가상의 차선 움직임 (왼쪽/오른쪽 이탈 시뮬레이션)
    const generateCarPath = () => {
        const points = [];
        const segments = 100;
        const centerY = roadY + laneHeight * 1.5; // 도로 중앙

        for (let i = 0; i < segments; i++) {
            const x = (width * i) / (segments - 1);
            let y = centerY;

            // 이벤트 발생 근처에서는 차선 이탈 시뮬레이션
            const progress = i / segments;
            const currentTime = startTime + timeRange * progress;

            const nearestEvent = sortedEvents.find(event => {
                const eventMinute = timeToMinutes(event.time);
                return Math.abs(eventMinute - currentTime) < 1;
            });

            if (nearestEvent) {
                // 이벤트 발생 위치에서 차선 이탈 (위 또는 아래)
                const isLeftDeparture = Math.random() > 0.5; // 50% 확률로 왼쪽/오른쪽 차선 이탈
                const offset = isLeftDeparture ? -laneHeight : laneHeight;

                // 이탈 시작과 복귀를 부드럽게
                const eventMinute = timeToMinutes(nearestEvent.time);
                const distanceFromEvent = Math.abs(eventMinute - currentTime);

                if (distanceFromEvent < 0.8) {
                    // 가우시안 커브 형태로 이탈 (1에 가까울수록 중앙에서 멀어짐)
                    const deviation = Math.exp(-Math.pow(distanceFromEvent * 2, 2));
                    y += offset * deviation;
                }
            }

            points.push({ x, y });
        }

        return points;
    };

    const carPathPoints = generateCarPath();

    // SVG 경로 생성
    const createCarPath = () => {
        return carPathPoints.map((point, index) =>
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
                차선 이탈 시각화
            </h3>

            <svg width={width} height={chartHeight}>
                {/* 도로 배경 */}
                <rect
                    x={0} y={roadY}
                    width={width} height={roadHeight}
                    fill="#E2E8F0"
                />

                {/* 차선 그리기 */}
                <line
                    x1={0} y1={roadY + laneHeight}
                    x2={width} y2={roadY + laneHeight}
                    stroke="white" strokeWidth={3} strokeDasharray="10,10"
                />
                <line
                    x1={0} y1={roadY + laneHeight * 2}
                    x2={width} y2={roadY + laneHeight * 2}
                    stroke="white" strokeWidth={3} strokeDasharray="10,10"
                />

                {/* 운전 경로 */}
                <path
                    d={createCarPath()}
                    stroke={ACCIDENT_COLORS.chart.purple}
                    strokeWidth={4}
                    fill="none"
                />

                {/* 이벤트 발생 지점 표시 */}
                {sortedEvents.map((event, index) => {
                    const eventMinute = timeToMinutes(event.time);
                    const x = ((eventMinute - startTime) / timeRange) * width;
                    const isLeftDeparture = index % 2 === 0; // 시뮬레이션: 짝/홀수 인덱스에 따라 왼쪽/오른쪽 이탈

                    const iconY = isLeftDeparture ?
                        roadY - 10 : // 왼쪽 차선 이탈
                        roadY + roadHeight + 10; // 오른쪽 차선 이탈

                    return (
                        <g key={`lane-event-${index}`}>
                            <circle cx={x} cy={iconY} r={8} fill={ACCIDENT_COLORS.chart.red} />
                            <text
                                x={x}
                                y={chartHeight}
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

                {/* 시간 표시 */}
                <line
                    x1={0} y1={chartHeight - 15}
                    x2={width} y2={chartHeight - 15}
                    stroke={ACCIDENT_COLORS.chart.grid} strokeWidth={1}
                />

                {/* 차량 아이콘 */}
                <circle
                    cx={carPathPoints[carPathPoints.length - 1].x - 5}
                    cy={carPathPoints[carPathPoints.length - 1].y}
                    r={8}
                    fill={ACCIDENT_COLORS.primary}
                />
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
            차량 경로
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
            차선 이탈
          </span>
                </div>
            </div>
        </div>
    );
};

export default LaneDepartureChart;
