import React from 'react';

interface CircleChartProps {
    percentage: number;
    radius: number;
    color: string;
}

const CircleChart: React.FC<CircleChartProps> = ({
                                                     percentage,
                                                     radius,
                                                     color
                                                 }) => {
    const center = radius + radius * 0.1;
    const startAngle = -90;
    const endAngle = 360 * (percentage / 100) - 90;

    const polarToCartesian = (
        centerX: number,
        centerY: number,
        r: number,
        angleInDegrees: number,
    ) => {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + r * Math.cos(angleInRadians),
            y: centerY + r * Math.sin(angleInRadians),
        };
    };

    const createArc = (
        x: number,
        y: number,
        r: number,
        start: number,
        end: number,
    ) => {
        const s = polarToCartesian(x, y, r, end);
        const e = polarToCartesian(x, y, r, start);
        const largeArcFlag = end - start <= 180 ? '0' : '1';
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${e.x} ${e.y}`;
    };

    const fullCirclePath = `M ${center},${
        center - radius
    } a ${radius},${radius} 0 1,0 0,${2 * radius} a ${radius},${radius} 0 1,0 0,${
        -2 * radius
    }`;

    const progressPath =
        percentage >= 100
            ? fullCirclePath
            : createArc(center, center, radius, startAngle, endAngle);

    // 배경 색상 생성 (색상 + 투명도)
    const backgroundColor = `${color}20`;

    return (
        <div className="flex justify-center items-center relative">
            <svg width={center * 2} height={center * 2}>
                {/* 배경 원 */}
                <path
                    d={fullCirclePath}
                    stroke={backgroundColor}
                    strokeWidth={radius * 0.1}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* 진행률 원 */}
                <path
                    d={progressPath}
                    stroke={color}
                    strokeWidth={radius * 0.1}
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>

            {/* 중앙 텍스트 */}
            <span
                className="absolute font-bold"
                style={{
                    fontSize: `${radius * 0.5}px`,
                    color: color
                }}
            >
        {Math.round(percentage)}%
      </span>
        </div>
    );
};

export default CircleChart;
