export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

export interface TimeSeriesDataPoint {
    date: string;
    values: Record<string, number>;
}

export interface ChartConfig {
    title?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    beginAtZero?: boolean;
    stepSize?: number;
    colors?: string[];
    height?: number;
    width?: number;
    tension?: number;
    fill?: boolean;
}

export interface BaseChartProps {
    title?: string;
    config?: ChartConfig;
    noDataMessage?: string;
}
