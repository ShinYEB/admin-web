import {BaseChartProps} from "@/components/General/GeneralType";

export interface TimelineEvent {
    time: string;
    formattedTime: string;
    label?: string;
}

export interface TimelineChartProps extends BaseChartProps {
    events: TimelineEvent[];
    showMarkers?: boolean;
    eventColor?: string;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
                                                                events,
                                                                title,
                                                                showMarkers = true,
                                                                eventColor = "#8B5CF6",
                                                                config = {},
                                                                noDataMessage = "이벤트가 없습니다."
                                                            }) => {
    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-500">
                {noDataMessage}
            </div>
        );
    }

    const timeToMinutes = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.getHours() * 60 + date.getMinutes();
    };

    const sortedEvents = [...events].sort((a, b) =>
        timeToMinutes(a.time) - timeToMinutes(b.time)
    );

    const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
    const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
    const timeRange = Math.max(endTime - startTime, 60);

    return (
        <div className="w-full" style={{ height: `${config.height || 200}px` }}>
            {title && (
                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">{title}</h4>
            )}
            <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-300"></div>
                <div className="space-y-6">
                    {sortedEvents.map((event, index) => (
                        <div key={index} className="relative flex items-center">
                            <div
                                className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
                                style={{ backgroundColor: eventColor }}
                            ></div>
                            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'ml-auto pl-8 text-left'}`}>
                <span className="text-sm font-medium text-gray-800 bg-white px-2 py-1 rounded-md shadow-sm">
                  {event.formattedTime}
                </span>
                                {event.label && (
                                    <p className="text-xs text-gray-600 mt-1">{event.label}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
