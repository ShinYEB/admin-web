export interface CircleProgressProps {
    percentage: number;
    radius: number;
    color: string;
    backgroundColor?: string;
    showPercentage?: boolean;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
                                                                  percentage,
                                                                  radius,
                                                                  color,
                                                                  backgroundColor,
                                                                  showPercentage = true
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

    const bgColor = backgroundColor || `${color}20`;

    return (
        <div className="flex justify-center items-center relative">
            <svg width={center * 2} height={center * 2}>
                <path
                    d={fullCirclePath}
                    stroke={bgColor}
                    strokeWidth={radius * 0.1}
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d={progressPath}
                    stroke={color}
                    strokeWidth={radius * 0.1}
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
            {showPercentage && (
                <span
                    className="absolute font-bold"
                    style={{
                        fontSize: `${radius * 0.5}px`,
                        color: color
                    }}
                >
          {Math.round(percentage)}%
        </span>
            )}
        </div>
    );
};
