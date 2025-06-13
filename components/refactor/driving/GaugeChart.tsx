import React from 'react';

// ACCIDENT_COLORS 대체 (실제 사용 시에는 theme 파일에서 import)
const ACCIDENT_COLORS = {
    text: {
        light: '#718096'
    }
};

interface GaugeChartProps {
    percentage: number;
    color: string;
    size?: number;
    gaugeBackgroundColor?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
                                                   percentage,
                                                   color,
                                                   size = 180,
                                                   gaugeBackgroundColor = '#f0f0f0',
                                               }) => {
    const center = size / 2;
    const gaugeRadius = (size / 2) * 0.8;
    const strokeWidth = 20;

    // 게이지 각도 계산 - 반원형 차트 (180도)
    const gaugeStartAngle = -180;
    const gaugeEndAngle = gaugeStartAngle + (percentage / 100) * 180;

    // 극좌표를 데카르트 좌표로 변환
    const polarToCartesian = (
        centerX: number,
        centerY: number,
        r: number,
        angleDegrees: number,
    ) => {
        const angleRad = (angleDegrees * Math.PI) / 180.0;
        return {
            x: centerX + r * Math.cos(angleRad),
            y: centerY + r * Math.sin(angleRad),
        };
    };

    // 호 경로 생성
    const createArc = (
        x: number,
        y: number,
        r: number,
        startAng: number,
        endAng: number,
    ) => {
        const start = polarToCartesian(x, y, r, endAng);
        const end = polarToCartesian(x, y, r, startAng);
        const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';

        return [
            'M',
            start.x,
            start.y,
            'A',
            r,
            r,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
        ].join(' ');
    };

    const foregroundArc = createArc(
        center,
        center,
        gaugeRadius,
        gaugeStartAngle,
        gaugeEndAngle,
    );
    const backgroundArc = createArc(
        center,
        center,
        gaugeRadius,
        gaugeStartAngle,
        gaugeStartAngle + 180,
    );

    const displayValue = percentage.toFixed(1);
    const ratingText =
        percentage >= 70 ? 'Good' : percentage >= 40 ? 'So-so' : 'Poor';

    // 반응형 폰트 크기 계산
    const scoreFontSize = size * 0.18 > 36 ? 36 : size * 0.18;
    const ratingFontSize = size * 0.12 > 24 ? 24 : size * 0.12;

    // 0과 100 텍스트 색상
    const labelTextColor = ACCIDENT_COLORS?.text?.light || '#718096';

    // 게이지 끝 부분 원의 좌표
    const endCirclePos = polarToCartesian(center, center, gaugeRadius, gaugeEndAngle);

    return (
        <div
            className="flex items-center justify-start overflow-hidden mb-0"
            style={{ height: `${size * 0.6}px` }}
        >
            <svg width={size} height={size * 0.6}>
                {/* 배경 호 */}
                <path
                    d={backgroundArc}
                    stroke={gaugeBackgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* 전경 호 */}
                <path
                    d={foregroundArc}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* 게이지 끝 부분의 원 */}
                <circle
                    cx={endCirclePos.x}
                    cy={endCirclePos.y}
                    r={strokeWidth / 2}
                    fill="#FFFFFF"
                    stroke={color}
                    strokeWidth={2}
                />

                {/* 점수 텍스트 그룹 */}
                <g transform={`translate(${center}, ${center - 10})`}>
                    <text
                        textAnchor="middle"
                        fontSize={scoreFontSize}
                        fontWeight="bold"
                        fill={color}
                        x={0}
                        y={0}
                        dominantBaseline="middle"
                    >
                        {displayValue}
                    </text>
                    <text
                        textAnchor="middle"
                        fontSize={ratingFontSize}
                        fontWeight="bold"
                        fill={color}
                        x={0}
                        y={30}
                        dominantBaseline="middle"
                    >
                        {ratingText}
                    </text>
                </g>

                {/* 0과 100 표시 */}
                <text
                    x={10}
                    y={center + 15}
                    fontSize={12}
                    fill={labelTextColor}
                    dominantBaseline="middle"
                >
                    0
                </text>
                <text
                    x={size - 22}
                    y={center + 15}
                    fontSize={12}
                    fill={labelTextColor}
                    dominantBaseline="middle"
                >
                    100
                </text>
            </svg>
        </div>
    );
};

export default GaugeChart;
