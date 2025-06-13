import {BaseChartProps} from "@/components/General/GeneralType";
import {Line} from "react-chartjs-2";

export interface TimeSeriesChartProps extends BaseChartProps {
    data: Array<{
        date: string;
        [key: string]: string | number;
    }>;
    metrics: Array<{
        key: string;
        label: string;
        color: string;
        type?: 'line' | 'area';
    }>;
    dateFormat?: 'YYYY-MM' | 'MM-DD' | 'YYYY-MM-DD' | 'MM월';
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
                                                                    data,
                                                                    metrics,
                                                                    title,
                                                                    dateFormat = 'YYYY-MM-DD',
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        switch(dateFormat) {
            case 'YYYY-MM':
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            case 'MM-DD':
                return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            case 'MM월':
                return `${date.getMonth() + 1}월`;
            default:
                return dateStr;
        }
    };

    const chartData = {
        labels: data.map(item => formatDate(item.date)),
        datasets: metrics.map(metric => ({
            label: metric.label,
            data: data.map(item => Number(item[metric.key]) || 0),
            borderColor: metric.color,
            backgroundColor: metric.type === 'area' ? `${metric.color}20` : 'transparent',
            tension: config.tension ?? 0.4,
            fill: metric.type === 'area',
            pointBackgroundColor: metric.color,
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
                },
                border: {
                    display: false,
                },
                ticks: {
                    stepSize: config.stepSize,
                    callback: function(value: number) {
                        return value % 1 === 0 ? value : '';
                    }
                }
            },
            x: {
                grid: {
                    display: config.showGrid ?? false,
                },
                border: {
                    display: false,
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
