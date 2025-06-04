import React, { useEffect, useMemo } from 'react';
import Layout from '@/components/Layout/Layout';
import { Line, Doughnut } from 'react-chartjs-2';
import useRewardSummaryStore from '@/store/useRewardSummaryStore';
import useRewardStatisticsStore from '@/store/useRewardStatisticsStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import MonthlyRewardsChart from '@/components/analytics/MonthlyRewardsChart'  ;
import Card from '@/components/UI/Card';
import RewardHistory from '@/components/analytics/RewardHistory';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 월별 발급 추이 샘플 데이터
const monthlyData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  data: [12500, 13200, 14500, 16000, 17800, 19500],
};

const AnalyticsPage = () => {
  const { summary, isLoading: isSummaryLoading, error: summaryError, fetchRewardSummary } = useRewardSummaryStore();
  
  const { 
    mode,
    totalStats,
    monthlyStats,
    selectedYear,
    selectedMonth,
    isLoading: isStatsLoading,
    error: statsError,
    setMode,
    fetchTotalStatistics,
    fetchMonthlyStatistics,
    setSelectedDate
  } = useRewardStatisticsStore();
  
  // 통계 데이터 로딩
  useEffect(() => {
    fetchRewardSummary();
    fetchTotalStatistics(); // 초기에는 총계 데이터 로드
  }, [fetchRewardSummary, fetchTotalStatistics]);
  
  // 차트 데이터 계산
  const chartData = useMemo(() => {
    // 현재 모드에 따라 적절한 데이터 선택
    const data = mode === 'total' ? totalStats : monthlyStats;
    
    if (!data || data.length === 0) {
      return {
        labels: [],
        data: [],
        backgroundColor: [],
      };
    }
    
    // 도넛 차트용 색상 팔레트
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6', '#14B8A6'];
    
    return {
      labels: data.map(item => item.reason),
      data: data.map(item => item.count),
      backgroundColor: data.map((_, index) => colors[index % colors.length]),
    };
  }, [mode, totalStats, monthlyStats]);

  // 통계 카드 데이터
  const statCards = summary ? [
    { 
      title: '총 발급 씨앗', 
      value: summary.totalIssued.value.toLocaleString(), 
      change: summary.totalIssued.changeRate.toFixed(1), 
      isPositive: summary.totalIssued.changeRate >= 0 
    },
    { 
      title: '월간 발급 씨앗', 
      value: summary.monthlyIssued.value.toLocaleString(), 
      change: summary.monthlyIssued.changeRate.toFixed(1), 
      isPositive: summary.monthlyIssued.changeRate >= 0 
    },
    { 
      title: '일평균 발급', 
      value: summary.dailyAverageIssued.value.toLocaleString(), 
      change: summary.dailyAverageIssued.changeRate.toFixed(1), 
      isPositive: summary.dailyAverageIssued.changeRate >= 0 
    },
    { 
      title: '사용자당 평균', 
      value: summary.perUserAverageIssued.value.toLocaleString(), 
      change: summary.perUserAverageIssued.changeRate.toFixed(1), 
      isPositive: summary.perUserAverageIssued.changeRate >= 0 
    },
  ] : [];

  // 현재 날짜 기준 최근 12개월 옵션 생성
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      options.push({
        label: `${year}년 ${month}월`,
        value: { year, month }
      });
    }
    
    return options;
  }, []);
  
  // 월 선택 핸들러
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = monthOptions[Number(event.target.value)];
    if (selectedOption) {
      setSelectedDate(selectedOption.value.year, selectedOption.value.month);
    }
  };

  return (
    <Layout title="씨앗 내역 통계 | Modive 관리자">
      <div className="pb-6">
        <h1 className="text-2xl font-medium mb-6">씨앗 내역 통계</h1>
        
        {isSummaryLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : summaryError ? (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-600">{summaryError}</p>
            <button 
              onClick={() => fetchRewardSummary()} 
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
                <span className={`text-sm ${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {card.isPositive ? '▲' : '▼'} {card.change}% 
                  {card.isPositive ? '증가' : '감소'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 발급 사유별 비율 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">발급 사유별 비율</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setMode('total')}
                  className={`text-sm px-3 py-1 rounded ${
                    mode === 'total' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  총계
                </button>
                <button 
                  onClick={() => setMode('monthly')}
                  className={`text-sm px-3 py-1 rounded ${
                    mode === 'monthly' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  월별
                </button>
                
                {/* 월별 모드일 때만 월 선택기 표시 */}
                {mode === 'monthly' && (
                  <select 
                    className="ml-2 text-sm border rounded px-2 py-1"
                    onChange={handleMonthChange}
                    value={monthOptions.findIndex(
                      opt => opt.value.year === selectedYear && opt.value.month === selectedMonth
                    )}
                  >
                    {monthOptions.map((option, index) => (
                      <option key={index} value={index}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            {isStatsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : statsError ? (
              <div className="bg-red-50 p-4 rounded-lg h-64 flex flex-col justify-center items-center">
                <p className="text-red-600 mb-2">{statsError}</p>
                <button 
                  onClick={() => mode === 'total' ? fetchTotalStatistics() : fetchMonthlyStatistics(selectedYear, selectedMonth)} 
                  className="text-sm text-blue-500 hover:underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (chartData.data.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                데이터가 없습니다
              </div>
            ) : (
              <div className="h-64 flex justify-center items-center w-full">
                <Doughnut
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        data: chartData.data,
                        backgroundColor: chartData.backgroundColor,
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        display: true,
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 12
                          }
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const index = context.dataIndex;
                            const stats = mode === 'total' ? totalStats : monthlyStats;
                            if (stats) {
                              return [
                                `${context.label}: ${stats[index].count.toLocaleString()}개`,
                                `비율: ${stats[index].ratio.toFixed(1)}%`
                              ];
                            }
                            return '';
                          }
                        }
                      }
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            ))}
          </Card>

          {/* 월별 씨앗 지급 추이 */}
          <Card className="p-4 mt-6">
            <h2 className="text-lg font-medium mb-4">월별 씨앗 지급 추이</h2>
            <MonthlyRewardsChart />
          </Card>
          
          {/* 최근 씨앗 발급 내역 추가 - md:col-span-2 추가 */}
          <Card className="p-4 mt-6 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">최근 씨앗 발급 내역</h2>
            <RewardHistory />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;