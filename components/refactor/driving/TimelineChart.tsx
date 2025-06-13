import React, { useState, useEffect, useRef } from 'react';

// 타입 정의
interface TimelineEvent {
    time: string;
    formattedTime: string;
}

// ACCIDENT_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const ACCIDENT_COLORS = {
    chart: {
        grid: '#E5E7EB',
        purple: '#8B5CF6',
    },
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
    },
};

interface TimelineChartProps {
    events: TimelineEvent[];
    title: string;
    height?: number;
    showMarkers?: boolean;
}

// 타임라인 점 마커 컴포넌트
const TimelineMarker: React.FC<{
    x: number;
    y: number;
    color: string;
    time: string;
}> = ({ x, y, color, time }) => (
    <g>
        <circle cx={x} cy={y} r={6} fill={color} />
        <text
            x={x}
            y={y - 10}
            fontSize={8}
            fill={ACCIDENT_COLORS.text.secondary}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {time}
        </text>
    </g>
);

const TimelineChart: React.FC<TimelineChartProps> = ({
                                                         events,
                                                         title,
                                                         height = 200,
                                                         showMarkers = true,
                                                     }) => {
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

    // 빈 이벤트 처리
    if (!events || events.length === 0) {
        return (
            <div
                ref={containerRef}
                className="w-full my-4 flex flex-col items-center"
                style={{ height: `${height}px` }}
            >
                <h4
                    className="text-base font-semibold mb-3 text-center"
                    style={{ color: ACCIDENT_COLORS.text.primary }}
                >
                    {title}
                </h4>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    이벤트가 없습니다.
                </div>
            </div>
        );
    }

    // 시간을 분 단위로 변환
    const timeToMinutes = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.getHours() * 60 + date.getMinutes();
    };

    // 이벤트를 시간순으로 정렬
    const sortedEvents = [...events].sort((a, b) =>
        timeToMinutes(a.time) - timeToMinutes(b.time)
    );

    // 시작 시간과 종료 시간 찾기
    const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
    const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;

    // 타임라인 시간 범위 (최소 60분)
    const timeRange = Math.max(endTime - startTime, 60);

    return (
        <div
            ref={containerRef}
            className="w-full my-4 flex flex-col items-center"
            style={{ height: `${height}px` }}
        >
            <h4
                className="text-base font-semibold mb-3 text-center"
                style={{ color: ACCIDENT_COLORS.text.primary }}
            >
                {title}
            </h4>

            <svg width={width} height={height - 40}>
                {/* 타임라인 기본선 */}
                <line
                    x1={0}
                    y1={height / 2}
                    x2={width}
                    y2={height / 2}
                    stroke={ACCIDENT_COLORS.chart.grid}
                    strokeWidth={2}
                />

                {/* 시간 눈금 (30분 간격) */}
                {Array.from({ length: Math.ceil(timeRange / 30) + 1 }).map((_, i) => {
                    const tickTime = startTime + i * 30;
                    const tickX = ((tickTime - startTime) / timeRange) * width;
                    const hours = Math.floor(tickTime / 60);
                    const minutes = tickTime % 60;
                    const timeLabel = `${hours}:${minutes.toString().padStart(2, '0')}`;

                    return (
                        <g key={`tick-${i}`}>
                            <line
                                x1={tickX}
                                y1={height / 2 - 5}
                                x2={tickX}
                                y2={height / 2 + 5}
                                stroke={ACCIDENT_COLORS.chart.grid}
                                strokeWidth={1}
                            />
                            <text
                                x={tickX}
                                y={height / 2 + 20}
                                fontSize={10}
                                fill={ACCIDENT_COLORS.text.secondary}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {timeLabel}
                            </text>
                        </g>
                    );
                })}

                {/* 이벤트 마커 */}
                {showMarkers && sortedEvents.map((event, index) => {
                    const eventTime = timeToMinutes(event.time);
                    const eventX = ((eventTime - startTime) / timeRange) * width;

                    return (
                        <TimelineMarker
                            key={`marker-${index}`}
                            x={eventX}
                            y={height / 2}
                            color={ACCIDENT_COLORS.chart.purple}
                            time={event.formattedTime}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default TimelineChart;
