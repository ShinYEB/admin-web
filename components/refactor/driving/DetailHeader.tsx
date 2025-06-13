import React from 'react';
import { X } from 'lucide-react';

interface DetailHeaderProps {
    title: string;
    onClose: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ title, onClose }) => {
    return (
        <div className="flex flex-row items-center justify-between h-14 px-5 border-b border-gray-200 bg-white">
            {/* 왼쪽 공간 (균형을 위한 spacer) */}
            <div className="w-6" />

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-indigo-600">
                {title}
            </h1>

            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:scale-95"
                aria-label="뒤로가기 버튼"
                type="button"
            >
                <X size={24} color="#333" />
            </button>
        </div>
    );
};

export default DetailHeader;
