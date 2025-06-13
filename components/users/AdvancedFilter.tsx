// components/users/AdvancedFilter.tsx
import React from "react";

interface AdvancedFilterProps {
  minExperience: string;
  maxExperience: string;
  accountAgeInMonths: string;
  status: string;
  isLoading: boolean;
  onMinExperienceChange: (value: string) => void;
  onMaxExperienceChange: (value: string) => void;
  onAccountAgeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  minExperience,
  maxExperience,
  accountAgeInMonths,
  status,
  isLoading,
  onMinExperienceChange,
  onMaxExperienceChange,
  onAccountAgeChange,
  onStatusChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const hasActiveFilters =
    minExperience || maxExperience || accountAgeInMonths || status !== "전체";

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="p-6">
        <div className="text-lg font-semibold text-gray-900 mb-4">
          사용자 필터링
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              최소 운전 경력 (년)
            </div>
            <input
              type="number"
              placeholder="예: 1"
              min="0"
              max="50"
              value={minExperience}
              onChange={(e) => onMinExperienceChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              최대 운전 경력 (년)
            </div>
            <input
              type="number"
              placeholder="예: 10"
              min="0"
              max="50"
              value={maxExperience}
              onChange={(e) => onMaxExperienceChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              가입 후 경과 개월 수
            </div>
            <input
              type="number"
              placeholder="예: 6"
              min="0"
              max="120"
              value={accountAgeInMonths}
              onChange={(e) => onAccountAgeChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              계정 상태
            </div>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="전체">전체</option>
              <option value="활성">활성</option>
              <option value="탈퇴">탈퇴</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onResetFilters}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            초기화
          </button>

          <button
            onClick={onApplyFilters}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            필터 적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
