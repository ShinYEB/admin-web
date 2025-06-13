import {BaseChartProps} from "@/components/General/GeneralType";
import {Line} from "react-chartjs-2";

export interface SpeedDistributionProps extends BaseChartProps {
    data: Array<{
        label: string;
        value: number;
        color: string;
        speedLimit?: number;
    }>;
    speedLimit?: number;
    showSpeedLimit?: boolean;
}

export const SpeedDistributionChart: React.FC<SpeedDistributionProps> = ({
                                                                             data,
                                                                             title,
                                                                             speedLimit = 60,
                                                                             showSpeedLimit = true,
                                                                             config = {},
                                                                             noDataMessage = "데이터가 없습니다."
                                                                         }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                {noDataMessage}
            </div>
        );
    }

    const chartData = {
        labels: data.map((_, index) => `${index + 1}`),
        datasets: [
            {
                label: '주행 속도',
                data: data.map(item => item.value),
                borderColor: '#68D392',
                backgroundColor: 'rgba(104, 211, 146, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#68D392',
                pointBorderColor: '#68D392',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            ...(showSpeedLimit ? [{
                label: '제한속도',
                data: data.map(() => speedLimit),
                borderColor: '#EF4444',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 0,
            }] : []),
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
        },
        plugins: {
            legend: {
                display: config.showLegend ?? false,
            },
            title: {
                display: !!title,
                text: title,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        if (context.datasetIndex === 0) {
                            const value = context.parsed.y;
                            const isOverLimit = value > speedLimit;
                            return `${value} km/h${isOverLimit ? ' (제한속도 초과)' : ''}`;
                        }
                        return null;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    // 필요한 grid 속성만 유지
                },
                border: {
                    display: false, // 새로운 방식
                },
                ticks: {
                    stepSize: 1,
                    callback: function(value: number) { // 타입 추가
                        return value % 1 === 0 ? value : '';
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false, // x축에도 필요시 추가
                },
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {title && (
                <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                    {title}
                </h3>
            )}
            <div className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl">
                <div style={{ height: `${config.height || 200}px`, width: '100%' }}>
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};
