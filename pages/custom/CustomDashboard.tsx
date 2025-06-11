import {useEffect, useState} from "react";
import { Download, RefreshCw, BarChart3, Clock, Users, TrendingUp } from 'lucide-react';
import {
    DailyStatsChart,
    ScoreDistributionChart,
} from '@/components/Dashboard/Charts'
import Card from "@/components/UI/Card";
import {EventsByReasonChart} from "@/components/Dashboard/EventsByReasonChart";
import {MonthlyDrivesChart} from "@/components/Dashboard/MonthlyDrivesChart";
import {UserTrendsChart} from "@/components/Dashboard/UserTrendsChart";

type Component = {
    component: string;
    props: any;
}

type CustomDashboardProps = {
    data: Component[];
}

const CustomDashboard = (dashboardResponse: CustomDashboardProps) => {

    const [components, setComponents] = useState<any>();

    useEffect(() => {

        console.log(dashboardResponse);
        if (dashboardResponse.data !== undefined) {
            const newComponents = dashboardResponse.data.map((d, index) => {
                if (d.component === "DailyStatsChart") {
                    return <Card className="p-4">
                        <DailyStatsChart data={d.props.data} />
                    </Card>
                } else if (d.component === "ScoreDistributionChart") {
                    return <Card className="p-4">
                        <ScoreDistributionChart data={d.props.data}/>
                    </Card>
                } else if (d.component === "EventsByReasonChart") {
                    return <Card className="p-4">
                        <EventsByReasonChart data={d.props.data}/>
                    </Card>
                } else if (d.component === "MonthlyDrivesChart") {
                    return <Card className="p-4">
                        <MonthlyDrivesChart data={d.props.data}/>
                    </Card>
                } else if (d.component === "UserTrendsChart") {
                    return <Card className="p-4">
                        <UserTrendsChart data={d.props.data}/>
                    </Card>
                }
            })
            setComponents(newComponents);
        }

    }, [dashboardResponse]);


    return (
        <div className="w-[100%] h-[90vh] bg-gray-50">
            {/* Header */}
            <div className="h-[70px] bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">

                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download size={16} />
                            내보내기
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <RefreshCw size={16} />
                            새로고침
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-[80vh] flex items-center justify-center">
                {/* Main Content */}
                {(!dashboardResponse.data || dashboardResponse.data.length === 0) ? (
                    <div className="flex flex-col items-center justify-center px-6 py-20 h-full">
                        {/* Chart Icon */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <BarChart3 size={48} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드 생성 준비</h2>

                        {/* Subtitle */}
                        <p className="text-gray-600 mb-12 text-center max-w-md">
                            AI와 채팅하여 원하는 대시보드를 생성해보세요.
                        </p>
                    </div>
                ) : (
                    <div className="p-6">
                        {components}
                    </div>
                )}
            </div>

        </div>
    );
}


export default CustomDashboard;
