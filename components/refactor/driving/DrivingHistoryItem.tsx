import React from 'react';

// 타입 정의
interface DriveHistoryItem {
    driveId: string;
    date: string;
    startTime: string;
    endTime: string;
    summaryScore: number;
}

interface DrivingHistoryItemProps {
    item: DriveHistoryItem;
    onPress: (driveId: string) => void;
}

// 유틸리티 함수들 (실제 구현에서는 별도 파일에서 import)
const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (startTime: string, endTime: string): string => {
    const start = new Date(startTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const end = new Date(endTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${start} - ${end}`;
};

// 색상 정의 (실제 구현에서는 theme 파일에서 import)
const colors = {
    primary: '#4945FF',
    background: '#FFFFFF',
    neutralLight: '#F8F9FA',
    neutralDark: '#2D3748',
};

const DrivingHistoryItem: React.FC<DrivingHistoryItemProps> = ({ item, onPress }) => {
    return (
        <div className="flex flex-row items-center mb-6">
            {/* 타임라인 컨테이너 */}
            <div className="flex items-center w-8 mr-3">
                <div
                    className="w-3 h-3 rounded-full border-4 relative z-10"
                    style={{
                        backgroundColor: colors.primary,
                        borderColor: colors.background
                    }}
                />
            </div>

            {/* 히스토리 아이템 */}
            <button
                className="flex-1 bg-gray-50 rounded-2xl py-4 px-5 flex flex-row justify-between shadow-sm hover:shadow-md hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                onClick={() => onPress(item.driveId)}
                role="button"
                aria-label={`주행 ${formatDate(item.date)} 상세 보기`}
                type="button"
            >
                {/* 왼쪽 콘텐츠 */}
                <div className="flex-1">
                    <p className="font-semibold text-base text-gray-800 leading-6 mb-1.5">
                        {formatDate(item.date)}
                    </p>
                    <p className="text-sm text-gray-800">
                        {formatTime(item.startTime, item.endTime)}
                    </p>
                </div>

                {/* 점수 컨테이너 */}
                <div className="flex justify-center pl-3">
          <span
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
          >
            {item.summaryScore.toFixed(2)}
          </span>
                </div>
            </button>
        </div>
    );
};

export default DrivingHistoryItem;
