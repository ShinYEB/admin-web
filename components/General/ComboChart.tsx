import { Chart } from 'react-chartjs-2';
import {BaseChartProps} from "@/components/General/GeneralType";

export interface ComboChartProps extends BaseChartProps {
    data: Array<{
        label: string;
        barValue: number;
        lineValue: number;
        color?: string;
    }>;
    barLabel?: string;
    lineLabel?: string;
    barColor?: string;
    lineColor?: string;
}

export const ComboChart: React.FC<ComboChartProps> = ({
                                                          data,
                                                          title,
                                                          barLabel = "값",
                                                          lineLabel = "추세",
                                                          barColor = "#8B5CF6",
                                                          lineColor = "#8B5CF6",
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
                type: 'bar' as const,
                label: barLabel,
                data: data.map(item => item.barValue),
                backgroundColor: data.map(item => item.color || barColor),
                borderColor: data.map(item => item.color || barColor),
                borderWidth: 1,
                borderRadius: 10,
                barThickness: 30,
            },
            {
                type: 'line' as const,
                label: lineLabel,
                data: data.map(item => item.lineValue),
                borderColor: lineColor,
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: lineColor,
                pointBorderColor: lineColor,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
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
        },
        scales: {
            y: {
                beginAtZero: config.beginAtZero ?? true,
                grid: {
                    display: config.showGrid ?? true,
                },
                border: {
                    display: false,
                },
                ticks: {
                    stepSize: config.stepSize ?? 25,
                    callback: function(value: number) {
                        return value % 1 === 0 ? value : '';
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    };

    return (
        <div className="mt-6 mb-2 w-full p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {title && (
                <h3 className="text-lg text-gray-800 font-bold mb-5 text-center px-5 tracking-wide">
                    {title}
                </h3>
            )}
            <div className="p-4 flex items-center justify-center my-4 relative w-full bg-white bg-opacity-60 rounded-2xl min-h-[250px]">
                <div
                    className="py-4 flex items-center justify-center w-full relative"
                    style={{ height: `${config.height || 200}px` }}
                >
                    <Chart type="bar" data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};
