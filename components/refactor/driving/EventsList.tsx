import React from 'react';
import { AlertTriangle } from 'lucide-react';

// 타입 정의
interface TimeEvent {
    formattedTime: string;
    formattedEndTime?: string;
    duration?: number;
}

interface EventsListProps {
    events: TimeEvent[];
    title: string;
    showDuration?: boolean;
}

const EventsList: React.FC<EventsListProps> = ({
                                                   events,
                                                   title,
                                                   showDuration = true,
                                               }) => {
    return (
        <div className="mt-6 w-full p-4 rounded-xl border"
             style={{
                 backgroundColor: 'rgba(187, 39, 255, 0.05)',
                 borderColor: 'rgba(187, 39, 255, 0.2)'
             }}>
            {/* 제목 */}
            <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
                {title}
            </h3>

            {/* 이벤트 목록 */}
            <div className="w-full">
                {events.map((event: TimeEvent, index) => (
                    <div
                        key={index}
                        className="flex flex-row justify-between items-center py-2 px-1 border-b border-gray-300 border-opacity-30"
                    >
                        {/* 이벤트 인덱스 */}
                        <span className="text-sm font-semibold w-8" style={{ color: '#BB27FF' }}>
              #{index + 1}
            </span>

                        {/* 이벤트 시간 */}
                        <span className="text-sm text-gray-800 flex-1">
              {event.formattedTime}
                            {event.formattedEndTime && ` ~ ${event.formattedEndTime}`}
            </span>

                        {/* 지속시간 또는 알림 아이콘 */}
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

export default EventsList;
