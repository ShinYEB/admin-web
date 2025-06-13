import React from 'react';
import { Bot } from 'lucide-react';

interface FeedbackMessageProps {
    title?: string;
    message: string;
    screenType?: 'accident' | 'safety' | 'carbon' | 'attention' | 'main';
    robotImageSrc?: string; // 선택적으로 커스텀 로봇 이미지 경로
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
                                                             title = "운전 피드백",
                                                             message,
                                                             screenType = 'accident',
                                                             robotImageSrc // 예: "/images/modive_robot1.png"
                                                         }) => {
    // 스크린 타입에 따른 색상 설정
    const getThemeColor = () => {
        switch(screenType) {
            case 'accident':
                return '#BB27FF'; // 보라색
            case 'safety':
                return '#68D392'; // 초록색
            case 'carbon':
                return '#4299E1'; // 파란색
            case 'attention':
                return '#FFD927'; // 노란색
            case 'main':
                return '#4945FF'; // 서비스 메인 파란색
            default:
                return '#BB27FF';
        }
    };

    // 스크린 타입에 따른 배경색 설정
    const getBackgroundColor = () => {
        switch(screenType) {
            case 'accident':
                return 'rgba(187, 39, 255, 0.15)'; // 연한 보라색
            case 'safety':
                return 'rgba(104, 211, 146, 0.15)'; // 연한 초록색
            case 'carbon':
                return 'rgba(66, 153, 225, 0.15)'; // 연한 파란색
            case 'attention':
                return 'rgba(255, 217, 39, 0.15)'; // 연한 노란색
            case 'main':
                return 'rgba(73, 69, 255, 0.15)'; // 연한 메인 파란색
            default:
                return 'rgba(187, 39, 255, 0.15)';
        }
    };

    const themeColor = getThemeColor();
    const backgroundColor = getBackgroundColor();

    return (
        <div
            className="flex flex-row mx-4 my-6 p-4 rounded-2xl border-l-4"
            style={{
                backgroundColor: backgroundColor,
                borderLeftColor: themeColor
            }}
        >
            {/* 로봇 컨테이너 */}
            <div className="mr-3 flex justify-center items-center">
                {robotImageSrc ? (
                    <img
                        src={robotImageSrc}
                        alt="모디브 로봇 아이콘"
                        className="w-12 h-12 object-contain"
                    />
                ) : (
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: themeColor + '20' }}
                    >
                        <Bot
                            size={32}
                            color={themeColor}
                        />
                    </div>
                )}
            </div>

            {/* 피드백 텍스트 컨테이너 */}
            <div className="flex-1">
                <h4
                    className="text-base font-bold mb-1"
                    style={{ color: themeColor }}
                >
                    {title}
                </h4>
                <p className="text-sm text-gray-800 leading-5">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default FeedbackMessage;
