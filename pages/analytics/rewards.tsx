import React from 'react';
import Layout from '@/components/Layout/Layout';
import MonthlyRewardsChart from '@/components/analytics/MonthlyRewardsChart';
import RewardHistory from '@/components/analytics/RewardHistory';
// 또는 import RewardHistory from '@/components/analytics/RewardHistory'; (실제 파일 위치에 맞게)

const RewardsAnalytics = () => {
  return (
    <Layout title="씨앗 내역 통계 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">씨앗 내역 통계</h1>
        
        {/* 기존 차트 및 통계 컴포넌트들 */}
        <MonthlyRewardsChart />
        
        {/* 최근 씨앗 발급 내역 - 전체 너비 사용하도록 수정 */}
        <div className="bg-white rounded-lg shadow p-6 mt-6 w-full max-w-none">
          <h2 className="text-xl font-medium mb-4">최근 씨앗 발급 내역</h2>
          <RewardHistory />
        </div>
      </div>
    </Layout>
  );
};

export default RewardsAnalytics;