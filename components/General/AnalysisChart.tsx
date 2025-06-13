export interface AnalysisItem {
    label: string;
    value: number;
    color: string;
    maxValue?: number;
}

export interface AnalysisChartProps {
    title: string;
    summary?: string;
    data: AnalysisItem[];
    unit?: string;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({
                                                                title,
                                                                summary,
                                                                data,
                                                                unit = '%'
                                                            }) => {
    return (
        <div className="bg-blue-50 space-y-3 p-4 rounded-xl">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                {title}
            </h3>

            {summary && (
                <p className="text-sm leading-5 text-gray-700">
                    {summary}
                </p>
            )}

            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className="text-sm text-gray-600">{item.value}{unit}</span>
                        </div>
                        <div className="relative h-2.5 bg-gray-300 rounded-md overflow-hidden">
                            <div
                                className="h-full rounded-md transition-all duration-300 ease-out"
                                style={{
                                    backgroundColor: item.color,
                                    width: `${Math.min(item.value, item.maxValue || 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
