import {AlertTriangle} from "lucide-react";

export interface EventItem {
    formattedTime: string;
    formattedEndTime?: string;
    duration?: number;
    label?: string;
    type?: string;
}

export interface EventsListProps {
    events: EventItem[];
    title: string;
    showDuration?: boolean;
    eventColor?: string;
    backgroundColor?: string;
    borderColor?: string;
}

export const EventsList: React.FC<EventsListProps> = ({
                                                          events,
                                                          title,
                                                          showDuration = true,
                                                          eventColor = '#BB27FF',
                                                          backgroundColor = 'rgba(187, 39, 255, 0.05)',
                                                          borderColor = 'rgba(187, 39, 255, 0.2)'
                                                      }) => {
    return (
        <div
            className="mt-6 w-full p-4 rounded-xl border"
            style={{ backgroundColor, borderColor }}
        >
            <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
                {title}
            </h3>
            <div className="w-full">
                {events.map((event: EventItem, index) => (
                    <div
                        key={index}
                        className="flex flex-row justify-between items-center py-2 px-1 border-b border-gray-300 border-opacity-30"
                    >
            <span className="text-sm font-semibold w-8" style={{ color: eventColor }}>
              #{index + 1}
            </span>
                        <span className="text-sm text-gray-800 flex-1">
              {event.formattedTime}
                            {event.formattedEndTime && ` ~ ${event.formattedEndTime}`}
            </span>
                        {showDuration && event.duration ? (
                            <span className="text-sm font-semibold ml-2" style={{ color: '#E53E3E' }}>
                {event.duration}초
              </span>
                        ) : (
                            <AlertTriangle size={16} color="#E53E3E" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
