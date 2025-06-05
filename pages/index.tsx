import React, { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import useDashboardStore from '@/store/useDashboardStore';
import useMonthlyDrivesStore from '@/store/useMonthlyDrivesStore';
import useEventsByReasonStore from '@/store/useEventsByReasonStore';
import useUserTrendsStore from '@/store/useUserTrendsStore';
import { MonthlyDrivesChart } from '@/components/Dashboard/MonthlyDrivesChart';
import { EventsByReasonChart } from '@/components/Dashboard/EventsByReasonChart';
import { UserTrendsChart } from '@/components/Dashboard/UserTrendsChart';

const Dashboard = () => {
  const { statistics, isLoading: isStatsLoading, error: statsError, fetchDashboardSummary } = useDashboardStore();
  const { monthlyDrives, isLoading: isDrivesLoading, error: drivesError, fetchMonthlyDrives } = useMonthlyDrivesStore();
  const { events, isLoading: isEventsLoading, error: eventsError, fetchEventsByReason } = useEventsByReasonStore();
  const { 
    summary, 
    trends, 
    isLoading: isTrendsLoading, 
    error: trendsError, 
    fetchUserTrends 
  } = useUserTrendsStore();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // 디버깅을 위한 순차적 API 호출
        console.log("대시보드 데이터 로딩 시작");
        await fetchDashboardSummary();
        console.log("대시보드 통계 로드 완료, 월별 운전 데이터 로딩 시작");
        await fetchMonthlyDrives();
        console.log("월별 운전 데이터 로드 완료, 이벤트 데이터 로딩 시작");
        await fetchEventsByReason();
        console.log("이벤트 데이터 로드 완료, 사용자 트렌드 로딩 시작");
        await fetchUserTrends();
        console.log("모든 데이터 로드 완료");
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
      }
    };
    
    loadData();
  }, [fetchDashboardSummary, fetchMonthlyDrives, fetchEventsByReason, fetchUserTrends]);

  // 사용자 중점 메트릭 데이터
  const focusMetrics = [
    { 
      label: '지난 주 신규 가입자', 
      value: summary ? summary.lastWeekNewUsers.toLocaleString() : '-' 
    },
    { 
      label: '전월 대비 사용자 증가율', 
      value: summary ? `${summary.monthlyUserGrowthRate.toFixed(1)}%` : '-' 
    },
    { 
      label: '이탈률', 
      value: summary ? `${summary.churnRate.toFixed(1)}%` : '-' 
    },
  ];

  // 통계 카드 데이터
  const statCards = statistics ? [
    { 
      title: '총 사용자 수', 
      value: statistics.totalUsers.value.toLocaleString(), 
      increase: `${statistics.totalUsers.changeRate.toFixed(1)}%` 
    },
    { 
      title: '디바이스 수', 
      value: statistics.totalDevices.value.toLocaleString(), 
      increase: `${statistics.totalDevices.changeRate.toFixed(1)}%` 
    },
    { 
      title: '누적 운전 횟수', 
      value: statistics.totalDrives.value.toLocaleString(), 
      increase: `${statistics.totalDrives.changeRate.toFixed(1)}%` 
    },
    { 
      title: '누적 적립 씨앗', 
      value: statistics.totalIssuedRewards.value.toLocaleString(), 
      increase: `${statistics.totalIssuedRewards.changeRate.toFixed(1)}%` 
    },
  ] : [];

  return (
    <Layout title="대시보드 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">대시보드</h1>

        {isStatsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : statsError ? (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-600">{statsError}</p>
            <button 
              onClick={() => fetchDashboardSummary()} 
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-xl font-bold">{card.value}</p>
                <span className="text-sm text-green-500">▲ {card.increase} 증가</span>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 월별 운전 횟수 추이 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">월별 운전 횟수 추이</h2>
            {isDrivesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : drivesError ? (
              <div className="bg-red-50 p-4 rounded-lg h-64 flex flex-col justify-center items-center">
                <p className="text-red-600 mb-2">{drivesError}</p>
                <button 
                  onClick={() => fetchMonthlyDrives()} 
                  className="text-sm text-blue-500 hover:underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="h-64">
                <MonthlyDrivesChart data={monthlyDrives || []} />
              </div>
            )}
          </div>

          {/* 이벤트 유형별 추이 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">이벤트 유형별 추이</h2>
            {isEventsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : eventsError ? (
              <div className="bg-red-50 p-4 rounded-lg h-64 flex flex-col justify-center items-center">
                <p className="text-red-600 mb-2">{eventsError}</p>
                <button 
                  onClick={() => fetchEventsByReason()} 
                  className="text-sm text-blue-500 hover:underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="h-64">
                <EventsByReasonChart data={events || []} />
              </div>
            )}
          </div>
        </div>

        {/* 사용자 증감 추이 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-6">사용자 증감 추이</h2>
          
          {/* 메트릭 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {focusMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
          
          {/* 트렌드 라인 차트 */}
          {isTrendsLoading ? (
            <div className="flex justify-center items-center h-72">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : trendsError ? (
            <div className="bg-red-50 p-4 rounded-lg h-72 flex flex-col justify-center items-center">
              <p className="text-red-600 mb-2">{trendsError}</p>
              <button 
                onClick={() => fetchUserTrends()} 
                className="text-sm text-blue-500 hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="h-72">
              <UserTrendsChart data={trends || []} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
