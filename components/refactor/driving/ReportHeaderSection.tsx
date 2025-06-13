import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import GaugeChart from './GaugeChart'; // 이전에 변환한 GaugeChart 사용

// HeaderDropdown 컴포넌트 (간단 구현)
interface HeaderDropdownProps {
    currentScreen: string;
    primaryColor: string;
    textColor: string;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
                                                           currentScreen,
                                                           primaryColor,
                                                           textColor
                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);

    const screenNames = {
        accident: '사고 위험',
        safety: '안전 운전',
        carbon: '탄소 배출',
        attention: '주의 집중'
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ color: textColor }}
            >
        <span className="font-semibold mr-2">
          {screenNames[currentScreen as keyof typeof screenNames] || '리포트'}
        </span>
                <ChevronDown
                    size={16}
                    color={primaryColor}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {Object.entries(screenNames).map(([key, name]) => (
                        <button
                            key={key}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                            style={{ color: key === currentScreen ? primaryColor : textColor }}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ReportHeaderSectionProps {
    score: number;
    onBackPress: () => void;
    screenType?: 'accident' | 'safety' | 'carbon' | 'attention';
}

const ReportHeaderSection: React.FC<ReportHeaderSectionProps> = ({
                                                                     score,
                                                                     onBackPress,
                                                                     screenType = 'accident',
                                                                 }) => {
    // 스크린 타입에 따른 테마 색상 설정
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
            default:
                return '#BB27FF';
        }
    };

    // 테마 색상 가져오기
    const themeColor = getThemeColor();

    // 스크린 타입에 따른 배경 카드 색상 설정
    const getCardBackgroundColor = () => {
        switch(screenType) {
            case 'accident':
                return '#F5E9FF'; // 연한 보라색
            case 'safety':
                return 'rgba(104, 211, 146, 0.1)'; // 연한 초록색
            case 'carbon':
                return 'rgba(66, 153, 225, 0.1)'; // 연한 파란색
            case 'attention':
                return '#FFFAEB'; // 연한 노란색
            default:
                return '#F5E9FF';
        }
    };

    // 스크린 타입에 따른 테두리 색상 설정
    const getBorderColor = () => {
        switch(screenType) {
            case 'accident':
                return 'rgba(187, 39, 255, 0.5)'; // 보라색
            case 'safety':
                return 'rgba(104, 211, 146, 0.5)'; // 초록색
            case 'carbon':
                return 'rgba(66, 153, 225, 0.5)'; // 파란색
            case 'attention':
                return 'rgba(255, 217, 39, 0.5)'; // 노란색
            default:
                return 'rgba(187, 39, 255, 0.5)';
        }
    };

    // 스크린 타입에 따른 게이지 차트 배경색 설정
    const getGaugeBackgroundColor = () => {
        switch(screenType) {
            case 'accident':
                return '#f0d6ff'; // 연한 보라
            case 'safety':
                return 'rgba(104, 211, 146, 0.2)'; // 연한 초록색
            case 'carbon':
                return 'rgba(66, 153, 225, 0.2)'; // 연한 파란색
            case 'attention':
                return 'rgba(255, 217, 39, 0.2)'; // 연한 노란색
            default:
                return '#f0d6ff';
        }
    };

    // 점수에 따른 게이지 색상 설정 (낮은 점수는 빨간색)
    const getGaugeColor = () => {
        if (score < 50) return '#E53E3E'; // 위험 점수 빨간색
        return themeColor; // 그 외에는 테마 색상
    };

    return (
        <>
            {/* 헤더 */}
            <div className="flex flex-row items-center justify-between px-5 py-4 bg-white">
                <button
                    className="p-3 -ml-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                    onClick={onBackPress}
                    aria-label="뒤로 가기"
                    type="button"
                >
                    <ChevronLeft size={24} color="#333" />
                </button>

                <HeaderDropdown
                    currentScreen={screenType}
                    primaryColor={themeColor}
                    textColor="#2D3748"
                />

                <div className="w-6" /> {/* 오른쪽 공간 확보 */}
            </div>

            {/* 리포트 헤더 카드 */}
            <div
                className="mx-0 my-4 p-5 border-2 rounded-2xl flex items-center justify-center"
                style={{
                    borderColor: getBorderColor(),
                    backgroundColor: getCardBackgroundColor(),
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div className="my-0 mb-2 flex items-center justify-center">
                    <GaugeChart
                        percentage={score}
                        color={getGaugeColor()}
                        size={240}
                        gaugeBackgroundColor={getGaugeBackgroundColor()}
                    />
                </div>
            </div>
        </>
    );
};

export default ReportHeaderSection;
