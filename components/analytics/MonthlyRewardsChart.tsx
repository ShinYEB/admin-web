import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import useMonthlyRewardsStore from '@/store/useMonthlyRewardsStore';

const MonthlyRewardsChart = () => {
  const { monthlyStats, isLoading, error, fetchMonthlyRewardStatistics } = useMonthlyRewardsStore();
  
  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchMonthlyRewardStatistics();
  }, [fetchMonthlyRewardStatistics]);
  
  // 차트 데이터 가공
  const chartData = {
    labels: monthlyStats.map(item => `${item.year}.${item.month}`),
    datasets: [
      {
        label: '씨앗 지급량',
        data: monthlyStats.map(item => item.amount),
        fill: false,
        backgroundColor: 'rgb(79, 70, 229)',
        borderColor: 'rgba(79, 70, 229, 0.8)',
        tension: 0.4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: '월별 씨앗 지급 추이',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg h-64 flex flex-col justify-center items-center">
        <p className="text-red-600 mb-2">{error}</p>
        <button 
          onClick={() => fetchMonthlyRewardStatistics()} 
          className="text-sm text-blue-500 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyRewardsChart;