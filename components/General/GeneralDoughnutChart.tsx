import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {BaseChartProps, ChartDataPoint} from "@/components/General/GeneralType";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface GeneralDoughnutChartProps extends BaseChartProps {
    data: ChartDataPoint[];
    centerText?: string;
    centerTextColor?: string;
    cutout?: string;
    showLegend?: boolean;
}

export const GeneralDoughnutChart: React.FC<GeneralDoughnutChartProps> = ({
                                                                              data,
                                                                              title,
                                                                              centerText,
                                                                              centerTextColor = '#333',
                                                                              cutout = '70%',
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

    const defaultColors = [
        '#FF6B8A', '#38B2FF', '#FFCE45', '#67CDB0',
        '#AB7AFF', '#FF9F40', '#5D87FF'
    ];

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            data: data.map(item => item.value),
            backgroundColor: data.map((item, index) =>
                item.color || config.colors?.[index] || defaultColors[index % defaultColors.length]
            ),
            borderWidth: 0,
            cutout,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: config.showLegend ?? true,
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.label}: ${context.parsed}`;
                    }
                }
            }
        },
    };

    return (
        <div style={{
            width: config.width || "300px",
            height: config.height || "300px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            marginBottom: "20px",
            margin: "auto",
            padding: "20px",
        }} className="relative">
            <h2 className="text-lg font-medium mb-4">{title}</h2>
            <Doughnut data={chartData} options={options} />
            {centerText && (
                <div className="absolute inset-0 flex justify-center items-center">
          <span
              className="text-lg font-bold"
              style={{ color: centerTextColor }}
          >
            {centerText}
          </span>
                </div>
            )}
        </div>
    );
};
