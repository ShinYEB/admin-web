import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {BaseChartProps, ChartDataPoint} from "@/components/General/GeneralType";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface GeneralBarChartProps extends BaseChartProps {
    data: ChartDataPoint[];
}

export const GeneralBarChart: React.FC<GeneralBarChartProps> = ({
                                                                    data,
                                                                    title,
                                                                    config = {},
                                                                    noDataMessage = "데이터가 없습니다."
                                                                }) => {
    console.log('title', title);
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                {noDataMessage}
            </div>
        );
    }

    const defaultColors = [
        '#FF6B8A', '#38B2FF', '#FFCE45', '#67CDB0',
        '#AB7AFF', '#FF9F40', '#5D87FF', '#FF5252',
        '#FFA726', '#FFD927', '#4ECD7B', '#4945FF'
    ];

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            data: data.map(item => item.value),
            backgroundColor: data.map((item, index) =>
                item.color || config.colors?.[index] || defaultColors[index % defaultColors.length]
            ),
            borderColor: data.map((item, index) =>
                item.color || config.colors?.[index] || defaultColors[index % defaultColors.length]
            ),
            borderWidth: 1,
            barThickness: 35,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: config.showLegend ?? false,
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
                    stepSize: config.stepSize ?? 1,
                    callback: function(value: any) {
                        if (Number.isInteger(value)) {
                            return value.toLocaleString();
                        }
                        return null;
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div style={{
            width: config.width || "100%",
            height: config.height || "500px",
            padding: "50px"
        }}>
            <h2 className="text-lg font-medium mb-4">{title}</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};
