import {BaseChartProps} from "@/components/General/GeneralType";
import {Bar} from "react-chartjs-2";

export interface HorizontalBarChartProps extends BaseChartProps {
    data: Array<{
        label: string;
        value: number;
        startTime?: string;
        endTime?: string;
        color?: string;
    }>;
    unit?: string;
    showDetails?: boolean;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
                                                                          data,
                                                                          title,
                                                                          unit = "분",
                                                                          showDetails = false,
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
        labels: data.map(item => item.label),
        datasets: [
            {
                label: `시간 (${unit})`,
                data: data.map(item => item.value),
                backgroundColor: data.map((item, index) =>
                    item.color || config.colors?.[index] || '#007AFF'
                ),
                borderColor: data.map((item, index) =>
                    item.color || config.colors?.[index] || '#007AFF'
                ),
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.parsed.x.toFixed(1)}${unit}`;
                    }
                }
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: Math.max(...data.map(item => item.value)) * 1.2,
                grid: {
                    display: config.showGrid ?? true,
                    drawBorder: false,
                },
                ticks: {
                    callback: function(value: any) {
                        return `${value.toFixed(1)}${unit}`;
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    stepSize: 1,
                    callback: function(value: number) {
                        return value % 1 === 0 ? value : '';
                    },
                },
            },
        },
    };

    const chartHeight = data.length * 50 + 50;

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {title && (
                <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                    {title}
                </h3>
            )}
            <div className="p-4 flex flex-col items-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl">
                <div style={{ height: `${chartHeight}px`, width: '100%' }}>
                    <Bar data={chartData} options={options} />
                </div>

                {showDetails && (
                    <div className="mt-5 w-full p-4 rounded-xl border border-blue-200 bg-blue-50">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-row justify-between items-center py-1.5 border-b border-gray-300 border-opacity-30"
                            >
                <span className="text-sm font-semibold text-gray-600 w-[30%]">
                  {item.label}:
                </span>
                                <span className="text-sm text-gray-800 w-[70%] text-right">
                  {item.startTime && item.endTime ?
                      `${item.startTime} ~ ${item.endTime}` :
                      `${item.value}${unit}`
                  }
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
