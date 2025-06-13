import React, { useState, useEffect, useRef } from 'react';

// 타입 정의
interface FollowingDistanceEvent {
    time: string;
    formattedTime: string;
}

// ACCIDENT_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const ACCIDENT_COLORS = {
    chart: {
        purple: '#8B5CF6',
        red: '#EF4444',
        green: '#68D392',
        grid: '#E5E7EB',
    },
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
    },
    shadow: '#000000',
};

interface SafeDistanceChartProps {
    events: FollowingDistanceEvent[];
    height?: number;
}

const SafeDistanceChart: React.FC<SafeDistanceChartProps> = ({ events, height = 200 }) => {
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
                    차간 안전거리 변화
                </h3>
                <div className="flex items-center justify-center h-32 text-gray-500">
                    안전거리 이벤트가 없습니다.
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

    // 안전 거리 데이터 포인트 생성 (시뮬레이션)
    const generateDistanceData = () => {
        const points = [];
        const numPoints = 50;
        const safeDistance = chartHeight * 0.6; // 안전 거리 기준선

        for (let i = 0; i < numPoints; i++) {
            const minute = startTime + (timeRange * i / (numPoints - 1));
            let distance;

            // 이벤트 발생 근처에서는 안전거리 위반
            const isNearEvent = sortedEvents.some(event => {
                const eventMinute = timeToMinutes(event.time);
                return Math.abs(eventMinute - minute) < 2;
            });

            // 거리 값 시뮬레이션
            if (isNearEvent) {
                // 이벤트 근처: 안전거리보다 가까움 (위반)
                distance = safeDistance * (0.3 + Math.random() * 0.2);
            } else {
                // 일반 상황: 안전거리 이상
                distance = safeDistance * (0.8 + Math.random() * 0.5);
            }

            const x = ((minute - startTime) / timeRange) * width;
            const y = chartHeight - distance;

            points.push({ x, y, minute, distance });
        }
        return points;
    };

    const distanceData = generateDistanceData();

    // SVG 경로 생성
    const createDistancePath = () => {
        let path = distanceData.map((point, index) =>
            (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
        ).join(' ');

        // 영역 채우기 위해 경로 닫기
        path += ` L${width},${chartHeight} L0,${chartHeight} Z`;
        return path;
    };

    const safeDistanceY = chartHeight * 0.4; // 안전 거리 기준선 (위에서부터)

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
                차간 안전거리 변화
            </h3>

            <svg width={width} height={chartHeight}>
                {/* 배경 영역: 안전/위험 구분 */}
                <rect
                    x={0} y={0}
                    width={width} height={safeDistanceY}
                    fill="rgba(239, 68, 68, 0.1)" // 위험 영역: 빨간색
                />
                <rect
                    x={0} y={safeDistanceY}
                    width={width} height={chartHeight - safeDistanceY}
                    fill="rgba(104, 211, 146, 0.1)" // 안전 영역: 녹색
                />

                {/* 안전 거리 기준선 */}
                <line
                    x1={0} y1={safeDistanceY}
                    x2={width} y2={safeDistanceY}
                    stroke="#68D392" strokeWidth={2}
                    strokeDasharray="5,5"
                />
                <text
                    x={8} y={safeDistanceY - 5}
                    fill="#68D392"
                    fontSize={10}
                    dominantBaseline="middle"
                >
                    권장 안전거리
                </text>

                {/* 거리 변화 곡선 */}
                <path
                    d={createDistancePath()}
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke={ACCIDENT_COLORS.chart.purple}
                    strokeWidth={3}
                />

                {/* 이벤트 발생 지점 */}
                {sortedEvents.map((event, index) => {
                    const eventMinute = timeToMinutes(event.time);
                    const x = ((eventMinute - startTime) / timeRange) * width;

                    // 이벤트 발생 지점에서 실제 거리 찾기 (가장 가까운 데이터 포인트)
                    const nearestPoint = distanceData.reduce((nearest, point) => {
                        const currentDiff = Math.abs(point.minute - eventMinute);
                        const nearestDiff = Math.abs(nearest.minute - eventMinute);
                        return currentDiff < nearestDiff ? point : nearest;
                    }, distanceData[0]);

                    return (
                        <g key={`distance-event-${index}`}>
                            <circle
                                cx={x} cy={nearestPoint.y}
                                r={6}
                                fill={ACCIDENT_COLORS.chart.red}
                            />
                            <line
                                x1={x} y1={nearestPoint.y}
                                x2={x} y2={chartHeight}
                                stroke={ACCIDENT_COLORS.chart.red}
                                strokeWidth={1}
                                strokeDasharray="3,3"
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

                {/* 영역 라벨 */}
                <text x={8} y={15} fontSize={10} fill={ACCIDENT_COLORS.chart.red}>
                    위험 구간
                </text>
                <text x={8} y={chartHeight - 5} fontSize={10} fill={ACCIDENT_COLORS.chart.green}>
                    안전 구간
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
            실제 유지 거리
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
                        style={{ backgroundColor: ACCIDENT_COLORS.chart.green }}
                    />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: ACCIDENT_COLORS.text.primary }}
                    >
            안전 거리
          </span>
                </div>
            </div>
        </div>
    );
};

export default SafeDistanceChart;
