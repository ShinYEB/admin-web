import React, {useEffect, useState} from "react";
import { Download, RefreshCw, BarChart3, Clock, Users, TrendingUp } from 'lucide-react';
import {
    DailyStatsChart,
    ScoreDistributionChart,
} from '@/components/Dashboard/Charts';
import Card from "@/components/UI/Card";
import {EventsByReasonChart} from "@/components/Dashboard/EventsByReasonChart";
import {MonthlyDrivesChart} from "@/components/Dashboard/MonthlyDrivesChart";
import {UserTrendsChart} from "@/components/Dashboard/UserTrendsChart";
import { AnalysisChart } from "@/components/General/AnalysisChart";
import { ComboChart } from "@/components/General/ComboChart";
import { CircleProgress } from "@/components/General/CircleProgress";
import { EventsList } from "@/components/General/EventsList";
import { FeedbackMessage } from "@/components/General/FeedbackMessage";
import {GeneralBarChart} from "@/components/General/GeneralBarChart";
import {GaugeChart} from "@/components/General/GaugeChart";
import { GeneralDoughnutChart } from "@/components/General/GeneralDoughnutChart";
import {GeneralLineChart} from "@/components/General/GeneralLineChart";
import {HorizontalBarChart} from "@/components/General/HorizontalBarChart";
import {InfoCard} from "@/components/General/InfoCard";
import {ScoreCard} from "@/components/General/ScoreCard";
import {SpeedDistributionChart} from "@/components/General/SpeedDistributionChart";
import {TimelineChart} from "@/components/General/TimelineChart";
import {TimeSeriesChart} from "@/components/General/TimeSeriesChart";

type Component = {
    type: string;
    props: any;
}

type CustomDashboardProps = {
    data: Component[];
}

const CustomDashboard = (dashboardResponse: CustomDashboardProps) => {

    const [components, setComponents] = useState<any>();

    // useEffect(() => {
    //     const storageComponents = sessionStorage.getItem("storageComponents")
    //     if (storageComponents != null) {
    //         try {
    //             // JSON 파싱 시 에러 처리
    //             const parseComponents = JSON.parse(storageComponents);
    //             setComponents(parseComponents);
    //         } catch (error) {
    //             console.error("sessionStorage 데이터 파싱 실패:", error);
    //             // 잘못된 데이터가 있다면 제거
    //             sessionStorage.removeItem("messages");
    //         }
    //     }
    //
    // }, []);

    useEffect(() => {

        if (dashboardResponse.data !== undefined) {
            const newComponents = dashboardResponse.data.map((d, index) => {
                if (d.type === "AnalysisChart") {
                    return <Card><AnalysisChart title={d.props.title} data={d.props.data} /></Card>
                } else if (d.type === "CircleProgress") {
                    return <Card><CircleProgress percentage={d.props.percentage} radius={d.props.radius} color={d.props.color} /></Card>
                } else if (d.type === "ComboChart") {
                    return <Card><ComboChart data={d.props.data} /></Card>
                } else if (d.type === "EventsList") {
                    return <Card><EventsList events={d.props.events} title={d.props.title} /></Card>
                } else if (d.type === "FeedbackMessage") {
                    return <Card><FeedbackMessage message={d.props.message} /></Card>
                } else if (d.type === "GaugeChart") {
                    return <Card><GaugeChart percentage={d.props.percentage} color={d.props.color} /></Card>
                } else if (d.type === "GeneralBarChart") {
                    return <Card><GeneralBarChart data={d.props.data} title={d.props.title} /></Card>
                } else if (d.type === "GeneralDoughnutChart") {
                    return <Card><GeneralDoughnutChart data={d.props.data} title={d.props.title} /></Card>
                } else if (d.type === "GeneralLineChart") {
                    return <Card><GeneralLineChart data={d.props.data} dataKeys={d.props.dataKeys} /></Card>
                }  else if (d.type === "HorizontalBarChart") {
                    return <Card><HorizontalBarChart data={d.props.data} /></Card>
                } else if (d.type === "InfoCard") {
                    return <Card><InfoCard title={d.props.title} content={d.props.content} /></Card>
                } else if (d.type === "ScoreCard") {
                    return <Card><ScoreCard score={d.props.score} color={d.props.color} bgColor={d.props.bgColor}  /></Card>
                } else if (d.type === "SpeedDistributionChart") {
                    return <Card><SpeedDistributionChart data={d.props.data} /></Card>
                } else if (d.type === "TimelineChart") {
                    return <Card><TimelineChart events={d.props.events} /></Card>
                } else if (d.type === "TimeSeriesChart") {
                    return <Card><TimeSeriesChart data={d.props.data} metrics={d.props.metrics} /></Card>
                }
            })
            setComponents(newComponents);
            sessionStorage.setItem("storageComponents", JSON.stringify(newComponents));
        }

    }, [dashboardResponse]);

    const resetComponents = () => {
        setComponents([]);

    }


    return (
        <div className="w-full h-full bg-gray-50 mx-auto">
            {/* Header */}
            <div className="h-[70px] bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">

                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <RefreshCw size={16} />
                            대시보드 초기화
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
                    <div className="w-[95%] h-full flex flex-col items-center justify-center">
                        {components}
                    </div>
                )}
            </div>

        </div>
    );
}


export default CustomDashboard;
