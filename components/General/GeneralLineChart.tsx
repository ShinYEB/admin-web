import {
    Chart as ChartJS,
    PointElement,
    LineElement,
    Filler,
    CategoryScale,
    Title,
    Tooltip,
    LinearScale,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {BaseChartProps, TimeSeriesDataPoint} from "@/components/General/GeneralType";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export interface GeneralLineChartProps extends BaseChartProps {
    data: TimeSeriesDataPoint[];
    dataKeys: Array<{
        key: string;
        label: string;
        color: string;
        fill?: boolean;
    }>;
}

export const GeneralLineChart: React.FC<GeneralLineChartProps> = ({
                                                                      data,
                                                                      dataKeys,
                                                                      title,
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
        labels: data.map(item => item.date),
        datasets: dataKeys.map(dataKey => ({
            label: dataKey.label,
            data: data.map(item => item.values[dataKey.key] || 0),
            borderColor: dataKey.color,
            backgroundColor: dataKey.fill ? `${dataKey.color}20` : 'transparent',
            tension: config.tension ?? 0.4,
            fill: dataKey.fill ?? false,
            pointBackgroundColor: dataKey.color,
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: config.showLegend ?? true,
                position: 'top' as const,
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
                    drawBorder: false,
                },
                ticks: {
                    stepSize: config.stepSize,
                    callback: function(value: any) {
                        return value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: config.showGrid ?? false,
                },
            },
        },
    };

    return (
        <div style={{
            width: config.width || "100%",
            height: config.height || "400px"
        }}>
            <Line data={chartData} options={options} />
        </div>
    );
};
