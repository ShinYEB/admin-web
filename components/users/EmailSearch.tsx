// components/users/EmailSearch.tsx
import React from "react";

interface EmailSearchProps {
  searchKeyword: string;
  isLoading: boolean;
  onSearchKeywordChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const EmailSearch: React.FC<EmailSearchProps> = ({
  searchKeyword,
  isLoading,
  onSearchKeywordChange,
  onSearch,
  onClear,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="text-lg font-semibold text-gray-900 mb-4">
        이메일 검색
      </div>

      <div className="flex gap-3">
        <input
          type="email"
          placeholder="이메일을 입력하세요..."
          value={searchKeyword}
          onChange={(e) => onSearchKeywordChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "검색중..." : "검색"}
        </button>
        {searchKeyword && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            지우기
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailSearch;
