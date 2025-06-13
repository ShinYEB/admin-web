import { Bot } from 'lucide-react';

export interface FeedbackMessageProps {
    title?: string;
    message: string;
    screenType?: 'accident' | 'safety' | 'carbon' | 'attention' | 'main';
    robotImageSrc?: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
                                                                    title = "운전 피드백",
                                                                    message,
                                                                    screenType = 'accident',
                                                                    robotImageSrc
                                                                }) => {
    const getThemeColor = () => {
        switch(screenType) {
            case 'accident': return '#BB27FF';
            case 'safety': return '#68D392';
            case 'carbon': return '#4299E1';
            case 'attention': return '#FFD927';
            case 'main': return '#4945FF';
            default: return '#BB27FF';
        }
    };

    const getBackgroundColor = () => {
        switch(screenType) {
            case 'accident': return 'rgba(187, 39, 255, 0.15)';
            case 'safety': return 'rgba(104, 211, 146, 0.15)';
            case 'carbon': return 'rgba(66, 153, 225, 0.15)';
            case 'attention': return 'rgba(255, 217, 39, 0.15)';
            case 'main': return 'rgba(73, 69, 255, 0.15)';
            default: return 'rgba(187, 39, 255, 0.15)';
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
                        <Bot size={32} color={themeColor} />
                    </div>
                )}
            </div>
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
