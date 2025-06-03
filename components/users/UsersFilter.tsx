// components/users/UsersFilter.tsx (통합된 필터 컴포넌트)
import React from "react";
import EmailSearch from "./EmailSearch";
import AdvancedFilter from "./AdvancedFilter";

interface UsersFilterProps {
  searchKeyword: string;
  minScore: string;
  maxScore: string;
  period: string;
  status: string;
  isLoading: boolean;
  onSearchKeywordChange: (value: string) => void;
  onMinScoreChange: (value: string) => void;
  onMaxScoreChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearch: () => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const UsersFilter: React.FC<UsersFilterProps> = ({
  searchKeyword,
  minScore,
  maxScore,
  period,
  status,
  isLoading,
  onSearchKeywordChange,
  onMinScoreChange,
  onMaxScoreChange,
  onPeriodChange,
  onStatusChange,
  onSearch,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <div>
      <EmailSearch
        searchKeyword={searchKeyword}
        isLoading={isLoading}
        onSearchKeywordChange={onSearchKeywordChange}
        onSearch={onSearch}
        onClear={onResetFilters}
      />

      <AdvancedFilter
        minExperience={minScore}
        maxExperience={maxScore}
        accountAgeInMonths={period}
        status={status}
        isLoading={isLoading}
        onMinExperienceChange={onMinScoreChange}
        onMaxExperienceChange={onMaxScoreChange}
        onAccountAgeChange={onPeriodChange}
        onStatusChange={onStatusChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
      />
    </div>
  );
};

export default UsersFilter;
