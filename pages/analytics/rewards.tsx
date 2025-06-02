import React from 'react';
import Layout from '@/components/Layout/Layout';
import MonthlyRewardsChart from '@/components/analytics/MonthlyRewardsChart';
import RewardHistory from '@/components/analytics/RewardHistory';

const RewardsAnalytics = () => {
  return (
    <Layout title="씨앗 내역 통계 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">씨앗 내역 통계</h1>
        
        {/* 기존 차트 및 통계 컴포넌트들 */}
        <MonthlyRewardsChart />
        
        {/* 최근 씨앗 발급 내역 */}
        <RewardHistory />
      </div>
    </Layout>
  );
};

export default RewardsAnalytics;